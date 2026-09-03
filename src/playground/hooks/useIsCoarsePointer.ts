import { useEffect, useState } from 'react'

/** True when the primary input is coarse (touch) or viewport is phone-sized. */
export function useIsCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const narrow = window.matchMedia('(max-width: 768px)')
    const update = () => setIsCoarse(coarse.matches || narrow.matches)
    update()
    coarse.addEventListener('change', update)
    narrow.addEventListener('change', update)
    return () => {
      coarse.removeEventListener('change', update)
      narrow.removeEventListener('change', update)
    }
  }, [])

  return isCoarse
}
