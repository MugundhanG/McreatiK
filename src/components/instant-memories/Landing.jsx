/* ============================================
   Landing — sections of the Instant Memories
   SaaS home (/instant-memories). Copy lives in
   src/data/instantMemories.js; every claim
   matches what the app does today.
   ============================================ */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  FiArrowRight, FiCamera, FiCheck, FiMail, FiMinus, FiPlus, FiSmartphone, FiWifi, FiX,
} from 'react-icons/fi'
import ContactSheet from './ContactSheet'
import { IM_IMG, Phone } from './Phones'
import { getWhatsAppHref } from '../../utils/whatsapp'
import {
  IM_DEMO_MESSAGE, IM_FAQ, IM_FAQ_TABS, IM_FOR_COUPLES, IM_HOW, IM_FOR_GUESTS, IM_FOR_STUDIOS, IM_PRICE_NOTES, IM_PRICES,
  IM_PRICING_URL, IM_PRIVACY, IM_PROBLEMS, IM_STEPS,
} from '../../data/instantMemories'

const EASE = [0.22, 1, 0.36, 1]
const imDemoHref = getWhatsAppHref(IM_DEMO_MESSAGE)

function Rise({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children, light = false }) {
  return <p className={`font-mono-label text-[13px] uppercase ${light ? 'text-white/60' : 'text-[#5B6270]'}`}>{children}</p>
}

function PrimaryButton({ children, href = imDemoHref }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-[#E5372B] px-5 py-3 font-body text-sm font-semibold text-white shadow-sm shadow-[#E5372B]/30 transition-colors hover:bg-[#C92B20]">
      {children}
    </a>
  )
}

export function ImHero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <Eyebrow>Live event galleries for photography studios</Eyebrow>
          <h1 className="mt-4 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0E1116] sm:text-6xl lg:text-[4.1rem]">
            Every photo on every guest’s phone, seconds after the shutter.
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-[#4A505C] lg:text-xl">
            Instant Memories connects your cameras to a live gallery with your studio’s name on it. Guests scan a QR code
            and watch the event unfold. Afterwards, the couple pick their album in the same place.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryButton>Book a demo</PrimaryButton>
            <Link to={IM_HOW}
              className="inline-flex items-center gap-2 rounded-lg border border-[#0E1116]/15 px-5 py-3 font-body text-sm font-semibold text-[#0E1116] transition-colors hover:border-[#0E1116]">
              See how it works <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-8 font-mono-label text-[13px] uppercase text-[#4A505C]">
            No app for guests · Up to 4 cameras per laptop · Windows &amp; Mac
          </p>
        </div>
        <ContactSheet />
      </div>
    </section>
  )
}

export function ImProblems() {
  return (
    <section id="problems" className="border-t border-black/[0.07] bg-white py-20 lg:py-28 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rise className="max-w-3xl">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#0E1116] sm:text-5xl lg:text-6xl">
            Event photos are still delivered the old way.
          </h2>
          <p className="mt-5 font-body text-lg leading-relaxed text-[#4A505C] sm:text-xl">
            Here is what goes wrong for studios today, and how Instant Memories fixes each one.
          </p>
        </Rise>
        <ol className="mt-14 space-y-5">
          {IM_PROBLEMS.map((row, i) => (
            <li key={row.problem}>
              <Rise delay={(i % 3) * 0.04} className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
                <div className="rounded-2xl bg-[#F1F2F5] p-6 sm:p-7">
                  <p className="flex items-center gap-2 font-mono-label text-[13px] uppercase text-[#5B6270]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9AA0AA] text-white"><FiX className="h-3 w-3" aria-hidden="true" /></span>
                    Today
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-bold leading-snug text-[#0E1116] sm:text-[1.7rem]">{row.problem}</h3>
                  <p className="mt-2 font-body text-[17px] leading-relaxed text-[#4A505C]">{row.problemBody}</p>
                </div>
                <div aria-hidden="true" className="flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E1116] text-white">
                    <FiArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
                  </span>
                </div>
                <div className="rounded-2xl border-2 border-[#0E1116] bg-white p-6 sm:p-7">
                  <p className="flex items-center gap-2 font-mono-label text-[13px] uppercase text-[#0E9F63]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#19C37D] text-white"><FiCheck className="h-3 w-3" aria-hidden="true" /></span>
                    With Instant Memories
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-bold leading-snug text-[#0E1116] sm:text-[1.7rem]">{row.fix}</h3>
                  <p className="mt-2 font-body text-[17px] leading-relaxed text-[#2E333C]">{row.fixBody}</p>
                </div>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const STEP_ICONS = [FiCamera, FiWifi, FiSmartphone]

export function ImSteps() {
  return (
    <section id="product" className="py-20 lg:py-28 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rise className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0E1116] sm:text-5xl">From the camera to every phone.</h2>
          </div>
          <Link to={IM_HOW} className="inline-flex items-center gap-2 font-body text-sm font-semibold text-[#0E1116] underline-offset-4 hover:underline">
            Follow a whole event, setup to album <FiArrowRight className="h-4 w-4" />
          </Link>
        </Rise>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 md:grid-cols-3">
          {IM_STEPS.map(({ title, body }, i) => {
            const Icon = STEP_ICONS[i]
            return (
              <li key={title} className="bg-[#F6F7F9] p-7">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-[#0E1116]" aria-hidden="true" />
                  <span className="font-mono-label text-[13px] uppercase text-[#5B6270]">Step {i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-2xl font-bold text-[#0E1116]">{title}</h3>
                <p className="mt-2 font-body text-base leading-relaxed text-[#4A505C]">{body}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* Real studio dashboard screens (demo events), switchable. */
const STUDIO_SCREENS = [
  { id: 'events', label: 'Events', src: 'studio-events.jpg', alt: 'The studio’s events list: monthly pack usage and every event with its status and photo count' },
  { id: 'overview', label: 'Event overview', src: 'studio-dashboard.jpg', alt: 'An event’s overview: photos, cameras online with Pause and Rename, storage, and the guest QR code with print files' },
  { id: 'guests', label: 'Guest activity', src: 'studio-analytics.jpg', alt: 'Guest activity: people, QR scans, gallery visits, photo views, downloads and likes, per hour, with the most loved photos' },
]

function StudioScreens() {
  const [shown, setShown] = useState('overview')
  const screen = STUDIO_SCREENS.find((x) => x.id === shown)
  return (
    <div>
      <div role="group" aria-label="Studio dashboard screens" className="mb-3 flex flex-wrap gap-2">
        {STUDIO_SCREENS.map((x) => (
          <button key={x.id} type="button" aria-pressed={shown === x.id} onClick={() => setShown(x.id)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 font-body text-sm transition-colors ${shown === x.id ? 'border-[#0E1116] bg-[#0E1116] text-white' : 'border-black/10 text-[#4A505C] hover:border-[#0E1116] hover:text-[#0E1116]'}`}>
            {x.label}
          </button>
        ))}
      </div>
      <img key={screen.id} src={`${IM_IMG}/${screen.src}`} alt={screen.alt} loading="lazy" width="1380" height="1080"
        className="w-full rounded-xl border border-black/10 shadow-xl shadow-black/10" />
    </div>
  )
}

const AUDIENCES = [
  { id: 'studios', label: 'For studios', title: 'Your work, live, under your name.', items: IM_FOR_STUDIOS, shot: 'dashboard' },
  { id: 'couples', label: 'For couples', title: 'Their photos, their way.', items: IM_FOR_COUPLES, shot: `${IM_IMG}/couple-portal.jpg` },
  { id: 'guests', label: 'For guests', title: 'Scan, watch, keep.', items: IM_FOR_GUESTS, shot: `${IM_IMG}/guest-viewer.jpg` },
]

export function ImAudiences() {
  const [active, setActive] = useState('studios')
  const a = AUDIENCES.find((x) => x.id === active)
  return (
    <section id="features" className="border-y border-black/[0.07] bg-white py-20 lg:py-28 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rise className="max-w-2xl">
          <Eyebrow>Built for everyone at the event</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0E1116] sm:text-5xl">One gallery. Three people it works for.</h2>
        </Rise>
        <div role="tablist" aria-label="Who it's for" className="mt-10 inline-flex rounded-lg bg-[#F6F7F9] p-1">
          {AUDIENCES.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={active === x.id} onClick={() => setActive(x.id)}
              className={`cursor-pointer rounded-md px-4 py-2 font-body text-sm transition-colors ${active === x.id ? 'bg-[#0E1116] font-medium text-white' : 'text-[#4A505C] hover:text-[#0E1116]'}`}>
              {x.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className={`mt-10 grid items-start gap-12 ${a.shot === 'dashboard' ? '' : 'lg:grid-cols-[1.1fr_0.9fr]'}`}>
          <div>
            <h3 className="font-display text-2xl font-bold text-[#0E1116]">{a.title}</h3>
            <ul className={`mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 ${a.shot === 'dashboard' ? 'lg:grid-cols-4' : ''}`}>
              {a.items.map(({ title, body }) => (
                <li key={title} className="border-t border-black/10 pt-4">
                  <p className="font-body text-[17px] font-semibold text-[#0E1116]">{title}</p>
                  <p className="mt-1 font-body text-[15px] leading-relaxed text-[#4A505C]">{body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className={a.shot === 'dashboard' ? 'mx-auto w-full max-w-5xl' : 'lg:sticky lg:top-24'}>
            {a.shot === 'dashboard' ? (
              <StudioScreens />
            ) : (
              <div className="mx-auto w-full max-w-[260px]">
                <Phone src={a.shot} alt={a.id === 'couples'
                  ? 'The couple’s private gallery with album picks and download buttons'
                  : 'A guest viewing a photo full screen, with Download, Request removal and Share'} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ImPricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rise className="max-w-2xl">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0E1116] sm:text-5xl">Pay per event, or by the month.</h2>
        </Rise>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IM_PRICES.map(({ name, price, unit, body }, i) => (
            <li key={name}>
              <Rise delay={i * 0.05} className="h-full">
                <div className={`h-full rounded-2xl border p-6 ${i === 0 ? 'border-[#0E1116] bg-[#0E1116] text-white' : 'border-black/10 bg-white text-[#0E1116]'}`}>
                  <h3 className="font-body font-semibold">{name}</h3>
                  <p className="mt-4 font-display text-4xl font-bold tabular-nums tracking-tight">{price}</p>
                  <p className={`mt-1 font-mono-label text-[13px] ${i === 0 ? 'text-white/70' : 'text-[#5B6270]'}`}>{unit}</p>
                  <p className={`mt-5 font-body text-[15px] leading-relaxed ${i === 0 ? 'text-white/85' : 'text-[#4A505C]'}`}>{body}</p>
                </div>
              </Rise>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="space-y-2 font-body text-base text-[#4A505C]">
            {IM_PRICE_NOTES.map((note) => (
              <li key={note} className="flex items-start gap-2"><FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#19C37D]" aria-hidden="true" />{note}</li>
            ))}
          </ul>
          <a href={IM_PRICING_URL} target="_blank" rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-[#0E1116] underline-offset-4 hover:underline">
            Full pricing and packs <FiArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

export function ImPrivacy() {
  return (
    <section id="privacy" className="bg-[#16191E] py-20 text-white lg:py-28 scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Rise>
          <Eyebrow light>Privacy &amp; security</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">Families trust you with these moments.</h2>
          <p className="mt-4 font-body text-white/70">
            Events are full of people who never signed up for anything. Galleries stay within the family and friends who
            have the QR code.
          </p>
        </Rise>
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
          {IM_PRIVACY.map((item) => (
            <li key={item} className="flex gap-3 bg-[#16191E] p-5 font-body text-base leading-relaxed text-white/90 sm:[&:last-child:nth-child(odd)]:col-span-2">
              <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#19C37D]" aria-hidden="true" />{item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ImFaq() {
  const [tab, setTab] = useState(IM_FAQ_TABS[0])
  const [open, setOpen] = useState(0)
  const items = IM_FAQ.filter((f) => f.tab === tab)
  return (
    <section id="faq" className="py-20 lg:py-28 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#0E1116] sm:text-5xl">Questions, answered.</h2>
        <div role="tablist" aria-label="Questions from" className="mt-8 inline-flex rounded-lg bg-white p-1 shadow-sm">
          {IM_FAQ_TABS.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setOpen(0) }}
              className={`cursor-pointer rounded-md px-4 py-2 font-body text-sm transition-colors ${tab === t ? 'bg-[#0E1116] font-medium text-white' : 'text-[#4A505C] hover:text-[#0E1116]'}`}>
              {t}
            </button>
          ))}
        </div>
        <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {items.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.question}>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-body text-[17px] font-medium text-[#0E1116]">
                  {f.question}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10">
                    {isOpen ? <FiMinus className="h-3 w-3" /> : <FiPlus className="h-3 w-3" />}
                  </span>
                </button>
                {isOpen && <p className="pb-5 pr-10 font-body text-base leading-relaxed text-[#4A505C]">{f.answer}</p>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function ImCta() {
  return (
    <section className="border-t border-black/[0.07] bg-white py-20 lg:py-28">
      <Rise className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#0E1116] sm:text-6xl">Your next event, live on every phone.</h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-[#4A505C]">
          Weddings, receptions, birthdays, baby showers or corporate events. We set up your studio account and walk you
          through your first event.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <PrimaryButton>Book a demo</PrimaryButton>
          <a href="mailto:connect@mcreatik.com?subject=Instant%20Memories%20demo"
            className="inline-flex items-center gap-2 rounded-lg border border-[#0E1116]/15 px-5 py-3 font-body text-sm font-semibold text-[#0E1116] transition-colors hover:border-[#0E1116]">
            <FiMail className="h-4 w-4" /> connect@mcreatik.com
          </a>
        </div>
      </Rise>
    </section>
  )
}
