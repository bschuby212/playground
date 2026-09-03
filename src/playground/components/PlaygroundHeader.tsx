import { useEffect, useRef, useState } from 'react'
import './PlaygroundHeader.css'

type PlaygroundHeaderProps = {
  hint: string
  activeTitle: string | null
  reducedMotion: boolean
  touchMode?: boolean
}

export function PlaygroundHeader({
  hint,
  activeTitle,
  reducedMotion,
  touchMode = false,
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
      <h1 className="playground-header__title">Playground</h1>
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
        {showingHint && (
          <span className="playground-header__icon" aria-hidden="true">
            {touchMode ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M6.2 1.8c0-.55.45-1 1-1s1 .45 1 1v5.35l1.05-.85a1.05 1.05 0 0 1 1.5.15l.08.1a1 1 0 0 1-.12 1.35L8.2 11.1A3.2 3.2 0 0 1 6 12.1H4.4A2.4 2.4 0 0 1 2 9.7V7.35c0-.66.54-1.2 1.2-1.2.28 0 .54.1.74.26V1.8Z"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M4.2 1.4 5.1 10.6l2.05-1.55 1.55 3.15c.18.36.62.51.98.33l.72-.36a.72.72 0 0 0 .33-.98L9.2 8.05l2.55-.35L4.2 1.4Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        )}
        <span className="playground-header__text">{renderedText}</span>
      </div>
    </header>
  )
}
