import { useEffect, useRef, useState } from 'react'
import type { ToolMeta } from '../data/tools'
import './PlaygroundHeader.css'

export type ActiveProjectMeta = {
  description: string
  tools: ToolMeta[]
}

type PlaygroundHeaderProps = {
  hint: string
  activeProject: ActiveProjectMeta | null
  reducedMotion: boolean
  touchMode?: boolean
}

function PointerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
      <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  )
}

function LinkViewIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

function MousePointerClickIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 4.1 12 6" />
      <path d="m5.1 8-2.9-.8" />
      <path d="m6 12-1.9 2" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
    </svg>
  )
}

export function PlaygroundHeader({
  hint,
  activeProject,
  reducedMotion,
  touchMode = false,
}: PlaygroundHeaderProps) {
  const displayText = activeProject?.description ?? hint
  const [renderedText, setRenderedText] = useState(displayText)
  const [renderedTools, setRenderedTools] = useState<ToolMeta[]>(
    activeProject?.tools ?? [],
  )
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const previousRef = useRef(displayText)
  const previousHintRef = useRef(hint)
  const showingHint = activeProject === null && renderedText === hint

  useEffect(() => {
    if (hint !== previousHintRef.current) {
      previousHintRef.current = hint
      if (activeProject === null) {
        setRenderedText(hint)
        setRenderedTools([])
        previousRef.current = hint
        setPhase('in')
        return
      }
    }

    if (displayText === previousRef.current) {
      if (activeProject) setRenderedTools(activeProject.tools)
      return
    }

    if (reducedMotion) {
      setRenderedText(displayText)
      setRenderedTools(activeProject?.tools ?? [])
      previousRef.current = displayText
      setPhase('in')
      return
    }

    setPhase('out')
    const timeout = window.setTimeout(() => {
      setRenderedText(displayText)
      setRenderedTools(activeProject?.tools ?? [])
      previousRef.current = displayText
      setPhase('in')
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [activeProject, displayText, hint, reducedMotion])

  const activeIcon = touchMode ? <MousePointerClickIcon /> : <LinkViewIcon />

  return (
    <header className="playground-header">
      <h1 className="playground-header__title">Design Playground</h1>
      <div
        className={[
          'playground-header__meta',
          showingHint ? 'is-hint' : 'is-project',
          touchMode ? 'is-touch' : '',
          `is-${phase}`,
          reducedMotion ? 'is-reduced-motion' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-live="polite"
      >
        <span className="playground-header__copy">
          <span className="playground-header__icon" aria-hidden="true">
            {showingHint ? <PointerIcon /> : activeIcon}
          </span>
          <span className="playground-header__text">{renderedText}</span>
        </span>
        {!showingHint && !touchMode && renderedTools.length > 0 ? (
          <span className="playground-header__tools" aria-hidden="true">
            {renderedTools.map((tool) => (
              <img
                key={tool.id}
                className="playground-header__tool"
                src={tool.icon}
                alt=""
                title={tool.label}
                width={16}
                height={16}
              />
            ))}
          </span>
        ) : null}
      </div>
    </header>
  )
}
