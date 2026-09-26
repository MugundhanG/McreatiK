/* ============================================
   useGalleryPosts — loads published gallery
   posts from the CMS, normalised with toPost().
   Shared by the full Gallery page and the
   Studios home preview. In local dev, sample
   posts are appended (see gallerySamples.js).
   ============================================ */

import { useEffect, useState } from 'react'
import { fetchGalleryItems } from '../../utils/cmsApi'
import { toPost } from './galleryPosts'
import { GALLERY_SAMPLES } from './gallerySamples'

// Local dev only — never ships sample posts to production.
const SAMPLES = import.meta.env.DEV ? GALLERY_SAMPLES : []

export function useGalleryPosts() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false
    fetchGalleryItems()
      .then((data) => {
        if (!cancelled) {
          setPosts([...data, ...SAMPLES].map(toPost))
          setStatus('ready')
        }
      })
      .catch(() => {
        if (cancelled) return
        if (SAMPLES.length > 0) {
          setPosts(SAMPLES.map(toPost))
          setStatus('ready')
        } else {
          setStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { posts, status }
}
