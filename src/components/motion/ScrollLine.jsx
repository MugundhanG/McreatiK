/* ============================================
   ScrollLine
   A progress rule that draws itself as its
   parent section scrolls past — for process
   rails, timelines, and step lists. Place it
   absolutely inside a `relative` container;
   it fills along that container's length.

   orientation: 'vertical' | 'horizontal'
   ============================================ */

import React, { memo, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

const ScrollLine = memo(function ScrollLine({
  orientation = 'vertical',
  className = '',
  trackClassName = 'bg-current opacity-15',
  fillClassName = 'bg-current',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 50%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const vertical = orientation === 'vertical'

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className={`absolute inset-0 ${trackClassName}`} />
      <motion.div
        className={`absolute inset-0 ${fillClassName} ${vertical ? 'origin-top' : 'origin-left'}`}
        style={reduce ? undefined : vertical ? { scaleY: progress } : { scaleX: progress }}
      />
    </div>
  )
})

export default ScrollLine
