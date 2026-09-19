/* ============================================
   AuthContext / useAuth
   First React Context in this codebase (confirmed
   by search - everything else is a plain `*Api.js`
   module + local component state). Kept deliberately
   minimal and consistent with that convention: this
   context owns only "who is the signed-in customer,
   right now" - login/signup/logout plus loading/error
   state - and delegates all actual request/token
   plumbing to src/utils/customerApi.js.

   Mirrors mcreatik-admin's src/context/AuthContext.tsx
   shape (refresh-on-mount via the httpOnly cookie,
   configureAuth() wiring so a 401 anywhere triggers
   this same refresh), adapted to plain JS/JSX and to
   the Customer identity (no `role` field - Customer
   has none).
   ============================================ */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  signup as signupRequest,
  login as loginRequest,
  logout as logoutRequest,
  refreshCustomerSession,
  configureAuth,
  setAccessToken,
} from '../utils/customerApi'

const AuthContext = createContext(null)

function toCustomer(authResponse) {
  // CustomerAuthResponse only ever carries `name` - no email/id is returned by
  // the backend (see CustomerAuthResponse.java) - so that's all we can expose.
  return { name: authResponse.name }
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const res = await refreshCustomerSession()
      setAccessToken(res.accessToken)
      setCustomer(toCustomer(res))
      return res.accessToken
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    // Wires the module-level customerApi client back to this context: a 401
    // anywhere in the app triggers this same refresh, and a failed refresh
    // clears the signed-in state.
    configureAuth(refresh, () => {
      setAccessToken(null)
      setCustomer(null)
    })

    let isCurrent = true
    // On first load there's no access token in memory (it's never persisted) -
    // silently try the refresh cookie before deciding the visitor is signed out.
    async function bootstrapSession() {
      await refresh()
      if (isCurrent) setLoading(false)
    }
    bootstrapSession()

    return () => {
      isCurrent = false
    }
  }, [refresh])

  const signup = useCallback(async ({ email, password, name }) => {
    setError(null)
    try {
      const res = await signupRequest({ email, password, name })
      setAccessToken(res.accessToken)
      setCustomer(toCustomer(res))
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      throw err
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setError(null)
    try {
      const res = await loginRequest({ email, password })
      setAccessToken(res.accessToken)
      setCustomer(toCustomer(res))
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    setAccessToken(null)
    setCustomer(null)
    setError(null)
    try {
      await logoutRequest()
    } catch {
      // Client-side state is already cleared regardless of whether this call succeeds.
    }
  }, [])

  return (
    <AuthContext.Provider value={{ customer, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Co-locating the hook with its Provider is the standard React Context pattern;
// splitting into a second file just to dodge this Fast Refresh lint rule isn't
// worth the indirection.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
