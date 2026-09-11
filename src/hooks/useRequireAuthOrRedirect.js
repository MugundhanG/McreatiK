/* ============================================
   useRequireAuthOrRedirect
   Deliberately NOT a route guard - browsing the
   Store stays public. This is meant to be invoked
   at the specific action that actually needs a
   signed-in customer attached to it (add-to-cart,
   built in a later task), not wrapped around a
   whole route.

   Usage (future add-to-cart button):
     const requireAuthOrRedirect = useRequireAuthOrRedirect()
     <button onClick={() => requireAuthOrRedirect(() => addToCart(product))}>
       Add to cart
     </button>

   If a customer is already signed in, `onAuthenticated` runs immediately and
   the function returns true. If not, the visitor is sent to /store/login
   carrying the current location in router state, so StoreLoginPage can send
   them back to exactly where they were after they sign in - and the function
   returns false (nothing ran).
   ============================================ */

import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function useRequireAuthOrRedirect() {
  const { customer, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (onAuthenticated) => {
      // Auth state hasn't settled yet (the refresh-cookie check on mount is
      // still in flight) - treat as "not authenticated yet" rather than
      // guessing, so a caller never runs its action against a stale customer.
      if (loading) return false

      if (customer) {
        onAuthenticated?.()
        return true
      }

      navigate('/store/login', { state: { from: `${location.pathname}${location.search}` } })
      return false
    },
    [customer, loading, navigate, location]
  )
}
