import { useEffect, useState } from 'react'

function readCompactViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 999px)').matches
}

/** True below 1000px — treat as touch-first (disable cursor-follow, clearer tap vs pan). */
export function useCompactViewport(): boolean {
  const [compact, setCompact] = useState(readCompactViewport)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 999px)')
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return compact
}
