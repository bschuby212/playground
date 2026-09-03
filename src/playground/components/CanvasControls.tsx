import type { PointerEvent as ReactPointerEvent } from 'react'
import type { LayoutMode } from '../data/config'
import './CanvasControls.css'

type CanvasControlsProps = {
  layout: LayoutMode
  zoom: number
  minZoom: number
  maxZoom: number
  listOpen: boolean
  onToggleList: () => void
  onToggleLayout: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

function stopDrag(event: ReactPointerEvent) {
  event.stopPropagation()
}

export function CanvasControls({
  layout,
  zoom,
  minZoom,
  maxZoom,
  listOpen,
  onToggleList,
  onToggleLayout,
  onZoomIn,
  onZoomOut,
}: CanvasControlsProps) {
  const zoomLabel = `${Math.round(zoom * 100)}%`
  const isBento = layout === 'bento'

  return (
    <div
      className="canvas-controls"
      onPointerDown={stopDrag}
      onPointerMove={stopDrag}
      onPointerUp={stopDrag}
      role="toolbar"
      aria-label="Canvas controls"
    >
      <button
        type="button"
        className="canvas-controls__button"
        onClick={onToggleList}
        aria-pressed={listOpen}
        aria-label={listOpen ? 'Hide project list' : 'Show project list'}
        title={listOpen ? 'Hide list' : 'Project list'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 4.25h10M3 8h10M3 11.75h10" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        className="canvas-controls__button"
        onClick={onToggleLayout}
        aria-pressed={isBento}
        aria-label={isBento ? 'Switch to scattered layout' : 'Switch to bento layout'}
        title={isBento ? 'Scattered layout' : 'Bento layout'}
      >
        {isBento ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1.75" y="1.75" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9.25" y="1.75" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1.75" y="9.25" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9.25" y="9.25" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1.5" y="2.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="2.5" y="9" width="4.5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9.5" y="9.5" width="5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        )}
      </button>

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
