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
 * Phone / tablet canvas (scattered) — two staggered rows of three (6 projects).
 * Packed tighter so more shows by default in the 640 mobile frame.
 */
export const mobileVerticalLayout: Record<string, LayoutPlacement> = {
  // Row 1
  'project-02': { x: 12, y: 20, width: 268, height: 184 },
  'project-03': { x: 292, y: 56, width: 292, height: 196 },
  'project-05': { x: 600, y: 12, width: 210, height: 290 },
  // Row 2 — pulled up so both rows read in the first viewport
  'project-06': { x: 20, y: 320, width: 268, height: 184 },
  'project-07': { x: 304, y: 360, width: 292, height: 196 },
  'project-09': { x: 612, y: 300, width: 236, height: 236 },
}

/**
 * Phone / tablet grid (bento) — clean 2×3 pseudo-square tiles.
 * Snaps into a compact block; canvas view restores the staggered spread.
 */
export const mobileBentoLayout: Record<string, LayoutPlacement> = (() => {
  const ids = [
    'project-02',
    'project-03',
    'project-05',
    'project-06',
    'project-07',
    'project-09',
  ] as const
  const cell = 152
  const gap = 10
  const cols = 2
  const originX = 12
  const originY = 16
  const layout: Record<string, LayoutPlacement> = {}

  ids.forEach((id, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    layout[id] = {
      x: originX + col * (cell + gap),
      y: originY + row * (cell + gap),
      width: cell,
      height: cell,
    }
  })

  return layout
})()

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
  options?: { mobileViewport?: boolean },
): PlaygroundProject[] {
  let placement = layouts[mode]
  if (options?.mobileViewport) {
    placement = mode === 'bento' ? mobileBentoLayout : mobileVerticalLayout
  }

  return projects.map((project) => {
    const next = placement[project.id]
    if (!next) return project
    return { ...project, ...next }
  })
}
