/* ============================================
   StudiosExperiencePage — McreatiK Studios
   Standalone page covering the shoot process and
   client testimonials, reachable via its own URL
   and nav link.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'

const StudiosExperience = lazy(() => import('../components/studios/Experience'))

function StudiosExperiencePage() {
  useEffect(() => {
    document.title = 'Experience | McreatiK Studios'
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
