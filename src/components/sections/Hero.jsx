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
import { Magnetic, RevealText } from '../motion'
import DemoShowcase from '../tech/DemoShowcase'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'd like a free consultation for my business.")

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

          <dl
            className="mth-reveal mt-12 grid grid-cols-3 gap-4 text-sm sm:mt-14 sm:flex sm:gap-0"
            style={{ animationDelay: '0.65s' }}
          >
            {TECH_STATS.map((stat, i) => (
              <div key={stat.label} className={i === 0 ? 'sm:pr-8' : 'sm:border-l sm:border-black/10 sm:px-8'}>
                <dt className="text-stone-500">{stat.label}</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
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
