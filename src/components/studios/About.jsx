/* ============================================
   About Section — Studios
   The founding story, set against a collage of
   two real photographs that drift at different
   speeds as you scroll (parallax) — the story
   on one side, the work on the other.
   ============================================ */

import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Parallax, ParallaxImage, RevealText } from '../motion'
import coupleEmbraceMono from '../../assets/studios-hero/couple-embrace-mono.webp'
import shorelineWalk from '../../assets/studios-hero/shoreline-walk.webp'

const EASE = [0.22, 1, 0.36, 1]

/* Wipes a print in from `hidden`. The outer element is the one watched for
   "in view"; the clip lives on the inner one — a fully clipped element has
   no visible area and would never report as on screen. */
function ClipReveal({ hidden, delay = 0, className, children }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
      <motion.div
        className={className}
        variants={{
          hidden: { opacity: 0, clipPath: hidden },
          visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, delay, ease: EASE } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const StudiosAbout = memo(function StudiosAbout() {
  return (
    <section id="about" className="relative overflow-hidden py-24 lg:py-32 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* ===== Story ===== */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="font-mono-label text-xs uppercase text-[#C9971F] mb-5"
          >
            Our Story
          </motion.p>

          <RevealText
            as="h2"
            text="It started with one camera and a lot of curiosity."
            accent={['curiosity.']}
            accentClassName="text-[#C9971F]"
            className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710] leading-snug mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="font-body text-[#6B6153] leading-relaxed"
          >
            It began during the COVID quarantine, with one entry-level camera and a lot of
            free time. What started as a way to pass the time quickly became something more —
            the first spark of a genuine love for photography. Thousands of photos and countless
            hours of experimenting later, that curiosity turned into a clear direction. One day,
            that direction became a decision, and McreatiK Studios was born.
          </motion.p>

          {/* The closing line pulled out as an editorial pull-quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-8 border-l-2 border-[#C9971F] pl-5 font-display italic text-xl leading-snug text-[#1C1710] sm:text-2xl"
          >
            We&apos;re not here to just provide a service. We&apos;re here because we love being behind the
            camera — turning someone&apos;s moment into a memory they&apos;ll keep forever.
          </motion.blockquote>
        </div>

        {/* ===== Collage — two frames drifting at different speeds ===== */}
        <div className="relative mx-auto h-[440px] w-full max-w-md sm:h-[520px]" aria-hidden="true">
          <Parallax speed={50} className="absolute left-0 top-0 w-[68%]">
            <ClipReveal hidden="inset(0% 0% 100% 0%)" className="rotate-[-3deg] bg-white p-2.5 pb-10 shadow-[0_30px_60px_-25px_rgba(28,23,16,0.45)]">
              <div data-lens><ParallaxImage src={coupleEmbraceMono} className="aspect-[4/5]" strength={60} /></div>
            </ClipReveal>
          </Parallax>

          <Parallax speed={-90} className="absolute bottom-0 right-0 w-[58%]">
            <ClipReveal hidden="inset(100% 0% 0% 0%)" delay={0.2} className="rotate-[4deg] bg-white p-2.5 pb-10 shadow-[0_30px_60px_-25px_rgba(28,23,16,0.45)]">
              <div data-lens><ParallaxImage src={shorelineWalk} className="aspect-[4/5]" strength={60} /></div>
            </ClipReveal>
          </Parallax>

          <span className="absolute -bottom-2 left-4 font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#6B6153]">
            McreatiK Studios · Chennai
          </span>
        </div>
      </div>
    </section>
  )
})

export default StudiosAbout
