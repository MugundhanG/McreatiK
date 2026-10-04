/* ============================================
   TechDemosPage — "Website Concepts" showcase
   Browsable gallery of the approved industry demo
   sites, filterable by industry (kept in the URL
   as ?industry=), so prospects can see a concept
   close to their own business and open it live.
   ============================================ */

import React, { useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import TechPageShell from '../components/layout/TechPageShell'
import DemoConceptCard from '../components/ui/DemoConceptCard'
import RegMark from '../components/ui/RegMark'
import { setFavicon } from '../utils/setFavicon'
import { useSEO } from '../hooks/useSEO'
import { seoFor } from '../seo/routes'
import { getWhatsAppHref } from '../utils/whatsapp'
import { DEMO_INDUSTRIES, DEMO_CONCEPTS } from '../data/demoConcepts'

const ALL_FILTER = 'all'

const HERO_WHATSAPP_HREF = getWhatsAppHref(
  "Hi McreatiK, I browsed your website concepts and I'd like one built for my business."
)
const CLOSING_WHATSAPP_HREF = getWhatsAppHref(
  "Hi McreatiK, I didn't see my industry among your website concepts — can we design one from scratch?"
)

function FilterPill({ label, count, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`relative shrink-0 overflow-hidden whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4FD9] ${
        isActive
          ? 'border-transparent text-white'
          : 'border-stone-200 bg-white text-stone-600 hover:border-[#1E4FD9]/40 hover:text-[#1E4FD9]'
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="tech-demos-filter-pill"
          className="absolute inset-0 rounded-full bg-[#1E4FD9]"
          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{label} <span className={isActive ? 'text-white/70' : 'text-stone-400'}>({count})</span></span>
    </button>
  )
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96 },
}

function TechDemosPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawIndustry = searchParams.get('industry')
  const activeIndustry = DEMO_INDUSTRIES.some((ind) => ind.id === rawIndustry) ? rawIndustry : ALL_FILTER

  useSEO(seoFor('/tech/demos'))

  useEffect(() => {
    setFavicon('/favicon-tech.png')
  }, [])

  const counts = useMemo(() => {
    const byIndustry = {}
    for (const concept of DEMO_CONCEPTS) {
      byIndustry[concept.industry] = (byIndustry[concept.industry] || 0) + 1
    }
    return byIndustry
  }, [])

  const filteredConcepts = useMemo(() => {
    if (activeIndustry === ALL_FILTER) return DEMO_CONCEPTS
    return DEMO_CONCEPTS.filter((concept) => concept.industry === activeIndustry)
  }, [activeIndustry])

  const activeDescription =
    activeIndustry === ALL_FILTER
      ? `${DEMO_CONCEPTS.length} concepts across ${DEMO_INDUSTRIES.length} industries — pick one close to your business and see it live.`
      : DEMO_INDUSTRIES.find((ind) => ind.id === activeIndustry)?.description

  const selectIndustry = useCallback(
    (id) => {
      if (id === ALL_FILTER) {
        setSearchParams({}, { replace: false })
      } else {
        setSearchParams({ industry: id }, { replace: false })
      }
    },
    [setSearchParams]
  )

  return (
    <TechPageShell>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-white pb-16 pt-28 sm:pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(30,79,217,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,79,217,0.08) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[#1E4FD9]/50" />
            <span className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#1E4FD9]">
              Website Concepts
            </span>
            <span className="h-px w-8 bg-[#1E4FD9]/50" />
          </div>
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Websites built for <span className="text-[#1E4FD9]">your industry</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-stone-600 sm:text-lg">
            Real, fully-built websites across {DEMO_INDUSTRIES.length} industries, from clinics and
            coaching centres to restaurants, real estate and manufacturers. Find one close to your
            business and open it live.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-stone-500">
            <span className="tabular-nums text-stone-900">{DEMO_CONCEPTS.length} concepts</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums text-stone-900">{DEMO_INDUSTRIES.length} industries</span>
          </div>

          <div className="mt-8">
            <a
              href={HERO_WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1E4FD9] px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-sm shadow-[#1E4FD9]/25 transition-colors duration-300 hover:bg-[#1840b8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4FD9]"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Get one for your business
            </a>
          </div>
        </div>
      </section>

      {/* ===== Filters ===== */}
      <div className="sticky top-[65px] z-20 border-y border-stone-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Phones: one swipeable row, with a right-edge fade hinting there's more.
              md+: wrap onto as many rows as needed so every industry is visible. */}
          <div role="group" aria-label="Filter concepts by industry" className="flex gap-2 overflow-x-auto pb-0.5 pr-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_85%,transparent)] md:flex-wrap md:overflow-visible md:pr-0 md:[mask-image:none]">
            <FilterPill
              label="All"
              count={DEMO_CONCEPTS.length}
              isActive={activeIndustry === ALL_FILTER}
              onSelect={() => selectIndustry(ALL_FILTER)}
            />
            {DEMO_INDUSTRIES.map((ind) => (
              <FilterPill
                key={ind.id}
                label={ind.label}
                count={counts[ind.id] || 0}
                isActive={activeIndustry === ind.id}
                onSelect={() => selectIndustry(ind.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== Grid ===== */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.p
            key={activeIndustry}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10 max-w-2xl text-sm text-stone-600 sm:text-base"
          >
            {activeDescription}
          </motion.p>

          <motion.div
            layout
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredConcepts.map((concept) => (
                <motion.div
                  key={concept.slug}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                >
                  <DemoConceptCard concept={concept} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ===== Closing band ===== */}
      <section className="relative border-t border-stone-200 bg-stone-50 py-16 lg:py-20">
        <RegMark position="top-left" className="left-1/2 top-0 -translate-y-1/2" />
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
            Don&rsquo;t see your industry? We design from scratch.
          </h2>
          <p className="mt-3 text-stone-600">
            These concepts are a starting point — every website we build is shaped around your own business.
          </p>
          <div className="mt-7">
            <a
              href={CLOSING_WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#14161C]/15 px-7 py-3.5 text-sm font-semibold tracking-wide text-[#14161C] transition-colors duration-300 hover:border-[#1E4FD9] hover:text-[#1E4FD9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4FD9]"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Talk to us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </TechPageShell>
  )
}

export default TechDemosPage
