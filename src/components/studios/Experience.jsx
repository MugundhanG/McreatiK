/* ============================================
   Experience Page — Studios
   What clients can expect: the shoot process as
   a vertical rail, plus real client testimonials
   (STUDIOS_TESTIMONIALS in constants.js) - no
   invented quotes or names, ever.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
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

/* Enough cards per strip copy to fill a wide screen, however few quotes exist */
const MIN_CARDS_PER_COPY = 6

function QuoteCard({ quote, name, shootType, hidden }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="flex w-[19rem] shrink-0 flex-col rounded-2xl border border-[#1C1710]/10 bg-[#FAF7F0] p-6 shadow-[0_18px_40px_-28px_rgba(28,23,16,0.45)] transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#C9971F]/50 sm:w-[23rem] sm:p-7"
    >
      <span aria-hidden="true" className="font-display italic text-6xl leading-[0.6] text-[#C9971F]/40">&ldquo;</span>
      <blockquote className="mt-3 flex-1 font-body text-[15px] italic leading-relaxed text-[#4A4438]">{quote}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-[#1C1710]/10 pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9971F] font-display text-lg italic text-white">
          {name.charAt(0)}
        </span>
        <span>
          <span className="block font-body text-sm font-semibold text-[#1C1710]">{name}</span>
          <span className="block font-mono-label text-[10px] uppercase tracking-wide text-[#6B6153]">{shootType}</span>
        </span>
      </figcaption>
    </figure>
  )
}

/* Real client quotes drifting slowly sideways on the same marquee as the
   home page's proof strip; pauses on hover. Each strip copy repeats the
   quotes enough to fill the track; only the first appearance of each quote
   is exposed to screen readers, so every quote is announced once. Reduced
   motion: a still, swipeable row. Only real client words — never invented. */
function Testimonials() {
  const reps = Math.max(1, Math.ceil(MIN_CARDS_PER_COPY / STUDIOS_TESTIMONIALS.length))
  const cards = Array.from({ length: reps }, () => STUDIOS_TESTIMONIALS).flat()

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 bg-[#F3EEE3] overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">In their words</p>
          <RevealText as="h2" text="What Clients Say" className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]" />
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">Real feedback from real clients.</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="marquee-mask group/marquee overflow-hidden py-3 motion-reduce:overflow-x-auto"
      >
        <div className="flex w-max items-stretch marquee-left [animation-duration:70s] group-hover/marquee:[animation-play-state:paused]">
          {[0, 1].map((strip) => (
            <div key={strip} className="flex items-stretch gap-5 pr-5">
              {cards.map((t, i) => (
                <QuoteCard key={`${strip}-${i}`} {...t} hidden={strip === 1 || i >= STUDIOS_TESTIMONIALS.length} />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
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
