/* ============================================
   TechWorkPage — McreatiK Tech
   Standalone page for the Portfolio/Work section,
   reachable via its own URL and nav link rather
   than an anchor scroll on the main Tech page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'

const Portfolio = lazy(() => import('../components/sections/Portfolio'))

function TechWorkPage() {
  useEffect(() => {
    document.title = 'Our Work | McreatiK Tech & Creative'
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <TechPageShell>
      <div className="pt-24">
        <Portfolio />
      </div>
    </TechPageShell>
  )
}

export default TechWorkPage
