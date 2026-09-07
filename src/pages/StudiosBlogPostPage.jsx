/* ============================================
   StudiosBlogPostPage — McreatiK Studios
   Standalone page for a single blog post,
   reached from the Blog list via its slug.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { setFavicon } from '../utils/setFavicon'

const BlogPost = lazy(() => import('../components/studios/BlogPost'))

function StudiosBlogPostPage() {
  const { slug } = useParams()

  useEffect(() => {
    setFavicon('/favicon-studios.png')
  }, [])

  return (
    <StudiosPageShell>
      <div className="pt-28">
        {/* Keying by slug forces a full remount (fresh loading state) when
            navigating from one post to another, instead of manually
            resetting state inside BlogPost's effect. */}
        <BlogPost key={slug} />
      </div>
    </StudiosPageShell>
  )
}

export default StudiosBlogPostPage
