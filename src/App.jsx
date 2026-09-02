/* ============================================
   App Component — Route Table
   McreatiK is two departments under one domain:
     /         Landing — pick a department
     /tech     McreatiK Tech & Creative Solutions
     /studios  McreatiK Studios (photography)
   Each department page is lazy-loaded so a visitor
   only ever downloads the one they chose.
   ============================================ */

import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Landing = lazy(() => import('./pages/Landing'))
const TechPage = lazy(() => import('./pages/TechPage'))
const StudiosPage = lazy(() => import('./pages/StudiosPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

/* Full-screen loading placeholder shown while a page chunk loads */
function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0b10]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tech" element={<TechPage />} />
        <Route path="/studios" element={<StudiosPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
