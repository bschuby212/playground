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

/** Lucide table — list view */
function ListIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  )
}

/** Lucide square-dimensions — scattered / scroll canvas */
function ScatteredIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 7H7v5" />
      <path d="M12 17h5v-5" />
    </svg>
  )
}

/** Lucide grid-2x2 — bento grid */
function BentoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
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
          className="canvas-controls__button canvas-controls__button--tooltip"
          data-tooltip="Table view"
          onClick={() => onSelectView('list')}
          aria-pressed={viewMode === 'list'}
          aria-label="Table view"
        >
          <ListIcon />
        </button>

        <button
          type="button"
          className="canvas-controls__button canvas-controls__button--tooltip"
          data-tooltip="Canvas view"
          onClick={() => onSelectView('scattered')}
          aria-pressed={viewMode === 'scattered'}
          aria-label="Canvas view"
        >
          <ScatteredIcon />
        </button>

        <button
          type="button"
          className="canvas-controls__button canvas-controls__button--tooltip"
          data-tooltip="Grid view"
          onClick={() => onSelectView('bento')}
          aria-pressed={viewMode === 'bento'}
          aria-label="Grid view"
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
