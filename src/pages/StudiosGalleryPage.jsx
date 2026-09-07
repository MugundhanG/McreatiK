/* ============================================
   StudiosGalleryPage — McreatiK Studios
   Standalone page for the Gallery section,
   reachable via its own URL and nav link rather
   than an anchor scroll on the main Studios page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'

const StudiosGallery = lazy(() => import('../components/studios/Gallery'))

function StudiosGalleryPage() {
  useEffect(() => {
    document.title = 'Gallery | McreatiK Studios'
    setFavicon('/favicon-studios.png')
  }, [])

  return (
    <StudiosPageShell>
      <div className="pt-28">
        <StudiosGallery />
      </div>
    </StudiosPageShell>
  )
}

export default StudiosGalleryPage
