/* ============================================
   Gallery Section — Studios
   Instagram-style profile grid of event posts.
   Each post (1-20 photos from one event) shows
   its cover as a square tile; clicking opens
   GalleryPostViewer. Pulls published posts from
   the CMS backend.
   ============================================ */

import React, { memo, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiAlertCircle, FiCamera } from 'react-icons/fi'
import { useGalleryPosts } from './useGalleryPosts'
import GalleryGrid from './GalleryGrid'

const StudiosGallery = memo(function StudiosGallery() {
  const { posts, status } = useGalleryPosts()
  const [activeCategory, setActiveCategory] = useState('All')

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
                  className={`relative shrink-0 pb-1.5 font-mono-label text-xs uppercase tracking-wide transition-colors ${
                    active ? 'text-[#1C1710]' : 'text-[#6B6153]/70 hover:text-[#1C1710]'
                  }`}
                >
                  {category}
                  {active && (
                    // One shared underline that glides to whichever tab is active.
                    <motion.span
                      layoutId="gallery-category-underline"
                      className="absolute inset-x-0 -bottom-px h-px bg-[#1C1710]"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>
        )}

        {status === 'loading' && (
          <div className="relative grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
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

        {status === 'ready' && visiblePosts.length > 0 && <GalleryGrid posts={visiblePosts} />}
      </div>
    </section>
  )
})

export default StudiosGallery
