/* ============================================
   Experience Page — Studios
   What clients can expect: the shoot process as
   a vertical rail, plus real client testimonials
   (STUDIOS_TESTIMONIALS in constants.js) - no
   invented quotes or names, ever.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { STUDIOS_EXPERIENCE_STEPS, STUDIOS_TESTIMONIALS } from '../../utils/constants'
import { RevealText, ScrollLine } from '../motion'

function ProcessSteps() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">What to expect</p>
          <RevealText as="h2" text="The Process" className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]" />
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">
            From your first message to the final delivery — here's how a shoot with us usually goes.
          </p>
        </motion.div>

        <div className="relative pl-6">
          <ScrollLine className="absolute top-1 bottom-1 left-0 w-px" trackClassName="bg-black/10" fillClassName="bg-[#C9971F]" />
          <div className="space-y-10">
            {STUDIOS_EXPERIENCE_STEPS.map(({ icon: Icon, step, title, description }, index) => (
              <motion.div
                key={step}
                className="relative"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className="absolute -left-9 top-0 w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#C9971F]/40 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#C9971F]" />
                </div>
                <span className="font-mono-label text-xs text-[#8B2E2A]">{step}</span>
                <h3 className="font-display text-lg text-[#1C1710] mt-1 mb-1.5">{title}</h3>
                <p className="font-body text-sm text-[#6B6153] leading-relaxed max-w-xl">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const ROTATE_MS = 8000
const EASE = [0.22, 1, 0.36, 1]

/* One quote at a time, set large as an editorial pull-quote. Rotates on
   its own (with a progress bar showing time to the next), pauses while
   hovered, and can be stepped with the arrows or the dots. Reduced
   motion: no autoplay. Only real client words — never invented ones. */
function Testimonials() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = STUDIOS_TESTIMONIALS.length
  const t = STUDIOS_TESTIMONIALS[index]
  const autoplay = !reduce && !paused && count > 1

  useEffect(() => {
    if (!autoplay) return undefined
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), ROTATE_MS)
    return () => clearTimeout(id)
  }, [index, autoplay, count])

  const go = (dir) => setIndex((i) => (i + dir + count) % count)

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 bg-[#F3EEE3] overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">In their words</p>
            <RevealText as="h2" text="What Clients Say" className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]" />
          </div>
          {count > 1 && (
            <div className="flex gap-2">
              {[[-1, FiArrowLeft, 'Previous'], [1, FiArrowRight, 'Next']].map(([dir, Icon, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(dir)}
                  aria-label={`${label} testimonial`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1C1710]/15 text-[#1C1710] transition-colors hover:border-[#C9971F] hover:bg-[#C9971F] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <div
          className="relative"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          {/* Oversized quote mark as a background ornament */}
          <span aria-hidden="true" className="pointer-events-none absolute -left-2 -top-16 font-display italic text-[12rem] leading-none text-[#C9971F]/15 select-none">
            &ldquo;
          </span>

          <div aria-live="polite" className="relative min-h-[260px] sm:min-h-[220px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <blockquote className="font-display italic text-2xl leading-snug text-[#1C1710] sm:text-3xl lg:text-[2.1rem]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-[#C9971F]" />
                  <span className="font-body font-semibold text-[#1C1710]">{t.name}</span>
                  <span className="font-mono-label text-[11px] uppercase text-[#6B6153]">{t.shootType}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-10 flex gap-2" role="group" aria-label="Choose a testimonial">
              {STUDIOS_TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-pressed={i === index}
                  className="relative h-1 w-16 overflow-hidden rounded-full bg-[#1C1710]/10"
                >
                  {/* The active bar fills over the time until the next quote */}
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-[#C9971F]"
                      initial={{ width: autoplay ? '0%' : '100%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: autoplay ? ROTATE_MS / 1000 : 0, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const StudiosExperience = memo(function StudiosExperience() {
  return (
    <>
      <ProcessSteps />
      <Testimonials />
    </>
  )
})

export default StudiosExperience
