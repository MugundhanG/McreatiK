/* ============================================
   WhoWeHelp Section
   Five audience segments, each a large outlined
   icon box + title + description — lighter than
   the photo cards above, no fill colors.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { HOME_WHO_WE_HELP } from '../../utils/constants'
import SectionHeading from './SectionHeading'

const WhoWeHelp = memo(function WhoWeHelp() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Who We Help" title="Made for businesses, professionals and creators" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {HOME_WHO_WE_HELP.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              className="flex flex-col items-center text-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span className="flex items-center justify-center w-16 h-16 rounded-lg border border-white/15 text-[#8890AE]">
                <Icon className="w-7 h-7" />
              </span>
              <h3 className="text-white font-semibold font-display">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[180px]">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default WhoWeHelp
