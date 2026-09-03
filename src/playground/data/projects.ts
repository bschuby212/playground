export type PlaygroundProject = {
  id: string
  title: string
  description: string
  skill: string
  image: string
  href: string
  x: number
  y: number
  width: number
  height: number
  alt: string
}

/** Thumbnail size presets — edit positions freely without touching interaction logic. */
export const thumbnailSizes = {
  small: { width: 220, height: 150 },
  medium: { width: 340, height: 230 },
  large: { width: 460, height: 310 },
} as const

/** Project content only — positions come from layout maps in layouts.ts */
export const playgroundProjects: PlaygroundProject[] = [
  {
    id: 'project-01',
    title: 'Saturday Design System',
    description: 'Token-led UI kit for a multi-product brand.',
    skill: 'Design systems',
    image: '/placeholders/project-01.svg',
    href: '#',
    x: 180,
    y: 200,
    ...thumbnailSizes.large,
    alt: 'Placeholder preview for Saturday Design System',
  },
  {
    id: 'project-02',
    title: 'Northline Branding',
    description: 'Identity and visual language for a transit startup.',
    skill: 'Brand',
    image: '/placeholders/project-02.svg',
    href: '#',
    x: 720,
    y: 120,
    ...thumbnailSizes.medium,
    alt: 'Placeholder preview for Northline Branding',
  },
  {
    id: 'project-03',
    title: 'Signal Icons',
    description: 'Compact icon set for status and system feedback.',
    skill: 'Iconography',
    image: '/placeholders/project-03.svg',
    href: '#',
    x: 1140,
    y: 240,
    ...thumbnailSizes.small,
    alt: 'Placeholder preview for Signal Icons',
  },
  {
    id: 'project-04',
    title: 'Paper Trail',
    description: 'Editorial layout system for long-form reading.',
    skill: 'Editorial',
    image: '/placeholders/project-04.svg',
    href: '#',
    x: 1480,
    y: 150,
    ...thumbnailSizes.medium,
    alt: 'Placeholder preview for Paper Trail',
  },
  {
    id: 'project-05',
    title: 'Orbit Metrics',
    description: 'Dashboard patterns for live product analytics.',
    skill: 'Product UI',
    image: '/placeholders/project-05.svg',
    href: '#',
    x: 1920,
    y: 280,
    ...thumbnailSizes.large,
    alt: 'Placeholder preview for Orbit Metrics',
  },
  {
    id: 'project-06',
    title: 'Quiet Hours',
    description: 'Calm focus mode for a wellness companion app.',
    skill: 'Mobile',
    image: '/placeholders/project-06.svg',
    href: '#',
    x: 220,
    y: 580,
    ...thumbnailSizes.small,
    alt: 'Placeholder preview for Quiet Hours',
  },
  {
    id: 'project-07',
    title: 'Field Notes App',
    description: 'Capture flows for researchers out in the field.',
    skill: 'UX',
    image: '/placeholders/project-07.svg',
    href: '#',
    x: 560,
    y: 560,
    ...thumbnailSizes.large,
    alt: 'Placeholder preview for Field Notes App',
  },
  {
    id: 'project-08',
    title: 'Copper Studio',
    description: 'Portfolio site and booking flow for a studio.',
    skill: 'Web',
    image: '/placeholders/project-08.svg',
    href: '#',
    x: 1120,
    y: 520,
    ...thumbnailSizes.medium,
    alt: 'Placeholder preview for Copper Studio',
  },
  {
    id: 'project-09',
    title: 'Bloom Pack',
    description: 'Illustration pack and motion cues for marketing.',
    skill: 'Motion',
    image: '/placeholders/project-09.svg',
    href: '#',
    x: 1600,
    y: 500,
    ...thumbnailSizes.small,
    alt: 'Placeholder preview for Bloom Pack',
  },
  {
    id: 'project-10',
    title: 'Arc Kit',
    description: 'Component primitives for rapid product experiments.',
    skill: 'Prototyping',
    image: '/placeholders/project-10.svg',
    href: '#',
    x: 1920,
    y: 680,
    ...thumbnailSizes.medium,
    alt: 'Placeholder preview for Arc Kit',
  },
  {
    id: 'project-11',
    title: 'Harbor UI',
    description: 'Onboarding and empty states for a finance tool.',
    skill: 'Product UI',
    image: '/placeholders/project-11.svg',
    href: '#',
    x: 200,
    y: 900,
    ...thumbnailSizes.medium,
    alt: 'Placeholder preview for Harbor UI',
  },
  {
    id: 'project-12',
    title: 'Mesa Commerce',
    description: 'Checkout polish and merchandising modules.',
    skill: 'E-commerce',
    image: '/placeholders/project-12.svg',
    href: '#',
    x: 640,
    y: 980,
    ...thumbnailSizes.large,
    alt: 'Placeholder preview for Mesa Commerce',
  },
]
