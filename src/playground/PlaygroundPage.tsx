import { useCallback, useMemo, useState } from 'react'
import { playgroundConfig } from './data/config'
import {
  PlaygroundHeader,
  type ActiveProjectMeta,
} from './components/PlaygroundHeader'
import { DraggableCanvas } from './components/DraggableCanvas'
import { FullscreenOpenButton } from './components/FullscreenOpenButton'
import { useCompactViewport } from './hooks/useCompactViewport'
import { useIsCoarsePointer } from './hooks/useIsCoarsePointer'
import { useIsStandalone } from './hooks/useIsStandalone'
import { useNarrowMobile } from './hooks/useNarrowMobile'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './PlaygroundPage.css'

export function PlaygroundPage() {
  const reducedMotion = usePrefersReducedMotion()
  const isCoarsePointer = useIsCoarsePointer()
  const isCompactViewport = useCompactViewport()
  const isNarrowMobile = useNarrowMobile()
  const isStandalone = useIsStandalone()
  const [activeProject, setActiveProject] = useState<ActiveProjectMeta | null>(null)

  // Under 1000px (and coarse pointers): touch-first — no cursor-follow, clearer tap vs pan
  const touchMode = isCoarsePointer || isCompactViewport

  const defaultHint = useMemo(
    () => (touchMode ? playgroundConfig.mobileHint : playgroundConfig.defaultHint),
    [touchMode],
  )

  const enableProximityScaling =
    playgroundConfig.enableProximityScaling && !(touchMode && isNarrowMobile)

  const handleActiveProjectChange = useCallback((project: ActiveProjectMeta | null) => {
    setActiveProject(project)
  }, [])

  return (
    <main
      className={['playground-page', isStandalone ? 'is-standalone' : 'is-embed'].join(
        ' ',
      )}
    >
      <div className="playground-page__frame">
        <PlaygroundHeader
          hint={defaultHint}
          activeProject={activeProject}
          reducedMotion={reducedMotion}
          touchMode={touchMode}
        />
        <DraggableCanvas
          reducedMotion={reducedMotion}
          enableProximityScaling={enableProximityScaling}
          touchMode={touchMode}
          mobileViewport={touchMode}
          onActiveProjectChange={handleActiveProjectChange}
        />
      </div>
      <FullscreenOpenButton />
    </main>
  )
}

export default PlaygroundPage
