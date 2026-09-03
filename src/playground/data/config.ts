export const playgroundConfig = {
  defaultHint: 'Hover thumbnail for info',
  mobileHint: 'Tap thumbnail for info',
  openLinksInNewTab: false,
  enableProximityScaling: true,
  enableMomentum: false,
  enableHoverReveal: true,
  canvasWidth: 2400,
  canvasHeight: 1800,
  gridSize: 32,
  centerScale: 1,
  edgeScale: 0.84,
  hoverScale: 1.05,
  dragThreshold: 5,
  startingX: -380,
  startingY: -220,
  revealPadding: 56,
  revealDurationMs: 340,
  revealMaxNudge: 140,
  momentumFriction: 0.92,
  momentumMinVelocity: 0.15,
} as const

export type PlaygroundConfig = typeof playgroundConfig
