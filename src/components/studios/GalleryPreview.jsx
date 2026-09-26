/* ============================================
   Gallery Preview — Studios home
   The latest few event posts in the same grid
   and viewer as the full Gallery page, with a
   link through to it. Hides itself entirely if
   there are no posts or the CMS can't be
   reached, so the home page never shows an
   empty or broken block.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { useGalleryPosts } from './useGalleryPosts'
import GalleryGrid from './GalleryGrid'

const PREVIEW_COUNT = 6

const StudiosGalleryPreview = memo(function StudiosGalleryPreview() {
  const { posts, status } = useGalleryPosts()

  if (status !== 'ready' || posts.length === 0) return null
  const latest = posts.slice(0, PREVIEW_COUNT)

  return (
    <section id="gallery-preview" className="relative py-24 lg:py-32 bg-[#FAF8F3] scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">Recent frames</p>
            <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Gallery</h2>
            <p className="font-body mt-4 text-[#6B6153] max-w-lg">
              A look at our latest events — open any post to see the full set.
            </p>
          </div>
          <Link
            to="/studios/gallery"
            className="group inline-flex shrink-0 items-center gap-2 self-start sm:self-auto font-mono-label text-xs uppercase tracking-wide text-[#1C1710] border-b border-[#1C1710]/30 pb-1 hover:border-[#1C1710] transition-colors"
          >
            View full gallery
            <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <GalleryGrid posts={latest} />
      </div>
    </section>
  )
})

export default StudiosGalleryPreview
