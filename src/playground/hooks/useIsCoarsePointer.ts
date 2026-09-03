import { useEffect, useState } from 'react'

function readTouchUi(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(max-width: 768px)').matches
  )
}

/** True for touch / no-hover input, or phone-sized viewports. */
export function useIsCoarsePointer(): boolean {
  const [isTouchUi, setIsTouchUi] = useState(readTouchUi)

  useEffect(() => {
    const queries = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(hover: none)'),
      window.matchMedia('(max-width: 768px)'),
    ]
    const update = () => setIsTouchUi(readTouchUi())
    update()
    for (const query of queries) {
      query.addEventListener('change', update)
    }
    return () => {
      for (const query of queries) {
        query.removeEventListener('change', update)
      }
    }
  }, [])

  return isTouchUi
}
