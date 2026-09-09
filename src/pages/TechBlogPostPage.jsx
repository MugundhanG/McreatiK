/* ============================================
   TechBlogPostPage — McreatiK Tech
   Standalone page for a single blog post,
   reached from the Blog list via its slug.
   ============================================ */

import React, { lazy, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TechPageShell from '../components/layout/TechPageShell'
import { setFavicon } from '../utils/setFavicon'

const BlogPost = lazy(() => import('../components/tech/BlogPost'))

function TechBlogPostPage() {
  const { slug } = useParams()

  useEffect(() => {
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <TechPageShell>
      <div className="pt-24">
        {/* Keying by slug forces a full remount (fresh loading state) when
            navigating from one post to another, instead of manually
            resetting state inside BlogPost's effect. */}
        <BlogPost key={slug} />
      </div>
    </TechPageShell>
  )
}

export default TechBlogPostPage
