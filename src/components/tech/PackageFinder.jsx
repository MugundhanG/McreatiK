/* ============================================
   PackageFinder — Tech
   Three quick questions that point a visitor at
   one of the TECH_PACKAGES tiers, with its real
   price and a WhatsApp message pre-filled with
   their answers. Each answer is scored 0–2 (the
   tier it implies); the recommendation is the
   highest tier any answer needs.

   onRecommend(name) lets the Packages section
   highlight the matching card below.
   ============================================ */

import React, { memo, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowDown, FiRotateCcw } from 'react-icons/fi'
import { TECH_PACKAGES } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'

export const FINDER_QUESTIONS = [
  {
    id: 'pages',
    question: 'How big is your site?',
    options: ['Up to 5 pages', 'Around 8–10 pages', 'Up to 15 pages'],
  },
  {
    id: 'goal',
    question: 'What matters most?',
    options: ['Look credible & get found', 'Bring in more enquiries', 'A premium, custom feel'],
  },
  {
    id: 'features',
    question: 'Any special features?',
    options: ['No, keep it simple', 'Gallery, FAQ, testimonials', 'Catalogue & advanced forms'],
  },
]

/* Highest tier any answer calls for, or null until something is picked */
export function recommendTier(answers) {
  const picked = Object.values(answers)
  return picked.length ? Math.max(...picked) : null
}

const EASE = [0.22, 1, 0.36, 1]

const PackageFinder = memo(function PackageFinder({ onRecommend }) {
  const [answers, setAnswers] = useState({})
  const tier = recommendTier(answers)
  const pkg = tier === null ? null : TECH_PACKAGES[tier]
  const complete = Object.keys(answers).length === FINDER_QUESTIONS.length

  const choose = (id, value) => {
    const next = { ...answers, [id]: value }
    setAnswers(next)
    onRecommend?.(TECH_PACKAGES[recommendTier(next)].name)
  }

  const reset = () => {
    setAnswers({})
    onRecommend?.(null)
  }

  const whatsappHref = useMemo(() => {
    if (!pkg) return null
    const lines = FINDER_QUESTIONS.filter((q) => answers[q.id] !== undefined).map(
      (q) => `• ${q.question} ${q.options[answers[q.id]]}`,
    )
    return getWhatsAppHref(
      `Hi McreatiK, the package finder suggested the ${pkg.name} package (${pkg.price}) for me.\n${lines.join('\n')}`,
    )
  }, [answers, pkg])

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#1E4FD9]">Package finder</p>
          <h3 className="mt-1 font-display text-xl font-bold text-stone-900 sm:text-2xl">Not sure which fits? Answer three questions.</h3>
        </div>
        {tier !== null && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 transition-colors hover:text-stone-900"
          >
            <FiRotateCcw className="h-3.5 w-3.5" /> Start over
          </button>
        )}
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-3">
        {FINDER_QUESTIONS.map((q) => (
          <fieldset key={q.id}>
            <legend className="mb-3 text-sm font-semibold text-stone-900">{q.question}</legend>
            <div className="flex flex-col gap-2">
              {q.options.map((label, value) => {
                const active = answers[q.id] === value
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(q.id, value)}
                    className={`relative rounded-lg border px-4 py-2.5 text-left text-sm transition-colors duration-200 ${
                      active
                        ? 'border-[#1E4FD9] text-[#1E4FD9]'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`finder-pill-${q.id}`}
                        className="absolute inset-0 rounded-lg bg-[#1E4FD9]/[0.06]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* Result — slides open once anything is picked, updates live */}
      <AnimatePresence initial={false}>
        {pkg && (
          <motion.div
            key="result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              className="mt-7 flex flex-col gap-5 rounded-xl bg-[#14161C] p-6 text-white sm:flex-row sm:items-center sm:justify-between"
              aria-live="polite"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <p className="font-mono-label text-xs uppercase tracking-wider text-white/50">
                    {complete ? 'Our suggestion' : 'So far, we’d suggest'}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold">
                    {pkg.name} <span className="text-white/50">·</span> {pkg.displayName}
                  </p>
                  <p className="mt-1 text-white/70">
                    <span className="text-xl font-semibold text-white">{pkg.price}</span> one-time
                    <span className="ml-2 text-sm text-white/50">{pkg.priceUSD} USD</span>
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`#package-${pkg.name.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  See what’s included <FiArrowDown className="h-4 w-4" />
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb957]"
                >
                  <FaWhatsapp className="h-4 w-4" /> Discuss this on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default PackageFinder
