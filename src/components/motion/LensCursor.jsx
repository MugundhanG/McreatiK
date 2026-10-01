/* ============================================
   LensCursor — Studios
   The cursor as a camera lens: a small gold
   lens ring (focus-ring ticks, slowly turning,
   a focus dot at its centre) trails the
   pointer across the page.
   - Over links/buttons it opens up a little.
   - Over a [data-cursor] element (gallery tiles,
     album covers) it opens wide and carries that
     word — "View", "Open" — and the system
     pointer is hidden there.

   Position runs on motion values (no re-render
   per mouse move); state changes only when the
   mode changes. Mouse-only; off with reduced
   motion. Mount once per page shell.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import useFinePointer from './useFinePointer'

const RING_SPRING = { stiffness: 500, damping: 38, mass: 0.35 }
const SIZES = { ring: 34, hover: 52, label: 84 }

/* Tick marks around a lens barrel, drawn in a 100-unit box so one SVG
   scales cleanly to every ring size */
function LensTicks({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
      <circle cx="50" cy="50" r="49" fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        const long = i % 6 === 0
        const r2 = long ? 41 : 44
        return (
          <line
            key={i}
            x1={50 + 48 * Math.cos(a)}
            y1={50 + 48 * Math.sin(a)}
            x2={50 + r2 * Math.cos(a)}
            y2={50 + r2 * Math.sin(a)}
            stroke={color}
            strokeOpacity={long ? 0.9 : 0.5}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
    </svg>
  )
}

const LensCursor = memo(function LensCursor({ color = '#C9971F' }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const active = fine && !reduce

  const [mode, setMode] = useState('ring') // 'ring' | 'hover' | 'label' | 'hidden'
  const [label, setLabel] = useState(null)

  const x = useSpring(useMotionValue(-200), RING_SPRING)
  const y = useSpring(useMotionValue(-200), RING_SPRING)

  useEffect(() => {
    if (!active) return undefined
    const root = document.documentElement
    root.classList.add('has-lens-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target instanceof Element ? e.target : null
      const target = el?.closest('[data-cursor]')
      if (target) {
        setLabel(target.getAttribute('data-cursor'))
        setMode('label')
        return
      }
      setMode(el?.closest('a, button, [role="button"], input, select, textarea, label') ? 'hover' : 'ring')
    }
    const onLeave = () => setMode('hidden')
    const onEnter = () => setMode('ring')

    window.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerenter', onEnter)
    return () => {
      window.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerenter', onEnter)
      root.classList.remove('has-lens-cursor')
    }
  }, [active, x, y])

  if (!active) return null

  const size = SIZES[mode] ?? SIZES.ring
  const showLabel = mode === 'label' && label

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45]"
      style={{ x, y }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{ x: '-50%', y: '-50%' }}
        initial={false}
        animate={{
          width: size,
          height: size,
          opacity: mode === 'hidden' ? 0 : 1,
          backgroundColor: showLabel ? 'rgba(28, 23, 16, 0.35)' : 'rgba(28, 23, 16, 0)',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: showLabel ? 18 : 12, repeat: Infinity, ease: 'linear' }}
        >
          <LensTicks color={color} />
        </motion.div>

        {showLabel ? (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative font-mono-label text-[10px] uppercase tracking-[0.2em] text-white"
          >
            {label}
          </motion.span>
        ) : (
          <span className="relative h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
        )}
      </motion.div>
    </motion.div>
  )
})

export default LensCursor
