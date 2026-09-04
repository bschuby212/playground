import { useEffect, useRef, type RefObject } from 'react'
import { playgroundConfig } from '../data/config'

type UseCursorParallaxOptions = {
  enabled: boolean
  reducedMotion: boolean
  isDragging: () => boolean
  containerRef: RefObject<HTMLDivElement | null>
}

/**
 * Subtle same-direction follow: mouse left → viewport eases left,
 * with a light perspective tilt. Disabled while dragging / on touch / reduced motion.
 */
export function useCursorParallax({
  enabled,
  reducedMotion,
  isDragging,
  containerRef,
}: UseCursorParallaxOptions) {
  const layerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 })
  const currentRef = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 })
  const rafRef = useRef<number | null>(null)
  const activeRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const layer = layerRef.current
    if (!container || !layer) return

    const canRun = enabled && !reducedMotion
    if (!canRun) {
      layer.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)'
      return
    }

    const { parallaxMaxShift, parallaxMaxTilt, parallaxEase } = playgroundConfig

    const apply = () => {
      const current = currentRef.current
      const target = targetRef.current
      current.x += (target.x - current.x) * parallaxEase
      current.y += (target.y - current.y) * parallaxEase
      current.rotateX += (target.rotateX - current.rotateX) * parallaxEase
      current.rotateY += (target.rotateY - current.rotateY) * parallaxEase

      layer.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) rotateX(${current.rotateX.toFixed(3)}deg) rotateY(${current.rotateY.toFixed(3)}deg)`

      const settled =
        Math.abs(target.x - current.x) < 0.05 &&
        Math.abs(target.y - current.y) < 0.05 &&
        Math.abs(target.rotateX - current.rotateX) < 0.01 &&
        Math.abs(target.rotateY - current.rotateY) < 0.01

      if (!settled || activeRef.current) {
        rafRef.current = requestAnimationFrame(apply)
      } else {
        rafRef.current = null
      }
    }

    const kick = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(apply)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || isDragging()) {
        targetRef.current = { x: 0, y: 0, rotateX: 0, rotateY: 0 }
        activeRef.current = false
        kick()
        return
      }

      const rect = container.getBoundingClientRect()
      const nx = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2
      const ny = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2

      // Same direction: mouse left → content shifts left (viewport follows)
      targetRef.current = {
        x: nx * parallaxMaxShift,
        y: ny * parallaxMaxShift,
        rotateY: nx * parallaxMaxTilt,
        rotateX: -ny * parallaxMaxTilt,
      }
      activeRef.current = true
      kick()
    }

    const onLeave = () => {
      targetRef.current = { x: 0, y: 0, rotateX: 0, rotateY: 0 }
      activeRef.current = false
      kick()
    }

    container.addEventListener('pointermove', onMove, { passive: true })
    container.addEventListener('pointerleave', onLeave)
    kick()

    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [containerRef, enabled, isDragging, reducedMotion])

  return { layerRef }
}
