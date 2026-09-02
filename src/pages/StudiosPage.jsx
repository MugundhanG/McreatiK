/* ============================================
   StudiosPage — McreatiK Studios
   Assembles the department's sections inside the
   .theme-studios wrapper (light paper palette,
   Fraunces display, film-frame gallery motif).
   ============================================ */

import React, { lazy, Suspense, useEffect } from 'react'
import StudiosNavbar from '../components/studios/Navbar'
import StudiosHero from '../components/studios/Hero'
import StudiosFooter from '../components/studios/Footer'
import ScrollToTop from '../components/ui/ScrollToTop'
import { setFavicon } from '../utils/setFavicon'

const StudiosOfferings = lazy(() => import('../components/studios/Offerings'))
const StudiosGallery = lazy(() => import('../components/studios/Gallery'))
const StudiosAbout = lazy(() => import('../components/studios/About'))
const StudiosContact = lazy(() => import('../components/studios/Contact'))

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function StudiosPage() {
  useEffect(() => {
    document.title = 'McreatiK Studios | Photography — Portraits, Weddings & Events'
    setFavicon('/favicon-studios.png')
  }, [])

  return (
    <div className="theme-studios min-h-screen overflow-x-hidden w-full">
      <StudiosNavbar />
      <main>
        <StudiosHero />
        <Suspense fallback={<SectionLoader />}>
          <StudiosOfferings />
          <StudiosGallery />
          <StudiosAbout />
          <StudiosContact />
        </Suspense>
      </main>
      <StudiosFooter />
      <ScrollToTop accentClass="bg-[#C9971F] text-white shadow-[#C9971F]/30 hover:bg-[#b3860f]" />
    </div>
  )
}

export default StudiosPage
