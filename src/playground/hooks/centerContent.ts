import type { ContentBounds } from './useCanvasDrag'

export type FocusRect = {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Pan offset that keeps a focus tile central-ish in the viewport.
 * When no focus is given, falls back to the project-cluster midpoint.
 * Soft blend keeps neighboring projects visible around the focus.
 */
export function getCenteredPan(
  bounds: ContentBounds,
  viewportWidth: number,
  viewportHeight: number,
  zoom: number,
  focus?: FocusRect | null,
  /** 0 = cluster only, 1 = focus only. Default favors the focus tile. */
  focusBias = 0.78,
) {
  const clusterX = (bounds.left + bounds.right) / 2
  const clusterY = (bounds.top + bounds.bottom) / 2

  let centerX = clusterX
  let centerY = clusterY

  if (focus) {
    const focusX = focus.x + focus.width / 2
    const focusY = focus.y + focus.height / 2
    const t = Math.min(1, Math.max(0, focusBias))
    centerX = focusX * t + clusterX * (1 - t)
    centerY = focusY * t + clusterY * (1 - t)
  }

  return {
    x: viewportWidth / 2 - centerX * zoom,
    y: viewportHeight / 2 - centerY * zoom,
  }
}
