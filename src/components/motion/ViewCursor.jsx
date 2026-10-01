/* ============================================
   ViewCursor
   A labelled cursor for media. Any element with
   data-cursor="View" (or "Open", "Play"…) swaps
   the system pointer for a soft circle carrying
   that word, which trails the pointer on a
   spring. Mount once per page shell; mark up
   targets with the attribute.

   Only on devices with a real mouse, and never
   with reduced motion — touch and keyboard users
   get the normal UI. The `has-view-cursor` class
   on <html> is what hides the system pointer
   (see index.css), so it's only ever hidden
   while this component is actually running.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import useFinePointer from './useFinePointer'

const SPRING = { stiffness: 380, damping: 32, mass: 0.4 }

const ViewCursor = memo(function ViewCursor({ color = '#C9971F' }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const active = fine && !reduce
  const [label, setLabel] = useState(null)
  const x = useSpring(useMotionValue(-100), SPRING)
  const y = useSpring(useMotionValue(-100), SPRING)

  useEffect(() => {
    if (!active) return undefined
    document.documentElement.classList.add('has-view-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      setLabel(target ? target.getAttribute('data-cursor') : null)
    }
    const onLeaveWindow = () => setLabel(null)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeaveWindow)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeaveWindow)
      document.documentElement.classList.remove('has-view-cursor')
    }
  }, [active, x, y])

  if (!active) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45]"
      style={{ x, y }}
    >
      <AnimatePresence>
        {label && (
          <motion.div
            key="cursor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            style={{ x: '-50%', y: '-50%', backgroundColor: color }}
            className="flex h-20 w-20 items-center justify-center rounded-full font-mono-label text-[11px] uppercase tracking-[0.2em] text-white shadow-lg shadow-black/25"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export default ViewCursor
