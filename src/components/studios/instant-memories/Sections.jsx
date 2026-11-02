/* ============================================
   Instant Memories — page sections
   Hero, how it works, who it's for (studios,
   couples, guests), privacy, screenshots and the
   closing call to action for
   /studios/instant-memories. Copy lives in
   src/data/instantMemories.js.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  FiArrowRight, FiBarChart2, FiCamera, FiCheck, FiDownload, FiHeart, FiImage, FiLock, FiMail,
  FiMessageCircle, FiSliders, FiSmartphone, FiStar, FiUsers, FiWifi,
} from 'react-icons/fi'
import { RevealText } from '../../motion'
import { getWhatsAppHref } from '../../../utils/whatsapp'
import {
  IM_COUPLE_MESSAGE, IM_DEMO_MESSAGE, IM_FOR_COUPLES, IM_FOR_GUESTS, IM_FOR_STUDIOS, IM_PRIVACY, IM_STEPS,
} from '../../../data/instantMemories'

const EASE = [0.22, 1, 0.36, 1]
const IMG = '/studios/instant-memories'

/** Fades a block up into view once, or just fades it when the visitor prefers less motion. */
function Rise({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children, light = false }) {
  return <p className={`font-mono-label text-xs uppercase mb-3 ${light ? 'text-[#E3C46F]' : 'text-[#C9971F]'}`}>{children}</p>
}

/** A screenshot shown inside a simple phone frame. */
function Phone({ src, alt, className = '' }) {
  return (
    <div className={`relative rounded-[2.2rem] border-[6px] border-[#1C1710] bg-[#1C1710] shadow-2xl shadow-black/30 ${className}`}>
      <img src={src} alt={alt} loading="lazy" width="390" height="844" className="block w-full rounded-[1.7rem]" />
    </div>
  )
}

const demoHref = getWhatsAppHref(IM_DEMO_MESSAGE)
const coupleHref = getWhatsAppHref(IM_COUPLE_MESSAGE)

export const InstantMemoriesHero = memo(function InstantMemoriesHero() {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden bg-[#1C1710] pt-32 pb-20 lg:pt-40 lg:pb-28 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-[#C9971F]/15 blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow light>McreatiK Studios · Live wedding gallery</Eyebrow>
          <h1 className="font-display italic text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Instant Memories
          </h1>
          <p className="mt-5 max-w-xl font-body text-lg text-white/80 leading-relaxed">
            Wedding photos on every guest&apos;s phone, seconds after they&apos;re taken. Guests scan a QR code — no app,
            no sign-up — and watch the day unfold in your studio&apos;s own gallery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={demoHref} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9971F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C9971F]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b3860f]">
              <FiMessageCircle className="w-4 h-4" /> Book a demo
            </a>
            <a href={coupleHref} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
              Getting married? Have it at your wedding <FiArrowRight className="w-4 h-4" />
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-white/70">
            {['No app for guests', 'Your studio branding', 'Private and secure'].map((t) => (
              <li key={t} className="inline-flex items-center gap-2"><FiCheck className="w-4 h-4 text-[#E3C46F]" />{t}</li>
            ))}
          </ul>
        </div>
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: 2 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="mx-auto w-full max-w-[300px]"
        >
          <Phone src={`${IMG}/guest-gallery.jpg`} alt="A live wedding gallery on a guest's phone, showing new photos arriving" />
        </motion.div>
      </div>
    </section>
  )
})

const STEP_ICONS = [FiCamera, FiWifi, FiSmartphone]

export const InstantMemoriesHowItWorks = memo(function InstantMemoriesHowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Rise className="mb-12 max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <RevealText as="h2" text="From the camera to every phone" className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]" />
        </Rise>
        <ol className="grid gap-6 md:grid-cols-3">
          {IM_STEPS.map(({ title, body }, i) => {
            const Icon = STEP_ICONS[i]
            return (
              <Rise key={title} delay={i * 0.08}>
                <li className="h-full list-none rounded-2xl border border-black/10 bg-white p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9971F]/10 text-[#C9971F]"><Icon className="w-5 h-5" /></span>
                    <span className="font-mono-label text-xs text-[#6B6354]">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl text-[#1C1710]">{title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-[#4A4438]">{body}</p>
                </li>
              </Rise>
            )
          })}
        </ol>
      </div>
    </section>
  )
})

const STUDIO_ICONS = [FiStar, FiCamera, FiWifi, FiSliders, FiHeart, FiBarChart2]

export const InstantMemoriesForStudios = memo(function InstantMemoriesForStudios() {
  return (
    <section id="for-studios" className="relative py-20 lg:py-28 bg-white scroll-mt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Rise>
            <Eyebrow>For photography studios</Eyebrow>
            <RevealText as="h2" text="The wedding everyone talks about — with your name on it" className="font-display italic text-3xl sm:text-4xl text-[#1C1710]" />
            <p className="mt-4 font-body text-[#4A4438] leading-relaxed">
              Every guest watches your work live, on their own phone, under your logo. It is the most visible advertising
              a studio can get, and it makes album selection with the couple easy.
            </p>
          </Rise>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {IM_FOR_STUDIOS.map(({ title, body }, i) => {
              const Icon = STUDIO_ICONS[i]
              return (
                <Rise key={title} delay={(i % 2) * 0.06}>
                  <div className="flex gap-3">
                    <Icon className="mt-1 w-5 h-5 shrink-0 text-[#C9971F]" aria-hidden="true" />
                    <div>
                      <h3 className="font-body font-semibold text-[#1C1710]">{title}</h3>
                      <p className="mt-1 font-body text-sm leading-relaxed text-[#4A4438]">{body}</p>
                    </div>
                  </div>
                </Rise>
              )
            })}
          </div>
        </div>
        <Rise delay={0.1}>
          <div className="space-y-5">
            <img src={`${IMG}/studio-dashboard.jpg`} alt="The studio dashboard: cameras online, photo counts and the event's QR code" loading="lazy"
              width="1440" height="900" className="w-full rounded-xl border border-black/10 shadow-xl shadow-black/10" />
            <img src={`${IMG}/studio-analytics.jpg`} alt="Guest activity: people, QR scans, photo views and downloads per hour" loading="lazy"
              width="1440" height="900" className="w-full rounded-xl border border-black/10 shadow-xl shadow-black/10 lg:ml-10 lg:w-[90%]" />
          </div>
        </Rise>
      </div>
    </section>
  )
})

const COUPLE_ICONS = [FiLock, FiHeart, FiDownload, FiUsers]
const GUEST_ICONS = [FiSmartphone, FiWifi, FiDownload, FiLock]

function BenefitList({ items, icons }) {
  return (
    <ul className="space-y-5">
      {items.map(({ title, body }, i) => {
        const Icon = icons[i]
        return (
          <li key={title} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9971F]/10 text-[#C9971F]"><Icon className="w-4 h-4" /></span>
            <div>
              <h3 className="font-body font-semibold text-[#1C1710]">{title}</h3>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#4A4438]">{body}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export const InstantMemoriesForCouples = memo(function InstantMemoriesForCouples() {
  return (
    <section id="for-couples" className="relative py-20 lg:py-28 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid gap-12 md:grid-cols-[1fr_260px] md:items-center lg:gap-20">
        <Rise>
          <Eyebrow>For couples</Eyebrow>
          <h2 className="font-display italic text-3xl sm:text-4xl text-[#1C1710] mb-8">Your photos, your way</h2>
          <BenefitList items={IM_FOR_COUPLES} icons={COUPLE_ICONS} />
        </Rise>
        <Rise delay={0.1} className="mx-auto w-full max-w-[260px]">
          <Phone src={`${IMG}/couple-portal.jpg`} alt="The couple's private portal with album picks and download buttons" />
        </Rise>
      </div>
    </section>
  )
})

export const InstantMemoriesForGuests = memo(function InstantMemoriesForGuests() {
  return (
    <section id="for-guests" className="relative py-20 lg:py-28 bg-white scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid gap-12 md:grid-cols-[260px_1fr] md:items-center lg:gap-20">
        <Rise className="md:order-2">
          <Eyebrow>For guests</Eyebrow>
          <h2 className="font-display italic text-3xl sm:text-4xl text-[#1C1710] mb-8">Scan, watch, keep</h2>
          <BenefitList items={IM_FOR_GUESTS} icons={GUEST_ICONS} />
        </Rise>
        <Rise delay={0.1} className="mx-auto w-full max-w-[260px] md:order-1">
          <Phone src={`${IMG}/guest-viewer.jpg`} alt="A guest viewing a wedding photo full screen, with Download and Request removal buttons" />
        </Rise>
      </div>
    </section>
  )
})

export const InstantMemoriesPrivacy = memo(function InstantMemoriesPrivacy() {
  return (
    <section id="privacy" className="relative py-20 lg:py-24 bg-[#1C1710] text-white scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <Rise className="max-w-2xl">
          <Eyebrow light>Privacy & security</Eyebrow>
          <h2 className="font-display italic text-3xl sm:text-4xl">Families trust you with these moments</h2>
          <p className="mt-4 font-body text-white/75 leading-relaxed">
            Weddings are full of people who never signed up for anything. Instant Memories is built so their photos stay
            within the family and friends who have the QR code.
          </p>
        </Rise>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {IM_PRIVACY.map((line, i) => (
            <Rise key={line} delay={(i % 2) * 0.06}>
              <li className="flex h-full gap-3 rounded-xl border border-white/10 bg-white/5 p-5 font-body text-sm leading-relaxed text-white/85">
                <FiLock className="mt-0.5 w-4 h-4 shrink-0 text-[#E3C46F]" aria-hidden="true" />{line}
              </li>
            </Rise>
          ))}
        </ul>
        <p className="mt-8 font-body text-sm text-white/60">
          Full privacy notice: <a href="https://live.mcreatik.com/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">live.mcreatik.com/privacy</a>
        </p>
      </div>
    </section>
  )
})

export const InstantMemoriesCTA = memo(function InstantMemoriesCTA() {
  return (
    <section id="get-started" className="relative py-20 lg:py-28 bg-white scroll-mt-28">
      <Rise className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <FiImage className="mx-auto w-8 h-8 text-[#C9971F]" aria-hidden="true" />
        <h2 className="mt-4 font-display italic text-3xl sm:text-4xl text-[#1C1710]">See it live in ten minutes</h2>
        <p className="mt-4 font-body text-[#4A4438] leading-relaxed">
          Pricing depends on how many events you shoot — per event or a monthly package. Message us for a quick demo on
          your phone and a quote for your studio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={demoHref} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1C1710] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <FiMessageCircle className="w-4 h-4" /> WhatsApp for a demo
          </a>
          <a href="mailto:connect@mcreatik.com?subject=Instant%20Memories%20demo"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#C9971F] px-6 py-3 text-sm font-semibold text-[#C9971F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C9971F] hover:text-white">
            <FiMail className="w-4 h-4" /> connect@mcreatik.com
          </a>
        </div>
        <p className="mt-6 font-body text-sm text-[#6B6354]">
          Getting married? <Link to="/studios#book" className="font-medium text-[#C9971F] underline underline-offset-4">Book McreatiK Studios</Link> and ask for Instant Memories.
        </p>
      </Rise>
    </section>
  )
})

