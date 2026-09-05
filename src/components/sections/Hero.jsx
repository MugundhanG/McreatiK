/* ============================================
   Hero Section — Tech & Creative (light theme)
   Text left; right is a WebGPU shader panel (the
   `shaders` library: a hidden ChromaFlow fluid sim
   drives a ColorWheel's hue angle through the
   library's built-in "map" prop driver) in a slow
   flowing blue gradient — the same signal-blue used
   in the site's CTAs — with our services listed
   directly on it as a continuously scrolling ticker.
   ============================================ */

import React, { memo, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { TECH_STATS, TECH_TARGET_INDUSTRIES } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'

const TechHeroShaderPanel = lazy(() => import('./TechHeroShaderPanel'))

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'd like a free consultation for my business.")

const HERO_SERVICES_TICKER = [
  'Website Development',
  'Website Redesign',
  'Logo Design',
  'Business Card Design',
  'SEO Optimization',
  'WhatsApp Business Setup',
  'Resume Design & Makeover',
  'Landing Page Design',
]

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

          {/* ===== RIGHT — Shader panel with an animated services ticker ===== */}
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

              {/* Services — shown directly on the gradient as a vertical ticker */}
              <div className="absolute inset-0 flex flex-col p-8 sm:p-12">
                <p className="font-mono-label text-xs font-semibold uppercase text-white/70">Our Services</p>
                <p className="mt-1.5 font-display text-lg font-semibold text-white sm:text-xl">
                  What we build for you
                </p>
                <div className="mth-ticker-mask relative mt-6 flex-1 overflow-hidden">
                  <div className="mth-ticker absolute inset-x-0 top-0 flex flex-col">
                    {[...HERO_SERVICES_TICKER, ...HERO_SERVICES_TICKER].map((service, i) => (
                      <div key={`${service}-${i}`} className="flex items-center gap-3 py-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                          <FiCheck className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-base font-medium text-white sm:text-lg">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  to="/tech/services"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors duration-150 hover:text-white/80"
                >
                  View all services <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
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
