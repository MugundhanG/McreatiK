/* ============================================
   Phones — the phone mockups shared by the
   Instant Memories site and the Studios page:
   a plain screenshot in a phone frame, and the
   "live gallery" phone where a new photo drops
   in every few seconds. The live photos are
   blurred Unsplash photos of South Indian
   weddings (small crops in
   public/studios/instant-memories/live, Unsplash
   licence).
   ============================================ */

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiCamera } from 'react-icons/fi'

const EASE = [0.22, 1, 0.36, 1]
export const IM_IMG = '/studios/instant-memories'
const LIVE = `${IM_IMG}/live`
const LIVE_POOL = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'].map((n) => `${LIVE}/${n}.webp`)
const LIVE_VISIBLE = 4
const LIVE_START_COUNT = 18
const LIVE_INTERVAL_MS = 3200

/** A screenshot shown inside a simple phone frame. */
export function Phone({ src, alt, className = '' }) {
  return (
    <div className={`relative rounded-[2.2rem] border-[6px] border-[#16191E] bg-[#16191E] shadow-2xl shadow-black/30 ${className}`}>
      <img src={src} alt={alt} loading="lazy" width="390" height="844" className="block w-full rounded-[1.7rem]" />
    </div>
  )
}

/**
 * A live guest gallery on a phone. `brandLogo` (an image) or `brandName`
 * (text) is the studio shown on the cover, as on a real gallery.
 */
export function LivePhone({ brandLogo, brandName = 'Your Studio' }) {
  const reduce = useReducedMotion()
  // Each tile gets a unique id so a photo can re-enter after the pool loops.
  const [tiles, setTiles] = useState(() =>
    LIVE_POOL.slice(0, LIVE_VISIBLE).map((src, i) => ({ id: i, src }))
  )
  const [count, setCount] = useState(LIVE_START_COUNT)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (reduce) return undefined
    let next = LIVE_VISIBLE
    let hideToast
    const timer = setInterval(() => {
      if (document.hidden) return
      const id = next++
      setTiles((prev) => [{ id, src: LIVE_POOL[id % LIVE_POOL.length] }, ...prev].slice(0, LIVE_VISIBLE))
      setCount((c) => c + 1)
      setToast(true)
      clearTimeout(hideToast)
      hideToast = setTimeout(() => setToast(false), 1600)
    }, LIVE_INTERVAL_MS)
    return () => {
      clearInterval(timer)
      clearTimeout(hideToast)
    }
  }, [reduce])

  return (
    <div
      role="img"
      aria-label="A live event gallery on a guest's phone, with new photos arriving"
      className="relative rounded-[2.2rem] border-[6px] border-[#16191E] bg-[#16191E] shadow-2xl shadow-black/40"
    >
      <div aria-hidden="true" className="relative aspect-[9/17] overflow-hidden rounded-[1.7rem] bg-[#F6F7F9]">
        {/* Cover */}
        <div className="relative h-[40%]">
          <img src={`${LIVE}/cover.webp`} alt="" width="600" height="560" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/75" />
          {brandLogo ? (
            <img src={brandLogo} alt="" className="absolute left-4 top-4 h-9 w-auto" />
          ) : (
            <span className="absolute left-4 top-4 font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-white">{brandName}</span>
          )}
          <div className="absolute inset-x-4 bottom-7 text-white">
            <p className="font-display text-[26px] leading-none">Wedding Day</p>
            <p className="mt-1.5 font-body text-[11px] text-white/80">Live from the venue</p>
          </div>
        </div>

        {/* Live bar */}
        <div className="relative z-10 mx-3 -mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md shadow-black/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5484D]/60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E5484D]" />
          </span>
          <span className="font-body text-[10px] font-bold tracking-[0.2em] text-[#0E1116]">LIVE</span>
          <span className="truncate font-body text-[10px] text-[#5B6270]">New photos arriving</span>
          <span className="ml-auto shrink-0 font-body text-[10px] tabular-nums text-[#5B6270]">{count} photos</span>
        </div>

        {/* Photo grid — newest first */}
        <div className="grid grid-cols-2 gap-1.5 p-3">
          <AnimatePresence initial={false} mode="popLayout">
            {tiles.map((tile) => (
              <motion.img
                key={tile.id}
                src={tile.src}
                alt=""
                width="400"
                height="500"
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
            ))}
          </AnimatePresence>
        </div>

        {/* "Just arrived" toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute inset-x-0 bottom-4 flex justify-center"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16191E]/90 px-3 py-1.5 font-body text-[10px] font-medium text-white shadow-lg">
                <FiCamera className="h-3 w-3 text-[#19C37D]" /> New photo just arrived
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
