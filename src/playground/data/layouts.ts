import { thumbnailSizes, type PlaygroundProject } from './projects'
import type { LayoutMode } from './config'

export type LayoutPlacement = {
  x: number
  y: number
  width: number
  height: number
}

/** Organic scattered placement — Saturday sits mid-field so home pan can keep it in view. */
export const scatteredLayout: Record<string, LayoutPlacement> = {
  'project-02': { x: 120, y: 120, ...thumbnailSizes.medium },
  'project-03': { x: 520, y: 80, ...thumbnailSizes.large },
  'project-01': { x: 1040, y: 280, ...thumbnailSizes.large },
  'project-04': { x: 1580, y: 100, ...thumbnailSizes.medium },
  'project-05': { x: 1980, y: 360, ...thumbnailSizes.tall },
  'project-06': { x: 160, y: 520, ...thumbnailSizes.medium },
  'project-07': { x: 560, y: 560, ...thumbnailSizes.large },
  'project-08': { x: 1540, y: 560, ...thumbnailSizes.large },
  'project-09': { x: 1100, y: 640, ...thumbnailSizes.square },
}

/**
 * Phone / tablet canvas (scattered) — Saturday sits mid-composition so the
 * starting pan can keep it central-ish; surrounding tiles stay readable.
 */
export const mobileVerticalLayout: Record<string, LayoutPlacement> = {
  // Row 1 — Saturday in the middle
  'project-02': { x: 12, y: 36, width: 248, height: 170 },
  'project-01': { x: 276, y: 12, width: 300, height: 202 },
  'project-03': { x: 592, y: 48, width: 248, height: 170 },
  // Row 2
  'project-05': { x: 24, y: 260, width: 188, height: 260 },
  'project-06': { x: 228, y: 300, width: 248, height: 170 },
  'project-07': { x: 492, y: 280, width: 268, height: 180 },
  'project-09': { x: 776, y: 300, width: 200, height: 200 },
}

/**
 * Phone / tablet grid (bento) — Saturday leads the block so home pan
 * lands on it; remaining tiles fill a compact 2-col grid under/around it.
 */
export const mobileBentoLayout: Record<string, LayoutPlacement> = (() => {
  const gap = 10
  const originX = 12
  const originY = 16
  const cell = 152
  const wide = cell * 2 + gap

  const layout: Record<string, LayoutPlacement> = {
    // Focal tile — full width of the 2-col grid
    'project-01': { x: originX, y: originY, width: wide, height: 168 },
  }

  const rest = [
    'project-02',
    'project-03',
    'project-05',
    'project-06',
    'project-07',
    'project-09',
  ] as const

  const restOriginY = originY + 168 + gap
  rest.forEach((id, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    layout[id] = {
      x: originX + col * (cell + gap),
      y: restOriginY + row * (cell + gap),
      width: cell,
      height: cell,
    }
  })

  return layout
})()

/**
 * Clean bento rows — Saturday occupies the visual center cell so the
 * starting viewport can frame it without fighting pan clamps.
 */
export const bentoLayout: Record<string, LayoutPlacement> = (() => {
  const gap = 28
  const originX = 140
  const originY = 140
  const rowGap = 44

  const rowPatterns: Array<Array<'large' | 'medium' | 'small' | 'tall' | 'square'>> = [
    ['medium', 'large', 'medium'],
    ['large', 'large', 'square'],
    ['medium', 'large', 'tall'],
  ]

  // Saturday in the middle of the block; others fill around it in stable order.
  const ids = [
    'project-02',
    'project-03',
    'project-04',
    'project-05',
    'project-01',
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
