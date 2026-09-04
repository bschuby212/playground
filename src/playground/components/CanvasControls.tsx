import type { PointerEvent as ReactPointerEvent } from 'react'
import type { LayoutMode } from '../data/config'
import './CanvasControls.css'

export type ViewMode = 'list' | LayoutMode

type CanvasControlsProps = {
  viewMode: ViewMode
  zoom: number
  minZoom: number
  maxZoom: number
  onSelectView: (mode: ViewMode) => void
  onZoomIn: () => void
  onZoomOut: () => void
}

function stopDrag(event: ReactPointerEvent) {
  event.stopPropagation()
}

/** Stacked rows with thumb + text — reads as a list, not a grid. */
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2" width="3.2" height="3.2" rx="0.7" fill="currentColor" />
      <path d="M6.4 2.7h8M6.4 4.5h5.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <rect x="1.5" y="6.4" width="3.2" height="3.2" rx="0.7" fill="currentColor" />
      <path d="M6.4 7.1h8M6.4 8.9h5.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <rect x="1.5" y="10.8" width="3.2" height="3.2" rx="0.7" fill="currentColor" />
      <path d="M6.4 11.5h8M6.4 13.3h5.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

/** Loose freeform tiles — organic scatter, not aligned. */
function ScatteredIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1.2" width="4.4" height="3" rx="0.7" fill="currentColor" opacity="0.9" />
      <rect x="8.2" y="0.8" width="6.2" height="4.4" rx="0.7" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.4" y="5.8" width="3.2" height="2.6" rx="0.7" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.4" y="6.6" width="2.8" height="2.2" rx="0.7" fill="currentColor" opacity="0.9" />
      <rect x="11.2" y="6.2" width="3.6" height="3.4" rx="0.7" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.2" y="10.4" width="5.4" height="4.4" rx="0.7" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8.6" y="11.2" width="4.8" height="3.2" rx="0.7" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

/** Tight uneven bento cells — structured mosaic. */
function BentoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.25" y="1.25" width="6.6" height="6.6" rx="1" fill="currentColor" opacity="0.92" />
      <rect x="9" y="1.25" width="5.75" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="5.1" width="5.75" height="2.75" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.25" y="9" width="3.1" height="5.75" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="5.2" y="9" width="9.55" height="5.75" rx="1" fill="currentColor" opacity="0.92" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CanvasControls({
  viewMode,
  zoom,
  minZoom,
  maxZoom,
  onSelectView,
  onZoomIn,
  onZoomOut,
}: CanvasControlsProps) {
  const zoomLabel = `${Math.round(zoom * 100)}%`

  return (
    <div
      className="canvas-controls"
      onPointerDown={stopDrag}
      onPointerMove={stopDrag}
      onPointerUp={stopDrag}
      role="toolbar"
      aria-label="Canvas controls"
    >
      <div className="canvas-controls__views" role="group" aria-label="View mode">
        <button
          type="button"
          className="canvas-controls__button"
          onClick={() => onSelectView('list')}
          aria-pressed={viewMode === 'list'}
          aria-label="List view"
          title="List"
        >
          <ListIcon />
        </button>

        <button
          type="button"
          className="canvas-controls__button"
          onClick={() => onSelectView('scattered')}
          aria-pressed={viewMode === 'scattered'}
          aria-label="Scattered drag grid"
          title="Scattered"
        >
          <ScatteredIcon />
        </button>

        <button
          type="button"
          className="canvas-controls__button"
          onClick={() => onSelectView('bento')}
          aria-pressed={viewMode === 'bento'}
          aria-label="Bento layout"
          title="Bento"
        >
          <BentoIcon />
        </button>
      </div>

      <div className="canvas-controls__divider" aria-hidden="true" />

      <button
        type="button"
        className="canvas-controls__button"
        onClick={onZoomOut}
        disabled={zoom <= minZoom + 0.001}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <MinusIcon />
      </button>

      <span className="canvas-controls__zoom" aria-live="polite">
        {zoomLabel}
      </span>

      <button
        type="button"
        className="canvas-controls__button"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom - 0.001}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <PlusIcon />
      </button>
    </div>
  )
}
