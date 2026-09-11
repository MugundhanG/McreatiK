/* ============================================
   StorePageShell
   Shared Navbar/Footer/loading-state wrapper for
   every McreatiK Store route, mirroring
   TechPageShell/StudiosPageShell so all three
   departments share one chrome pattern and each
   gets its own loading spinner in its own accent.
   ============================================ */

import React, { Suspense } from 'react'
import StoreNavbar from '../store/Navbar'
import StoreFooter from '../store/Footer'
import ScrollToTop from '../ui/ScrollToTop'

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-[#8B7FE8] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function StorePageShell({ children }) {
  return (
    <div className="theme-store min-h-screen overflow-x-hidden w-full">
      <StoreNavbar />
      <main>
        <Suspense fallback={<SectionLoader />}>
          {children}
        </Suspense>
      </main>
      <StoreFooter />
      <ScrollToTop accentClass="bg-[#8B7FE8] text-white shadow-[#8B7FE8]/30 hover:bg-[#7A6DE0]" />
    </div>
  )
}
