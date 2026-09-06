import type { ContentBounds } from './useCanvasDrag'

/** Pan offset that places the project cluster in the middle of the viewport. */
export function getCenteredPan(
  bounds: ContentBounds,
  viewportWidth: number,
  viewportHeight: number,
  zoom: number,
) {
  const centerX = (bounds.left + bounds.right) / 2
  const centerY = (bounds.top + bounds.bottom) / 2
  return {
    x: viewportWidth / 2 - centerX * zoom,
    y: viewportHeight / 2 - centerY * zoom,
  }
}
