import { useEffect, useRef, type RefObject } from 'react'
import { playgroundConfig } from '../data/config'

type Point = { x: number; y: number }

type UseCursorParallaxOptions = {
  enabled: boolean
  reducedMotion: boolean
  zoom: number
  isDragging: () => boolean
  containerRef: RefObject<HTMLDivElement | null>
  positionRef: RefObject<Point>
  applyPosition: (next: Point) => Point
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Cursor-driven canvas pan:
 * 1) Move mouse → scroll-style pan, gentler in the center, stronger toward edges
 * 2) Rest near a viewport edge → slow auto-pan (Figma/Miro style)
 * Yields fully while dragging. Speeds/zones scale with viewport + zoom.
 */
export function useCursorParallax({
  enabled,
  reducedMotion,
  zoom,
  isDragging,
  containerRef,
  positionRef,
  applyPosition,
}: UseCursorParallaxOptions) {
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const pendingRef = useRef({ x: 0, y: 0 })
  const pointerInsideRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const zoomRef = useRef(zoom)

  zoomRef.current = zoom

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canRun = enabled && !reducedMotion
    if (!canRun) {
      lastPointerRef.current = null
      pointerRef.current = null
      pendingRef.current = { x: 0, y: 0 }
      pointerInsideRef.current = false
      return
    }

    const {
      parallaxGain,
      parallaxCenterGain,
      parallaxCenterSoftZone,
      parallaxEase,
    } = playgroundConfig

    const getEdgeMetrics = (width: number, height: number) => {
      const shortSide = Math.min(width, height)
      const zone = clamp(
        shortSide * playgroundConfig.edgePanZoneFraction,
        playgroundConfig.edgePanZoneMin,
        playgroundConfig.edgePanZoneMax,
      )
      const speed =
        playgroundConfig.edgePanMaxSpeed *
        (shortSide / 700) *
        (0.75 + zoomRef.current * 0.35)
      return { zone, speed }
    }

    /** 0 at center → 1 near rim; keeps middle of the port gentle. */
    const centerFalloff = (localX: number, localY: number, width: number, height: number) => {
      const nx = (localX - width / 2) / (width / 2)
      const ny = (localY - height / 2) / (height / 2)
      const dist = Math.min(1, Math.hypot(nx, ny))
      const soft = parallaxCenterSoftZone
      if (dist <= soft) {
        return (dist / soft) * (dist / soft)
      }
      const t = (dist - soft) / (1 - soft)
      return soft * soft + (1 - soft * soft) * t
    }

    const gainAt = (localX: number, localY: number, width: number, height: number) => {
      const edgeMix = centerFalloff(localX, localY, width, height)
      return parallaxCenterGain + (parallaxGain - parallaxCenterGain) * edgeMix
    }

    const edgePush = (distanceFromEdge: number, zone: number, speed: number) => {
      if (distanceFromEdge >= zone || distanceFromEdge < 0) return 0
      const t = 1 - distanceFromEdge / zone
      return t * t * speed
    }

    const tick = () => {
      rafRef.current = null

      if (isDragging()) {
        pendingRef.current = { x: 0, y: 0 }
        lastPointerRef.current = null
        if (pointerInsideRef.current) {
          rafRef.current = requestAnimationFrame(tick)
        }
        return
      }

      if (!pointerInsideRef.current) {
        return
      }

      const pending = pendingRef.current
      let stepX = pending.x * parallaxEase
      let stepY = pending.y * parallaxEase
      pending.x -= stepX
      pending.y -= stepY
      if (Math.abs(pending.x) < 0.05) pending.x = 0
      if (Math.abs(pending.y) < 0.05) pending.y = 0

      const pointer = pointerRef.current
      let nearEdge = false
      if (pointer) {
        const rect = container.getBoundingClientRect()
        const { zone, speed } = getEdgeMetrics(rect.width, rect.height)
        const localX = pointer.x - rect.left
        const localY = pointer.y - rect.top

        const up = edgePush(localY, zone, speed)
        const down = edgePush(rect.height - localY, zone, speed)
        const left = edgePush(localX, zone, speed)
        const right = edgePush(rect.width - localX, zone, speed)

        stepY += up
        stepY -= down
        stepX += left
        stepX -= right
        nearEdge = up > 0 || down > 0 || left > 0 || right > 0
      }

      if (stepX !== 0 || stepY !== 0) {
        const current = positionRef.current
        applyPosition({
          x: current.x + stepX,
          y: current.y + stepY,
        })
      }

      const stillPending = pending.x !== 0 || pending.y !== 0
      if (pointerInsideRef.current && (stillPending || nearEdge || isDragging())) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const kick = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        lastPointerRef.current = null
        return
      }

      pointerInsideRef.current = true
      pointerRef.current = { x: event.clientX, y: event.clientY }

      if (isDragging()) {
        lastPointerRef.current = null
        pendingRef.current = { x: 0, y: 0 }
        kick()
        return
      }

      const last = lastPointerRef.current
      lastPointerRef.current = { x: event.clientX, y: event.clientY }
      if (!last) {
        kick()
        return
      }

      const dx = event.clientX - last.x
      const dy = event.clientY - last.y
      if (dx !== 0 || dy !== 0) {
        const rect = container.getBoundingClientRect()
        const localX = event.clientX - rect.left
        const localY = event.clientY - rect.top
        const gain = gainAt(localX, localY, rect.width, rect.height)
        pendingRef.current.x -= dx * gain
        pendingRef.current.y -= dy * gain
      }
      kick()
    }

    const onLeave = () => {
      pointerInsideRef.current = false
      lastPointerRef.current = null
      pointerRef.current = null
    }

    container.addEventListener('pointermove', onMove, { passive: true })
    container.addEventListener('pointerleave', onLeave)

    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [applyPosition, containerRef, enabled, isDragging, positionRef, reducedMotion])
}
