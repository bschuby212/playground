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
 */
export function getCenteredPan(
  bounds: ContentBounds,
  viewportWidth: number,
  viewportHeight: number,
  zoom: number,
  focus?: FocusRect | null,
) {
  const clusterX = (bounds.left + bounds.right) / 2
  const clusterY = (bounds.top + bounds.bottom) / 2

  const centerX = focus ? focus.x + focus.width / 2 : clusterX
  const centerY = focus ? focus.y + focus.height / 2 : clusterY

  return {
    x: viewportWidth / 2 - centerX * zoom,
    y: viewportHeight / 2 - centerY * zoom,
  }
}
