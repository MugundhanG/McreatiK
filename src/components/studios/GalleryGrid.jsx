/* ============================================
   GalleryGrid — the Instagram-style square grid
   of event posts plus the post viewer it opens.
   Shared by the full Gallery page and the
   Studios home preview so both always look and
   behave the same. Tiles glide into place when
   the `posts` list changes (e.g. a category
   filter), fading out/in as they leave/enter.
   ============================================ */

import React, { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiLayers } from 'react-icons/fi'
import { photoAlt } from './galleryPosts'
import GalleryPostViewer from './GalleryPostViewer'

export default function GalleryGrid({ posts }) {
  const [openIndex, setOpenIndex] = useState(null)
  const closeViewer = useCallback(() => setOpenIndex(null), [])

  return (
    <>
      <div className="relative grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
        {/* popLayout: tiles leaving the list are pulled out of the grid
            immediately, so the tiles that stay can glide (layout) into their
            new positions while the leavers fade out and new ones fade in. */}
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => {
            const cover = post.photos[0]
            const count = post.photos.length
            const enterDelay = Math.min(index, 11) * 0.035
            return (
              <motion.button
                key={post.id}
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open ${post.title}${count > 1 ? `, ${count} photos` : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                transition={{
                  layout: { type: 'spring', stiffness: 320, damping: 32 },
                  opacity: { duration: 0.35, delay: enterDelay },
                  scale: { duration: 0.35, delay: enterDelay, ease: 'easeOut' },
                }}
                className="group relative block aspect-square overflow-hidden bg-[#1C1710]/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9971F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F3]"
              >
                <img
                  src={cover.media.url}
                  alt={photoAlt(post, cover)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {count > 1 && (
                  <FiLayers
                    aria-hidden="true"
                    className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  />
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
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <GalleryPostViewer posts={posts} index={openIndex} onIndexChange={setOpenIndex} onClose={closeViewer} />
        )}
      </AnimatePresence>
    </>
  )
}
