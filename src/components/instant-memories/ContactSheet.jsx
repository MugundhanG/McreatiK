/* ============================================
   ContactSheet — the Instant Memories hero.
   A photographer's contact sheet that fills in
   live: each frame appears with the time it
   took to reach guests' phones, then a red
   grease-pencil circle marks the couple's pick.
   Under reduced motion it shows the finished
   sheet. Photos are the blurred live crops.
   ============================================ */

import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { IM_IMG } from './Phones'

const POOL = ['p1', 'p2', 'p3', 'p4', 'cover', 'p5', 'p6', 'p7', 'p8', 'p2', 'p4', 'p6']
const FRAMES = POOL.map((name, i) => ({
  src: `${IM_IMG}/live/${name}.webp`,
  number: `${21 + Math.floor(i / 2)}${i % 2 ? 'A' : ''}`,
  // Illustrative shutter-to-phone times, all a few seconds.
  seconds: [2.4, 3.1, 1.9, 2.8, 3.6, 2.2, 2.9, 4.1, 2.5, 3.3, 2.1, 2.7][i],
}))
const PICK = 4
const START_MS = 500
const STEP_MS = 260

/* A loose, hand-drawn loop — not a perfect ellipse. */
const CIRCLE = 'M 52 6 C 86 4, 104 22, 101 50 C 98 82, 70 97, 44 95 C 16 93, 0 74, 3 47 C 6 20, 26 8, 58 9'

function Sprockets() {
  return (
    <div aria-hidden="true" className="flex justify-between px-3 py-2">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="h-2 w-3 rounded-[2px] bg-[#F6F7F9]/15" />
      ))}
    </div>
  )
}

export default function ContactSheet() {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? FRAMES.length : 0)

  useEffect(() => {
    if (reduce) return undefined
    let timer
    const start = setTimeout(() => {
      timer = setInterval(() => {
        setShown((n) => {
          if (n >= FRAMES.length) {
            clearInterval(timer)
            return n
          }
          return n + 1
        })
      }, STEP_MS)
    }, START_MS)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [reduce])

  const done = reduce || shown >= FRAMES.length

  return (
    <figure
      className="relative rounded-2xl bg-[#16191E] shadow-2xl shadow-black/25"
      aria-label="A contact sheet filling in live: each photo reaches guests' phones within seconds, and the couple's pick is circled in red"
    >
      <div className="flex items-center justify-between px-4 pt-3 font-mono-label text-[10px] uppercase text-white/60">
        <span className="flex items-center gap-1.5 text-[#19C37D]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19C37D]/60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#19C37D]" />
          </span>
          Live
        </span>
        <span>Wedding day · Roll 03</span>
      </div>
      <Sprockets />
      <ol className="grid grid-cols-3 gap-2 px-3 sm:grid-cols-4" aria-hidden="true">
        {FRAMES.map((f, i) => {
          const visible = i < shown
          return (
            <li key={i} className={`relative ${i >= 9 ? 'hidden sm:block' : ''}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-[#22262D]">
                <motion.img
                  src={f.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={false}
                  animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 1.06 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                {visible && (
                  <motion.span
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-1 left-1 rounded-sm bg-black/65 px-1 font-mono-label text-[9px] text-[#19C37D]"
                  >
                    +{f.seconds}s
                  </motion.span>
                )}
              </div>
              <p className="mt-1 font-mono-label text-[9px] text-[#F6F7F9]/40">{f.number}</p>
              {i === PICK && done && (
                <>
                  <svg viewBox="0 0 105 100" className="pointer-events-none absolute -inset-2.5 h-[calc(100%+20px)] w-[calc(100%+20px)] overflow-visible">
                    <motion.path
                      d={CIRCLE}
                      fill="none"
                      stroke="#E5372B"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={reduce ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.3 }}
                    />
                  </svg>
                  <motion.span
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="absolute -right-1 -top-3 rotate-[-8deg] rounded-sm bg-[#E5372B] px-1.5 py-0.5 font-mono-label text-[9px] font-semibold text-white"
                  >
                    Pick
                  </motion.span>
                </>
              )}
            </li>
          )
        })}
      </ol>
      <Sprockets />
      <figcaption className="px-4 pb-3 font-mono-label text-[10px] text-white/50">
        +s = time from the shutter to guests’ phones
      </figcaption>
    </figure>
  )
}
