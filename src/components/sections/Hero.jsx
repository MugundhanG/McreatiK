/* ============================================
   Hero Section — Tech & Creative (light theme)
   Text left; right is a WebGPU shader panel (the
   `shaders` library: a hidden ChromaFlow fluid sim
   drives a ColorWheel's hue angle through the
   library's built-in "map" prop driver) in a slow
   flowing blue gradient — the same signal-blue used
   in the site's CTAs — with two floating glass cards
   and a stat chip layered on top.
   ============================================ */

import React, { memo, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { TECH_STATS, TECH_TARGET_INDUSTRIES } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'

const TechHeroShaderPanel = lazy(() => import('./TechHeroShaderPanel'))

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'd like a free consultation for my business.")

const Hero = memo(function Hero() {
  return (
    <>
      <section className="relative isolate overflow-x-clip bg-white">
        <div className="max-w-7xl mx-auto grid items-center gap-16 px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 lg:grid-cols-2">
          {/* ===== LEFT — Copy ===== */}
          <div className="relative z-10">
            <p
              className="mth-reveal inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium shadow-[0_0_0_1px_rgba(10,10,10,0.10)]"
              style={{ animationDelay: '0.05s' }}
            >
              <span className="rounded-full bg-[#1E4FD9]/10 px-2 py-0.5 text-xs font-semibold text-[#1E4FD9]">
                New
              </span>
              Modern websites &amp; branding for local businesses
            </p>

            <h1
              className="mth-reveal mt-8 max-w-[22ch] text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '0.12s' }}
            >
              Build a stronger <span className="text-[#1E4FD9]">digital presence</span> for your business
            </h1>

            <p
              className="mth-reveal mt-6 max-w-[48ch] text-pretty text-base text-stone-600 sm:text-lg"
              style={{ animationDelay: '0.2s' }}
            >
              Modern websites, branding, and digital design that help local businesses
              look professional online — and get more customers.
            </p>

            <div className="mth-reveal mt-9 flex flex-wrap items-center gap-6" style={{ animationDelay: '0.28s' }}>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1E4FD9] focus-visible:outline-offset-2"
              >
                <FaWhatsapp className="w-4 h-4" /> Get a Free Consultation
              </a>
              <Link
                to="/tech/services"
                className="text-sm font-semibold text-stone-900 transition-colors duration-150 hover:text-[#1E4FD9]"
              >
                View Our Services <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <dl
              className="mth-reveal mt-14 flex flex-col gap-4 text-sm sm:flex-row sm:gap-0"
              style={{ animationDelay: '0.36s' }}
            >
              {TECH_STATS.map((stat, i) => (
                <div key={stat.label} className={i === 0 ? 'sm:pr-8' : 'sm:border-l sm:border-black/10 sm:px-8'}>
                  <dt className="text-stone-500">{stat.label}</dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ===== RIGHT — Shader panel + glass cards ===== */}
          <div className="mth-reveal relative h-100 sm:h-120 lg:h-140" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-y-0 left-4 right-0 rotate-3 overflow-hidden rounded-[2rem] bg-[#1E4FD9] shadow-2xl shadow-[#1E4FD9]/20 lg:-right-16 lg:rotate-6">
              <Suspense fallback={null}>
                <TechHeroShaderPanel />
              </Suspense>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 70% 50% at 25% 10%, rgba(255,255,255,0.35), transparent 65%)',
                }}
              />
            </div>

            {/* Glass card — project health */}
            <div className="mth-float-a absolute top-10 left-0 w-72 rounded-2xl bg-white/70 p-5 shadow-xl shadow-black/10 ring-1 ring-white/60 backdrop-blur-[24px] sm:top-16">
              <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
                <span>Performance score</span>
                <span className="flex items-center gap-1.5 text-[#1E4FD9]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E4FD9]" />
                  Live
                </span>
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-neutral-950">
                98<span className="text-lg text-neutral-400">.2</span>
              </p>
              <p className="text-sm font-medium text-[#1E4FD9]">+14 pts this sprint</p>
              <div className="mt-4 flex justify-between border-t border-black/5 pt-4 text-sm">
                <span className="text-neutral-500">Pages delivered</span>
                <span className="font-medium tabular-nums text-neutral-950">12/12</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-neutral-500">Auto-backups</span>
                <span className="font-medium text-[#1E4FD9]">On</span>
              </div>
            </div>

            {/* Glass card — enquiry toast */}
            <div className="mth-float-b absolute bottom-16 right-0 w-64 rounded-xl bg-white/80 p-4 shadow-lg shadow-black/10 ring-1 ring-white/60 backdrop-blur-[24px] sm:bottom-24 sm:right-6">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1E4FD9]" />
                <div className="text-sm">
                  <p className="font-bold text-neutral-950">New enquiry received</p>
                  <p className="text-neutral-500">WhatsApp &middot; Local Dental Clinic</p>
                  <p className="mt-0.5 text-xs text-neutral-400">Just now</p>
                </div>
              </div>
            </div>

            {/* Stat chip */}
            <div className="absolute bottom-4 left-8 rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold tabular-nums text-white sm:bottom-8">
              99% &middot; client satisfaction
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust strip — industries served ===== */}
      <section
        aria-label="Industries"
        className="mth-reveal max-w-7xl mx-auto border-t border-black/5 px-4 py-10 sm:px-6 lg:px-8"
        style={{ animationDelay: '0.45s' }}
      >
        <div className="flex flex-wrap items-baseline gap-x-12 gap-y-4 text-stone-400">
          <p className="text-sm">Built for businesses across</p>
          {TECH_TARGET_INDUSTRIES.slice(0, 5).map((industry, i) => (
            <span key={industry.title} className={`font-semibold ${i === 4 ? 'hidden sm:inline' : ''}`}>
              {industry.title}
            </span>
          ))}
        </div>
      </section>
    </>
  )
})

export default Hero
