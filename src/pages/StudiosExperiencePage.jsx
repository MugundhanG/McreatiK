/* ============================================
   StudiosExperiencePage — McreatiK Studios
   Standalone page covering the shoot process and
   client testimonials, reachable via its own URL
   and nav link.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'
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

  return (
    <StudiosPageShell>
      <div className="pt-28">
        <StudiosExperience />
      </div>
    </StudiosPageShell>
  )
}

export default StudiosExperiencePage
