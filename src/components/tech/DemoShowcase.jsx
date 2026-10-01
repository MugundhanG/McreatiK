/* ============================================
   DemoShowcase — Tech hero visual
   A browser window and a phone showing real
   McreatiK website concepts. Each screen slowly
   scrolls through its full-page screenshot, the
   pair cycles through a handful of industries,
   and the devices drift with the cursor.

   Every frame is a live demo (/demos/<slug>/),
   so the caption links straight to it — proof
   rather than a services list.

   Reduced motion: no autoplay, no auto-scroll,
   no drift; the dots still switch demos.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { DEMO_CONCEPTS, DEMO_INDUSTRIES } from '../../data/demoConcepts'
import { useFinePointer } from '../motion'

const FEATURED_SLUGS = [
  'dental-smile-studio',
  'photo-kadhai',
  'interior-aalaya',
  'rs-coalstreet',
  'fit-anvil',
  're-kalpa',
]

const FEATURED = FEATURED_SLUGS.map((slug) => DEMO_CONCEPTS.find((d) => d.slug === slug)).filter(Boolean)
const industryLabel = (id) => DEMO_INDUSTRIES.find((i) => i.id === id)?.label ?? id

const SLIDE_MS = 6000
const EASE = [0.22, 1, 0.36, 1]
const SPRING = { stiffness: 90, damping: 20, mass: 0.6 }

/* One screen's content: fades in, then slowly scrolls the long screenshot */
function Screen({ src, scrollTo, reduce, duration }) {
  return (
    <motion.img
      src={src}
      alt=""
      decoding="async"
      className="absolute inset-x-0 top-0 w-full"
      initial={{ opacity: 0, y: '0%' }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: scrollTo }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.6 },
        y: { duration, ease: 'easeInOut', delay: 0.6 },
      }}
    />
  )
}

const DemoShowcase = memo(function DemoShowcase() {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const demo = FEATURED[index]

  /* Autoplay — off with reduced motion, paused while hovered */
  useEffect(() => {
    if (reduce || paused) return undefined
    const id = setTimeout(() => setIndex((i) => (i + 1) % FEATURED.length), SLIDE_MS)
    return () => clearTimeout(id)
  }, [index, paused, reduce])

  /* Cursor drift: the phone (closer) moves twice as far as the browser */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, SPRING)
  const sy = useSpring(my, SPRING)
  const browserX = useTransform(sx, (v) => v * -10)
  const browserY = useTransform(sy, (v) => v * -10)
  const phoneX = useTransform(sx, (v) => v * 22)
  const phoneY = useTransform(sy, (v) => v * 22)
  const drift = fine && !reduce

  const onMove = (e) => {
    if (!drift) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
    setPaused(false)
  }

  if (!demo) return null

  return (
    <div
      className="relative h-[440px] sm:h-[520px] lg:h-[560px]"
      onPointerMove={onMove}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={onLeave}
    >
      {/* Backdrop — soft signal-blue glow on a blueprint grid */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-6 h-[85%] w-[90%] rounded-[2.5rem] bg-[#1E4FD9]/[0.06] blueprint-grid" />
        <div className="absolute right-[10%] top-[20%] h-64 w-64 rounded-full bg-[#1E4FD9]/25 blur-[90px]" />
      </div>

      {/* ===== Browser window ===== */}
      <motion.div
        style={drift ? { x: browserX, y: browserY } : undefined}
        className="absolute right-0 top-0 w-[92%] sm:w-[88%] overflow-hidden rounded-xl border border-stone-900/10 bg-white shadow-[0_30px_80px_-20px_rgba(20,22,28,0.35)]"
      >
        <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate rounded-md bg-white px-3 py-1 font-mono-label text-[11px] text-stone-500 ring-1 ring-stone-200">
            mcreatik.com{demo.url}
          </span>
        </div>
        <div className="relative aspect-[16/10.5] overflow-hidden bg-stone-100">
          <AnimatePresence initial={false}>
            <Screen key={demo.slug} src={demo.desktopShot} scrollTo="-38%" reduce={reduce} duration={SLIDE_MS / 1000 - 1} />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ===== Phone ===== */}
      <motion.div
        style={drift ? { x: phoneX, y: phoneY } : undefined}
        className="absolute bottom-10 left-0 w-[30%] max-w-[180px] rounded-[1.75rem] border-[6px] border-stone-900 bg-stone-900 shadow-[0_30px_60px_-15px_rgba(20,22,28,0.5)] sm:bottom-6"
      >
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.3rem] bg-stone-100">
          <AnimatePresence initial={false}>
            <Screen key={demo.slug} src={demo.mobileShot} scrollTo="-45%" reduce={reduce} duration={SLIDE_MS / 1000 - 1} />
          </AnimatePresence>
          <span aria-hidden="true" className="absolute left-1/2 top-1.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-stone-900" />
        </div>
      </motion.div>

      {/* ===== Caption + controls ===== */}
      <div className="absolute bottom-0 right-0 flex w-[62%] flex-col items-end gap-3 sm:w-[60%]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.a
            key={demo.slug}
            href={demo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="group inline-flex max-w-full items-center gap-3 rounded-full border border-stone-900/10 bg-white/90 py-2 pl-4 pr-2 text-sm shadow-lg shadow-stone-900/10 backdrop-blur"
          >
            <span className="truncate">
              <span className="hidden font-mono-label text-[11px] uppercase tracking-wider text-[#1E4FD9] sm:inline">
                {industryLabel(demo.industry)}
              </span>
              <span className="mx-2 hidden text-stone-300 sm:inline">/</span>
              <span className="font-semibold text-stone-900">{demo.name}</span>
            </span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E4FD9] text-white transition-transform duration-200 group-hover:rotate-45">
              <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Open live demo</span>
            </span>
          </motion.a>
        </AnimatePresence>

        <div className="flex items-center gap-1.5" role="group" aria-label="Choose a website concept">
          {FEATURED.map((d, i) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${d.name}`}
              aria-pressed={i === index}
              className="group flex h-6 items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 bg-[#1E4FD9]' : 'w-1.5 bg-stone-300 group-hover:bg-stone-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})

export default DemoShowcase
