/* ============================================
   StudiosPage — McreatiK Studios
   The main scroll: Home, About, Offerings,
   Pricing, and Book. Gallery, Experience, and
   Blog are now their own standalone pages (see
   StudiosGalleryPage, StudiosExperiencePage,
   StudiosBlogPage).
   ============================================ */

import React, { lazy, useEffect } from 'react'
import StudiosHero from '../components/studios/Hero'
import StudiosBookingModal from '../components/studios/BookingModal'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'

const StudiosOfferings = lazy(() => import('../components/studios/Offerings'))
const StudiosPricing = lazy(() => import('../components/studios/Pricing'))
const StudiosAbout = lazy(() => import('../components/studios/About'))
const StudiosContact = lazy(() => import('../components/studios/Contact'))

function StudiosPage() {
  useSEO({
    title: 'McreatiK Studios | Wedding, Portrait & Event Photography in Chennai',
    description:
      'Professional wedding, portrait & event photography in Chennai, Tamil Nadu — including for NRI couples planning a wedding back home.',
    path: '/studios',
  })

  useEffect(() => {
    setFavicon('/favicon-studios.png')
  }, [])

  useScrollToHash()

  return (
    <StudiosPageShell>
      <StudiosHero />
      <StudiosOfferings />
      <StudiosPricing />
      <StudiosAbout />
      <StudiosContact />
      <StudiosBookingModal />
    </StudiosPageShell>
  )
}

export default StudiosPage
