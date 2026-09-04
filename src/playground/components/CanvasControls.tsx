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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 4.25h10M3 8h10M3 11.75h10"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="canvas-controls__button"
          onClick={() => onSelectView('scattered')}
          aria-pressed={viewMode === 'scattered'}
          aria-label="Scattered drag grid"
          title="Scattered"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1.5" y="2.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="2.5" y="9" width="4.5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9.5" y="9.5" width="5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>

        <button
          type="button"
          className="canvas-controls__button"
          onClick={() => onSelectView('bento')}
          aria-pressed={viewMode === 'bento'}
          aria-label="Bento layout"
          title="Bento"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1.75" y="1.75" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9.25" y="1.75" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1.75" y="9.25" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9.25" y="9.25" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 8h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
