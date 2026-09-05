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
  /** When false, hidden below 800px (case studies that aren’t mobile-friendly). */
  showOnMobile: boolean
}

/** Thumbnail size presets — edit positions freely without touching interaction logic. */
export const thumbnailSizes = {
  small: { width: 220, height: 150 },
  medium: { width: 340, height: 230 },
  large: { width: 460, height: 310 },
  tall: { width: 260, height: 360 },
  square: { width: 280, height: 280 },
} as const

/** Project content only — positions come from layout maps in layouts.ts */
export const playgroundProjects: PlaygroundProject[] = [
  {
    id: 'project-01',
    title: 'Saturday Design System',
    description: 'MCP design system exploring AI-assisted workflows.',
    skill: 'Design systems',
    tool: 'Figma',
    image: '/projects/saturday-design-system.png',
    href: 'https://blakeschubert.com/saturday-design-system',
    x: 180,
    y: 200,
    ...thumbnailSizes.large,
    alt: 'Saturday Design System documentation overview',
    showOnMobile: false,
  },
  {
    id: 'project-02',
    title: 'Blossom',
    description: 'Landing page and product concept for a healthcare SaaS.',
    skill: 'Web',
    tool: 'Figma',
    image: '/projects/blossom.png',
    href: 'https://blakeschubert.com/blossom',
    x: 720,
    y: 120,
    ...thumbnailSizes.medium,
    alt: 'Blossom healthcare platform hero',
    showOnMobile: false,
  },
  {
    id: 'project-03',
    title: 'Glyph',
    description: 'Design toolkit for building and testing interface styles.',
    skill: 'Product UI',
    tool: 'Figma',
    image: '/projects/glyph.png',
    href: 'https://blakeschubert.com/glpyh',
    x: 1140,
    y: 240,
    ...thumbnailSizes.large,
    alt: 'Glyph design toolkit workspace',
    showOnMobile: false,
  },
  {
    id: 'project-04',
    title: 'Digital Bookshelf',
    description: 'Digital bookshelf of favorite reads.',
    skill: 'Editorial',
    tool: 'Figma',
    image: '/projects/bookshelf.png',
    href: 'https://blakeschubert.com/digital-bookshelf',
    x: 1480,
    y: 150,
    ...thumbnailSizes.medium,
    alt: 'Digital bookshelf design reference shelf',
    showOnMobile: false,
  },
  {
    id: 'project-05',
    title: 'Buddy the Brave',
    description: 'Interactive 3D playing card exploring web interactions.',
    skill: 'Illustration',
    tool: 'Midjourney',
    image: '/projects/buddy-the-brave.png',
    href: 'https://blakeschubert.com/buddy',
    x: 1920,
    y: 280,
    ...thumbnailSizes.tall,
    alt: 'Buddy the Brave trading card',
    showOnMobile: false,
  },
  {
    id: 'project-06',
    title: 'RetroTV',
    description: 'Retro TV for classic cartoons and nostalgia.',
    skill: '3D',
    tool: 'Blender',
    image: '/projects/retrotv.png',
    href: 'https://blakeschubert.com/retrotv',
    x: 220,
    y: 580,
    ...thumbnailSizes.medium,
    alt: 'RetroTV with Pokémon on screen',
    showOnMobile: true,
  },
  {
    id: 'project-07',
    title: 'Inspo',
    description: 'Personal archive for standout UI inspiration.',
    skill: 'Research',
    tool: 'Figma',
    image: '/projects/design-references.png',
    href: 'https://blakeschubert.com/inspo',
    x: 560,
    y: 560,
    ...thumbnailSizes.large,
    alt: 'Inspo gallery with mobile app mockups',
    showOnMobile: true,
  },
  {
    id: 'project-08',
    title: 'Invoice Studio',
    description: 'Create, send, and track client invoices.',
    skill: 'Product UI',
    tool: 'Cursor',
    image: '/projects/invoice-studio.png',
    href: 'https://blakeschubert.com/invoicegenerator',
    x: 1120,
    y: 520,
    ...thumbnailSizes.large,
    alt: 'Invoice Studio new invoice and live preview',
    showOnMobile: false,
  },
  {
    id: 'project-09',
    title: 'Robot Animation',
    description: 'AI avatar set exploring character design and motion.',
    skill: 'Motion',
    tool: 'After Effects',
    image: '/projects/robot-animation.png',
    href: 'https://blakeschubert.com/robot-animation',
    x: 1680,
    y: 620,
    ...thumbnailSizes.square,
    alt: 'Blue robot character with glowing smile',
    showOnMobile: true,
  },
]
