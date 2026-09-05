import { useEffect, useRef, useState } from 'react'
import './PlaygroundHeader.css'

type PlaygroundHeaderProps = {
  hint: string
  activeTitle: string | null
  reducedMotion: boolean
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

export function PlaygroundHeader({
  hint,
  activeTitle,
  reducedMotion,
}: PlaygroundHeaderProps) {
  const displayText = activeTitle ?? hint
  const [renderedText, setRenderedText] = useState(displayText)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const previousRef = useRef(displayText)
  const previousHintRef = useRef(hint)
  const showingHint = activeTitle === null && renderedText === hint

  useEffect(() => {
    // Base hint changed (desktop ↔ mobile) — sync immediately
    if (hint !== previousHintRef.current) {
      previousHintRef.current = hint
      if (activeTitle === null) {
        setRenderedText(hint)
        previousRef.current = hint
        setPhase('in')
        return
      }
    }

    if (displayText === previousRef.current) return

    if (reducedMotion) {
      setRenderedText(displayText)
      previousRef.current = displayText
      setPhase('in')
      return
    }

    setPhase('out')
    const timeout = window.setTimeout(() => {
      setRenderedText(displayText)
      previousRef.current = displayText
      setPhase('in')
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [activeTitle, displayText, hint, reducedMotion])

  return (
    <header className="playground-header">
      <h1 className="playground-header__title">Design Playground</h1>
      <div
        className={[
          'playground-header__meta',
          showingHint ? 'is-hint' : 'is-project',
          `is-${phase}`,
          reducedMotion ? 'is-reduced-motion' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-live="polite"
      >
        <span className="playground-header__icon" aria-hidden="true">
          {showingHint ? <PointerIcon /> : <LinkViewIcon />}
        </span>
        <span className="playground-header__text">{renderedText}</span>
      </div>
    </header>
  )
}
