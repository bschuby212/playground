import { playgroundConfig } from '../data/config'
import './FullscreenOpenButton.css'

function ExpandIcon() {
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
      <path d="M15 3h6v6" />
      <path d="m21 3-7 7" />
      <path d="M9 21H3v-6" />
      <path d="m3 21 7-7" />
    </svg>
  )
}

/** Desktop-only (≥1000px): pinned control that opens the live site fullscreen. */
export function FullscreenOpenButton() {
  return (
    <a
      className="fullscreen-open"
      href={playgroundConfig.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open fullscreen"
      title="Open fullscreen"
    >
      <ExpandIcon />
      <span className="fullscreen-open__label">Fullscreen</span>
    </a>
  )
}
