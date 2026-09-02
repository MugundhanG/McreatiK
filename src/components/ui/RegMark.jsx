/* ============================================
   RegMark — print/production registration-mark
   tick. Tech department's signature motif;
   place at a corner of a section or card with
   position: relative on the parent.
   ============================================ */

import React, { memo } from 'react'

const POSITIONS = {
  'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
}

const RegMark = memo(function RegMark({ position = 'top-left', className = '' }) {
  return <span className={`reg-mark ${POSITIONS[position]} ${className}`} aria-hidden="true" />
})

export default RegMark
