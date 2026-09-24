/* ============================================
   Gallery Section — Studios
   Instagram-style profile grid of event posts.
   Each post (1-20 photos from one event) shows
   its cover as a square tile; clicking opens
   GalleryPostViewer. Pulls published posts from
   the CMS backend.
   ============================================ */

import React, { memo, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAlertCircle, FiCamera, FiLayers } from 'react-icons/fi'
import { fetchGalleryItems } from '../../utils/cmsApi'
import { toPost, photoAlt } from './galleryPosts'
import { GALLERY_SAMPLES } from './gallerySamples'
import GalleryPostViewer from './GalleryPostViewer'

// Local dev only — never ships sample posts to production.
const SAMPLES = import.meta.env.DEV ? GALLERY_SAMPLES : []

const StudiosGallery = memo(function StudiosGallery() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)

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

  const categories = useMemo(() => ['All', ...new Set(posts.map((post) => post.category))], [posts])

  const visiblePosts = useMemo(
    () => (activeCategory === 'All' ? posts : posts.filter((post) => post.category === activeCategory)),
    [posts, activeCategory]
  )

  return (
    <section id="gallery" className="relative bg-[#FAF8F3] py-20 lg:py-28 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="pb-10 mb-10 border-b border-[#1C1710]/10"
        >
          <p className="font-mono-label text-xs uppercase tracking-wide text-[#C9971F] mb-4">Selected frames</p>
          <h1 className="font-display italic text-4xl sm:text-5xl lg:text-6xl text-[#1C1710]">Gallery</h1>
          <p className="font-body mt-5 text-[#6B6153] max-w-xl leading-relaxed">
            Moments from recent events — open any post to see the full set.
          </p>
        </motion.header>

        {status === 'ready' && categories.length > 2 && (
          <nav
            aria-label="Filter by category"
            className="-mx-5 sm:mx-0 px-5 sm:px-0 mb-10 flex gap-6 overflow-x-auto sm:flex-wrap sm:gap-x-7 sm:gap-y-3 [scrollbar-width:none]"
          >
            {categories.map((category) => {
              const active = activeCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`shrink-0 pb-1.5 font-mono-label text-xs uppercase tracking-wide border-b transition-colors ${
                    active
                      ? 'text-[#1C1710] border-[#1C1710]'
                      : 'text-[#6B6153]/70 border-transparent hover:text-[#1C1710]'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </nav>
        )}

        {status === 'loading' && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="aspect-square bg-[#1C1710]/[0.06] animate-pulse" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="py-20 flex flex-col items-center text-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-[#8B2E2A]" />
            <p className="font-body text-[#6B6153]">Couldn't load the gallery right now. Please try again shortly.</p>
          </div>
        )}

        {status === 'ready' && visiblePosts.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <FiCamera className="w-8 h-8 text-[#1C1710]/30" />
            <p className="font-body text-[#6B6153]">New frames are on their way — check back soon.</p>
          </div>
        )}

        {status === 'ready' && visiblePosts.length > 0 && (
          <div key={activeCategory} className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
            {visiblePosts.map((post, index) => {
              const cover = post.photos[0]
              const count = post.photos.length
              return (
                <motion.button
                  key={post.id}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Open ${post.title}${count > 1 ? `, ${count} photos` : ''}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                  className="group relative block aspect-square overflow-hidden bg-[#1C1710]/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9971F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F3]"
                >
                  <img
                    src={cover.media.url}
                    alt={photoAlt(post, cover)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {count > 1 && (
                    <FiLayers aria-hidden="true" className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                  )}
                  <div className="absolute inset-0 hidden sm:flex flex-col items-center justify-center gap-1 p-3 text-center bg-black/45 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                    <p className="font-display italic text-base lg:text-lg text-white leading-snug line-clamp-2">{post.title}</p>
                    <p className="font-mono-label text-[10px] uppercase tracking-wide text-white/80">
                      {count} {count === 1 ? 'photo' : 'photos'}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <GalleryPostViewer
            posts={visiblePosts}
            index={openIndex}
            onIndexChange={setOpenIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
})

export default StudiosGallery
