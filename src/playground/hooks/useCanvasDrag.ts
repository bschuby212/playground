import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { playgroundConfig } from '../data/config'

type Point = { x: number; y: number }

type UseCanvasDragOptions = {
  canvasWidth: number
  canvasHeight: number
  startingX: number
  startingY: number
  dragThreshold: number
  enableMomentum: boolean
  reducedMotion: boolean
  onPositionChange?: (position: Point) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function useCanvasDrag({
  canvasWidth,
  canvasHeight,
  startingX,
  startingY,
  dragThreshold,
  enableMomentum,
  reducedMotion,
  onPositionChange,
}: UseCanvasDragOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<Point>({ x: startingX, y: startingY })
  const pointerIdRef = useRef<number | null>(null)
  const dragOriginRef = useRef<Point>({ x: 0, y: 0 })
  const positionOriginRef = useRef<Point>({ x: startingX, y: startingY })
  const movedDistanceRef = useRef(0)
  const isDraggingRef = useRef(false)
  const suppressClickRef = useRef(false)
  const velocityRef = useRef<Point>({ x: 0, y: 0 })
  const lastSampleRef = useRef<{ point: Point; time: number } | null>(null)
  const rafRef = useRef<number | null>(null)
  const momentumRafRef = useRef<number | null>(null)

  const getBounds = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return { minX: startingX, maxX: startingX, minY: startingY, maxY: startingY }
    }
    const { clientWidth, clientHeight } = container
    return {
      minX: Math.min(0, clientWidth - canvasWidth),
      maxX: 0,
      minY: Math.min(0, clientHeight - canvasHeight),
      maxY: 0,
    }
  }, [canvasHeight, canvasWidth, startingX, startingY])

  const applyPosition = useCallback(
    (next: Point, announce = true) => {
      const bounds = getBounds()
      const clamped = {
        x: clamp(next.x, bounds.minX, bounds.maxX),
        y: clamp(next.y, bounds.minY, bounds.maxY),
      }
      positionRef.current = clamped
      const surface = surfaceRef.current
      if (surface) {
        surface.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0)`
      }
      if (announce) {
        onPositionChange?.(clamped)
      }
      return clamped
    },
    [getBounds, onPositionChange],
  )

  const stopMomentum = useCallback(() => {
    if (momentumRafRef.current !== null) {
      cancelAnimationFrame(momentumRafRef.current)
      momentumRafRef.current = null
    }
  }, [])

  const startMomentum = useCallback(() => {
    stopMomentum()
    if (!enableMomentum || reducedMotion) return

    const friction = playgroundConfig.momentumFriction
    const minVelocity = playgroundConfig.momentumMinVelocity

    const step = () => {
      const velocity = velocityRef.current
      const speed = Math.hypot(velocity.x, velocity.y)
      if (speed < minVelocity) {
        momentumRafRef.current = null
        return
      }

      const current = positionRef.current
      applyPosition({
        x: current.x + velocity.x,
        y: current.y + velocity.y,
      })

      velocityRef.current = {
        x: velocity.x * friction,
        y: velocity.y * friction,
      }
      momentumRafRef.current = requestAnimationFrame(step)
    }

    momentumRafRef.current = requestAnimationFrame(step)
  }, [applyPosition, enableMomentum, reducedMotion, stopMomentum])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return

      stopMomentum()
      const container = containerRef.current
      if (!container) return

      pointerIdRef.current = event.pointerId
      container.setPointerCapture(event.pointerId)
      dragOriginRef.current = { x: event.clientX, y: event.clientY }
      positionOriginRef.current = { ...positionRef.current }
      movedDistanceRef.current = 0
      isDraggingRef.current = false
      suppressClickRef.current = false
      velocityRef.current = { x: 0, y: 0 }
      lastSampleRef.current = {
        point: { x: event.clientX, y: event.clientY },
        time: performance.now(),
      }
      container.classList.add('is-dragging')
    },
    [stopMomentum],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) return

      const dx = event.clientX - dragOriginRef.current.x
      const dy = event.clientY - dragOriginRef.current.y
      const distance = Math.hypot(dx, dy)
      movedDistanceRef.current = distance

      if (distance > dragThreshold) {
        isDraggingRef.current = true
        suppressClickRef.current = true
      }

      if (!isDraggingRef.current) return

      event.preventDefault()

      const now = performance.now()
      const last = lastSampleRef.current
      if (last) {
        const dt = Math.max(now - last.time, 1)
        velocityRef.current = {
          x: ((event.clientX - last.point.x) / dt) * 16,
          y: ((event.clientY - last.point.y) / dt) * 16,
        }
      }
      lastSampleRef.current = {
        point: { x: event.clientX, y: event.clientY },
        time: now,
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        applyPosition({
          x: positionOriginRef.current.x + dx,
          y: positionOriginRef.current.y + dy,
        })
        rafRef.current = null
      })
    },
    [applyPosition, dragThreshold],
  )

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) return

      const container = containerRef.current
      if (container?.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId)
      }

      pointerIdRef.current = null
      container?.classList.remove('is-dragging')

      if (isDraggingRef.current) {
        startMomentum()
      }

      // Keep suppressClickRef true through the subsequent click event
      if (suppressClickRef.current) {
        window.setTimeout(() => {
          suppressClickRef.current = false
        }, 0)
      }

      isDraggingRef.current = false
    },
    [startMomentum],
  )

  const shouldSuppressClick = useCallback(() => suppressClickRef.current, [])

  useEffect(() => {
    applyPosition({ x: startingX, y: startingY })
  }, [applyPosition, startingX, startingY])

  useEffect(() => {
    const onResize = () => {
      applyPosition(positionRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applyPosition])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      stopMomentum()
    }
  }, [stopMomentum])

  return {
    containerRef,
    surfaceRef,
    positionRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: endDrag,
    handlePointerCancel: endDrag,
    shouldSuppressClick,
    applyPosition,
  }
}
