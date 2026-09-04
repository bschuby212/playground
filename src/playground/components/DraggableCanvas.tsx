import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { playgroundConfig, type LayoutMode } from '../data/config'
import { applyLayout } from '../data/layouts'
import { playgroundProjects } from '../data/projects'
import { getProximityScale } from '../hooks/proximityScale'
import { getRevealOffset } from '../hooks/revealProject'
import { useCanvasDrag } from '../hooks/useCanvasDrag'
import { useCursorParallax } from '../hooks/useCursorParallax'
import { CanvasControls, type ViewMode } from './CanvasControls'
import { ProjectListOverlay } from './ProjectListOverlay'
import { ProjectThumbnail } from './ProjectThumbnail'
import './DraggableCanvas.css'

type DraggableCanvasProps = {
  reducedMotion: boolean
  enableProximityScaling: boolean
  touchMode: boolean
  onActiveProjectChange: (title: string | null) => void
}

function clampZoom(value: number) {
  return Math.min(
    playgroundConfig.maxZoom,
    Math.max(playgroundConfig.minZoom, Number(value.toFixed(2))),
  )
}

export function DraggableCanvas({
  reducedMotion,
  enableProximityScaling,
  touchMode,
  onActiveProjectChange,
}: DraggableCanvasProps) {
  const [layout, setLayout] = useState<LayoutMode>(playgroundConfig.defaultLayout)
  const [viewMode, setViewMode] = useState<ViewMode>(playgroundConfig.defaultLayout)
  const [zoom, setZoom] = useState(playgroundConfig.defaultZoom)
  const [activeId, setActiveId] = useState<string | null>(null)
  const thumbNodesRef = useRef(new Map<string, HTMLAnchorElement>())
  const scalesRef = useRef<Record<string, number>>(
    Object.fromEntries(playgroundProjects.map((p) => [p.id, 1])),
  )
  const updateScalesRef = useRef<(offset: { x: number; y: number }) => void>(() => {})
  const leaveTimerRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const revealingRef = useRef(false)
  const zoomRef = useRef(zoom)

  zoomRef.current = zoom
  const listOpen = viewMode === 'list'

  const projects = useMemo(
    () => applyLayout(playgroundProjects, layout),
    [layout],
  )

  const handlePositionChange = useCallback((offset: { x: number; y: number }) => {
    updateScalesRef.current(offset)
  }, [])

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
    applyPosition,
    animateTo,
  } = useCanvasDrag({
    canvasWidth: playgroundConfig.canvasWidth,
    canvasHeight: playgroundConfig.canvasHeight,
    startingX: playgroundConfig.startingX,
    startingY: playgroundConfig.startingY,
    dragThreshold: playgroundConfig.dragThreshold,
    enableMomentum: playgroundConfig.enableMomentum,
    reducedMotion,
    zoom,
    onPositionChange: handlePositionChange,
  })

  useCursorParallax({
    enabled: playgroundConfig.enableCursorParallax && !touchMode && !listOpen,
    reducedMotion,
    isDragging,
    containerRef,
    positionRef,
    applyPosition,
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

      const enabled = enableProximityScaling && !reducedMotion && layout === 'scattered'
      for (const project of projects) {
        const scale = getProximityScale(
          project,
          offset,
          viewport,
          zoomRef.current,
          enabled,
        )
        applyScaleToNode(project.id, scale)
      }
    },
    [applyScaleToNode, containerRef, enableProximityScaling, layout, projects, reducedMotion],
  )

  useEffect(() => {
    updateScalesRef.current = updateScales
  }, [updateScales])

  useEffect(() => {
    updateScales(positionRef.current)
  }, [enableProximityScaling, layout, positionRef, reducedMotion, updateScales, zoom])

  useEffect(() => {
    for (const project of projects) {
      applyScaleToNode(project.id, scalesRef.current[project.id] ?? 1)
    }
  }, [activeId, applyScaleToNode, projects])

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
      id ? (projects.find((p) => p.id === id)?.title ?? null) : null,
    )
  }, [onActiveProjectChange, projects])

  const revealProject = useCallback(
    (id: string) => {
      if (!playgroundConfig.enableHoverReveal || isDragging()) return

      const project = projects.find((item) => item.id === id)
      const container = containerRef.current
      if (!project || !container) return

      const scaleBoost = reducedMotion ? 1 : playgroundConfig.hoverScale
      const overflow =
        ((scaleBoost - 1) / 2) * Math.max(project.width, project.height) * zoomRef.current
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
        zoomRef.current,
      )

      if (!next) return

      revealingRef.current = true
      animateTo(next, reducedMotion ? 0 : playgroundConfig.revealDurationMs, () => {
        revealingRef.current = false
        syncActiveFromPointer()
      })
    },
    [
      animateTo,
      containerRef,
      isDragging,
      positionRef,
      projects,
      reducedMotion,
      syncActiveFromPointer,
    ],
  )

  const handleActivate = useCallback(
    (id: string | null) => {
      if (leaveTimerRef.current !== null) {
        window.clearTimeout(leaveTimerRef.current)
        leaveTimerRef.current = null
      }

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
      const title = projects.find((p) => p.id === id)?.title ?? null
      onActiveProjectChange(title)
      revealProject(id)
    },
    [onActiveProjectChange, projects, revealProject],
  )

  const handleSelectView = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode)
      if (mode === 'list') return

      setLayout(mode)
      setActiveId(null)
      onActiveProjectChange(null)
    },
    [onActiveProjectChange],
  )

  const handleCloseList = useCallback(() => {
    setViewMode(layout)
  }, [layout])

  const handleLocateProject = useCallback(
    (id: string) => {
      const project = projects.find((item) => item.id === id)
      const container = containerRef.current
      if (!project || !container) return

      setViewMode(layout)
      setActiveId(id)
      onActiveProjectChange(project.title)

      const z = zoomRef.current
      const next = {
        x: container.clientWidth / 2 - (project.x + project.width / 2) * z,
        y: container.clientHeight / 2 - (project.y + project.height / 2) * z,
      }
      animateTo(next, reducedMotion ? 0 : playgroundConfig.revealDurationMs)
    },
    [animateTo, containerRef, layout, onActiveProjectChange, projects, reducedMotion],
  )

  const handleZoomIn = useCallback(() => {
    setZoom((current) => clampZoom(current + playgroundConfig.zoomStep))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((current) => clampZoom(current - playgroundConfig.zoomStep))
  }, [])

  const handleCanvasPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      if (touchMode && !target.closest('[data-project-id], .canvas-controls')) {
        handleActivate(null)
      }
      handlePointerDown(event)
    },
    [handleActivate, handlePointerDown, touchMode],
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
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="region"
      aria-label="Interactive project canvas. Drag to explore projects."
    >
      <div ref={surfaceRef} className="draggable-canvas__surface" style={surfaceStyle}>
        {projects.map((project) => (
          <ProjectThumbnail
            key={project.id}
            project={project}
            isActive={activeId === project.id}
            reducedMotion={reducedMotion}
            layoutMode={layout}
            touchMode={touchMode}
            onActivate={handleActivate}
            shouldSuppressClick={shouldSuppressClick}
            registerNode={registerThumb}
          />
        ))}
      </div>

      <ProjectListOverlay
        projects={projects}
        open={listOpen}
        onClose={handleCloseList}
        onSelect={handleLocateProject}
      />

      <CanvasControls
        viewMode={viewMode}
        zoom={zoom}
        minZoom={playgroundConfig.minZoom}
        maxZoom={playgroundConfig.maxZoom}
        onSelectView={handleSelectView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  )
}
