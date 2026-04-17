/* ============================================
   App Component — Root Layout
   Assembles the full page from section
   components. Uses React.lazy + Suspense
   for code-split loading of heavy sections
   below the fold.
   ============================================ */

import React, { lazy, Suspense } from 'react'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ui/ScrollToTop'

/* Lazy-load below-the-fold sections for faster initial paint */
const Services = lazy(() => import('./components/sections/Services'))
const Portfolio = lazy(() => import('./components/sections/Portfolio'))
const About = lazy(() => import('./components/sections/About'))
const Contact = lazy(() => import('./components/sections/Contact'))

/* Minimal loading placeholder shown while chunks load */
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden w-full">
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
      <ScrollToTop />
    </div>
  )
}

export default App
