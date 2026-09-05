/* ============================================
   TechFAQPage — McreatiK Tech
   Standalone page for the FAQ section, reachable
   via its own URL and nav link rather than an
   anchor scroll on the main Tech page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'

const FAQ = lazy(() => import('../components/sections/FAQ'))

function TechFAQPage() {
  useEffect(() => {
    document.title = 'FAQs | McreatiK Tech & Creative'
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <TechPageShell>
      <div className="pt-24">
        <FAQ />
      </div>
    </TechPageShell>
  )
}

export default TechFAQPage
