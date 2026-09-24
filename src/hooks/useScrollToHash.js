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

   Settle checks: the first scroll's target position
   is calculated the moment the element is found, but
   lazy-loaded content further up the page (images,
   other Suspense sections) can still be settling into
   its final layout after that - shifting the target
   down and leaving the page short of (or, for a target
   far down a long page, well past) where it should be.
   A few delayed re-checks correct the landing spot once
   that content has actually settled, instead of trusting
   one calculation frozen at the moment the target first
   appeared.
   ============================================ */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const MAX_ATTEMPTS = 40
const RETRY_MS = 200
const EXTRA_GAP = 16
const SETTLE_CHECK_DELAYS_MS = [300, 700, 1200]
const SETTLE_TOLERANCE_PX = 4

export function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    let attempts = 0
    let retryTimeoutId
    const settleTimeoutIds = []

    const targetTop = () => {
      const el = document.getElementById(id)
      if (!el) return null
      const header = document.querySelector('header')
      const offset = (header?.getBoundingClientRect().height || 0) + EXTRA_GAP
      return el.getBoundingClientRect().top + window.scrollY - offset
    }

    const scheduleSettleChecks = () => {
      SETTLE_CHECK_DELAYS_MS.forEach((delay) => {
        settleTimeoutIds.push(
          setTimeout(() => {
            const top = targetTop()
            if (top !== null && Math.abs(top - window.scrollY) > SETTLE_TOLERANCE_PX) {
              window.scrollTo({ top, behavior: 'instant' })
            }
          }, delay)
        )
      })
    }

    const tryScroll = () => {
      const top = targetTop()
      if (top !== null) {
        window.scrollTo({ top, behavior: 'smooth' })
        scheduleSettleChecks()
        return
      }
      attempts += 1
      if (attempts < MAX_ATTEMPTS) {
        retryTimeoutId = setTimeout(tryScroll, RETRY_MS)
      }
    }

    tryScroll()
    return () => {
      clearTimeout(retryTimeoutId)
      settleTimeoutIds.forEach(clearTimeout)
    }
  }, [hash])
}
