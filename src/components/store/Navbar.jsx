/* ============================================
   Navbar Component — Store
   Minimal bar for the Store department: wordmark +
   department switcher, in the same frame language as
   Tech/Studios' bars. The "Soon" tag is gone now that
   /store is the real catalog (Task 12) rather than a
   placeholder. Shows sign-in state (Task 10): a Log In
   link when signed out, or the customer's name + Log
   Out when signed in. Shows a cart badge (Task 13) when
   signed in, reading its count straight from useCart() -
   the same source of truth StoreCartPage.jsx renders
   from, so the two can never disagree about what's in
   the cart. No badge when signed out: the cart endpoint
   is auth-gated, so there's nothing for it to reflect
   yet (checkout is Task 14).
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const StoreNavbar = memo(function StoreNavbar() {
  const { customer, loading, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 border-b border-[#17151f]/10 bg-[#f8f7fb]/90 backdrop-blur-xl"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="shrink-0 inline-flex items-center gap-2">
          <span className="font-display font-bold text-lg text-[var(--store-accent-text)]">
            McreatiK
          </span>
          <span className="hidden sm:inline font-display font-semibold text-lg text-[#17151f]">Digital Store</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {!loading && (
            customer ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="hidden lg:inline text-[#17151f]/70">Hi, {customer.name}</span>
                <Link
                  to="/store/cart"
                  aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
                  className="relative font-semibold hover:underline text-[var(--store-accent-text)]"
                >
                  Cart
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
                      className="absolute -top-2 -right-3 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-bold text-white bg-[#17151f]"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden sm:inline font-semibold hover:underline text-[var(--store-accent-text)]"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/store/login" className="text-sm font-semibold hover:underline text-[var(--store-accent-text)]">
                Log In
              </Link>
            )
          )}
          <DepartmentSwitcher className="text-[#17151f]/70 bg-white/70" />
        </div>
      </div>
    </motion.header>
  )
})

export default StoreNavbar
