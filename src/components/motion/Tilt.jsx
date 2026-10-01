/* ============================================
   Tilt
   Gentle 3D tilt toward the cursor for cards,
   with an optional soft glare that follows the
   pointer. `max` is the tilt in degrees. Inert
   on touch devices and with reduced motion on.
   ============================================ */

import React, { memo, useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import useFinePointer from './useFinePointer'

const SPRING = { stiffness: 180, damping: 20, mass: 0.5 }

const Tilt = memo(function Tilt({
  children,
  max = 6,
  glare = true,
  className = '',
  wrapperClassName = '',
}) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING)
  const gx = useTransform(px, (v) => `${v * 100}%`)
  const gy = useTransform(py, (v) => `${v * 100}%`)
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.22), transparent 55%)`
  const glareOpacity = useSpring(0, SPRING)

  if (!fine || reduce) {
    return (
      <div className={wrapperClassName}>
        <div className={`relative ${className}`}>{children}</div>
      </div>
    )
  }

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    glareOpacity.set(0)
  }

  return (
    <div className={`[perspective:1000px] ${wrapperClassName}`}>
      <motion.div
        ref={ref}
        className={`relative [transform-style:preserve-3d] ${className}`}
        style={{ rotateX, rotateY }}
        onPointerMove={onMove}
        onPointerEnter={() => glareOpacity.set(1)}
        onPointerLeave={onLeave}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  )
})

export default Tilt
