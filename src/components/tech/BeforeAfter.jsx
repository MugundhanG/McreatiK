/* ============================================
   BeforeAfter — Tech
   Drag-to-compare: a typical outdated small-
   business site (drawn in HTML/CSS, clearly
   labelled as an illustration — not a real
   business) against one of our live concepts.

   The control is a real, invisible <input
   type="range"> stretched over the frame, so
   mouse, touch and keyboard all work natively.
   On first view it sweeps once to show it can
   be dragged (skipped with reduced motion).
   ============================================ */

import React, { memo, useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import SectionHeading from '../ui/SectionHeading'
import { DEMO_CONCEPTS } from '../../data/demoConcepts'

const AFTER = DEMO_CONCEPTS.find((d) => d.slug === 'dental-smile-studio')

/* A deliberately dated page — tables-era layout, default serif,
   clashing colours, cramped text, "under construction" energy. */
function OutdatedSite() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#d8d8d8] font-serif text-black" aria-hidden="true">
      <div className="bg-[#000080] px-3 py-2 text-center">
        <p className="text-[clamp(14px,2.6vw,26px)] font-bold text-yellow-300 [text-shadow:2px_2px_0_#f00]">
          ★ WELCOME TO SMILE DENTAL CLINIC ★
        </p>
      </div>
      <div className="flex justify-center gap-3 border-y-2 border-[#808080] bg-[#c0c0c0] py-1 text-[clamp(9px,1.3vw,13px)] text-[#0000ee] underline">
        <span>Home</span>|<span>About Us</span>|<span>Services</span>|<span>Gallery</span>|<span>Contact</span>
      </div>
      <div className="grid grid-cols-[28%_1fr] gap-2 p-2 sm:gap-3 sm:p-3">
        <div className="space-y-2 border-2 border-dashed border-[#808080] bg-white p-2 text-[clamp(8px,1.1vw,12px)]">
          <p className="font-bold text-[#800000]">QUICK LINKS</p>
          <p className="text-[#0000ee] underline">» Timings</p>
          <p className="text-[#0000ee] underline">» Fees</p>
          <p className="text-[#0000ee] underline">» Location map</p>
          <div className="mt-2 border border-black bg-black px-1 py-0.5 text-center font-mono text-[#0f0]">VISITORS: 004127</div>
        </div>
        <div className="space-y-2 bg-white p-2 text-[clamp(8px,1.15vw,13px)] leading-snug">
          <p className="text-[clamp(11px,1.8vw,18px)] font-bold text-[#800000] underline">About Our Clinic</p>
          <p>
            We are providing best dental treatment in the city since many years with experienced doctors and modern
            equipments. All type of dental treatments are done here at affordable cost. For appointment please call
            during clinic timings. Thank you for visiting our website.
          </p>
          <div className="flex gap-2">
            <div className="flex aspect-square w-1/3 items-center justify-center border border-[#808080] bg-[#e8e8e8] text-[#808080]">
              [image]
            </div>
            <div className="flex-1 space-y-1">
              <p>✔ Root canal ✔ Cleaning</p>
              <p>✔ Braces ✔ Implants</p>
              <p className="font-bold text-red-600">CALL: 98XXX XXXXX</p>
            </div>
          </div>
          <p className="bg-yellow-200 text-center font-bold">🚧 This site is under construction 🚧</p>
        </div>
      </div>
    </div>
  )
}

const BeforeAfter = memo(function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const frameRef = useRef(null)
  const inView = useInView(frameRef, { once: true, margin: '-120px' })
  const reduce = useReducedMotion()
  const touched = useRef(false)

  /* One teaching sweep the first time the frame is on screen */
  useEffect(() => {
    if (!inView || reduce) return undefined
    const controls = animate(50, [50, 22, 78, 50], {
      duration: 2.6,
      ease: 'easeInOut',
      delay: 0.4,
      onUpdate: (v) => {
        if (!touched.current) setPos(v)
      },
    })
    return () => controls.stop()
  }, [inView, reduce])

  const onInput = (e) => {
    touched.current = true
    setPos(Number(e.target.value))
  }

  if (!AFTER) return null

  return (
    <section className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="The Difference"
          title="Same business. A different first impression."
          subtitle="Drag across to compare a typical outdated clinic website with one of our concepts. Visitors decide in seconds which one they trust."
        />

        <div
          ref={frameRef}
          className="relative mx-auto aspect-[4/3] max-w-5xl overflow-hidden rounded-2xl border border-stone-200 shadow-[0_30px_80px_-30px_rgba(20,22,28,0.35)] sm:aspect-[16/10]"
        >
          {/* After — a live McreatiK concept */}
          <img
            src={AFTER.desktopShot}
            alt={`${AFTER.name}, a McreatiK website concept`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />

          {/* Before — clipped to the left of the handle */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <OutdatedSite />
          </div>

          {/* Labels */}
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
            Before · typical outdated site
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-[#1E4FD9] px-3 py-1 text-xs font-semibold text-white">
            After · McreatiK concept
          </span>

          {/* Handle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
            style={{ left: `${pos}%` }}
          >
            <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow-lg ring-1 ring-black/10">
              <FiChevronLeft className="h-4 w-4 -mr-1" />
              <FiChevronRight className="h-4 w-4 -ml-1" />
            </span>
          </div>

          {/* The actual control: invisible, full-frame, native drag + keys */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={pos}
            onChange={onInput}
            aria-label="Compare before and after: drag left or right"
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>

        <p className="mt-4 text-center text-xs text-stone-500">
          “Before” is an illustration of a common small-business site, not a real client.{' '}
          <a href={AFTER.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#1E4FD9] hover:underline">
            Open the live {AFTER.name} concept →
          </a>
        </p>
      </div>
    </section>
  )
})

export default BeforeAfter
