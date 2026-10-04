/* ============================================
   TechFAQPage — McreatiK Tech
   Standalone page for the FAQ section, reachable
   via its own URL and nav link rather than an
   anchor scroll on the main Tech page.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'

const FAQ = lazy(() => import('../components/sections/FAQ'))

function TechFAQPage() {
  useSEO(seoFor('/tech/faq'))

  useEffect(() => {
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
