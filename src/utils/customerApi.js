/* ============================================
   customerApi
   Plain fetch module for the customer-facing auth
   API, mirroring mcreatik-admin's src/lib/api.ts
   shape/conventions (module-level in-memory access
   token + a configureAuth() hook wired up by
   AuthContext, transparent 401-refresh-and-retry).

   Backend contract (read from
   CustomerAuthController.java in the backend
   worktree, not assumed):
     POST /api/v1/customer/auth/signup   { email, password, name } -> CustomerAuthResponse (201)
     POST /api/v1/customer/auth/login    { email, password }       -> CustomerAuthResponse (200)
     POST /api/v1/customer/auth/refresh  (no body)                 -> CustomerAuthResponse (200)
     POST /api/v1/customer/auth/logout   (no body)                 -> 204
     POST /api/v1/customer/auth/password-reset/request { email }              -> 204 (always, even if email unknown)
     POST /api/v1/customer/auth/password-reset/confirm  { token, newPassword } -> 204

   CustomerAuthResponse = { accessToken, tokenType, expiresInSeconds, name }

   Token delivery: the ACCESS token comes back in the JSON body above and is
   kept in memory only (never localStorage/sessionStorage - see setAccessToken
   below). The REFRESH token is set by the backend as an httpOnly
   "customerRefreshToken" cookie scoped to /api/v1/customer/auth - this module
   never reads or stores that cookie's value itself (it can't - httpOnly - and
   shouldn't try). `credentials: 'include'` on every request is what makes the
   browser send/receive that cookie cross-origin.
   ============================================ */

const API_BASE = import.meta.env.VITE_API_BASE_URL

export class CustomerApiError extends Error {
  constructor(status, message, fieldErrors) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

let accessToken = null
let refreshFn = null
let onAuthFailure = null

/** In-memory only - never persisted, so a page reload always starts from the refresh cookie. */
export function setAccessToken(token) {
  accessToken = token
}

/** Wired up once by AuthProvider - this module has no React context of its own. */
export function configureAuth(refresh, onFailure) {
  refreshFn = refresh
  onAuthFailure = onFailure
}

async function rawRequest(path, options) {
  const headers = new Headers(options.headers)
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  // credentials: 'include' is required for the httpOnly refresh cookie to be sent
  // cross-origin to the API's own origin.
  return fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' })
}

// signup/login/refresh must never trigger the retry-via-refresh logic below - refreshFn()
// itself calls /auth/refresh through this same function, so a 401 from that call (the
// normal case when there's no session yet) would otherwise call refreshFn() again from
// inside refreshFn(), recursing forever (same bug the admin app's api.ts already hit once).
const AUTH_ENDPOINTS = [
  '/api/v1/customer/auth/refresh',
  '/api/v1/customer/auth/login',
  '/api/v1/customer/auth/signup',
]

/**
 * A 401 usually just means the short-lived access token expired mid-session -
 * transparently refresh and retry once before giving up.
 */
async function request(path, options, allowRefresh = true) {
  const res = await rawRequest(path, options)
  const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => path.startsWith(p))
  if (res.status === 401 && allowRefresh && refreshFn && !isAuthEndpoint) {
    const newToken = await refreshFn()
    if (newToken) {
      return request(path, options, false)
    }
    onAuthFailure?.()
  }
  return res
}

export async function customerApiFetch(path, options = {}) {
  const res = await request(path, options)
  if (!res.ok) {
    let message = res.statusText
    let fieldErrors
    try {
      const body = await res.json()
      fieldErrors = body?.fieldErrors ?? undefined
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        message = Object.entries(fieldErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join('; ')
      } else if (body?.message) {
        message = body.message
      }
    } catch {
      // response had no JSON body - keep the statusText fallback
    }
    throw new CustomerApiError(res.status, message, fieldErrors)
  }
  if (res.status === 204) {
    return undefined
  }
  return res.json()
}

export async function signup({ email, password, name }) {
  return customerApiFetch('/api/v1/customer/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
}

export async function login({ email, password }) {
  return customerApiFetch('/api/v1/customer/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

/** Reads the refresh cookie server-side and rotates it - never called with a token argument. */
export async function refreshCustomerSession() {
  return customerApiFetch('/api/v1/customer/auth/refresh', { method: 'POST' })
}

export async function logout() {
  return customerApiFetch('/api/v1/customer/auth/logout', { method: 'POST' })
}

// Always resolves (204, no body) whether or not the email is registered - the backend
// deliberately keeps this response identical either way, see the controller.
export async function requestPasswordReset(email) {
  return customerApiFetch('/api/v1/customer/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function confirmPasswordReset({ token, newPassword }) {
  return customerApiFetch('/api/v1/customer/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  })
}
