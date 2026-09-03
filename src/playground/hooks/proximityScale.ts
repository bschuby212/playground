import { playgroundConfig } from '../data/config'
import type { PlaygroundProject } from '../data/projects'

type Point = { x: number; y: number }

/**
 * Map a thumbnail's distance from the visible viewport center to a proximity scale.
 * Returns 1 when scaling is disabled.
 */
export function getProximityScale(
  project: PlaygroundProject,
  canvasOffset: Point,
  viewport: { width: number; height: number },
  zoom: number,
  enabled: boolean,
): number {
  if (!enabled) return 1

  const { centerScale, edgeScale } = playgroundConfig
  const z = Math.max(zoom, 0.001)
  const viewportCenterX = (-canvasOffset.x + viewport.width / 2) / z
  const viewportCenterY = (-canvasOffset.y + viewport.height / 2) / z
  const thumbCenterX = project.x + project.width / 2
  const thumbCenterY = project.y + project.height / 2

  const dx = thumbCenterX - viewportCenterX
  const dy = thumbCenterY - viewportCenterY
  const distance = Math.hypot(dx, dy)

  // Normalize against half-diagonal of the visible canvas area
  const maxDistance = Math.hypot(viewport.width / z, viewport.height / z) / 2
  const t = Math.min(1, distance / Math.max(maxDistance, 1))
  return centerScale + (edgeScale - centerScale) * t
}
