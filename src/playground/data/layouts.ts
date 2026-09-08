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
 * Intrinsic image sizes — mobile frames follow these ratios so thumbnails
 * aren’t cropped into squares or tall cards.
 */
const mobileImageAspect: Record<string, { w: number; h: number }> = {
  'project-01': { w: 843, h: 632 },
  'project-02': { w: 842, h: 632 },
  'project-03': { w: 843, h: 632 },
  'project-05': { w: 843, h: 632 },
  'project-06': { w: 842, h: 632 },
  'project-07': { w: 1920, h: 1440 },
  'project-09': { w: 403, h: 403 },
}

function mobileThumb(id: string, displayWidth: number): LayoutPlacement {
  const aspect = mobileImageAspect[id] ?? { w: 843, h: 632 }
  return {
    x: 0,
    y: 0,
    width: displayWidth,
    height: Math.round((displayWidth * aspect.h) / aspect.w),
  }
}

/**
 * Phone / tablet canvas (scattered) — natural image ratios, Saturday mid-field.
 * Sized closer to prior mobile tile scale so thumbs stay readable.
 */
export const mobileVerticalLayout: Record<string, LayoutPlacement> = (() => {
  // Wider gaps so fingers can pan between thumbs without feeling cramped.
  const gap = 32
  const originX = 16
  const originY = 20

  const row1: Array<{ id: string; width: number }> = [
    { id: 'project-02', width: 260 },
    { id: 'project-01', width: 320 },
    { id: 'project-03', width: 260 },
  ]
  const row2: Array<{ id: string; width: number }> = [
    { id: 'project-05', width: 240 },
    { id: 'project-06', width: 240 },
    { id: 'project-07', width: 240 },
    { id: 'project-09', width: 200 },
  ]
  const layout: Record<string, LayoutPlacement> = {}

  let x = originX
  let row1Height = 0
  for (const item of row1) {
    const size = mobileThumb(item.id, item.width)
    const y = item.id === 'project-01' ? originY : originY + 20
    layout[item.id] = { ...size, x, y }
    x += size.width + gap
    row1Height = Math.max(row1Height, size.height + (y - originY))
  }

  x = originX
  const row2Y = originY + row1Height + gap
  for (const item of row2) {
    const size = mobileThumb(item.id, item.width)
    layout[item.id] = { ...size, x, y: row2Y }
    x += size.width + gap
  }

  return layout
})()

/**
 * Phone / tablet grid (bento) — packed rows that keep each image’s
 * natural aspect ratio at a readable size (no square crop frames).
 */
export const mobileBentoLayout: Record<string, LayoutPlacement> = (() => {
  // Roomier packing — more open canvas between tiles for smoother pan gestures.
  const gap = 32
  const originX = 16
  const originY = 20
  const layout: Record<string, LayoutPlacement> = {}

  const saturday = mobileThumb('project-01', 340)
  layout['project-01'] = { ...saturday, x: originX, y: originY }

  // Inspo above Buddy so mobile hierarchy matches desktop bento impact.
  const rows: Array<Array<{ id: string; width: number }>> = [
    [
      { id: 'project-02', width: 260 },
      { id: 'project-03', width: 260 },
    ],
    [
      { id: 'project-07', width: 260 },
      { id: 'project-06', width: 260 },
    ],
    [
      { id: 'project-05', width: 260 },
      { id: 'project-09', width: 200 },
    ],
  ]

  let y = originY + saturday.height + gap
  for (const row of rows) {
    let x = originX
    let rowHeight = 0
    for (const item of row) {
      const size = mobileThumb(item.id, item.width)
      layout[item.id] = { ...size, x, y }
      x += size.width + gap
      rowHeight = Math.max(rowHeight, size.height)
    }
    y += rowHeight + gap
  }

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
    ['large', 'large', 'large'],
    ['medium', 'square', 'square'],
  ]

  // Saturday centered; Inspo + Invoice flank it; Buddy demoted; Robot square (no tall crop).
  const ids = [
    'project-02',
    'project-03',
    'project-04',
    'project-07',
    'project-01',
    'project-08',
    'project-05',
    'project-06',
    'project-09',
  ]
  // Measure rows first so shorter ones (esp. bottom) can center under the widest.
  type RowPlan = {
    items: Array<{ id: string; width: number; height: number }>
    width: number
    height: number
  }
  const rows: RowPlan[] = []
  let index = 0
  for (const pattern of rowPatterns) {
    const items: RowPlan['items'] = []
    let width = 0
    let height = 0
    for (const sizeKey of pattern) {
      const id = ids[index]
      if (!id) break
      const size = thumbnailSizes[sizeKey]
      items.push({ id, ...size })
      width += size.width + (items.length > 1 ? gap : 0)
      height = Math.max(height, size.height)
      index += 1
    }
    rows.push({ items, width, height })
  }

  const maxRowWidth = Math.max(...rows.map((row) => row.width))
  const layout: Record<string, LayoutPlacement> = {}
  let y = originY

  for (const row of rows) {
    // Optical center under the bento block (fixes left-heavy bottom row).
    let x = originX + Math.round((maxRowWidth - row.width) / 2)
    for (const item of row.items) {
      layout[item.id] = { x, y, width: item.width, height: item.height }
      x += item.width + gap
    }
    y += row.height + rowGap
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
