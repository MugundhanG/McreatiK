/* ============================================
   LensCursor — Studios
   The cursor as a camera lens.
   - Everywhere: a small gold lens ring (focus-
     ring ticks, slowly turning) trails the
     pointer, and opens up over links/buttons.
   - Over photos inside a [data-lens] element:
     it becomes a loupe — a magnified view of
     the exact spot under the pointer — with the
     element's data-cursor word ("View", "Open")
     on the rim. The system pointer is hidden
     only there.

   Position and magnification run on motion
   values (no re-render per mouse move); React
   state changes only when the hovered photo or
   mode changes. Mouse-only; off with reduced
   motion. Mount once per page shell.
   ============================================ */

import React, { memo, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import useFinePointer from './useFinePointer'

const ZOOM = 2.4
const LOUPE = 160 // px diameter
const RING_SPRING = { stiffness: 500, damping: 38, mass: 0.35 }

/* Tick marks around a lens barrel */
function LensTicks({ size, color }) {
  const r = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
      <circle cx={r} cy={r} r={r - 1} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={r} cy={r} r={r - 6} fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        const long = i % 6 === 0
        const r1 = r - 1.5
        const r2 = r - (long ? 6 : 4)
        return (
          <line
            key={i}
            x1={r + r1 * Math.cos(a)}
            y1={r + r1 * Math.sin(a)}
            x2={r + r2 * Math.cos(a)}
            y2={r + r2 * Math.sin(a)}
            stroke={color}
            strokeOpacity={long ? 0.9 : 0.5}
            strokeWidth="1"
          />
        )
      })}
    </svg>
  )
}

/* Where an object-cover/contain <img> actually paints its picture inside its box */
function paintedBox(img, rect) {
  const nw = img.naturalWidth || rect.width
  const nh = img.naturalHeight || rect.height
  const fit = getComputedStyle(img).objectFit
  const scale = fit === 'contain'
    ? Math.min(rect.width / nw, rect.height / nh)
    : fit === 'cover'
      ? Math.max(rect.width / nw, rect.height / nh)
      : null
  if (scale === null) return { x: rect.left, y: rect.top, w: rect.width, h: rect.height }
  const w = nw * scale
  const h = nh * scale
  return { x: rect.left + (rect.width - w) / 2, y: rect.top + (rect.height - h) / 2, w, h }
}

const LensCursor = memo(function LensCursor({ color = '#C9971F' }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const active = fine && !reduce

  const [mode, setMode] = useState('ring') // 'ring' | 'hover' | 'loupe' | 'hidden'
  const [loupe, setLoupe] = useState(null) // { src, label }
  const lastImg = useRef(null)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, RING_SPRING)
  const sy = useSpring(y, RING_SPRING)

  /* Magnified background, driven per move */
  const bgW = useMotionValue(0)
  const bgH = useMotionValue(0)
  const bgX = useMotionValue(0)
  const bgY = useMotionValue(0)
  const bgSize = useMotionTemplate`${bgW}px ${bgH}px`
  const bgPos = useMotionTemplate`${bgX}px ${bgY}px`

  useEffect(() => {
    if (!active) return undefined
    const root = document.documentElement
    root.classList.add('has-lens-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target instanceof Element ? e.target : null
      const lensHost = el?.closest('[data-lens]')
      const img = lensHost
        ? (el.tagName === 'IMG' ? el : lensHost.querySelector('img'))
        : null

      if (img && img.complete && img.naturalWidth) {
        const box = paintedBox(img, img.getBoundingClientRect())
        bgW.set(box.w * ZOOM)
        bgH.set(box.h * ZOOM)
        bgX.set(-((e.clientX - box.x) * ZOOM - LOUPE / 2))
        bgY.set(-((e.clientY - box.y) * ZOOM - LOUPE / 2))
        if (lastImg.current !== img) {
          lastImg.current = img
          setLoupe({ src: img.currentSrc || img.src, label: lensHost.getAttribute('data-cursor') })
        }
        setMode('loupe')
        return
      }

      lastImg.current = null
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
  }, [active, x, y, bgW, bgH, bgX, bgY])

  if (!active) return null

  const isLoupe = mode === 'loupe' && loupe
  const ringSize = mode === 'hover' ? 52 : 34

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45]"
      style={{ x: isLoupe ? x : sx, y: isLoupe ? y : sy }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {isLoupe ? (
          <motion.div
            key="loupe"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{ x: '-50%', y: '-50%', width: LOUPE, height: LOUPE }}
            className="relative"
          >
            {/* The magnified view */}
            <motion.div
              className="absolute inset-[3px] overflow-hidden rounded-full bg-[#1C1710] bg-no-repeat shadow-[0_18px_40px_-10px_rgba(0,0,0,0.55)]"
              style={{ backgroundImage: `url("${loupe.src}")`, backgroundSize: bgSize, backgroundPosition: bgPos }}
            />
            {/* Glass highlight */}
            <div className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_45%)]" />
            {/* Lens barrel */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            >
              <LensTicks size={LOUPE} color={color} />
            </motion.div>
            {loupe.label && (
              <span
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-full px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.2em] text-white"
                style={{ backgroundColor: color }}
              >
                {loupe.label}
              </span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="ring"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: mode === 'hidden' ? 0 : 1, width: ringSize, height: ringSize }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            style={{ x: '-50%', y: '-50%' }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <LensTicks size={ringSize} color={color} />
            </motion.div>
            {/* Focus dot */}
            <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: color }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export default LensCursor
