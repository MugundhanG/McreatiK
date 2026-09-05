/* ============================================
   BeamsBackground
   Canvas-drawn drifting light beams, adapted from a
   full-page hero reference into a section-scoped
   decorative layer: sized to its own parent (via
   ResizeObserver, not window), tuned down in count
   and opacity so it stays atmospheric behind real
   copy instead of competing with it, and retinted to
   McreatiK's own gold + periwinkle accents instead of
   the reference's generic cyan/violet. Runs on
   framer-motion (already a project dependency) rather
   than the "motion" package the reference calls for.
   Respects prefers-reduced-motion by drawing one
   static frame instead of animating forever.
   ============================================ */

import React, { memo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const INTENSITY_OPACITY = { subtle: 0.7, medium: 0.85, strong: 1 }

/* Two brand hue bands — gold (~35-50°) and periwinkle (~215-235°) —
   picked to match #D8AE55 and #8fa3e0 rather than the reference's
   generic cyan-to-violet sweep. */
function randomHue() {
  return Math.random() < 0.5 ? 35 + Math.random() * 15 : 215 + Math.random() * 20
}

function createBeam(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height * 1.4 - height * 0.2,
    width: 40 + Math.random() * 50,
    length: height * 2.2,
    angle: -35 + Math.random() * 10,
    speed: 0.25 + Math.random() * 0.35,
    opacity: 0.28 + Math.random() * 0.18,
    hue: randomHue(),
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.015 + Math.random() * 0.02,
  }
}

const BeamsBackground = memo(function BeamsBackground({ className = '', intensity = 'medium', beamCount = 12 }) {
  const canvasRef = useRef(null)
  const beamsRef = useRef([])
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = container.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      beamsRef.current = Array.from({ length: beamCount }, () => createBeam(width, height))
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    function resetBeam(beam, width, height) {
      beam.y = height + 100
      beam.x = Math.random() * width
      beam.speed = 0.25 + Math.random() * 0.25
      beam.hue = randomHue()
      beam.opacity = 0.28 + Math.random() * 0.18
    }

    function drawBeam(beam) {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)
      const pulsing = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * INTENSITY_OPACITY[intensity]
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)
      gradient.addColorStop(0, `hsla(${beam.hue}, 80%, 65%, 0)`)
      gradient.addColorStop(0.15, `hsla(${beam.hue}, 80%, 65%, ${pulsing * 0.5})`)
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 80%, 65%, ${pulsing})`)
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 80%, 65%, ${pulsing})`)
      gradient.addColorStop(0.85, `hsla(${beam.hue}, 80%, 65%, ${pulsing * 0.5})`)
      gradient.addColorStop(1, `hsla(${beam.hue}, 80%, 65%, 0)`)
      ctx.fillStyle = gradient
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    function renderFrame() {
      const { width, height } = container.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)
      ctx.filter = 'blur(24px)'
      beamsRef.current.forEach((beam) => {
        drawBeam(beam)
      })
    }

    if (reduceMotion) {
      renderFrame()
      return () => resizeObserver.disconnect()
    }

    /* Cap to ~30fps — the beams drift slowly, so this halves the
       cost of the per-frame canvas blur without a visible difference. */
    let lastTime = 0
    function tick(time) {
      frameRef.current = requestAnimationFrame(tick)
      if (time - lastTime < 33) return
      lastTime = time

      const { width, height } = container.getBoundingClientRect()
      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed
        beam.pulse += beam.pulseSpeed
        if (beam.y + beam.length < -100) resetBeam(beam, width, height)
      })
      renderFrame()
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(frameRef.current)
    }
  }, [intensity, beamCount])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" style={{ filter: 'blur(10px)' }} />
      <motion.div
        className="absolute inset-0 bg-[#0a1128]/10"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  )
})

export default BeamsBackground
