/* ============================================
   TechServicesPage — McreatiK Tech
   Standalone page for the Services section,
   reachable via its own URL and nav link rather
   than an anchor scroll on the main Tech page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'

const Services = lazy(() => import('../components/sections/Services'))

function TechServicesPage() {
  useEffect(() => {
    document.title = 'Services | McreatiK Tech & Creative'
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <TechPageShell>
      <div className="pt-24">
        <Services />
      </div>
    </TechPageShell>
  )
}

export default TechServicesPage
