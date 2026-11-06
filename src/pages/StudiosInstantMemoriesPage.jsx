/* ============================================
   StudiosInstantMemoriesPage — McreatiK Studios
   Product page for Instant Memories, the live
   wedding photo gallery (live.mcreatik.com):
   what it does for studios, couples and guests,
   privacy, FAQ and a demo call to action.
   ============================================ */

import React, { lazy, Suspense, useEffect } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'
import {
  InstantMemoriesHero, InstantMemoriesHowItWorks, InstantMemoriesForStudios,
  InstantMemoriesForCouples, InstantMemoriesForGuests, InstantMemoriesPrivacy, InstantMemoriesPricing, InstantMemoriesCTA,
} from '../components/studios/instant-memories/Sections'

const InstantMemoriesFAQ = lazy(() => import('../components/studios/instant-memories/FAQ'))

function StudiosInstantMemoriesPage() {
  useSEO(seoFor('/studios/instant-memories'))

  useEffect(() => {
    setFavicon('/favicon-studios.png')
  }, [])

  useScrollToHash()

  return (
    <StudiosPageShell>
      <InstantMemoriesHero />
      <InstantMemoriesHowItWorks />
      <InstantMemoriesForStudios />
      <InstantMemoriesForCouples />
      <InstantMemoriesForGuests />
      <InstantMemoriesPrivacy />
      <InstantMemoriesPricing />
      <Suspense fallback={null}>
        <InstantMemoriesFAQ />
      </Suspense>
      <InstantMemoriesCTA />
    </StudiosPageShell>
  )
}

export default StudiosInstantMemoriesPage
