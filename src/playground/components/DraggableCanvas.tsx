import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { playgroundConfig } from '../data/config'
import { playgroundProjects } from '../data/projects'
import { getProximityScale } from '../hooks/proximityScale'
import { useCanvasDrag } from '../hooks/useCanvasDrag'
import { ProjectThumbnail } from './ProjectThumbnail'
import './DraggableCanvas.css'

type DraggableCanvasProps = {
  reducedMotion: boolean
  enableProximityScaling: boolean
  onActiveProjectChange: (title: string | null) => void
}

export function DraggableCanvas({
  reducedMotion,
  enableProximityScaling,
  onActiveProjectChange,
}: DraggableCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const thumbNodesRef = useRef(new Map<string, HTMLAnchorElement>())
  const scalesRef = useRef<Record<string, number>>(
    Object.fromEntries(playgroundProjects.map((p) => [p.id, 1])),
  )
  const updateScalesRef = useRef<(offset: { x: number; y: number }) => void>(() => {})

  const {
    containerRef,
    surfaceRef,
    positionRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    shouldSuppressClick,
  } = useCanvasDrag({
    canvasWidth: playgroundConfig.canvasWidth,
    canvasHeight: playgroundConfig.canvasHeight,
    startingX: playgroundConfig.startingX,
    startingY: playgroundConfig.startingY,
    dragThreshold: playgroundConfig.dragThreshold,
    enableMomentum: playgroundConfig.enableMomentum,
    reducedMotion,
    onPositionChange: (offset) => updateScalesRef.current(offset),
  })

  const applyScaleToNode = useCallback(
    (id: string, proximityScale: number) => {
      scalesRef.current[id] = proximityScale
      const node = thumbNodesRef.current.get(id)
      if (!node) return
      const hoverMultiplier =
        activeId === id && !reducedMotion ? playgroundConfig.hoverScale : 1
      node.style.setProperty('--thumb-scale', String(proximityScale * hoverMultiplier))
    },
    [activeId, reducedMotion],
  )

  const updateScales = useCallback(
    (offset: { x: number; y: number }) => {
      const container = containerRef.current
      if (!container) return

      const viewport = {
        width: container.clientWidth,
        height: container.clientHeight,
      }

      const enabled = enableProximityScaling && !reducedMotion
      for (const project of playgroundProjects) {
        const scale = getProximityScale(project, offset, viewport, enabled)
        applyScaleToNode(project.id, scale)
      }
    },
    [applyScaleToNode, containerRef, enableProximityScaling, reducedMotion],
  )

  useEffect(() => {
    updateScalesRef.current = updateScales
  }, [updateScales])

  useEffect(() => {
    updateScales(positionRef.current)
  }, [enableProximityScaling, positionRef, reducedMotion, updateScales])

  // Re-apply hover multiplier when active thumbnail changes
  useEffect(() => {
    for (const project of playgroundProjects) {
      applyScaleToNode(project.id, scalesRef.current[project.id] ?? 1)
    }
  }, [activeId, applyScaleToNode])

  const registerThumb = useCallback((id: string, node: HTMLAnchorElement | null) => {
    if (node) {
      thumbNodesRef.current.set(id, node)
      node.style.setProperty('--thumb-scale', String(scalesRef.current[id] ?? 1))
    } else {
      thumbNodesRef.current.delete(id)
    }
  }, [])

  const handleActivate = useCallback(
    (id: string | null) => {
      setActiveId(id)
      const title = id
        ? (playgroundProjects.find((p) => p.id === id)?.title ?? null)
        : null
      onActiveProjectChange(title)
    },
    [onActiveProjectChange],
  )

  const surfaceStyle = useMemo(
    () =>
      ({
        width: playgroundConfig.canvasWidth,
        height: playgroundConfig.canvasHeight,
        '--grid-size': `${playgroundConfig.gridSize}px`,
      }) as CSSProperties,
    [],
  )

  return (
    <div
      ref={containerRef}
      className="draggable-canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="region"
      aria-label="Interactive project canvas. Drag to explore projects."
    >
      <div ref={surfaceRef} className="draggable-canvas__surface" style={surfaceStyle}>
        {playgroundProjects.map((project) => (
          <ProjectThumbnail
            key={project.id}
            project={project}
            isActive={activeId === project.id}
            reducedMotion={reducedMotion}
            onActivate={handleActivate}
            shouldSuppressClick={shouldSuppressClick}
            registerNode={registerThumb}
          />
        ))}
      </div>
    </div>
  )
}
