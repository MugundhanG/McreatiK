/* ============================================
   What is McreatiK? — McreatiK (home)
   A bento grid instead of a text block:
   - an intro tile with the one-line thesis;
   - a Tech tile — a browser window that
     scrolls through a real website concept,
     faster and tilting forward on hover;
   - a Studios tile — a real photograph with a
     slow push-in, deeper on hover;
   - Mission and Vision tiles.
   Tiles wipe in one after another and lean
   toward the cursor (Tilt). Carries id="about"
   (navbar "About") and the grid has
   id="explore" (the hero's Explore button).
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiTarget, FiCompass } from 'react-icons/fi'
import { DEMO_CONCEPTS } from '../../data/demoConcepts'
import { RevealText, Tilt } from '../motion'
import mkMark from '../../assets/mcreatik-mk-mark.webp'
import weddingRings from '../../assets/studios-hero/wedding-rings.webp'

const EASE = [0.22, 1, 0.36, 1]
const TECH_DEMO = DEMO_CONCEPTS.find((d) => d.slug === 'interior-aalaya')

const TECH_CHIPS = ['Websites', 'Redesigns', 'Landing pages', 'Logo & branding', 'SEO']
const STUDIOS_CHIPS = ['Weddings', 'Pre & post wedding', 'Portraits', 'Events', 'Albums']

/* Wrapper that wipes a tile up out of a mask, staggered by `order` */
function TileReveal({ order = 0, className = '', children }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, clipPath: 'inset(12% 0% 0% 0% round 20px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 20px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: order * 0.1, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Chips({ items, accent }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((c) => (
        <li
          key={c}
          className="rounded-full border px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm"
          style={{ borderColor: `${accent}55`, backgroundColor: `${accent}14` }}
        >
          {c}
        </li>
      ))}
    </ul>
  )
}

const WhatIsMcreatik = memo(function WhatIsMcreatik() {
  return (
    <section id="about" className="relative py-24 lg:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="explore" className="grid scroll-mt-24 grid-cols-1 gap-4 lg:grid-cols-6 lg:auto-rows-[minmax(0,auto)]">

          {/* ===== Intro ===== */}
          <TileReveal order={0} className="lg:col-span-2 lg:row-span-2">
            <div className="relative h-full overflow-hidden rounded-[20px] border border-white/10 bg-[#0F1838] p-7 sm:p-8">
              <img
                src={mkMark}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -right-12 w-64 opacity-[0.07]"
              />
              <span className="inline-block rounded-full border border-[#D8AE55]/25 bg-[#D8AE55]/10 px-3.5 py-1 font-mono-label text-[11px] uppercase text-[#D8AE55]">
                What is McreatiK?
              </span>
              <RevealText
                as="h2"
                text="One brand. Two crafts."
                accent={['Two', 'crafts.']}
                accentClassName="text-[#D8AE55]"
                className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-[#F4F2EA] sm:text-5xl"
              />
              <p className="mt-5 text-[15px] leading-relaxed text-[#A9B0CB]">
                Your website one week, your wedding photos the next.{' '}
                <span className="text-white">McreatiK Tech</span> builds the digital presence that makes a
                business look credible online. <span className="text-white">McreatiK Studios</span> captures the
                moments a screen can&apos;t. Different crafts, the same standard — one place to talk to about either.
              </p>
              <p className="mt-6 font-mono-label text-[11px] uppercase tracking-wider text-[#8890AE]">
                Next: McreatiK Digital Store — coming soon
              </p>
            </div>
          </TileReveal>

          {/* ===== Tech ===== */}
          <TileReveal order={1} className="lg:col-span-4">
            <Tilt max={4} className="h-full rounded-[20px]" wrapperClassName="h-full">
              <Link
                to="/tech"
                className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(140deg,#1a2470_0%,#0F1838_60%)] p-7 sm:p-8"
              >
                <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#5B5FEF]/30 blur-[90px] transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

                {/* Browser — scrolls a real concept; faster + tilts forward on hover */}
                {TECH_DEMO && (
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-8 right-[-8%] hidden w-[52%] rotate-[-5deg] overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl shadow-black/50 transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:rotate-[-2deg] sm:block"
                  >
                    <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <img
                        src={TECH_DEMO.desktopShot}
                        alt=""
                        loading="lazy"
                        className="absolute inset-x-0 top-0 w-full transition-transform duration-[9000ms] ease-in-out group-hover:-translate-y-[55%] group-hover:duration-[5000ms] motion-reduce:!translate-y-0"
                      />
                    </div>
                  </div>
                )}

                <div className="relative max-w-[30ch] sm:max-w-[46%]">
                  <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#8C9BFF]">McreatiK Tech · Remote, worldwide</p>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    Websites that make a business look credible
                  </h3>
                </div>
                <div className="relative mt-auto pt-6 sm:max-w-[46%]">
                  <Chips items={TECH_CHIPS} accent="#8C9BFF" />
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C9BFF]">
                    Explore Tech <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Tilt>
          </TileReveal>

          {/* ===== Studios ===== */}
          <TileReveal order={2} className="lg:col-span-4">
            <Tilt max={4} className="h-full rounded-[20px]" wrapperClassName="h-full">
              <Link
                to="/studios"
                className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[20px] border border-white/10 p-7 sm:p-8"
              >
                <img
                  src={weddingRings}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-[1.15] motion-reduce:!scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128]/95 via-[#0A1128]/70 to-[#0A1128]/10" />
                <div className="film-grain opacity-50" />

                <div className="relative max-w-[30ch] sm:max-w-[50%]">
                  <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#D8AE55]">McreatiK Studios · Chennai</p>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    Photographs worth keeping
                  </h3>
                  <p className="mt-2 text-sm text-white/70">Serving Tamil Nadu &amp; nearby states.</p>
                </div>
                <div className="relative mt-auto pt-6 sm:max-w-[60%]">
                  <Chips items={STUDIOS_CHIPS} accent="#D8AE55" />
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#D8AE55]">
                    Explore Studios <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Tilt>
          </TileReveal>

          {/* ===== Mission / Vision ===== */}
          {[
            {
              icon: FiTarget,
              label: 'Our Mission',
              title: 'Turn ideas into meaningful experiences.',
              body: 'We bring technology and creativity together to create digital solutions and creative work that help people and businesses build, express and grow.',
            },
            {
              icon: FiCompass,
              label: 'Our Vision',
              title: 'The same bar, no matter what we build next.',
              body: "We want McreatiK to be a name people trust. Today, that's Tech and Studios. Tomorrow, whatever comes next will have to meet the same standard.",
            },
          ].map(({ icon: Icon, label, title, body }, i) => (
            <TileReveal key={label} order={3 + i} className="lg:col-span-3">
              <div className="group h-full rounded-[20px] border border-white/10 bg-[#0F1838] p-7 transition-colors duration-300 hover:border-[#D8AE55]/40 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8AE55]/30 text-[#D8AE55] transition-transform duration-500 group-hover:rotate-[20deg]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#D8AE55]">{label}</p>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A9B0CB]">{body}</p>
              </div>
            </TileReveal>
          ))}
        </div>
      </div>
    </section>
  )
})

export default WhatIsMcreatik
