/* ============================================
   cartApi
   Plain fetch module for the customer-scoped Cart API,
   mirroring customerApi.js's shape/conventions - and,
   for auth specifically, not just mirroring it but
   reusing it outright. Every cart route requires the
   same signed-in customer session as the auth routes
   (SecurityConfig gates /api/v1/cart on hasRole
   ("CUSTOMER")), and the in-memory access token +
   401-refresh-and-retry logic already lives in
   customerApi's module-scoped state, wired up once by
   AuthProvider. Duplicating that state here would risk
   it drifting out of sync with the one AuthProvider in
   main.jsx, so this module routes every call through
   customerApiFetch instead of rolling its own fetch
   wrapper. That also means a Cart validation failure
   surfaces as a CustomerApiError with the same shape
   AuthContext already knows how to read (`.message`,
   `.fieldErrors`).

   Backend contract (read from CartController.java /
   CartService.java in the backend worktree, not
   assumed):
     GET    /api/v1/cart                -> CartResponse
     POST   /api/v1/cart/items          { productId, fieldValues, quantity? } -> CartResponse
     PUT    /api/v1/cart/items/{itemId} { fieldValues, quantity? }             -> CartResponse
     DELETE /api/v1/cart/items/{itemId} -> CartResponse
     DELETE /api/v1/cart                -> CartResponse (empty)

   Every one of those returns the WHOLE refreshed cart, not just the
   changed line - CartController's own class doc calls this out as
   deliberately matching the frontend's refetch-after-mutation Context
   (this module's caller, CartContext): the server re-validates
   fieldValues/price against the product's current schema on every
   mutation, so the response body already *is* the authoritative
   post-mutation state. CartContext.jsx sets its state directly from
   whatever a mutation call here returns, rather than issuing a second
   GET or locally patching the previous cart - there's nothing a second
   round trip would tell it that this response doesn't already say.

   CartResponse = { id, items: CartItemResponse[], totalAmount, currency }
   CartItemResponse = { id, productId, productName, productType, categoryId,
                         unitPrice, currency, quantity, lineAmount, fieldValues }
   ============================================ */

import { customerApiFetch } from './customerApi'

const CART_PATH = '/api/v1/cart'

/** The signed-in customer's cart (find-or-create server-side; never 404s). */
export async function fetchCart() {
  return customerApiFetch(CART_PATH)
}

/**
 * Add-to-cart. `quantity` is omitted from the request body entirely when not
 * given - CartItemRequest.quantityOrDefault() treats a missing quantity as 1,
 * and every category is single-licence today (see CartItem.java), so callers
 * never need to pass it.
 */
export async function addCartItem({ productId, fieldValues, quantity }) {
  const body = { productId, fieldValues }
  if (quantity != null) body.quantity = quantity
  return customerApiFetch(`${CART_PATH}/items`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Edit an existing line's fieldValues (and, if this product's category ever
 * stops being single-licence, its quantity). Not currently wired into any UI -
 * see StoreCartPage.jsx's comment on why quantity isn't exposed as editable
 * there - but kept here since CartItemUpdateRequest already exists.
 */
export async function updateCartItem(itemId, { fieldValues, quantity }) {
  const body = { fieldValues }
  if (quantity != null) body.quantity = quantity
  return customerApiFetch(`${CART_PATH}/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function removeCartItem(itemId) {
  return customerApiFetch(`${CART_PATH}/items/${itemId}`, { method: 'DELETE' })
}

export async function clearCart() {
  return customerApiFetch(CART_PATH, { method: 'DELETE' })
}
