import { thumbnailSizes, type PlaygroundProject } from './projects'
import type { LayoutMode } from './config'

export type LayoutPlacement = {
  x: number
  y: number
  width: number
  height: number
}

/** Organic scattered placement — freeform composition for nine projects. */
export const scatteredLayout: Record<string, LayoutPlacement> = {
  'project-01': { x: 140, y: 160, ...thumbnailSizes.large },
  'project-02': { x: 680, y: 100, ...thumbnailSizes.medium },
  'project-03': { x: 1100, y: 180, ...thumbnailSizes.large },
  'project-04': { x: 1660, y: 120, ...thumbnailSizes.medium },
  'project-05': { x: 2080, y: 380, ...thumbnailSizes.tall },
  'project-06': { x: 180, y: 540, ...thumbnailSizes.medium },
  'project-07': { x: 600, y: 540, ...thumbnailSizes.large },
  'project-08': { x: 1160, y: 560, ...thumbnailSizes.large },
  'project-09': { x: 1720, y: 620, ...thumbnailSizes.square },
}

/**
 * Phone / tablet — two staggered rows of three (6 projects).
 * Zigzag left/right so it still reads as a playground, not a grid.
 */
export const mobileVerticalLayout: Record<string, LayoutPlacement> = {
  // Row 1 — sizes ~1.1× prior mobile thumbs
  'project-02': { x: 24, y: 64, width: 220, height: 150 },
  'project-03': { x: 268, y: 118, width: 242, height: 163 },
  'project-05': { x: 540, y: 48, width: 172, height: 238 },
  // Row 2
  'project-06': { x: 48, y: 390, width: 220, height: 150 },
  'project-07': { x: 292, y: 442, width: 242, height: 163 },
  'project-09': { x: 560, y: 360, width: 194, height: 194 },
}

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

  const ids = Object.keys(scatteredLayout)
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
  options?: { mobileVertical?: boolean },
): PlaygroundProject[] {
  const placement = options?.mobileVertical
    ? mobileVerticalLayout
    : layouts[mode]

  return projects.map((project) => {
    const next = placement[project.id]
    if (!next) return project
    return { ...project, ...next }
  })
}
