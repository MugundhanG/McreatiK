/* ============================================
   useScrollToHash
   Scrolls to the element matching the current
   URL hash on route entry. Needed because Tech/
   Studios sections are lazy-loaded (Suspense) —
   the target element may not exist in the DOM
   yet on the first render after navigation, so
   this retries briefly instead of relying on the
   browser's native (load-time-only) hash scroll.

   Also corrects for the fixed navbar: plain
   scrollIntoView aligns the section's top edge
   with the viewport's top edge, which lands it
   right under (hidden behind) the fixed header.
   We measure the actual rendered header height
   and scroll to that offset instead.
   ============================================ */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const MAX_ATTEMPTS = 40
const RETRY_MS = 200
const EXTRA_GAP = 16

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
        const header = document.querySelector('header')
        const offset = (header?.getBoundingClientRect().height || 0) + EXTRA_GAP
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
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
