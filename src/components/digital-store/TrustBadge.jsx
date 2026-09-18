/* ============================================
   TrustBadge — Store
   One line item of ProductTrustSection: icon + label +
   description. Replaces the old flat <li>🔒 text</li> list —
   same true claims (this component makes none of its own; the
   caller supplies exactly what ProductTrustSection.jsx already
   said), just given a real icon and its own reveal animation
   instead of an emoji character.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import StoreIconBadge from '../store/StoreIconBadge'

const TrustBadge = memo(function TrustBadge({ icon, label, description, index = 0 }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-3"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <StoreIconBadge icon={icon} size="md" />
      <div>
        <p className="font-semibold text-sm text-[#17151f]">{label}</p>
        {description ? <p className="text-xs text-[#4b4a55] mt-1">{description}</p> : null}
      </div>
    </motion.div>
  )
})

export default TrustBadge
