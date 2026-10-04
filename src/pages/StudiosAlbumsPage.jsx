/* ============================================
   StudiosAlbumsPage — McreatiK Studios
   Standalone page for sample album spreads,
   reachable via its own URL and nav link.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'

const StudiosAlbums = lazy(() => import('../components/studios/Albums'))

function StudiosAlbumsPage() {
  useSEO(seoFor('/studios/albums'))

  useEffect(() => {
    setFavicon('/favicon-studios.png')
  }, [])

  return (
    <StudiosPageShell>
      <div className="pt-28">
        <StudiosAlbums />
      </div>
    </StudiosPageShell>
  )
}

export default StudiosAlbumsPage
