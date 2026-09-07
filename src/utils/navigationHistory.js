/* ============================================
   navigationHistory
   Tracks the pathname of the page the user is
   navigating away from. `syncPathname` must be
   called synchronously during App's render (not
   from an effect) so the value is already correct
   by the time the newly-routed page's own
   components render in that same pass — an effect
   would only update it after that render, always
   one transition behind.

   Module-level (not sessionStorage) on purpose: it
   resets to null on a genuine page load/refresh —
   since the module re-evaluates from scratch — but
   persists across client-side route changes within
   the same load, which is exactly the "came from
   elsewhere in the app vs. arrived fresh"
   distinction some UI (like Studios' booking popup)
   needs to make.
   ============================================ */

let currentPathname = null
let previousPathname = null

export function syncPathname(pathname) {
  if (pathname !== currentPathname) {
    previousPathname = currentPathname
    currentPathname = pathname
  }
}

export function getLastPathname() {
  return previousPathname
}
