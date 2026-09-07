/* ============================================
   Blog Section — Studios
   No real posts yet. An honest empty state with
   the topics planned, rather than fabricated
   placeholder articles with fake dates/titles.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiEdit3 } from 'react-icons/fi'
import { STUDIOS_BLOG_TOPICS } from '../../utils/constants'

const StudiosBlog = memo(function StudiosBlog() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#FAF7F0]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">Stories & notes</p>
          <h1 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710] mb-6">Blog</h1>

          <div className="w-14 h-14 mx-auto rounded-full border border-[#C9971F]/40 flex items-center justify-center mb-6">
            <FiEdit3 className="w-5 h-5 text-[#C9971F]" />
          </div>

          <p className="font-body text-[#6B6153] leading-relaxed max-w-md mx-auto">
            First stories coming soon. Here's what we're planning to write about:
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {STUDIOS_BLOG_TOPICS.map((topic) => (
              <span
                key={topic}
                className="px-4 py-2 rounded-full text-sm font-medium border border-black/10 text-[#4A4438]"
              >
                {topic}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
})

export default StudiosBlog
