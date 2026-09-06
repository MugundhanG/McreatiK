/* ============================================
   useScrollRestoration
   React Router doesn't reset scroll position on
   navigation — a client-side route change keeps
   whatever scrollY the previous page had. Landing
   on a shorter page deep in that scroll (e.g. the
   Home page's Contact section) shows its footer
   instead of the top. Reset to top on every path
   change; skip when a hash is present so
   useScrollToHash can position it instead.
   ============================================ */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollRestoration() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
}
