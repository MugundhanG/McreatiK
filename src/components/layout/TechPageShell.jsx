/* ============================================
   TechPageShell
   Shared Navbar/Footer/loading-state wrapper for
   every McreatiK Tech route (the main page and
   the standalone Services/Industries/Work/FAQ
   pages) so they all share one chrome and one
   light-theme loading spinner.
   ============================================ */

import React, { Suspense } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-[#1E4FD9] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function TechPageShell({ children }) {
  return (
    <div className="theme-tech min-h-screen overflow-x-hidden w-full">
      <Navbar />
      <main>
        <Suspense fallback={<SectionLoader />}>
          {children}
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop accentClass="bg-[#1E4FD9] text-white shadow-[#1E4FD9]/30 hover:bg-[#1840b8]" />
    </div>
  )
}
