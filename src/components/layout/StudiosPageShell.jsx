/* ============================================
   StudiosPageShell
   Shared Navbar/Footer/loading-state wrapper for
   every McreatiK Studios route (the main page and
   the standalone Gallery/Experience/Blog pages)
   so they all share one chrome and one loading
   spinner in the department's own accent color.
   ============================================ */

import React, { Suspense } from 'react'
import StudiosNavbar from '../studios/Navbar'
import StudiosFooter from '../studios/Footer'
import ScrollToTop from '../ui/ScrollToTop'

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function StudiosPageShell({ children }) {
  return (
    <div className="theme-studios min-h-screen overflow-x-hidden w-full">
      <StudiosNavbar />
      <main>
        <Suspense fallback={<SectionLoader />}>
          {children}
        </Suspense>
      </main>
      <StudiosFooter />
      <ScrollToTop accentClass="bg-[#C9971F] text-white shadow-[#C9971F]/30 hover:bg-[#b3860f]" />
    </div>
  )
}
