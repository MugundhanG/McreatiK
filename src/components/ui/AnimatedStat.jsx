/* ============================================
   AnimatedStat
   Counts a stat value up from 0 once it scrolls
   into view. All instances share one fixed
   duration so stats with very different
   magnitudes (2 vs 100,000) still land at the
   same moment instead of the smaller ones
   finishing early.
   ============================================ */

import React, { memo, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const DURATION_MS = 1800

/* Splits "1,00,000+" into a numeric target (100000) and
   a trailing suffix ("+") to re-append after counting up. */
function parseStat(value) {
  const match = String(value).match(/^([\d,]+)(.*)$/)
  if (!match) return { target: null, suffix: value }
  return { target: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] }
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const AnimatedStat = memo(function AnimatedStat({ value }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const { target, suffix } = parseStat(value)
  const [display, setDisplay] = useState(target === null ? value : '0')

  useEffect(() => {
    if (!isInView || target === null) return
    let raf
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1)
      const current = Math.round(easeOutCubic(progress) * target)
      setDisplay(current.toLocaleString('en-IN'))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, target])

  return <span ref={ref}>{display}{target !== null ? suffix : ''}</span>
})

export default AnimatedStat
