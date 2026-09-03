/* ============================================
   TechPage — McreatiK Tech & Creative Solutions
   Assembles the department's sections inside the
   .theme-tech wrapper (indigo + registration-
   orange, Archivo display, build-manifest layout).
   ============================================ */

import React, { lazy, Suspense, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/ui/ScrollToTop'
import { setFavicon } from '../utils/setFavicon'

const WhyChooseUs = lazy(() => import('../components/sections/WhyChooseUs'))
const TargetIndustries = lazy(() => import('../components/sections/TargetIndustries'))
const Services = lazy(() => import('../components/sections/Services'))
const WhatYouGet = lazy(() => import('../components/sections/WhatYouGet'))
const Portfolio = lazy(() => import('../components/sections/Portfolio'))
const Packages = lazy(() => import('../components/sections/Packages'))
const Process = lazy(() => import('../components/sections/Process'))
const About = lazy(() => import('../components/sections/About'))
const FinalCTA = lazy(() => import('../components/sections/FinalCTA'))
const Contact = lazy(() => import('../components/sections/Contact'))

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-[#5B5FEF] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function TechPage() {
  useEffect(() => {
    document.title = 'McreatiK Tech & Creative | Website & Logo Design in Chennai'
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <div className="theme-tech min-h-screen text-white overflow-x-hidden w-full">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <WhyChooseUs />
          <TargetIndustries />
          <Services />
          <WhatYouGet />
          <Portfolio />
          <Packages />
          <Process />
          <About />
          <FinalCTA />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop accentClass="bg-[#5B5FEF] text-white shadow-[#5B5FEF]/30 hover:bg-[#6d70f2]" />
    </div>
  )
}

export default TechPage
