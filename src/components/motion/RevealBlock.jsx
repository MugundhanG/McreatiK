/* ============================================
   RevealBlock
   Wipes a block into view with a clip-path
   mask (bottom → top by default) plus a small
   rise. Works on anything — images, cards,
   gradient-clipped headings — since nothing
   inside gets split or individually moved.

   direction: 'up' | 'left' | 'right'
   ============================================ */

import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

const HIDDEN = {
  up: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

const RevealBlock = memo(function RevealBlock({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 1,
  as = 'div',
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      initial={{ clipPath: HIDDEN[direction] ?? HIDDEN.up, y: direction === 'up' ? 24 : 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
})

export default RevealBlock
