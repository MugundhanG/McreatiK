/* ============================================
   InstantMemoriesPage — /instant-memories
   Home of Instant Memories by McreatiK, the
   live event gallery SaaS for photography
   studios: hero contact sheet, the old way vs
   Instant Memories, how it works, features by
   audience, pricing, privacy, FAQ and a demo
   call to action.
   ============================================ */

import React, { useEffect } from 'react'
import ImShell from '../components/instant-memories/ImShell'
import {
  ImAudiences, ImCta, ImFaq, ImFindMyPhotos, ImHero, ImPricing, ImPrivacy, ImProblems, ImSteps,
} from '../components/instant-memories/Landing'
import { setFavicon } from '../utils/setFavicon'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'

function InstantMemoriesPage() {
  useSEO(seoFor('/instant-memories'))

  useEffect(() => {
    setFavicon('/favicon-im.svg')
  }, [])

  useScrollToHash()

  return (
    <ImShell>
      <ImHero />
      <ImProblems />
      <ImSteps />
      <ImFindMyPhotos />
      <ImAudiences />
      <ImPricing />
      <ImPrivacy />
      <ImFaq />
      <ImCta />
    </ImShell>
  )
}

export default InstantMemoriesPage
