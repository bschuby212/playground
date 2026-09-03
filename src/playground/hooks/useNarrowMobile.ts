import { useEffect, useState } from 'react'

function readNarrowMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 480px)').matches
}

/** Disable proximity scaling on very narrow touch viewports for performance. */
export function useNarrowMobile(): boolean {
  const [narrow, setNarrow] = useState(readNarrowMobile)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 480px)')
    const update = () => setNarrow(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return narrow
}
