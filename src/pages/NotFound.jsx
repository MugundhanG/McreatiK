/* ============================================
   NotFound — catch-all route (noindex)
   ============================================ */

import React, { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

const NotFound = memo(function NotFound() {
  const { pathname } = useLocation()
  // The server can't send a real 404 status for a single-page app, so tell
  // search engines directly not to index this "soft 404".
  useSEO({
    title: 'Page not found | McreatiK',
    description: "The page you're looking for isn't here.",
    path: pathname,
    noindex: true,
  })

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">404</p>
      <h1 className="text-3xl sm:text-4xl font-semibold">This page doesn't exist</h1>
      <p className="text-gray-400 max-w-md">
        The page you're looking for isn't here. Head back and pick a department.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
      >
        Back to McreatiK
      </Link>
    </div>
  )
})

export default NotFound
