/* ============================================
   OrderStateIllustration — Store
   One component for StoreOrderPage's 7 header states
   (verifying/preparing/ready/partial/taking_longer/error/
   recovery_failed), replacing 6+ near-duplicate inline JSX
   blocks. Purely presentational - StoreOrderPage still owns
   which state is active; this only renders whichever icon,
   tone, title and description it's handed.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import StoreIconBadge from '../store/StoreIconBadge'

const OrderStateIllustration = memo(function OrderStateIllustration({
  icon,
  tone = 'accent',
  title,
  description,
  spin = false,
  celebrate = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-10 flex flex-col items-center gap-4"
    >
      <motion.div
        initial={celebrate ? { scale: 0.5, rotate: -12 } : false}
        animate={celebrate ? { scale: 1, rotate: 0 } : false}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
      >
        <motion.div
          animate={spin ? { rotate: 360 } : {}}
          transition={spin ? { repeat: Infinity, duration: 1.2, ease: 'linear' } : {}}
        >
          <StoreIconBadge icon={icon} size="lg" tone={tone} />
        </motion.div>
      </motion.div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17151f] mb-2">{title}</h1>
        {description ? <p className="text-[#4b4a55] max-w-md mx-auto">{description}</p> : null}
      </div>
    </motion.div>
  )
})

export default OrderStateIllustration
