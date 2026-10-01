/* ============================================
   Magnetic
   Wrap a CTA so it leans toward the cursor while
   hovered and springs back on leave. `strength`
   is the fraction of the cursor offset applied
   (0.3 = subtle). Inert on touch devices and
   with reduced motion on.
   ============================================ */

import React, { memo, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import useFinePointer from './useFinePointer'

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 }

const Magnetic = memo(function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)

  if (!fine || reduce) {
    return <span className={`inline-block ${className}`}>{children}</span>
  }

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  )
})

export default Magnetic
