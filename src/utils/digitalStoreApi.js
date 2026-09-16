const API_BASE = import.meta.env.VITE_API_BASE_URL

export class DigitalStoreApiError extends Error {
  constructor(status, body) {
    super(body?.message || `Request failed with status ${status}`)
    this.status = status
    this.fieldErrors = body?.fieldErrors || null
  }
}

async function parseErrorBody(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new DigitalStoreApiError(res.status, await parseErrorBody(res))
  }
  return res.json()
}

// Public catalog: categories + products, backed by CategoryPublicController
// (/api/v1/categories, PUBLISHED-only, sorted by sortOrder/name) and
// ProductPublicController (/api/v1/products, ACTIVE-only). Both endpoints are
// unpaginated, small, complete lists - fine for a storefront catalog.
export async function fetchDigitalStoreCategories() {
  return getJson('/api/v1/categories')
}

export async function fetchDigitalStoreProducts() {
  return getJson('/api/v1/products')
}

// The backend has no single-product lookup endpoint - only the list. Fetching the
// whole (small, single-digit-count) catalog and finding by id client-side is a
// deliberate, small trade-off rather than adding a new backend endpoint for this.
export async function fetchDigitalStoreProduct(productId) {
  const products = await fetchDigitalStoreProducts()
  const product = products.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  return product
}

export async function requestDigitalStorePreview(productId, fieldValues) {
  const res = await fetch(`${API_BASE}/api/v1/products/${productId}/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fieldValues }),
  })
  if (!res.ok) {
    throw new DigitalStoreApiError(res.status, await parseErrorBody(res))
  }
  return res.blob()
}

/* The single-product order/verify/download helpers that used to live here are gone as of
   Task 14, along with the page that called them. They weren't merely unused: two of the
   three addressed routes the backend no longer has. createDigitalStoreOrder posted a
   client-supplied basket to POST /api/v1/orders (replaced by POST /api/v1/checkout, which
   takes a session id and prices the cart server-side) with a client-chosen
   Idempotency-Key header (the key is now computed server-side - a client choosing the key
   is a client choosing whether it gets a fresh order or a cached one), and
   digitalStoreDownloadUrl addressed a per-ORDER download route that is now per ITEM.
   Leaving them here as dead code would leave a caller-shaped trap. Their replacements are
   in checkoutApi.js, which also documents why they sit in a separate module. */

// Maps a currency code to its display symbol. Any currency not listed here falls back to
// showing the raw code (e.g. "USD 99") rather than a symbol.
const CURRENCY_SYMBOLS = { INR: '₹' }

/**
 * Formats a price for display: "₹99" (no decimals for a whole number), "₹99.50" (2 decimals
 * when there's a fractional part), or "USD 99" for a currency with no known symbol.
 */
export function formatDigitalStorePrice(currency, price) {
  const numericPrice = Number(price)
  const formattedPrice = Number.isInteger(numericPrice) ? String(numericPrice) : numericPrice.toFixed(2)
  const symbol = CURRENCY_SYMBOLS[currency]
  return symbol ? `${symbol}${formattedPrice}` : `${currency} ${formattedPrice}`
}
