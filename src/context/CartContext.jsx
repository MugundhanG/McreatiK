/* ============================================
   CartContext / useCart
   Second React Context in this codebase, following
   AuthContext's shape exactly: owns one piece of
   state (the signed-in customer's cart), delegates all
   request plumbing to a plain `*Api.js` module
   (src/utils/cartApi.js), exposes a `use*` hook
   co-located with its Provider.

   Deliberately refetch-after-mutation, NOT optimistic:
   every add/edit/remove call below sets `cart` to
   whatever the server just returned, never to a
   locally-spliced guess. That matters more here than
   almost anywhere else in the app, because
   CartService.addItem/updateItem re-validate
   fieldValues against the product's *current* schema
   and can rewrite them (a non-editable field is
   resolved server-side, not stored as submitted) or
   reject them outright (stale price/schema) - see
   CartService.java's class doc and
   ProductFieldValidationException. A client that
   optimistically appended what it *sent* would show the
   buyer something the server never actually accepted.
   Every cartApi.js mutation call already returns the
   whole fresh CartResponse for exactly this reason, so
   "refetch" here means "trust that response", not "make
   a second GET".

   Nested inside AuthProvider (see main.jsx): the cart
   only exists for a signed-in customer, so this
   Provider re-fetches whenever `customer` changes and
   clears its state on sign-out rather than leaving the
   previous customer's cart visible.
   ============================================ */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  fetchCart,
  addCartItem as addCartItemRequest,
  updateCartItem as updateCartItemRequest,
  removeCartItem as removeCartItemRequest,
  clearCart as clearCartRequest,
} from '../utils/cartApi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { customer } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchCart()
      setCart(res)
      setError(null)
      return res
    } catch (err) {
      setError(err.message || 'Something went wrong loading your cart.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // No customer -> no cart to fetch (the endpoint is auth-gated and would
    // just 401). Clearing local state on sign-out/mount-without-session
    // avoids showing a previous customer's cart to whoever's signed in now.
    if (!customer) {
      setCart(null)
      return
    }
    refresh().catch(() => {
      // Already recorded on `error` above; nothing else to do here.
    })
  }, [customer, refresh])

  const addItem = useCallback(async ({ productId, fieldValues, quantity }) => {
    setError(null)
    try {
      const res = await addCartItemRequest({ productId, fieldValues, quantity })
      setCart(res)
      return res
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      throw err
    }
  }, [])

  const updateItem = useCallback(async (itemId, { fieldValues, quantity }) => {
    setError(null)
    try {
      const res = await updateCartItemRequest(itemId, { fieldValues, quantity })
      setCart(res)
      return res
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      throw err
    }
  }, [])

  const removeItem = useCallback(async (itemId) => {
    setError(null)
    try {
      const res = await removeCartItemRequest(itemId)
      setCart(res)
      return res
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      throw err
    }
  }, [])

  const clear = useCallback(async () => {
    setError(null)
    try {
      const res = await clearCartRequest()
      setCart(res)
      return res
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      throw err
    }
  }, [])

  // Sum of line quantities, not items.length - a future quantity>1 line should
  // count for more than one badge tick even though every line is 1 today.
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider
      value={{ cart, itemCount, loading, error, refresh, addItem, updateItem, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Co-located with its Provider for the same reason AuthContext does this -
// see that file's comment.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
