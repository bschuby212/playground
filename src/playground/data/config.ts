export const playgroundConfig = {
  tagline: 'Design experiments using AI, code, and emerging tools',
  /** Live site opened by the desktop fullscreen button (Framer → new tab). */
  siteUrl: 'https://design-playground-framer.netlify.app',
  defaultHint: 'Hover Thumbnails',
  mobileHint: 'Tap Thumbnails',
  mobileDetailHint: 'Double tap to open',
  openLinksInNewTab: false,
  enableProximityScaling: true,
  enableMomentum: false,
  enableHoverReveal: false,
  enableCursorParallax: true,
  parallaxEase: 0.14,
  /** Peak move-to-pan gain near edges. Center uses parallaxCenterGain. */
  parallaxGain: 0.42,
  /** Soft gain while the pointer is in the middle of the viewport. */
  parallaxCenterGain: 0.16,
  /** Radius (fraction of half-viewport) that stays in the gentle center band. */
  parallaxCenterSoftZone: 0.55,
  /** Extra multiplier on horizontal move-to-pan (~18% faster left/right). */
  parallaxHorizontalBoost: 1.18,
  /** Extra multiplier on vertical move-to-pan (viewport is shorter than wide). */
  parallaxVerticalBoost: 1.45,
  /**
   * How far past the outermost images you can pan (screen px floor).
   * Also grows with a small viewport fraction for larger screens.
   */
  panPastImages: 112,
  panPastImagesViewport: 0.1,
  /** Edge auto-pan band as a fraction of the shorter viewport side. */
  edgePanZoneFraction: 0.14,
  edgePanZoneMin: 64,
  edgePanZoneMax: 140,
  /** Base max auto-pan speed (px/frame at ~700px short side, 1x zoom). */
  edgePanMaxSpeed: 8,
  /** Extra multiplier for top/bottom edge auto-pan. */
  edgePanVerticalBoost: 1.55,
  /** Padding around the toolbar where cursor-follow pan is disabled (px). */
  controlsDeadZone: 56,
  defaultLayout: 'scattered' as 'scattered' | 'bento',
  canvasWidth: 2400,
  canvasHeight: 1800,
  gridSize: 32,
  centerScale: 1,
  edgeScale: 0.84,
  hoverScale: 1.05,
  dragThreshold: 5,
  /** Higher threshold on touch / compact viewports so taps don't become pans. */
  touchDragThreshold: 10,
  startingX: -380,
  startingY: -220,
  /** Phone / tablet start — top of the vertical stack. */
  mobileStartingX: -24,
  mobileStartingY: -48,
  revealPadding: 56,
  revealDurationMs: 340,
  revealMaxNudge: 140,
  minZoom: 0.6,
  maxZoom: 1.6,
  zoomStep: 0.1,
  defaultZoom: 1 as number,
  doubleTapMs: 400,
  momentumFriction: 0.92,
  momentumMinVelocity: 0.15,
} as const

export type PlaygroundConfig = typeof playgroundConfig
export type LayoutMode = PlaygroundConfig['defaultLayout']
