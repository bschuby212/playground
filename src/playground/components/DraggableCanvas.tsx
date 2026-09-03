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
import { getRevealOffset } from '../hooks/revealProject'
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
  const leaveTimerRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const revealingRef = useRef(false)

  const {
    containerRef,
    surfaceRef,
    positionRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    shouldSuppressClick,
    isDragging,
    animateTo,
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

  const syncActiveFromPointer = useCallback(() => {
    const el = document.elementFromPoint(pointerRef.current.x, pointerRef.current.y)
    const thumb = el?.closest('[data-project-id]') as HTMLElement | null
    const id = thumb?.dataset.projectId ?? null

    setActiveId(id)
    onActiveProjectChange(
      id ? (playgroundProjects.find((p) => p.id === id)?.title ?? null) : null,
    )
  }, [onActiveProjectChange])

  const revealProject = useCallback(
    (id: string) => {
      if (!playgroundConfig.enableHoverReveal || isDragging()) return

      const project = playgroundProjects.find((item) => item.id === id)
      const container = containerRef.current
      if (!project || !container) return

      // Account for hover scale so the enlarged image still clears the edge
      const scaleBoost = reducedMotion ? 1 : playgroundConfig.hoverScale
      const overflow = ((scaleBoost - 1) / 2) * Math.max(project.width, project.height)
      const padding = playgroundConfig.revealPadding + overflow

      const next = getRevealOffset(
        project,
        positionRef.current,
        {
          width: container.clientWidth,
          height: container.clientHeight,
        },
        padding,
        playgroundConfig.revealMaxNudge,
      )

      if (!next) return

      revealingRef.current = true
      animateTo(next, reducedMotion ? 0 : playgroundConfig.revealDurationMs, () => {
        revealingRef.current = false
        syncActiveFromPointer()
      })
    },
    [animateTo, containerRef, isDragging, positionRef, reducedMotion, syncActiveFromPointer],
  )

  const handleActivate = useCallback(
    (id: string | null) => {
      if (leaveTimerRef.current !== null) {
        window.clearTimeout(leaveTimerRef.current)
        leaveTimerRef.current = null
      }

      // Ignore leave while the canvas is sliding under the cursor
      if (id === null && revealingRef.current) return

      if (id === null) {
        leaveTimerRef.current = window.setTimeout(() => {
          setActiveId(null)
          onActiveProjectChange(null)
          leaveTimerRef.current = null
        }, 100)
        return
      }

      setActiveId(id)
      const title = playgroundProjects.find((p) => p.id === id)?.title ?? null
      onActiveProjectChange(title)
      revealProject(id)
    },
    [onActiveProjectChange, revealProject],
  )

  useEffect(() => {
    const trackPointer = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
    }
    window.addEventListener('pointermove', trackPointer, { passive: true })
    return () => {
      window.removeEventListener('pointermove', trackPointer)
      if (leaveTimerRef.current !== null) {
        window.clearTimeout(leaveTimerRef.current)
      }
    }
  }, [])

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
