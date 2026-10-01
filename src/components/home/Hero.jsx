/* ============================================
   Hero — McreatiK (home)
   "Two worlds": a headline over two large
   panels, Tech and Studios. Hovering (or
   focusing) a panel widens it and brings it
   forward while the other recedes:
   - Tech: a browser window scrolling through
     real website concepts;
   - Studios: a slow Ken Burns slideshow of
     real Studios photographs.
   Each whole panel is a link into that
   department. On touch screens the panels
   simply stack, both fully alive.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { getWhatsAppHref } from '../../utils/whatsapp'
import { DEMO_CONCEPTS } from '../../data/demoConcepts'
import { Magnetic, RevealText, useFinePointer } from '../motion'
import Button from '../ui/Button'
import beachWalk from '../../assets/studios-hero/beach-walk.webp'
import weddingRings from '../../assets/studios-hero/wedding-rings.webp'
import sunsetDance from '../../assets/studios-hero/sunset-dance.webp'
import coupleEmbraceMono from '../../assets/studios-hero/couple-embrace-mono.webp'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I have a project in mind — I'd like to talk.")
const EASE = [0.22, 1, 0.36, 1]

const TECH_SLUGS = ['interior-aalaya', 'dental-dentique', 'rs-coalstreet']
const TECH_SHOTS = TECH_SLUGS.map((s) => DEMO_CONCEPTS.find((d) => d.slug === s)).filter(Boolean)
const STUDIO_SHOTS = [sunsetDance, weddingRings, beachWalk, coupleEmbraceMono]
const CYCLE_MS = 4500

/* Shared slide clock for both panels (paused with reduced motion) */
function useCycle(length, reduce) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return undefined
    const id = setInterval(() => setI((n) => (n + 1) % length), CYCLE_MS)
    return () => clearInterval(id)
  }, [length, reduce])
  return i
}

function TechVisual({ index, reduce }) {
  const demo = TECH_SHOTS[index % TECH_SHOTS.length]
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[linear-gradient(150deg,#16205a_0%,#0A1128_70%)]">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#5B5FEF]/30 blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute right-[-6%] top-[12%] w-[78%] max-w-[560px] rotate-[-4deg] overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl shadow-black/50 transition-transform duration-700 group-hover:rotate-[-2deg] group-hover:scale-[1.03]">
        <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.img
              key={demo.slug}
              src={demo.desktopShot}
              alt=""
              decoding="async"
              className="absolute inset-x-0 top-0 w-full"
              initial={{ opacity: 0, y: '0%' }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: '-30%' }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.6 }, y: { duration: CYCLE_MS / 1000, ease: 'easeInOut' } }}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function StudiosVisual({ index, reduce }) {
  const src = STUDIO_SHOTS[index % STUDIO_SHOTS.length]
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#1C1710]">
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: reduce ? 1 : 1.12 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1 }, scale: { duration: CYCLE_MS / 1000 + 1, ease: 'linear' } }}
        />
      </AnimatePresence>
      <div className="film-grain opacity-60" />
    </div>
  )
}

const PANELS = [
  {
    key: 'tech',
    to: '/tech',
    kicker: 'McreatiK Tech',
    title: 'Websites & branding',
    line: 'For businesses anywhere — built remotely, worldwide.',
    cta: 'Explore Tech',
    accent: '#8C9BFF',
    Visual: TechVisual,
  },
  {
    key: 'studios',
    to: '/studios',
    kicker: 'McreatiK Studios',
    title: 'Photography & albums',
    line: 'Weddings, portraits & events — Chennai, Tamil Nadu & nearby states.',
    cta: 'Explore Studios',
    accent: '#D8AE55',
    Visual: StudiosVisual,
  },
]

const Hero = memo(function Hero() {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const [active, setActive] = useState(null)
  const slide = useCycle(12, reduce)

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-10 sm:pt-28">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[520px] w-[520px] rounded-full bg-[#D8AE55]/10 blur-[130px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {/* ===== Headline row ===== */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="lg:min-w-0 lg:flex-1">
            <motion.div
              className="flex flex-wrap items-center gap-x-4 gap-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#D8AE55]">
                McreatiK · Digital &amp; creative studio
              </p>
              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono-label text-[10px] uppercase text-[#8890AE]">
                Digital Store · coming soon
              </span>
            </motion.div>
            {/* One sentence per line, each revealing word by word */}
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-[#F4F2EA] sm:text-5xl lg:text-[2.75rem] xl:text-[3.6rem]">
              <RevealText
                as="span"
                animateOnMount
                delay={0.1}
                text="Websites that win customers."
                accent={['customers.']}
                accentClassName="text-[#D8AE55]"
                className="block"
              />
              <RevealText
                as="span"
                animateOnMount
                delay={0.4}
                text="Photographs worth keeping."
                accent={['keeping.']}
                accentClassName="text-[#D8AE55]"
                className="block"
              />
            </h1>
          </div>

          <motion.div
            className="flex shrink-0 flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          >
            <Magnetic>
              <Button href={WHATSAPP_HREF} theme="home">
                Start a Project <FiArrowRight className="w-4 h-4" />
              </Button>
            </Magnetic>
          </motion.div>
        </div>

        {/* ===== The two worlds ===== */}
        <div
          id="explore"
          className="mt-8 flex flex-1 flex-col gap-4 lg:min-h-[400px] lg:flex-row"
          onPointerLeave={() => setActive(null)}
        >
          {PANELS.map(({ key, to, kicker, title, line, cta, accent, Visual }, i) => {
            const isActive = active === key
            const isDimmed = active !== null && !isActive
            return (
              <motion.div
                key={key}
                className="relative min-h-[300px] sm:min-h-[340px] lg:min-h-0"
                style={{ flexBasis: 0 }}
                initial={{ opacity: 0, y: 30, flexGrow: 1 }}
                animate={{ opacity: 1, y: 0, flexGrow: fine && isActive ? 1.55 : 1 }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.35 + i * 0.12 },
                  y: { duration: 0.8, delay: 0.35 + i * 0.12, ease: EASE },
                  flexGrow: { duration: 0.7, ease: EASE },
                }}
                onPointerEnter={() => fine && setActive(key)}
              >
                <Link
                  to={to}
                  onFocus={() => setActive(key)}
                  onBlur={() => setActive(null)}
                  className="group absolute inset-0 overflow-hidden rounded-2xl border border-white/10"
                >
                  <Visual index={slide} reduce={reduce} />

                  {/* Legibility gradient + dim when the other panel is active */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/40 to-transparent" />
                  <motion.div
                    className="absolute inset-0 bg-[#0A1128]"
                    animate={{ opacity: isDimmed ? 0.55 : 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                    <div>
                      <p className="font-mono-label text-xs uppercase tracking-[0.18em]" style={{ color: accent }}>
                        {kicker}
                      </p>
                      <p className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{title}</p>
                      <p className="mt-2 max-w-sm text-sm text-white/70">{line}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: accent }}>
                        {cta}
                        <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                    <span
                      className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent sm:flex"
                      style={{ backgroundColor: isActive ? accent : 'transparent', color: isActive ? '#0A1128' : '#fff' }}
                    >
                      <FiArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export default Hero
