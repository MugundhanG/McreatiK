/* ============================================
   TechIndustriesPage — McreatiK Tech
   Standalone page for the Industries section,
   reachable via its own URL and nav link rather
   than an anchor scroll on the main Tech page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'

const TargetIndustries = lazy(() => import('../components/sections/TargetIndustries'))

function TechIndustriesPage() {
  useEffect(() => {
    document.title = 'Industries We Serve | McreatiK Tech & Creative'
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
