/* ============================================
   TechPage — McreatiK Tech & Creative Solutions
   The main scroll: everything except Services,
   Industries, Work, and FAQ, which are now their
   own standalone pages (see TechServicesPage,
   TechIndustriesPage, TechWorkPage, TechFAQPage).
   ============================================ */

import React, { lazy, useEffect } from 'react'
import Hero from '../components/sections/Hero'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'

const WhyChooseUs = lazy(() => import('../components/sections/WhyChooseUs'))
const BeforeAfter = lazy(() => import('../components/tech/BeforeAfter'))
const WhatYouGet = lazy(() => import('../components/sections/WhatYouGet'))
const TechDemosTeaser = lazy(() => import('../components/sections/TechDemosTeaser'))
const StudiosCrossSell = lazy(() => import('../components/sections/StudiosCrossSell'))
const Packages = lazy(() => import('../components/sections/Packages'))
const Process = lazy(() => import('../components/sections/Process'))
const About = lazy(() => import('../components/sections/About'))
// Testimonials hidden until real client feedback comes in — see below, not removed.
// const Testimonials = lazy(() => import('../components/sections/Testimonials'))
const FinalCTA = lazy(() => import('../components/sections/FinalCTA'))
const Contact = lazy(() => import('../components/sections/Contact'))

function TechPage() {
  useSEO(seoFor('/tech'))

  useEffect(() => {
    setFavicon('/favicon-tech.png')
  }, [])

  useScrollToHash()

  return (
    <TechPageShell>
      <Hero />
      <WhyChooseUs />
      <BeforeAfter />
      <TechDemosTeaser />
      <WhatYouGet />
      <Packages />
      <Process />
      <About />
      <StudiosCrossSell />
      {/* <Testimonials /> — hidden until real client feedback replaces the placeholders */}
      <FinalCTA />
      <Contact />
    </TechPageShell>
  )
}

export default TechPage
