/* ============================================
   Hero Section — Tech & Creative (light theme)
   Text left; right is DemoShowcase — real website
   concepts cycling through a browser window and a
   phone. Below the CTAs, proof stats a visitor can
   verify on /tech/demos (no unverifiable claims).
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { TECH_STATS } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import { motion, useReducedMotion } from 'framer-motion'
import { FiGlobe } from 'react-icons/fi'
import { CountUp, Magnetic, RevealText } from '../motion'
import DemoShowcase from '../tech/DemoShowcase'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'd like a free consultation for my business.")

const EASE = [0.22, 1, 0.36, 1]

/* Proof strip: three tiles that rise in one after another; numbers count
   up, a signal-blue rule draws under each, and "Global" gets a slowly
   turning globe. Every value is checkable on /tech/demos. */
function HeroStats() {
  const reduce = useReducedMotion()
  return (
    <dl className="mt-12 grid grid-cols-3 gap-2.5 sm:mt-14 sm:gap-4">
      {TECH_STATS.map((stat, i) => {
        const numeric = /^\d+$/.test(stat.value)
        const delay = 0.75 + i * 0.12
        return (
          <motion.div
            key={stat.label}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: EASE }}
            whileHover={reduce ? undefined : { y: -4 }}
            className="group relative flex flex-col-reverse overflow-hidden rounded-xl border border-stone-200 bg-white px-3 py-3.5 shadow-[0_1px_0_rgba(20,22,28,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[#1E4FD9]/40 hover:shadow-[0_14px_30px_-14px_rgba(30,79,217,0.35)] sm:px-5 sm:py-4"
          >
            <dt className="mt-1 text-[11px] leading-snug text-stone-500 sm:text-xs">{stat.label}</dt>
            <dd className="flex min-h-[2.5rem] items-center gap-1.5 font-display text-2xl font-bold tabular-nums tracking-tight text-stone-900 sm:text-[2rem]">
              {numeric ? (
                <CountUp value={Number(stat.value)} delay={delay + 0.15} />
              ) : (
                <>
                  <motion.span
                    aria-hidden="true"
                    className="inline-flex text-[#1E4FD9]"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiGlobe className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.span>
                  {/* A word, not a number — sized down so it fits the tile */}
                  <span className="text-xl sm:text-2xl">{stat.value}</span>
                </>
              )}
            </dd>

            {/* Signal rule — draws in under the number */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-[#1E4FD9] to-[#1E4FD9]/30"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: delay + 0.2, ease: EASE }}
            />
          </motion.div>
        )
      })}
    </dl>
  )
}

const Hero = memo(function Hero() {
  return (
    <section className="relative isolate overflow-x-clip bg-white">
      <div className="max-w-7xl mx-auto grid items-center gap-14 px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 lg:grid-cols-[1fr_1.1fr]">
        {/* ===== LEFT — Copy ===== */}
        <div className="relative z-10">
          <div
            className="mth-reveal inline-flex flex-col gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_0_0_1px_rgba(10,10,10,0.10)]"
            style={{ animationDelay: '0.05s' }}
          >
            <span className="text-stone-900">Modern websites &amp; branding for</span>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-stone-600">
              {['Businesses', 'Professionals', 'Small & Local Brands'].map((audience) => (
                <li key={audience} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E4FD9]" aria-hidden="true" />
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          <RevealText
            as="h1"
            animateOnMount
            delay={0.15}
            text="Build a stronger digital presence for your business"
            accent={['digital', 'presence']}
            accentClassName="text-[#1E4FD9]"
            className="mt-8 max-w-[22ch] text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl"
          />

          <p
            className="mth-reveal mt-6 max-w-[48ch] text-pretty text-base text-stone-600 sm:text-lg"
            style={{ animationDelay: '0.45s' }}
          >
            Modern websites, branding, and digital design that help businesses
            look professional online — and get more customers. Wherever you are.
          </p>

          <div className="mth-reveal mt-9 flex flex-wrap items-center gap-6" style={{ animationDelay: '0.55s' }}>
            <Magnetic>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-800"
              >
                <FaWhatsapp className="w-4 h-4" /> Get a Free Consultation
              </a>
            </Magnetic>
            <Link
              to="/tech/demos"
              className="text-sm font-semibold text-stone-900 transition-colors duration-150 hover:text-[#1E4FD9]"
            >
              Browse live demos <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <HeroStats />
        </div>

        {/* ===== RIGHT — Live website concepts ===== */}
        <div className="mth-reveal" style={{ animationDelay: '0.3s' }}>
          <DemoShowcase />
        </div>
      </div>
    </section>
  )
})

export default Hero
