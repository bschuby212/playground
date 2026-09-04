export type PlaygroundProject = {
  id: string
  title: string
  description: string
  skill: string
  tool: string
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
  tall: { width: 260, height: 360 },
} as const

/** Project content only — positions come from layout maps in layouts.ts */
export const playgroundProjects: PlaygroundProject[] = [
  {
    id: 'project-01',
    title: 'Saturday Design System',
    description: 'Foundations and components built end-to-end in a weekend.',
    skill: 'Design systems',
    tool: 'Figma',
    image: '/projects/saturday-design-system.png',
    href: '#',
    x: 180,
    y: 200,
    ...thumbnailSizes.large,
    alt: 'Saturday Design System documentation overview',
  },
  {
    id: 'project-02',
    title: 'Blossom',
    description: 'Healthcare landing that keeps care aligned from start to finish.',
    skill: 'Web',
    tool: 'Figma',
    image: '/projects/blossom.png',
    href: '#',
    x: 720,
    y: 120,
    ...thumbnailSizes.medium,
    alt: 'Blossom healthcare platform hero',
  },
  {
    id: 'project-03',
    title: 'Glyph',
    description: 'Toolkit for generating styles, reviewing type, and finding references.',
    skill: 'Product UI',
    tool: 'Figma',
    image: '/projects/glyph.png',
    href: '#',
    x: 1140,
    y: 240,
    ...thumbnailSizes.large,
    alt: 'Glyph design toolkit workspace',
  },
  {
    id: 'project-04',
    title: 'My Bookshelf',
    description: 'A quiet shelf of design books and references to pull from.',
    skill: 'Editorial',
    tool: 'Figma',
    image: '/projects/bookshelf.png',
    href: '#',
    x: 1480,
    y: 150,
    ...thumbnailSizes.medium,
    alt: 'My bookshelf design reference shelf',
  },
  {
    id: 'project-05',
    title: 'Buddy the Brave',
    description: 'Collectible card for a legendary pet cuddler with veil of night.',
    skill: 'Illustration',
    tool: 'Midjourney',
    image: '/projects/buddy-the-brave.png',
    href: '#',
    x: 1920,
    y: 280,
    ...thumbnailSizes.tall,
    alt: 'Buddy the Brave trading card',
  },
  {
    id: 'project-06',
    title: 'RetroTV',
    description: 'Skeuomorphic CRT set tuned to a classic Pokémon broadcast.',
    skill: '3D',
    tool: 'Blender',
    image: '/projects/retrotv.png',
    href: '#',
    x: 220,
    y: 580,
    ...thumbnailSizes.medium,
    alt: 'RetroTV with Pokémon on screen',
  },
  {
    id: 'project-07',
    title: 'Design References',
    description: 'Searchable gallery of mobile apps, landings, and onboarding flows.',
    skill: 'Research',
    tool: 'Figma',
    image: '/projects/design-references.png',
    href: '#',
    x: 560,
    y: 560,
    ...thumbnailSizes.large,
    alt: 'Design references gallery with mobile app mockups',
  },
  {
    id: 'project-08',
    title: 'Invoice Studio',
    description: 'Live invoice builder with form inputs and PDF-ready preview.',
    skill: 'Product UI',
    tool: 'Cursor',
    image: '/projects/invoice-studio.png',
    href: '#',
    x: 1120,
    y: 520,
    ...thumbnailSizes.large,
    alt: 'Invoice Studio new invoice and live preview',
  },
]
