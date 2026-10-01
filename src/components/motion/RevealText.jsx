/* ============================================
   RevealText
   Signature headline entrance: each word rises
   out of its own clipping mask, staggered, the
   first time the text scrolls into view.

   Pass plain text as `text`. `as` picks the
   element (h1/h2/p…). Screen readers get the
   whole string once via sr-only text — the split
   word spans are aria-hidden.

   Not for gradient-clipped text (background-
   clip: text breaks under per-word transforms) —
   use RevealBlock for those instead.
   ============================================ */

import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

const RevealText = memo(function RevealText({
  text,
  as = 'h2',
  className = '',
  delay = 0,
  stagger = 0.06,
  once = true,
  accent = [],
  accentClassName = '',
  animateOnMount = false,
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.h2
  const words = String(text).split(' ')
  /* `accent` lists words (exact match, punctuation included) to tint */
  const isAccent = (w) => accent.includes(w)

  if (reduce) {
    const Plain = as
    return (
      <Plain className={className}>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            {isAccent(w) ? <span className={accentClassName}>{w}</span> : w}
            {i < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </Plain>
    )
  }

  /* Above-the-fold headlines animate on mount; the rest wait for scroll */
  const trigger = animateOnMount
    ? { animate: 'visible' }
    : { whileInView: 'visible', viewport: { once, margin: '-60px' } }

  return (
    <Tag
      className={className}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {/* The readable copy for screen readers (aria-label is ignored on
          plain spans); the animated word masks below are aria-hidden. */}
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
          >
            <motion.span
              className={`inline-block will-change-transform ${isAccent(word) ? accentClassName : ''}`}
              variants={{
                hidden: { y: '110%' },
                visible: { y: '0%', transition: { duration: 0.8, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* A real space between masks, so the line can still wrap here */}
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </Tag>
  )
})

export default RevealText
