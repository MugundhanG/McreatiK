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

const Services = lazy(() => import('../components/sections/Services'))
const Portfolio = lazy(() => import('../components/sections/Portfolio'))
const About = lazy(() => import('../components/sections/About'))
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
          <Services />
          <Portfolio />
          <About />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop accentClass="bg-[#5B5FEF] text-white shadow-[#5B5FEF]/30 hover:bg-[#6d70f2]" />
    </div>
  )
}

export default TechPage
