import { thumbnailSizes, type PlaygroundProject } from './projects'
import type { LayoutMode } from './config'

export type LayoutPlacement = {
  x: number
  y: number
  width: number
  height: number
}

/** Organic scattered placement — current freeform composition. */
export const scatteredLayout: Record<string, LayoutPlacement> = {
  'project-01': { x: 180, y: 200, ...thumbnailSizes.large },
  'project-02': { x: 720, y: 120, ...thumbnailSizes.medium },
  'project-03': { x: 1140, y: 240, ...thumbnailSizes.small },
  'project-04': { x: 1480, y: 150, ...thumbnailSizes.medium },
  'project-05': { x: 1920, y: 280, ...thumbnailSizes.large },
  'project-06': { x: 220, y: 580, ...thumbnailSizes.small },
  'project-07': { x: 560, y: 560, ...thumbnailSizes.large },
  'project-08': { x: 1120, y: 520, ...thumbnailSizes.medium },
  'project-09': { x: 1600, y: 500, ...thumbnailSizes.small },
  'project-10': { x: 1920, y: 680, ...thumbnailSizes.medium },
  'project-11': { x: 200, y: 900, ...thumbnailSizes.medium },
  'project-12': { x: 640, y: 980, ...thumbnailSizes.large },
  'project-13': { x: 1220, y: 880, ...thumbnailSizes.small },
  'project-14': { x: 1480, y: 920, ...thumbnailSizes.medium },
  'project-15': { x: 1900, y: 1080, ...thumbnailSizes.large },
  'project-16': { x: 1120, y: 1180, ...thumbnailSizes.small },
}

/**
 * Clean bento rows — aligned tops per row with a consistent gap rhythm.
 * Pattern per row: large · medium · small · medium (rotated by row).
 */
export const bentoLayout: Record<string, LayoutPlacement> = (() => {
  const gap = 28
  const originX = 160
  const originY = 160
  const rowH = 310
  const rowGap = 40

  const rowPatterns: Array<Array<'large' | 'medium' | 'small'>> = [
    ['large', 'medium', 'small', 'medium'],
    ['medium', 'large', 'medium', 'small'],
    ['small', 'medium', 'large', 'medium'],
    ['medium', 'small', 'medium', 'large'],
  ]

  const ids = Object.keys(scatteredLayout)
  const layout: Record<string, LayoutPlacement> = {}
  let index = 0

  for (let row = 0; row < rowPatterns.length; row += 1) {
    let x = originX
    const y = originY + row * (rowH + rowGap)
    for (const sizeKey of rowPatterns[row]) {
      const id = ids[index]
      if (!id) break
      const size = thumbnailSizes[sizeKey]
      // Vertically center smaller tiles within the row band
      const yOffset = Math.round((rowH - size.height) / 2)
      layout[id] = { x, y: y + yOffset, ...size }
      x += size.width + gap
      index += 1
    }
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
