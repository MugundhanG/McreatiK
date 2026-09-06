/* ============================================
   Gallery Section — Studios
   Portfolio grid, presented like a contact
   sheet — each frame gets the film-frame border
   and a frame-counter caption. No real photos
   yet: a soft tinted paper stands in for imagery
   until real work is supplied.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiCamera } from 'react-icons/fi'
import { STUDIOS_GALLERY_ITEMS } from '../../utils/constants'

const TINTS = [
  'radial-gradient(circle at 30% 30%, rgba(201,151,31,0.22) 0, transparent 45%), radial-gradient(circle at 75% 70%, rgba(27,42,74,0.12) 0, transparent 45%), #F3EEE3',
  'radial-gradient(circle at 70% 25%, rgba(139,46,42,0.14) 0, transparent 45%), radial-gradient(circle at 25% 75%, rgba(201,151,31,0.18) 0, transparent 45%), #F3EEE3',
  'radial-gradient(circle at 50% 50%, rgba(201,151,31,0.2) 0, transparent 50%), #F3EEE3',
  'radial-gradient(circle at 40% 60%, rgba(27,42,74,0.12) 0, transparent 45%), radial-gradient(circle at 80% 20%, rgba(201,151,31,0.16) 0, transparent 40%), #F3EEE3',
]

const StudiosGallery = memo(function StudiosGallery() {
  return (
    <section id="gallery" className="relative py-24 lg:py-32 bg-[#F3EEE3] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">Selected frames</p>
          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Gallery</h2>
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">
            Placeholder frames — real work goes here before launch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-16">
          {STUDIOS_GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div
                className="film-frame relative aspect-[4/5] flex items-center justify-center"
                style={{ background: TINTS[index % TINTS.length] }}
              >
                <div className="film-grain" />
                <FiCamera className="w-8 h-8 text-[#1C1710]/20" />
                <span className="absolute top-3 left-3 font-mono-label text-[10px] uppercase text-[#1C1710]/45">
                  {item.category}
                </span>
              </div>
              <p className="font-mono-label text-[11px] uppercase text-[#6B6153] mt-3">
                Frame {String(index + 1).padStart(2, '0')}/{String(STUDIOS_GALLERY_ITEMS.length).padStart(2, '0')} — {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default StudiosGallery
