import { thumbnailSizes, type PlaygroundProject } from './projects'
import type { LayoutMode } from './config'

export type LayoutPlacement = {
  x: number
  y: number
  width: number
  height: number
}

type SizedItem = {
  id: string
  size: keyof typeof thumbnailSizes
}

/**
 * Place items on an ellipse around the canvas center.
 * One piece sits in the middle; the rest orbit in a ring.
 */
function buildCircularLayout(
  center: SizedItem,
  ring: SizedItem[],
  options: {
    cx: number
    cy: number
    radiusX: number
    radiusY: number
    startAngleDeg?: number
  },
): Record<string, LayoutPlacement> {
  const { cx, cy, radiusX, radiusY, startAngleDeg = -90 } = options
  const layout: Record<string, LayoutPlacement> = {}

  const centerSize = thumbnailSizes[center.size]
  layout[center.id] = {
    x: Math.round(cx - centerSize.width / 2),
    y: Math.round(cy - centerSize.height / 2),
    ...centerSize,
  }

  const count = ring.length
  ring.forEach((item, index) => {
    const size = thumbnailSizes[item.size]
    const angle = ((startAngleDeg + (360 / count) * index) * Math.PI) / 180
    // Slight radius wobble keeps the ring from reading as a rigid oval
    const wobble = 1 + (((index % 3) - 1) * 0.04)
    const px = cx + radiusX * wobble * Math.cos(angle)
    const py = cy + radiusY * wobble * Math.sin(angle)
    layout[item.id] = {
      x: Math.round(px - size.width / 2),
      y: Math.round(py - size.height / 2),
      ...size,
    }
  })

  return layout
}

/** Circular scattered placement — ring around a center piece. */
export const scatteredLayout: Record<string, LayoutPlacement> = buildCircularLayout(
  { id: 'project-09', size: 'square' },
  [
    { id: 'project-01', size: 'large' },
    { id: 'project-02', size: 'medium' },
    { id: 'project-03', size: 'large' },
    { id: 'project-04', size: 'medium' },
    { id: 'project-05', size: 'tall' },
    { id: 'project-06', size: 'medium' },
    { id: 'project-07', size: 'large' },
    { id: 'project-08', size: 'large' },
  ],
  {
    cx: 1200,
    cy: 900,
    radiusX: 820,
    radiusY: 560,
    startAngleDeg: -90,
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
