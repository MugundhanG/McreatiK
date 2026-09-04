/* ============================================
   Landing — McreatiK Homepage
   Introduces McreatiK as the umbrella brand for
   Tech (live), Studios (live), and Store (future).
   Runs its own "theme-home" visual identity — navy
   + gold, sourced from the real McreatiK logo —
   distinct from both Tech's and Studios' palettes.
   ============================================ */

import React, { lazy, Suspense, useEffect } from 'react'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import Footer from '../components/home/Footer'
import ScrollToTop from '../components/ui/ScrollToTop'
import { setFavicon } from '../utils/setFavicon'

const WhatIsMcreatik = lazy(() => import('../components/home/WhatIsMcreatik'))
const ExploreMcreatik = lazy(() => import('../components/home/ExploreMcreatik'))
const WhoWeHelp = lazy(() => import('../components/home/WhoWeHelp'))
const WhatWeCreate = lazy(() => import('../components/home/WhatWeCreate'))
const WhyMcreatik = lazy(() => import('../components/home/WhyMcreatik'))
const HowItWorks = lazy(() => import('../components/home/HowItWorks'))
const FinalCTA = lazy(() => import('../components/home/FinalCTA'))
const Contact = lazy(() => import('../components/home/Contact'))

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-[#D8AE55] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

const Landing = function Landing() {
  useEffect(() => {
    document.title = 'McreatiK | Digital & Creative Solutions — Tech, Studios & More'
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <div className="theme-home min-h-screen overflow-x-hidden w-full">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <WhatIsMcreatik />
          <ExploreMcreatik />
          <WhoWeHelp />
          <WhatWeCreate />
          <WhyMcreatik />
          <HowItWorks />
          <FinalCTA />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop accentClass="bg-[#D8AE55] text-[#0A1128] shadow-[#D8AE55]/30 hover:bg-[#F0CB7E]" />
    </div>
  )
}

export default Landing
