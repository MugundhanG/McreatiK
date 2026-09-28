/* ============================================
   Hero Section — Studios
   Full-bleed hero (100vw x 100vh) doubling as
   the backdrop for the transparent navbar above
   it. A slideshow of real work cross-fades
   behind the headline, each photo easing in
   with a slow Ken Burns zoom; a dark gradient
   keeps the nav and headline legible over any
   of them. Progress dashes (bottom-centre) show
   the current photo and jump to one on click.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Button from '../ui/Button'
import studiosHeroPhoto from '../../assets/studios-hero-photo.jpg'
import coupleEmbraceMono from '../../assets/studios-hero/couple-embrace-mono.webp'
import beachWalk from '../../assets/studios-hero/beach-walk.webp'
import weddingRings from '../../assets/studios-hero/wedding-rings.webp'
import seasideRocksSepia from '../../assets/studios-hero/seaside-rocks-sepia.webp'
import sunsetDance from '../../assets/studios-hero/sunset-dance.webp'
import shorelineWalk from '../../assets/studios-hero/shoreline-walk.webp'

// `position` is the object-position focal point, so the subjects stay in
// frame when object-cover crops a landscape photo on a portrait phone.
const SLIDES = [
  { src: studiosHeroPhoto, position: '50% 50%' },
  { src: coupleEmbraceMono, position: '52% 40%' },
  { src: beachWalk, position: '62% 55%' },
  { src: weddingRings, position: '52% 55%' },
  { src: seasideRocksSepia, position: '70% 45%' },
  { src: sunsetDance, position: '38% 55%' },
  { src: shorelineWalk, position: '32% 60%' },
]

const SLIDE_MS = 6000
const FADE_S = 1.6

const StudiosHero = memo(function StudiosHero() {
  const [index, setIndex] = useState(0)
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden)

  // Pause the slideshow while the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Advance after each slide's time on screen; restarts whenever the slide
  // changes (including a manual jump), so a clicked photo gets its full time.
  useEffect(() => {
    if (!pageVisible) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [index, pageVisible])

  // Warm the cache for the next photo so its fade-in never shows a blank.
  useEffect(() => {
    const next = new Image()
    next.src = SLIDES[(index + 1) % SLIDES.length].src
  }, [index])

  const slide = SLIDES[index]

  return (
    <section id="home" className="relative h-screen w-screen min-h-screen flex items-end overflow-hidden bg-[#1C1710] scroll-mt-28">
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.src}
          src={slide.src}
          alt=""
          aria-hidden="true"
          fetchPriority={index === 0 ? 'high' : 'auto'}
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{
            opacity: 1,
            scale: 1.04,
            transition: {
              opacity: { duration: FADE_S, ease: 'easeInOut' },
              // Slow Ken Burns drift across the photo's whole time on screen.
              scale: { duration: (SLIDE_MS + FADE_S * 1000) / 1000, ease: 'linear' },
            },
          }}
          exit={{ opacity: 0, transition: { duration: FADE_S, ease: 'easeInOut' } }}
          style={{ objectPosition: slide.position }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="film-grain" />

      {/* Gradient — dark enough at the very top for the transparent navbar's
          logo/links, and dark enough at the bottom for the headline. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pb-20 sm:pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display italic font-normal text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white max-w-3xl text-balance"
        >
          Photographs worth keeping, made worth remembering.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body mt-6 text-base sm:text-lg text-white/80 max-w-xl leading-relaxed"
        >
          We capture the emotions, connections, and little moments that make every story uniquely yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Button theme="studios" href="#book">
            Book a Session <FiArrowRight className="w-4 h-4" />
          </Button>
          <Link
            to="/studios/gallery"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            View Gallery
          </Link>
        </motion.div>
      </div>

      {/* Progress dashes, bottom-centre (clear of the floating WhatsApp button) — the active one fills over the slide's time. */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5" role="group" aria-label="Hero photos">
        {SLIDES.map((s, i) => {
          const active = i === index
          return (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${SLIDES.length}`}
              aria-current={active ? 'true' : undefined}
              className="group py-2"
            >
              <span className="relative block h-[2px] w-6 sm:w-8 overflow-hidden rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
                {active && (
                  <motion.span
                    key={`${index}-${pageVisible}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: pageVisible ? '100%' : '0%' }}
                    transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
})

export default StudiosHero
