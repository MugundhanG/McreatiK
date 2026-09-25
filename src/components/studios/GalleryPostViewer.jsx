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
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiMapPin, FiX } from 'react-icons/fi'
import { photoAlt } from './galleryPosts'

// A drag counts as a swipe past this distance, or a shorter flick past this speed.
const SWIPE_DISTANCE = 80
const SWIPE_VELOCITY = 500

// `dir` is +1 (next: new photo enters from the right), -1 (previous: enters
// from the left) or 0 (no direction, e.g. first open) — passed as `custom`.
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0, opacity: dir === 0 ? 0 : 1 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0, opacity: dir === 0 ? 0 : 1 }),
}

// Reduced motion: a plain cross-fade, no sliding.
const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

const slideTransition = {
  x: { type: 'spring', stiffness: 300, damping: 34 },
  opacity: { duration: 0.2 },
}

export default function GalleryPostViewer({ posts, index, onIndexChange, onClose }) {
  const post = posts[index]
  const reduceMotion = useReducedMotion()
  // One piece of state so the photo index and slide direction always change
  // together. `postIndex` remembers which post it belongs to: when the viewer
  // moves to another post we reset to its cover *during render* (React's
  // "adjust state when a prop changes" pattern), so the new post never renders
  // even once with the previous post's photo index, and the slide direction
  // follows the post navigation direction.
  const [slide, setSlide] = useState({ postIndex: index, photo: 0, dir: 0 })
  if (slide.postIndex !== index) {
    setSlide({ postIndex: index, photo: 0, dir: Math.sign(index - slide.postIndex) })
  }
  const closeButtonRef = useRef(null)
  const photos = post?.photos ?? []
  const hasManyPhotos = photos.length > 1

  const goToPhoto = useCallback(
    (target) => {
      setSlide((s) => {
        if (target < 0 || target >= photos.length || target === s.photo) return s
        return { ...s, photo: target, dir: Math.sign(target - s.photo) }
      })
    },
    [photos.length]
  )
  const prevPhoto = useCallback(() => setSlide((s) => (s.photo > 0 ? { ...s, photo: s.photo - 1, dir: -1 } : s)), [])
  const nextPhoto = useCallback(
    () => setSlide((s) => (s.photo < photos.length - 1 ? { ...s, photo: s.photo + 1, dir: 1 } : s)),
    [photos.length]
  )

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
  const safeIndex = Math.min(slide.photo, photos.length - 1)
  const photo = photos[safeIndex]
  const dir = slide.dir

  function handleDragEnd(_event, { offset, velocity }) {
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) nextPhoto()
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) prevPhoto()
    // Otherwise dragConstraints spring the photo back to centre.
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
        <div className="relative h-[65vh] lg:h-full lg:flex-1 bg-[#0F0D0A] overflow-hidden">
          <AnimatePresence initial={false} custom={dir}>
            <motion.img
              key={`${post.id}-${photo.media.id ?? photo.media.url}`}
              src={photo.media.url}
              alt={photoAlt(post, photo)}
              custom={dir}
              variants={reduceMotion ? fadeVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              drag={hasManyPhotos && !reduceMotion ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              className={`absolute inset-0 w-full h-full object-contain select-none touch-pan-y ${
                hasManyPhotos && !reduceMotion ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              draggable={false}
            />
          </AnimatePresence>

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
                    onClick={() => goToPhoto(i)}
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
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: reduceMotion ? 0 : dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
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
          </motion.div>

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
