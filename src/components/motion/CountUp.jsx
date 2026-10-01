/* ============================================
   CountUp
   Counts a number up from 0. Built so a proof
   number can never be left showing "0":
   - the real value is what renders first (and
     what screen readers / no-JS ever see);
   - the count runs once the number is on
     screen (or immediately with `onMount`);
   - a timer forces the final value if the
     animation is ever starved of frames.
   Reduced motion: shows the final value.
   ============================================ */

import React, { memo, useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/* Module-level so the effect below doesn't re-run on every render */
const formatIN = (n) => Math.round(n).toLocaleString('en-IN')

const CountUp = memo(function CountUp({
  value,
  duration = 1.6,
  delay = 0,
  onMount = false,
  format = formatIN,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(() => format(value))
  const started = useRef(false)

  useEffect(() => {
    if (reduce || started.current || !(onMount || inView)) return undefined
    started.current = true
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      /* Drop to 0 only once the count actually starts (after `delay`) */
      onPlay: () => setDisplay(format(0)),
      onUpdate: (v) => setDisplay(format(v)),
      onComplete: () => setDisplay(format(value)),
    })
    /* Safety net: land on the real number no matter what */
    const failsafe = setTimeout(() => setDisplay(format(value)), (duration + delay) * 1000 + 600)
    return () => {
      controls.stop()
      clearTimeout(failsafe)
      /* Allow a restart (React dev mode mounts effects twice) */
      started.current = false
      setDisplay(format(value))
    }
  }, [inView, onMount, reduce, value, duration, delay, format])

  return (
    <span ref={ref} aria-label={format(value)}>
      <span aria-hidden="true">{display}</span>
    </span>
  )
})

export default CountUp
