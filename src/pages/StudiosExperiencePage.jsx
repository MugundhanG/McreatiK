/* ============================================
   StudiosExperiencePage — McreatiK Studios
   Standalone page covering the shoot process and
   client testimonials, reachable via its own URL
   and nav link.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'

const StudiosExperience = lazy(() => import('../components/studios/Experience'))

function StudiosExperiencePage() {
  useSEO({
    title: 'Experience | McreatiK Studios',
    description: 'What to expect working with McreatiK Studios, from enquiry to delivery.',
    path: '/studios/experience',
  })

  useEffect(() => {
    setFavicon('/favicon-studios.png')
  }, [])

  // #testimonials (the nav's Testimonials link) is the first hash target on
  // this page - Process itself has never needed one, since the nav's own
  // Process link just goes to the page's top.
  useScrollToHash()

  return (
    <StudiosPageShell>
      <div className="pt-28">
        <StudiosExperience />
      </div>
    </StudiosPageShell>
  )
}

export default StudiosExperiencePage
