import { thumbnailSizes, type PlaygroundProject } from './projects'
import type { LayoutMode } from './config'

export type LayoutPlacement = {
  x: number
  y: number
  width: number
  height: number
}

type OrbitItem = {
  id: string
  size: keyof typeof thumbnailSizes
  /** Degrees from center; uneven spacing keeps the ring feeling playful. */
  angleDeg: number
  /** Multiplier on base radius (0.7–1.2) for stagger in/out. */
  radiusScale: number
  /** Extra nudge in canvas px after polar placement. */
  nudgeX?: number
  nudgeY?: number
}

/**
 * Playground ring: roughly circular, but staggered angles/radii so it
 * reads as a loose constellation instead of a neat oval.
 */
function buildPlaygroundRing(
  center: { id: string; size: keyof typeof thumbnailSizes; nudgeX?: number; nudgeY?: number },
  orbit: OrbitItem[],
  options: { cx: number; cy: number; radiusX: number; radiusY: number },
): Record<string, LayoutPlacement> {
  const { cx, cy, radiusX, radiusY } = options
  const layout: Record<string, LayoutPlacement> = {}

  const centerSize = thumbnailSizes[center.size]
  layout[center.id] = {
    x: Math.round(cx - centerSize.width / 2 + (center.nudgeX ?? 0)),
    y: Math.round(cy - centerSize.height / 2 + (center.nudgeY ?? 0)),
    ...centerSize,
  }

  for (const item of orbit) {
    const size = thumbnailSizes[item.size]
    const angle = (item.angleDeg * Math.PI) / 180
    const px = cx + radiusX * item.radiusScale * Math.cos(angle) + (item.nudgeX ?? 0)
    const py = cy + radiusY * item.radiusScale * Math.sin(angle) + (item.nudgeY ?? 0)
    layout[item.id] = {
      x: Math.round(px - size.width / 2),
      y: Math.round(py - size.height / 2),
      ...size,
    }
  }

  return layout
}

/** Scattered playground — loose circular constellation with uneven spacing. */
export const scatteredLayout: Record<string, LayoutPlacement> = buildPlaygroundRing(
  { id: 'project-09', size: 'square', nudgeX: 24, nudgeY: -18 },
  [
    { id: 'project-01', size: 'large', angleDeg: -98, radiusScale: 1.08, nudgeX: -20, nudgeY: 12 },
    { id: 'project-02', size: 'medium', angleDeg: -48, radiusScale: 0.82, nudgeX: 36, nudgeY: -28 },
    { id: 'project-03', size: 'large', angleDeg: -8, radiusScale: 1.14, nudgeX: 18, nudgeY: 40 },
    { id: 'project-04', size: 'medium', angleDeg: 38, radiusScale: 0.9, nudgeX: -30, nudgeY: 22 },
    { id: 'project-05', size: 'tall', angleDeg: 78, radiusScale: 1.18, nudgeX: 14, nudgeY: -16 },
    { id: 'project-06', size: 'medium', angleDeg: 128, radiusScale: 0.86, nudgeX: -42, nudgeY: 8 },
    { id: 'project-07', size: 'large', angleDeg: 168, radiusScale: 1.06, nudgeX: 26, nudgeY: -34 },
    { id: 'project-08', size: 'large', angleDeg: -148, radiusScale: 0.94, nudgeX: -12, nudgeY: 48 },
  ],
  {
    cx: 1180,
    cy: 880,
    radiusX: 780,
    radiusY: 520,
  },
)

/**
 * Clean bento rows — three rows for the current 9-item set.
 */
export const bentoLayout: Record<string, LayoutPlacement> = (() => {
  const gap = 28
  const originX = 140
  const originY = 140
  const rowGap = 44

  const rowPatterns: Array<Array<'large' | 'medium' | 'small' | 'tall' | 'square'>> = [
    ['large', 'medium', 'large'],
    ['medium', 'large', 'square'],
    ['medium', 'large', 'tall'],
  ]

  const ids = [
    'project-01',
    'project-02',
    'project-03',
    'project-04',
    'project-05',
    'project-06',
    'project-07',
    'project-08',
    'project-09',
  ]
  const layout: Record<string, LayoutPlacement> = {}
  let index = 0
  let y = originY

  for (const pattern of rowPatterns) {
    let x = originX
    let rowHeight = 0
    for (const sizeKey of pattern) {
      const id = ids[index]
      if (!id) break
      const size = thumbnailSizes[sizeKey]
      layout[id] = { x, y, ...size }
      x += size.width + gap
      rowHeight = Math.max(rowHeight, size.height)
      index += 1
    }
    y += rowHeight + rowGap
  }

  return layout
})()

export const layouts: Record<LayoutMode, Record<string, LayoutPlacement>> = {
  scattered: scatteredLayout,
  bento: bentoLayout,
}

export function applyLayout(
  projects: PlaygroundProject[],
  mode: LayoutMode,
): PlaygroundProject[] {
  const placement = layouts[mode]
  return projects.map((project) => {
    const next = placement[project.id]
    if (!next) return project
    return { ...project, ...next }
  })
}
