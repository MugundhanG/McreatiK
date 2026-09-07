/* ============================================
   StudiosBlogPage — McreatiK Studios
   Standalone page for the Blog section,
   reachable via its own URL and nav link.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'

const StudiosBlog = lazy(() => import('../components/studios/Blog'))

function StudiosBlogPage() {
  useEffect(() => {
    document.title = 'Blog | McreatiK Studios'
    setFavicon('/favicon-studios.png')
  }, [])

  return (
    <StudiosPageShell>
      <div className="pt-28">
        <StudiosBlog />
      </div>
    </StudiosPageShell>
  )
}

export default StudiosBlogPage
