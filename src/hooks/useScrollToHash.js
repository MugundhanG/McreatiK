/* ============================================
   useScrollToHash
   Scrolls to the element matching the current
   URL hash on route entry. Needed because Tech/
   Studios sections are lazy-loaded (Suspense) —
   the target element may not exist in the DOM
   yet on the first render after navigation, so
   this retries briefly instead of relying on the
   browser's native (load-time-only) hash scroll.
   ============================================ */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const MAX_ATTEMPTS = 40
const RETRY_MS = 200

export function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    let attempts = 0
    let timeoutId

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      attempts += 1
      if (attempts < MAX_ATTEMPTS) {
        timeoutId = setTimeout(tryScroll, RETRY_MS)
      }
    }

    tryScroll()
    return () => clearTimeout(timeoutId)
  }, [hash])
}
