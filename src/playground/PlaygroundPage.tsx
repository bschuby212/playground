import { useCallback, useMemo, useState } from 'react'
import { playgroundConfig } from './data/config'
import { PlaygroundHeader } from './components/PlaygroundHeader'
import { DraggableCanvas } from './components/DraggableCanvas'
import { useIsCoarsePointer } from './hooks/useIsCoarsePointer'
import { useNarrowMobile } from './hooks/useNarrowMobile'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './PlaygroundPage.css'

export function PlaygroundPage() {
  const reducedMotion = usePrefersReducedMotion()
  const isCoarsePointer = useIsCoarsePointer()
  const isNarrowMobile = useNarrowMobile()
  const [activeTitle, setActiveTitle] = useState<string | null>(null)

  const defaultHint = useMemo(
    () => (isCoarsePointer ? playgroundConfig.mobileHint : playgroundConfig.defaultHint),
    [isCoarsePointer],
  )

  const enableProximityScaling =
    playgroundConfig.enableProximityScaling && !(isCoarsePointer && isNarrowMobile)

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
          touchMode={isCoarsePointer}
        />
        <DraggableCanvas
          reducedMotion={reducedMotion}
          enableProximityScaling={enableProximityScaling}
          touchMode={isCoarsePointer}
          onActiveProjectChange={handleActiveProjectChange}
        />
      </div>
    </main>
  )
}

export default PlaygroundPage
