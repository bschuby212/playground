import { useCallback, useMemo, useState } from 'react'
import { playgroundConfig } from './data/config'
import { PlaygroundHeader } from './components/PlaygroundHeader'
import { DraggableCanvas } from './components/DraggableCanvas'
import { useCompactViewport } from './hooks/useCompactViewport'
import { useIsCoarsePointer } from './hooks/useIsCoarsePointer'
import { useNarrowMobile } from './hooks/useNarrowMobile'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './PlaygroundPage.css'

export function PlaygroundPage() {
  const reducedMotion = usePrefersReducedMotion()
  const isCoarsePointer = useIsCoarsePointer()
  const isCompactViewport = useCompactViewport()
  const isNarrowMobile = useNarrowMobile()
  const [activeTitle, setActiveTitle] = useState<string | null>(null)

  // Under 1000px (and coarse pointers): touch-first — no cursor-follow, clearer tap vs pan
  const touchMode = isCoarsePointer || isCompactViewport

  const defaultHint = useMemo(
    () => (touchMode ? playgroundConfig.mobileHint : playgroundConfig.defaultHint),
    [touchMode],
  )

  const enableProximityScaling =
    playgroundConfig.enableProximityScaling && !(touchMode && isNarrowMobile)

  const handleActiveProjectChange = useCallback((title: string | null) => {
    setActiveTitle(title)
  }, [])

  return (
    <main className="playground-page">
      <div className="playground-page__frame">
        <PlaygroundHeader
          hint={defaultHint}
          activeTitle={activeTitle}
          reducedMotion={reducedMotion}
          touchMode={touchMode}
        />
        <DraggableCanvas
          reducedMotion={reducedMotion}
          enableProximityScaling={enableProximityScaling}
          touchMode={touchMode}
          mobileViewport={isCompactViewport}
          onActiveProjectChange={handleActiveProjectChange}
        />
      </div>
    </main>
  )
}

export default PlaygroundPage
