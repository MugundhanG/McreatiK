/* ============================================
   StoreCard — Store
   The one flat surface (.card-store, index.css) every product
   card, cart line, order-item row, and trust badge shares,
   instead of five separate copies of "border rounded-xl
   bg-white". Renders as a react-router <Link> when `to` is
   given, otherwise a plain element (`as`, default 'div') — so
   the same card can be a clickable catalog tile or a static
   cart-line wrapper without two components.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const StoreCard = memo(function StoreCard({
  as: Tag = 'div',
  to,
  hover = true,
  padding = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = `card-store ${hover ? 'card-store-hover' : ''} ${PADDING[padding] ?? PADDING.md} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
})

export default StoreCard
