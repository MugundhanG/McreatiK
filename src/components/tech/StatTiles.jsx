/* ============================================
   StatTiles — Tech
   The proof strip (TECH_STATS): three tiles that
   rise in one after another; numbers count up, a
   signal-blue rule draws under each, and "Global"
   gets a slowly turning globe. Every value is
   checkable on /tech/demos.

   onMount: play right away (above-the-fold hero)
   instead of when scrolled into view.
   delay:   seconds before the first tile starts.
   ============================================ */

import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiGlobe } from 'react-icons/fi'
import { TECH_STATS } from '../../utils/constants'
import { CountUp } from '../motion'

const EASE = [0.22, 1, 0.36, 1]

const StatTiles = memo(function StatTiles({ onMount = false, delay = 0, className = '' }) {
  const reduce = useReducedMotion()

  /* Same target state either way; only the trigger differs */
  const play = (to) =>
    onMount ? { animate: to } : { whileInView: to, viewport: { once: true, amount: 0.4 } }

  return (
    <dl className={`grid grid-cols-3 gap-2.5 sm:gap-4 ${className}`}>
      {TECH_STATS.map((stat, i) => {
        const numeric = /^\d+$/.test(stat.value)
        const d = delay + i * 0.12
        return (
          <motion.div
            key={stat.label}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            {...play({ opacity: 1, y: 0 })}
            transition={{ duration: 0.7, delay: d, ease: EASE }}
            whileHover={reduce ? undefined : { y: -4 }}
            className="group relative flex flex-col-reverse overflow-hidden rounded-xl border border-stone-200 bg-white px-3 py-3.5 shadow-[0_1px_0_rgba(20,22,28,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[#1E4FD9]/40 hover:shadow-[0_14px_30px_-14px_rgba(30,79,217,0.35)] sm:px-5 sm:py-4"
          >
            <dt className="mt-1 text-[11px] leading-snug text-stone-500 sm:text-xs">{stat.label}</dt>
            <dd className="flex min-h-[2.5rem] items-center gap-1.5 font-display text-2xl font-bold tabular-nums tracking-tight text-stone-900 sm:text-[2rem]">
              {numeric ? (
                <CountUp value={Number(stat.value)} delay={d + 0.15} />
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
              {...play({ scaleX: 1 })}
              transition={{ duration: 1.1, delay: d + 0.2, ease: EASE }}
            />
          </motion.div>
        )
      })}
    </dl>
  )
})

export default StatTiles
