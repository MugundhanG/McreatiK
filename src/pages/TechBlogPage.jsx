/* ============================================
   TechBlogPage — McreatiK Tech
   Standalone page for the Blog section,
   reachable via its own URL and nav link.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'
import { useSEO } from '../hooks/useSEO'

const TechBlog = lazy(() => import('../components/tech/Blog'))

function TechBlogPage() {
  useSEO({
    title: 'Blog | McreatiK Tech & Creative',
    description: 'Web design tips, SEO basics, and client case studies from McreatiK Tech.',
    path: '/tech/blog',
  })

  useEffect(() => {
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <TechPageShell>
      <div className="pt-24">
        <TechBlog />
      </div>
    </TechPageShell>
  )
}

export default TechBlogPage
