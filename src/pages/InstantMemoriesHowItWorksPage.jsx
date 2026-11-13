/* ============================================
   InstantMemoriesHowItWorksPage
   /instant-memories/how-it-works — one
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
import ImShell from '../components/instant-memories/ImShell'
import StoryMock from '../components/instant-memories/story/StoryMocks'
import { setFavicon } from '../utils/setFavicon'
import { getWhatsAppHref } from '../utils/whatsapp'
import { IM_DEMO_MESSAGE, IM_HOME } from '../data/instantMemories'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'
import { STORY_ACTS, STORY_FAQ, STORY_MOMENTS, STORY_ROLES } from '../data/instantMemoriesStory'

const EASE = [0.22, 1, 0.36, 1]
const demoHref = getWhatsAppHref(IM_DEMO_MESSAGE)
const CHAPTER_IDS = STORY_ACTS.flatMap((act) => act.chapters.map((c) => c.id))
const TOTAL = CHAPTER_IDS.length
const chapterNumber = (id) => CHAPTER_IDS.indexOf(id) + 1

/* Colour and icon per role, for the chapter badges. */
const LANE = {
  photographer: { dot: 'bg-[#0E1116]', ring: 'ring-[#0E1116]', text: 'text-[#0E1116]', darkText: 'text-white', icon: FiCamera },
  couple: { dot: 'bg-[#E5372B]', ring: 'ring-[#E5372B]', text: 'text-[#E5372B]', darkText: 'text-[#FF6B5F]', icon: FiHeart },
  guest: { dot: 'bg-[#19C37D]', ring: 'ring-[#19C37D]', text: 'text-[#0E9F63]', darkText: 'text-[#19C37D]', icon: FiSmartphone },
}

const TONES = {
  light: { bg: 'bg-[#F6F7F9]', text: 'text-[#0E1116]', muted: 'text-[#4A505C]', soft: 'text-[#5B6270]', rule: 'bg-black/10', pill: 'border-black/10 bg-white text-[#0E1116]', dark: false },
  dark: { bg: 'bg-[#16191E]', text: 'text-white', muted: 'text-white/80', soft: 'text-white/55', rule: 'bg-white/15', pill: 'border-white/15 bg-white/10 text-white', dark: true },
  cream: { bg: 'bg-white', text: 'text-[#0E1116]', muted: 'text-[#4A505C]', soft: 'text-[#5B6270]', rule: 'bg-black/10', pill: 'border-black/10 bg-[#F6F7F9] text-[#0E1116]', dark: false },
  sage: { bg: 'bg-[#ECEEF2]', text: 'text-[#0E1116]', muted: 'text-[#4A505C]', soft: 'text-[#5B6270]', rule: 'bg-black/10', pill: 'border-black/10 bg-white text-[#0E1116]', dark: false },
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
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <p className="font-mono-label text-[11px] uppercase text-[#5B6270]">How Instant Memories works</p>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.02em] text-[#0E1116] sm:text-6xl lg:text-7xl">
          For all types of events, <span className="block">from initial setup</span>{' '}
          <span className="text-[#E5372B]">to album selection.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-[#4A505C] sm:text-lg">
          Weddings, receptions, birthdays, baby showers or corporate events: follow one event chapter by chapter, and
          see what the photographer, the guests and the couple or family get from Instant Memories.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a href={demoHref} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E5372B] px-5 py-3 font-body text-sm font-semibold text-white shadow-sm shadow-[#E5372B]/30 transition-colors hover:bg-[#C92B20]">
            <FiMessageCircle className="h-4 w-4" /> Book a demo
          </a>
          <a href="#story" className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#0E1116] hover:underline underline-offset-4">
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
          <span className={`inline-flex items-center gap-1 font-mono-label text-xs uppercase tracking-wider ${t.dark ? LANE[chapter.who].darkText : LANE[chapter.who].text}`}>
            <FiClock className="h-3 w-3" /> {chapter.time}
          </span>
        </div>
        <h3 className={`mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${t.text}`}>
          {chapter.title[0]}<br />
          <span className={t.dark ? 'text-white/50' : 'text-[#9AA0AA]'}>{chapter.title[1]}</span>
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
            <span aria-hidden="true" className={`absolute inset-y-0 left-[max(1.25rem,calc(50%-36rem))] hidden w-px border-l border-dashed lg:block ${t.dark ? 'border-white/15' : 'border-black/10'}`} />
            <span aria-hidden="true" className={`absolute inset-y-0 right-[max(1.25rem,calc(50%-36rem))] hidden w-px border-l border-dashed lg:block ${t.dark ? 'border-white/15' : 'border-[#19C37D]/30'}`} />
            <div className="relative mx-auto max-w-6xl px-5 sm:px-10">
              <Rise className="mb-14 lg:mb-20">
                <p className={`font-mono-label text-xs uppercase tracking-[0.2em] ${t.soft}`}>{act.label}</p>
                <div className="mt-2 flex items-center gap-6">
                  <h2 className={`shrink-0 font-display text-4xl font-bold tracking-tight sm:text-5xl ${t.text}`}>{act.title}</h2>
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
          <p className="font-mono-label text-[11px] uppercase text-[#5B6270]">The whole story</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0E1116] sm:text-5xl">
            Five moments. <span className="text-[#9AA0AA]">One studio account.</span>
          </h2>
          <p className="mt-4 font-body text-[#4A505C]">From initial setup to album selection.</p>
        </Rise>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STORY_MOMENTS.map((f, i) => (
            <li key={f.name}>
              <Rise delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-black/10 bg-[#F6F7F9] p-5">
                  <p className="font-display text-3xl font-bold text-[#0E1116]">{i + 1}</p>
                  <h3 className="mt-2 font-body font-semibold text-[#0E1116]">{f.name}</h3>
                  <p className="mt-1 font-mono-label text-[10px] uppercase text-[#5B6270]">Chapter {f.chapters}</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-[#4A505C]">{f.body}</p>
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
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-[#0E1116] sm:text-4xl">Questions, answered.</h2>
        <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {STORY_FAQ.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.question}>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-body font-medium text-[#0E1116]">
                  {f.question}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10">
                    {isOpen ? <FiMinus className="h-3 w-3" /> : <FiPlus className="h-3 w-3" />}
                  </span>
                </button>
                {isOpen && <p className="pb-5 pr-10 font-body text-sm leading-relaxed text-[#4A505C]">{f.answer}</p>}
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
    <section className="relative overflow-hidden bg-[#16191E] py-24 text-center text-white lg:py-32">
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Your next event, <span className="text-[#19C37D]">live on every phone.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-white/80">
          Weddings, receptions, engagements, birthdays, baby showers, traditional functions or corporate events: create
          the event, print the board, and shoot as you always do. Guests watch it live, with your studio’s name on every
          photo.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={demoHref} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E5372B] px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-[#C92B20]">
            <FiMessageCircle className="h-4 w-4" /> Book a demo
          </a>
          <Link to={IM_HOME}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
            Back to Instant Memories <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function InstantMemoriesHowItWorksPage() {
  useSEO(seoFor('/instant-memories/how-it-works'))

  useEffect(() => {
    setFavicon('/favicon-im.svg')
  }, [])

  useScrollToHash()

  return (
    <ImShell>
      <Hero />
      <Acts />
      <WholeStory />
      <Questions />
      <Closing />
    </ImShell>
  )
}

export default InstantMemoriesHowItWorksPage
