import { useEffect, useState } from 'react'

function readMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 799px)').matches
}

/** True below 800px — mobile embed: subset of projects, tap for description. */
export function useMobileViewport(): boolean {
  const [mobile, setMobile] = useState(readMobileViewport)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 799px)')
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return mobile
}
