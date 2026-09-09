/* ============================================
   TechWorkPage — McreatiK Tech
   Standalone page for the Portfolio/Work section,
   reachable via its own URL and nav link rather
   than an anchor scroll on the main Tech page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useSEO } from '../hooks/useSEO'

const Portfolio = lazy(() => import('../components/sections/Portfolio'))

function TechWorkPage() {
  useSEO({
    title: 'Our Work | McreatiK Tech & Creative',
    description: 'Real websites and branding projects delivered by McreatiK Tech for small businesses.',
    path: '/tech/work',
  })

  useEffect(() => {
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
