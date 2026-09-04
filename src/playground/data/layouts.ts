import { thumbnailSizes, type PlaygroundProject } from './projects'
import type { LayoutMode } from './config'

export type LayoutPlacement = {
  x: number
  y: number
  width: number
  height: number
}

/** Organic scattered placement — freeform composition for eight projects. */
export const scatteredLayout: Record<string, LayoutPlacement> = {
  'project-01': { x: 160, y: 180, ...thumbnailSizes.large },
  'project-02': { x: 700, y: 110, ...thumbnailSizes.medium },
  'project-03': { x: 1120, y: 200, ...thumbnailSizes.large },
  'project-04': { x: 1680, y: 140, ...thumbnailSizes.medium },
  'project-05': { x: 2040, y: 420, ...thumbnailSizes.tall },
  'project-06': { x: 200, y: 560, ...thumbnailSizes.medium },
  'project-07': { x: 620, y: 560, ...thumbnailSizes.large },
  'project-08': { x: 1180, y: 580, ...thumbnailSizes.large },
}

/**
 * Clean bento rows — two rows of four for the current 8-item set.
 */
export const bentoLayout: Record<string, LayoutPlacement> = (() => {
  const gap = 28
  const originX = 160
  const originY = 180
  const rowGap = 48

  const rowPatterns: Array<Array<'large' | 'medium' | 'small' | 'tall'>> = [
    ['large', 'medium', 'large', 'medium'],
    ['medium', 'large', 'large', 'tall'],
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
): PlaygroundProject[] {
  const placement = layouts[mode]
  return projects.map((project) => {
    const next = placement[project.id]
    if (!next) return project
    return { ...project, ...next }
  })
}
