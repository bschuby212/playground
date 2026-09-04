import { useEffect, useRef, type RefObject } from 'react'
import { playgroundConfig } from '../data/config'

type Point = { x: number; y: number }

type UseCursorParallaxOptions = {
  enabled: boolean
  reducedMotion: boolean
  isDragging: () => boolean
  containerRef: RefObject<HTMLDivElement | null>
  positionRef: RefObject<Point>
  applyPosition: (next: Point) => Point
}

/**
 * Website-style 2D scrolling: mouse move right/down scrolls the view
 * right/down (content translate decreases). No center snap — only canvas bounds.
 */
export function useCursorParallax({
  enabled,
  reducedMotion,
  isDragging,
  containerRef,
  positionRef,
  applyPosition,
}: UseCursorParallaxOptions) {
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)
  const pendingRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canRun = enabled && !reducedMotion
    if (!canRun) {
      lastPointerRef.current = null
      pendingRef.current = { x: 0, y: 0 }
      return
    }

    const { parallaxGain, parallaxEase } = playgroundConfig

    const flush = () => {
      const pending = pendingRef.current
      if (pending.x === 0 && pending.y === 0) {
        rafRef.current = null
        return
      }

      const stepX = pending.x * parallaxEase
      const stepY = pending.y * parallaxEase
      pending.x -= stepX
      pending.y -= stepY

      if (Math.abs(pending.x) < 0.05) pending.x = 0
      if (Math.abs(pending.y) < 0.05) pending.y = 0

      const current = positionRef.current
      applyPosition({
        x: current.x + stepX,
        y: current.y + stepY,
      })

      rafRef.current = requestAnimationFrame(flush)
    }

    const kick = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(flush)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || isDragging()) {
        lastPointerRef.current = null
        return
      }

      const last = lastPointerRef.current
      lastPointerRef.current = { x: event.clientX, y: event.clientY }
      if (!last) return

      const dx = event.clientX - last.x
      const dy = event.clientY - last.y
      if (dx === 0 && dy === 0) return

      // Scroll-style: move mouse right → view scrolls right → translate X decreases
      pendingRef.current.x -= dx * parallaxGain
      pendingRef.current.y -= dy * parallaxGain
      kick()
    }

    const onLeave = () => {
      // Keep pan where it is — only clear tracking sample so re-entry does not jump
      lastPointerRef.current = null
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
