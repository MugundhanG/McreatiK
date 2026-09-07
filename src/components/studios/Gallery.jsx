/* ============================================
   Gallery Section — Studios
   Portfolio grid, presented like a contact
   sheet — each frame gets the film-frame border
   and a frame-counter caption. Pulls published
   photos from the CMS backend.
   ============================================ */

import React, { memo, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCamera, FiAlertCircle } from 'react-icons/fi'
import { fetchGalleryItems } from '../../utils/cmsApi'

const StudiosGallery = memo(function StudiosGallery() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    let cancelled = false
    fetchGalleryItems()
      .then((data) => {
        if (!cancelled) {
          setItems(data)
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

  const categories = useMemo(() => {
    const unique = [...new Set(items.map((item) => item.category))]
    return ['All', ...unique]
  }, [items])

  const visibleItems = activeCategory === 'All' ? items : items.filter((item) => item.category === activeCategory)

  return (
    <section
      id="gallery"
      className="relative py-24 lg:py-32 scroll-mt-28 bg-[linear-gradient(135deg,#EDE7D3_0%,#E6B5AC_30%,#5FC7A8_62%,#163A3D_100%)]"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">Selected frames</p>
          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Gallery</h2>
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">
            A hand-picked selection of moments from behind the lens.
          </p>
        </motion.div>

        {status === 'ready' && categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-label uppercase tracking-wide border transition-colors ${
                  activeCategory === category
                    ? 'bg-[#1C1710] text-white border-[#1C1710]'
                    : 'border-black/15 text-[#6B6153] hover:border-[#1C1710]/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {status === 'loading' && (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="py-20 flex flex-col items-center text-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-[#8B2E2A]" />
            <p className="font-body text-[#6B6153]">Couldn't load the gallery right now. Please try again shortly.</p>
          </div>
        )}

        {status === 'ready' && visibleItems.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <FiCamera className="w-8 h-8 text-[#1C1710]/30" />
            <p className="font-body text-[#6B6153]">New frames are on their way — check back soon.</p>
          </div>
        )}

        {status === 'ready' && visibleItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-16">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="film-frame relative aspect-[4/5] overflow-hidden">
                  <img
                    src={item.media.url}
                    alt={item.media.altText || item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="film-grain" />
                  <span className="absolute top-3 left-3 font-mono-label text-[10px] uppercase text-white/80 drop-shadow">
                    {item.category}
                  </span>
                </div>
                <p className="font-mono-label text-[11px] uppercase text-[#6B6153] mt-3">
                  Frame {String(index + 1).padStart(2, '0')}/{String(visibleItems.length).padStart(2, '0')} — {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
})

export default StudiosGallery
