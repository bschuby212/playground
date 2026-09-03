import type { PlaygroundProject } from '../data/projects'

type Point = { x: number; y: number }

/**
 * How far to shift the canvas so a project sits more fully inside the viewport.
 * Nudges are capped so the thumbnail stays under the cursor.
 * Coordinates account for canvas zoom (transform origin top-left).
 */
export function getRevealOffset(
  project: PlaygroundProject,
  canvasOffset: Point,
  viewport: { width: number; height: number },
  padding: number,
  maxNudge: number,
  zoom: number,
): Point | null {
  const z = Math.max(zoom, 0.001)
  const left = project.x * z + canvasOffset.x
  const top = project.y * z + canvasOffset.y
  const right = left + project.width * z
  const bottom = top + project.height * z

  let dx = 0
  let dy = 0

  if (left < padding) {
    dx = padding - left
  } else if (right > viewport.width - padding) {
    dx = viewport.width - padding - right
  }

  if (top < padding) {
    dy = padding - top
  } else if (bottom > viewport.height - padding) {
    dy = viewport.height - padding - bottom
  }

  dx = Math.max(-maxNudge, Math.min(maxNudge, dx))
  dy = Math.max(-maxNudge, Math.min(maxNudge, dy))

  if (dx === 0 && dy === 0) return null

  return {
    x: canvasOffset.x + dx,
    y: canvasOffset.y + dy,
  }
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}
