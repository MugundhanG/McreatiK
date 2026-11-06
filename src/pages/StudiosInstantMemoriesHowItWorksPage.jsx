/* ============================================
   StudiosInstantMemoriesHowItWorksPage
   /studios/instant-memories/how-it-works — one
   event told from initial setup to album
   selection: what the photographer, the guests
   and the couple or family see, chapter by
   chapter, each with a small mock of the app.
   Content lives in src/data/instantMemoriesStory.js.
   ============================================ */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowDown, FiArrowRight, FiCamera, FiClock, FiHeart, FiMessageCircle, FiMinus, FiPlus, FiSmartphone } from 'react-icons/fi'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import StoryMock from '../components/studios/instant-memories/story/StoryMocks'
import { setFavicon } from '../utils/setFavicon'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'
import { getWhatsAppHref } from '../utils/whatsapp'
import { IM_DEMO_MESSAGE } from '../data/instantMemories'
import { STORY_ACTS, STORY_FAQ, STORY_MOMENTS, STORY_ROLES } from '../data/instantMemoriesStory'

const EASE = [0.22, 1, 0.36, 1]
const demoHref = getWhatsAppHref(IM_DEMO_MESSAGE)
const CHAPTER_IDS = STORY_ACTS.flatMap((act) => act.chapters.map((c) => c.id))
const TOTAL = CHAPTER_IDS.length
const chapterNumber = (id) => CHAPTER_IDS.indexOf(id) + 1

/* Colour and icon per role, for the chapter badges. */
const LANE = {
  photographer: { dot: 'bg-[#C9971F]', ring: 'ring-[#C9971F]', text: 'text-[#C9971F]', icon: FiCamera },
  couple: { dot: 'bg-[#C2185B]', ring: 'ring-[#C2185B]', text: 'text-[#C2185B]', icon: FiHeart },
  guest: { dot: 'bg-[#0F766E]', ring: 'ring-[#0F766E]', text: 'text-[#0F766E]', icon: FiSmartphone },
}

const TONES = {
  light: { bg: 'bg-[#FAF7F0]', text: 'text-[#1C1710]', muted: 'text-[#4A4438]', soft: 'text-[#6B6153]', rule: 'bg-black/10', pill: 'border-black/10 bg-white text-[#1C1710]', dark: false },
  dark: { bg: 'bg-[#3A0F1A]', text: 'text-white', muted: 'text-white/80', soft: 'text-white/60', rule: 'bg-white/15', pill: 'border-white/15 bg-white/10 text-white', dark: true },
  cream: { bg: 'bg-[#F4EADB]', text: 'text-[#1C1710]', muted: 'text-[#4A4438]', soft: 'text-[#6B6153]', rule: 'bg-black/10', pill: 'border-black/10 bg-white text-[#1C1710]', dark: false },
  sage: { bg: 'bg-[#E9EEE5]', text: 'text-[#1C1710]', muted: 'text-[#4A4438]', soft: 'text-[#6B6153]', rule: 'bg-black/10', pill: 'border-black/10 bg-white text-[#1C1710]', dark: false },
}

/** Fades a block up into view once (just fades under reduced motion). */
function Rise({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function RoleIcon({ who }) {
  const Icon = LANE[who].icon
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ring-2 ${LANE[who].ring} ${LANE[who].text}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F0] pt-36 pb-16 lg:pt-44 lg:pb-20">
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-[#C9971F]/50" />
          <span className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#C9971F]">How Instant Memories works</span>
          <span className="h-px w-8 bg-[#C9971F]/50" />
        </div>
        <h1 className="font-display text-4xl leading-[1.08] text-[#1C1710] sm:text-6xl lg:text-7xl">
          For all types of events, <span className="block">from initial setup</span>{' '}
          <span className="italic text-[#C9971F]">to album selection.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-[#4A4438] sm:text-lg">
          Weddings, receptions, birthdays, baby showers or corporate events: follow one event chapter by chapter, and
          see what the photographer, the guests and the couple or family get from Instant Memories.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a href={demoHref} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9971F] px-6 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-[#C9971F]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b3860f]">
            <FiMessageCircle className="h-4 w-4" /> Book a demo
          </a>
          <a href="#story" className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#1C1710] hover:text-[#C9971F]">
            See the story <FiArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}


function Chapter({ chapter, number, tone }) {
  const t = TONES[tone]
  const role = STORY_ROLES[chapter.who]
  const textRight = chapter.who === 'guest'
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Rise className={`min-w-0 ${textRight ? 'lg:order-2' : ''}`}>
        <div className="flex items-center gap-3">
          <RoleIcon who={chapter.who} />
          <span className={`font-mono-label text-xs ${t.soft}`}>{String(number).padStart(2, '0')} / {TOTAL}</span>
          <span className={`inline-flex items-center gap-1 font-mono-label text-xs uppercase tracking-wider ${LANE[chapter.who].text} ${t.dark ? 'brightness-150' : ''}`}>
            <FiClock className="h-3 w-3" /> {chapter.time}
          </span>
        </div>
        <h3 className={`mt-5 font-display text-3xl leading-tight sm:text-4xl ${t.text}`}>
          {chapter.title[0]}<br />
          <span className={`italic ${t.dark ? 'text-[#E3C46F]' : 'text-[#C9971F]'}`}>{chapter.title[1]}</span>
        </h3>
        <p className={`mt-3 font-body text-sm font-semibold ${t.text}`}>{role.label}</p>
        <p className={`mt-3 max-w-md font-body leading-relaxed ${t.muted}`}>{chapter.body}</p>
        <span className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-body text-xs ${t.pill}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${LANE[chapter.who].dot}`} /> {chapter.tag}
        </span>
      </Rise>
      <Rise delay={0.1} className={`min-w-0 ${textRight ? 'lg:order-1' : ''}`}>
        <StoryMock name={chapter.mock} />
      </Rise>
    </div>
  )
}

function Acts() {
  return (
    <div id="story">
      {STORY_ACTS.map((act) => {
        const t = TONES[act.tone]
        return (
          <section key={act.id} id={act.id} className={`relative overflow-hidden py-20 lg:py-28 ${t.bg}`}>
            {/* Timeline lanes: photographer on the left, guest on the right (large screens) */}
            <span aria-hidden="true" className={`absolute inset-y-0 left-[max(1.25rem,calc(50%-36rem))] hidden w-px border-l border-dashed lg:block ${t.dark ? 'border-white/15' : 'border-[#C9971F]/30'}`} />
            <span aria-hidden="true" className={`absolute inset-y-0 right-[max(1.25rem,calc(50%-36rem))] hidden w-px border-l border-dashed lg:block ${t.dark ? 'border-white/15' : 'border-[#0F766E]/25'}`} />
            {act.tone === 'dark' && (
              <img src="/studios/instant-memories/live/hero-bg.webp" alt="" aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
            )}
            <div className="relative mx-auto max-w-6xl px-5 sm:px-10">
              <Rise className="mb-14 lg:mb-20">
                <p className={`font-mono-label text-xs uppercase tracking-[0.2em] ${t.soft}`}>{act.label}</p>
                <div className="mt-2 flex items-center gap-6">
                  <h2 className={`shrink-0 font-display text-4xl sm:text-5xl ${t.text}`}>{act.title}</h2>
                  <span className={`h-px flex-1 ${t.rule}`} />
                </div>
                <p className={`mt-3 font-body ${t.soft}`}>{act.sub}</p>
              </Rise>
              <div className="space-y-20 lg:space-y-28">
                {act.chapters.map((chapter) => (
                  <Chapter key={chapter.id} chapter={chapter} number={chapterNumber(chapter.id)} tone={act.tone} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

function WholeStory() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rise className="mx-auto max-w-2xl text-center">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#C9971F]">The whole story</p>
          <h2 className="mt-3 font-display text-3xl text-[#1C1710] sm:text-5xl">
            Five moments. <span className="italic text-[#C9971F]">One studio account.</span>
          </h2>
          <p className="mt-4 font-body text-[#4A4438]">From initial setup to album selection.</p>
        </Rise>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STORY_MOMENTS.map((f, i) => (
            <li key={f.name}>
              <Rise delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-black/5 bg-[#FAF7F0] p-5">
                  <p className="font-display text-3xl text-[#C9971F]">{i + 1}</p>
                  <h3 className="mt-2 font-body font-semibold text-[#1C1710]">{f.name}</h3>
                  <p className="mt-1 font-mono-label text-[10px] uppercase tracking-wider text-[#6B6153]">Chapter {f.chapters}</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-[#4A4438]">{f.body}</p>
                </div>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Questions() {
  const [open, setOpen] = useState(0)
  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="text-center font-display text-3xl text-[#1C1710] sm:text-4xl">
          Questions, <span className="italic text-[#C9971F]">answered.</span>
        </h2>
        <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {STORY_FAQ.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.question}>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-body font-medium text-[#1C1710]">
                  {f.question}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10">
                    {isOpen ? <FiMinus className="h-3 w-3" /> : <FiPlus className="h-3 w-3" />}
                  </span>
                </button>
                {isOpen && <p className="pb-5 pr-10 font-body text-sm leading-relaxed text-[#4A4438]">{f.answer}</p>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="relative overflow-hidden bg-[#3A0F1A] py-24 text-center text-white lg:py-32">
      <img src="/studios/instant-memories/live/hero-bg.webp" alt="" aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="font-display text-4xl leading-tight sm:text-6xl">
          Your next event, <span className="italic text-[#E3C46F]">live on every phone.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-white/80">
          Weddings, receptions, engagements, birthdays, baby showers, traditional functions or corporate events: create
          the event, print the board, and shoot as you always do. Guests watch it live, with your studio’s name on every
          photo.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={demoHref} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9971F] px-6 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b3860f]">
            <FiMessageCircle className="h-4 w-4" /> Book a demo
          </a>
          <Link to="/studios/instant-memories"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
            Back to Instant Memories <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function StudiosInstantMemoriesHowItWorksPage() {
  useSEO(seoFor('/studios/instant-memories/how-it-works'))

  useEffect(() => {
    setFavicon('/favicon-studios.png')
  }, [])

  useScrollToHash()

  return (
    <StudiosPageShell>
      <Hero />
      <Acts />
      <WholeStory />
      <Questions />
      <Closing />
    </StudiosPageShell>
  )
}

export default StudiosInstantMemoriesHowItWorksPage
