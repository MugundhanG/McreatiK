/* ============================================
   Crafts — McreatiK (home)
   "One brand. Two crafts." Replaces the old
   stack of look-alike icon-card sections
   (What is / Who we help / What we create /
   Why us) with two editorial lists — what Tech
   builds, what Studios shoots.

   Hovering a row floats a preview that follows
   the cursor: a real website concept for Tech
   rows, a real photograph for Studios rows. On
   touch screens each row shows a small inline
   thumbnail instead.

   Carries id="about" — the home navbar's
   "About" link lands here.
   ============================================ */

import React, { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { DEMO_CONCEPTS } from '../../data/demoConcepts'
import { STUDIOS_SERVICES } from '../../utils/constants'
import { useFinePointer } from '../motion'
import SectionHeading from './SectionHeading'

const demoShot = (slug) => DEMO_CONCEPTS.find((d) => d.slug === slug)?.desktopShot
const studioShot = (title) => STUDIOS_SERVICES.find((s) => s.title === title)?.image

const CRAFTS = [
  {
    key: 'tech',
    name: 'McreatiK Tech',
    where: 'Remote · worldwide',
    accent: '#8C9BFF',
    to: '/tech',
    rows: [
      { label: 'Business websites', to: '/tech/services', image: demoShot('dental-dentique') },
      { label: 'Website redesigns', to: '/tech/services', image: demoShot('interior-aalaya') },
      { label: 'Landing pages', to: '/tech/services', image: demoShot('fit-anvil') },
      { label: 'Logo & brand identity', to: '/tech/services', image: demoShot('bq-zari') },
      { label: 'SEO & Google Business', to: '/tech/services', image: demoShot('re-kalpa') },
    ],
  },
  {
    key: 'studios',
    name: 'McreatiK Studios',
    where: 'Chennai · TN & nearby states',
    accent: '#D8AE55',
    to: '/studios',
    rows: [
      { label: 'Wedding photography', to: '/studios#offerings', image: studioShot('Wedding Photography') },
      { label: 'Pre & post wedding', to: '/studios#offerings', image: studioShot('Pre and Post Wedding') },
      { label: 'Portrait sessions', to: '/studios#offerings', image: studioShot('Portrait Sessions') },
      { label: 'Events & ceremonies', to: '/studios#offerings', image: studioShot('All Traditional Events') },
      { label: 'Album design', to: '/studios/albums', image: studioShot('Photo Album Design') },
    ],
  },
]

const SPRING = { stiffness: 260, damping: 28, mass: 0.5 }

const Crafts = memo(function Crafts() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(null) // { image, kind }
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)
  const showPreview = fine && !reduce

  const onMove = (e) => {
    if (!showPreview) return
    x.set(e.clientX)
    y.set(e.clientY)
  }

  return (
    <section id="about" className="relative py-24 lg:py-32 scroll-mt-20" onPointerMove={onMove}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="What is McreatiK?"
          title="One brand. Two crafts."
          subtitle="McreatiK Tech builds the online presence that makes a business look credible. McreatiK Studios captures the moments a screen can't. Different crafts, the same standard — and one place to talk to about either."
        />

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          {CRAFTS.map((craft) => (
            <div key={craft.key}>
              <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                <Link to={craft.to} className="font-display text-xl font-bold text-white hover:underline underline-offset-4">
                  {craft.name}
                </Link>
                <span className="font-mono-label text-[11px] uppercase tracking-wider" style={{ color: craft.accent }}>
                  {craft.where}
                </span>
              </div>

              <ul onPointerLeave={() => setHovered(null)}>
                {craft.rows.map((row, i) => (
                  <motion.li
                    key={row.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={row.to}
                      onPointerEnter={(e) => {
                        /* Start the preview at the cursor, not sliding in from 0,0 */
                        if (!hovered) {
                          x.jump(e.clientX)
                          y.jump(e.clientY)
                        }
                        setHovered({ image: row.image, kind: craft.key })
                      }}
                      className="group flex items-center gap-4 border-b border-white/10 py-5"
                    >
                      <span className="font-mono-label text-xs text-[#8890AE]">{String(i + 1).padStart(2, '0')}</span>
                      <span
                        className="flex-1 font-display text-2xl font-semibold text-[#F4F2EA] transition-all duration-300 group-hover:translate-x-2 sm:text-3xl"
                        style={{ '--accent': craft.accent }}
                      >
                        <span className="transition-colors duration-300 group-hover:text-[var(--accent)]">{row.label}</span>
                      </span>
                      {/* Touch screens: a small inline thumbnail instead of the floating preview */}
                      {!showPreview && row.image && (
                        <img src={row.image} alt="" loading="lazy" className="h-12 w-16 shrink-0 rounded-md object-cover object-top" />
                      )}
                      <FiArrowUpRight
                        className="h-5 w-5 shrink-0 text-[#8890AE] transition-all duration-300 group-hover:rotate-45 group-hover:text-white"
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Floating cursor preview (desktop) */}
      {showPreview && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-30"
          style={{ x, y }}
        >
          <AnimatePresence>
            {hovered?.image && (
              <motion.div
                key={hovered.image}
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: hovered.kind === 'tech' ? -3 : 3 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                /* Offset via motion values — Tailwind translate classes would be
                   overwritten by the transform framer-motion writes */
                style={{ x: '-50%', y: 24 }}
                className={`absolute overflow-hidden rounded-xl border border-white/20 shadow-2xl shadow-black/50 ${
                  hovered.kind === 'tech' ? 'h-44 w-72' : 'h-64 w-48'
                }`}
              >
                <img src={hovered.image} alt="" className="h-full w-full object-cover object-top" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
})

export default Crafts
