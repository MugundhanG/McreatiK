/* ============================================
   useGalleryPosts — loads published gallery
   posts from the CMS, normalised with toPost().
   Shared by the full Gallery page and the
   Studios home preview.
   ============================================ */

import { useEffect, useState } from 'react'
import { fetchGalleryItems } from '../../utils/cmsApi'
import { toPost } from './galleryPosts'

export function useGalleryPosts() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false
    fetchGalleryItems()
      .then((data) => {
        if (!cancelled) {
          setPosts(data.map(toPost))
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { posts, status }
}
