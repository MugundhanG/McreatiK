/* ============================================
   GalleryPostViewer — one event post, opened
   from the Gallery grid. Photo carousel (arrows,
   dots, ←/→ keys, swipe) plus the post's title,
   location, category and caption. Desktop: modal
   with the details panel on the right and arrows
   to the previous/next post. Mobile: full screen,
   details under the carousel. Closes on Escape,
   the X, or a backdrop click.
   ============================================ */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiMapPin, FiX } from 'react-icons/fi'
import { photoAlt } from './galleryPosts'

const SWIPE_THRESHOLD = 50

export default function GalleryPostViewer({ posts, index, onIndexChange, onClose }) {
  const post = posts[index]
  const [photoIndex, setPhotoIndex] = useState(0)
  const touchStartX = useRef(null)
  const closeButtonRef = useRef(null)
  const photos = post?.photos ?? []
  const hasManyPhotos = photos.length > 1

  // Opening another post always starts from its cover.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setPhotoIndex(0), [post?.id])

  const prevPhoto = useCallback(() => setPhotoIndex((i) => Math.max(i - 1, 0)), [])
  const nextPhoto = useCallback(() => setPhotoIndex((i) => Math.min(i + 1, photos.length - 1)), [photos.length])

  // Mount-only: record focus, lock scroll, move focus into the dialog, and
  // restore both on unmount. Kept separate from the keydown effect below so
  // that navigating between posts (which changes onClose/nextPhoto/prevPhoto
  // identities) doesn't re-run this teardown and yank focus back to the grid
  // tile behind the modal on every post change.
  useEffect(() => {
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus?.()
    return () => {
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, nextPhoto, prevPhoto])

  if (!post) return null
  const safeIndex = Math.min(photoIndex, photos.length - 1)
  const photo = photos[safeIndex]

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta > SWIPE_THRESHOLD) prevPhoto()
    if (delta < -SWIPE_THRESHOLD) nextPhoto()
  }

  const stop = (e) => e.stopPropagation()
  const photoArrow =
    'absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/85 text-[#1C1710] shadow hover:bg-white transition-colors'
  const postArrow =
    'hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[101] w-11 h-11 rounded-full items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      className="fixed inset-0 z-[100] bg-[#0F0D0A] lg:bg-black/85 lg:flex lg:items-center lg:justify-center lg:p-10"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close"
        className="fixed top-3 right-3 z-[102] w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <FiX className="w-6 h-6" />
      </button>

      {index > 0 && (
        <button
          onClick={(e) => {
            stop(e)
            onIndexChange(index - 1)
          }}
          aria-label="Previous post"
          className={`${postArrow} left-3`}
        >
          <FiChevronLeft className="w-7 h-7" />
        </button>
      )}
      {index < posts.length - 1 && (
        <button
          onClick={(e) => {
            stop(e)
            onIndexChange(index + 1)
          }}
          aria-label="Next post"
          className={`${postArrow} right-3`}
        >
          <FiChevronRight className="w-7 h-7" />
        </button>
      )}

      <div
        onClick={stop}
        className="h-full w-full overflow-y-auto lg:overflow-hidden lg:h-[85vh] lg:max-w-6xl lg:flex lg:rounded-sm lg:bg-white"
      >
        <div
          className="relative h-[65vh] lg:h-full lg:flex-1 bg-[#0F0D0A] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={photo.media.id ?? photo.media.url}
            src={photo.media.url}
            alt={photoAlt(post, photo)}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />

          {hasManyPhotos && safeIndex > 0 && (
            <button onClick={prevPhoto} aria-label="Previous photo" className={`${photoArrow} left-3`}>
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}
          {hasManyPhotos && safeIndex < photos.length - 1 && (
            <button onClick={nextPhoto} aria-label="Next photo" className={`${photoArrow} right-3`}>
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}

          {hasManyPhotos && (
            <>
              <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 font-mono-label text-[11px] text-white">
                {safeIndex + 1} / {photos.length}
              </span>
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 px-6 flex-wrap">
                {photos.map((p, i) => (
                  <button
                    key={p.media.id ?? i}
                    onClick={() => setPhotoIndex(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-current={i === safeIndex}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === safeIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="bg-white px-5 py-6 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:px-7 lg:py-8">
          <p className="font-mono-label text-[11px] uppercase tracking-wide text-[#C9971F]">{post.category}</p>
          <h2 className="font-display italic text-2xl lg:text-3xl text-[#1C1710] mt-2 leading-tight">{post.title}</h2>
          {post.location && (
            <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-[#6B6153]">
              <FiMapPin className="w-4 h-4 shrink-0" />
              {post.location}
            </p>
          )}
          {post.description && (
            <p className="mt-5 pt-5 border-t border-[#1C1710]/10 font-body text-[15px] leading-relaxed text-[#3D362C] whitespace-pre-line">
              {post.description}
            </p>
          )}

          <div className="mt-8 flex justify-between gap-3 lg:hidden">
            <button
              onClick={() => onIndexChange(index - 1)}
              disabled={index === 0}
              className="font-mono-label text-xs uppercase tracking-wide text-[#1C1710] disabled:opacity-30"
            >
              ← Previous event
            </button>
            <button
              onClick={() => onIndexChange(index + 1)}
              disabled={index === posts.length - 1}
              className="font-mono-label text-xs uppercase tracking-wide text-[#1C1710] disabled:opacity-30"
            >
              Next event →
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  )
}
