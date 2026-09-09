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

const FAQ = lazy(() => import('../components/sections/FAQ'))

function TechFAQPage() {
  useSEO({
    title: 'FAQs | McreatiK Tech & Creative',
    description: "Answers to common questions about McreatiK Tech's website design, branding, and SEO packages.",
    path: '/tech/faq',
  })

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
