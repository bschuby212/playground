import { useSyncExternalStore } from 'react'

function readStandalone() {
  if (typeof window === 'undefined') return true
  try {
    return window.self === window.top
  } catch {
    // Cross-origin embed — treat as iframe
    return false
  }
}

function subscribe() {
  // Frame context does not change at runtime
  return () => {}
}

/** True when the playground is a top-level page (not a Framer iframe embed). */
export function useIsStandalone() {
  return useSyncExternalStore(subscribe, readStandalone, () => true)
}
