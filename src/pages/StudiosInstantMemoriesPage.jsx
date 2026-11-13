/* ============================================
   StudiosInstantMemoriesPage — McreatiK Studios
   /studios/instant-memories: "our own
   technology". McreatiK Studios built and owns
   Instant Memories, and every event we shoot can
   have it. The product itself (for other
   studios) lives at /instant-memories.
   ============================================ */

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiDownload, FiHeart, FiSmartphone } from 'react-icons/fi'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { LivePhone } from '../components/instant-memories/Phones'
import { setFavicon } from '../utils/setFavicon'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'
import studiosLogoDark from '../assets/studios-logo-dark-bg.webp'

const EASE = [0.22, 1, 0.36, 1]

const FOR_YOU = [
  { icon: FiSmartphone, title: 'Live on every guest’s phone', body: 'Guests scan a QR code at your event and see the photos seconds after we take them. No app, no sign-up.' },
  { icon: FiHeart, title: 'Pick your album photos', body: 'Your own private gallery, organised by moment. Tap to choose favourites and we see your picks straight away.' },
  { icon: FiDownload, title: 'Full-quality downloads', body: 'Download every edited photo in full quality as a ZIP, or just your album picks.' },
]

function StudiosInstantMemoriesPage() {
  const reduce = useReducedMotion()
  useSEO(seoFor('/studios/instant-memories'))

  useEffect(() => {
    setFavicon('/favicon-studios.png')
  }, [])

  useScrollToHash()

  return (
    <StudiosPageShell>
      <section className="relative overflow-hidden bg-[#1C1710] pt-32 pb-20 text-white lg:pt-40 lg:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-[#C9971F]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 font-mono-label text-xs uppercase text-[#E3C46F]">Our own technology</p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              We built <span className="italic text-[#E3C46F]">Instant Memories.</span>
            </h1>
            <p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-white/80">
              McreatiK Studios is the team behind Instant Memories, a live photo gallery for events. It brings the latest
              technology in event photography to every wedding and celebration we shoot: your guests see the photos on
              their phones seconds after they’re taken.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/studios#book"
                className="inline-flex items-center gap-2 rounded-full bg-[#C9971F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C9971F]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b3860f]">
                Book a session <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/instant-memories"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
                Visit Instant Memories
              </Link>
            </div>
          </div>
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
            className="mx-auto w-full max-w-[270px]"
          >
            <LivePhone brandLogo={studiosLogoDark} />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#FAF7F0] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="font-mono-label text-xs uppercase text-[#C9971F]">At your event</p>
          <h2 className="mt-3 max-w-2xl font-display italic text-3xl text-[#1C1710] sm:text-4xl">What it means when you book McreatiK Studios</h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {FOR_YOU.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-2xl border border-black/10 bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9971F]/10 text-[#C9971F]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-5 font-display text-xl text-[#1C1710]">{title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#4A4438]">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="font-display text-2xl text-[#1C1710]">Are you a photographer?</h2>
            <p className="mt-1 font-body text-[#4A4438]">Instant Memories is available to photography studios everywhere.</p>
          </div>
          <Link to="/instant-memories"
            className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-[#C9971F] underline-offset-4 hover:underline">
            Instant Memories for studios <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </StudiosPageShell>
  )
}

export default StudiosInstantMemoriesPage
