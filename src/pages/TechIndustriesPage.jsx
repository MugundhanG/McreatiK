/* ============================================
   TechIndustriesPage — McreatiK Tech
   Standalone page for the Industries section,
   reachable via its own URL and nav link rather
   than an anchor scroll on the main Tech page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useSEO } from '../hooks/useSEO'

const TargetIndustries = lazy(() => import('../components/sections/TargetIndustries'))

function TechIndustriesPage() {
  useSEO({
    title: 'Industries We Serve | McreatiK Tech & Creative',
    description: 'Web design, branding, and SEO for small businesses across industries — see who McreatiK Tech works with, wherever you are.',
    path: '/tech/industries',
  })

  useEffect(() => {
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <TechPageShell>
      <div className="pt-24">
        <TargetIndustries />
      </div>
    </TechPageShell>
  )
}

export default TechIndustriesPage
