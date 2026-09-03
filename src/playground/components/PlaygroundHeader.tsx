import { useEffect, useRef, useState } from 'react'
import './PlaygroundHeader.css'

type PlaygroundHeaderProps = {
  hint: string
  activeTitle: string | null
  reducedMotion: boolean
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

  useEffect(() => {
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
  }, [displayText, reducedMotion])

  return (
    <header className="playground-header">
      <h1 className="playground-header__title">Playground</h1>
      <div
        className={[
          'playground-header__meta',
          activeTitle ? 'is-project' : 'is-hint',
          `is-${phase}`,
          reducedMotion ? 'is-reduced-motion' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-live="polite"
      >
        {!activeTitle && (
          <span className="playground-header__icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.25" />
              <path
                d="M7 4.2v2.8M7 9.2h.01"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        <span className="playground-header__text">{renderedText}</span>
      </div>
    </header>
  )
}
