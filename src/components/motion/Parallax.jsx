/* ============================================
   Parallax
   Drifts its children vertically as the block
   scrolls through the viewport — `speed` is the
   total travel in px (positive = moves up
   slower than the page, negative = faster).

   For images, put an oversized image inside an
   overflow-hidden frame and parallax the image
   (see `ParallaxImage`) so no edges ever show.
   ============================================ */

import React, { memo, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export const Parallax = memo(function Parallax({ children, speed = 60, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed / 2, -speed / 2])

  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  )
})

/* Image locked inside a frame, drifting within it. The image is scaled
   up just enough that `strength` px of travel never exposes an edge. */
export const ParallaxImage = memo(function ParallaxImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  strength = 80,
  loading = 'lazy',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-strength / 2, strength / 2])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`absolute left-0 w-full object-cover ${imgClassName}`}
        style={
          reduce
            ? { top: 0, height: '100%' }
            : { y, top: -strength / 2, height: `calc(100% + ${strength}px)` }
        }
      />
    </div>
  )
})

export default Parallax
