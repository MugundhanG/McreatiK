import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  customerApiFetch,
  signup,
  login,
  refreshCustomerSession,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
  uploadCustomerImage,
  setAccessToken,
  configureAuth,
  CustomerApiError,
} from './customerApi'

const AUTH_RESPONSE = { accessToken: 'access-1', tokenType: 'Bearer', expiresInSeconds: 900, name: 'Jane Doe' }

beforeEach(() => {
  globalThis.fetch = vi.fn()
  setAccessToken(null)
  configureAuth(null, null)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('signup', () => {
  it('POSTs to /api/v1/customer/auth/signup with credentials included and returns the parsed body', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 201, json: async () => AUTH_RESPONSE })

    const res = await signup({ email: 'jane@example.com', password: 'password123', name: 'Jane Doe' })

    expect(res).toEqual(AUTH_RESPONSE)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/customer/auth/signup')
    expect(options.method).toBe('POST')
    expect(options.credentials).toBe('include')
    expect(JSON.parse(options.body)).toEqual({ email: 'jane@example.com', password: 'password123', name: 'Jane Doe' })
  })

  it('throws CustomerApiError with the backend message on a 409 conflict', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ message: 'An account with that email already exists' }),
    })

    await expect(signup({ email: 'jane@example.com', password: 'password123', name: 'Jane' })).rejects.toMatchObject({
      status: 409,
      message: 'An account with that email already exists',
    })
  })
})

describe('login', () => {
  it('POSTs email/password and returns the auth response', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => AUTH_RESPONSE })

    const res = await login({ email: 'jane@example.com', password: 'password123' })

    expect(res.name).toBe('Jane Doe')
    const [, options] = globalThis.fetch.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({ email: 'jane@example.com', password: 'password123' })
  })

  it('throws CustomerApiError on invalid credentials (401)', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'Invalid email or password' }) })

    await expect(login({ email: 'jane@example.com', password: 'wrong' })).rejects.toMatchObject({ status: 401 })
  })

  it('does not attempt a refresh-and-retry on its own 401 (would recurse)', async () => {
    const refreshFn = vi.fn().mockResolvedValue('new-token')
    configureAuth(refreshFn, vi.fn())
    globalThis.fetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'bad creds' }) })

    await expect(login({ email: 'a@b.com', password: 'x' })).rejects.toBeInstanceOf(CustomerApiError)
    expect(refreshFn).not.toHaveBeenCalled()
  })
})

describe('refreshCustomerSession', () => {
  it('POSTs with no body to /api/v1/customer/auth/refresh', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => AUTH_RESPONSE })

    const res = await refreshCustomerSession()

    expect(res).toEqual(AUTH_RESPONSE)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/customer/auth/refresh')
    expect(options.body).toBeUndefined()
  })
})

describe('logout', () => {
  it('returns undefined on a 204 No Content response', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 204, json: async () => { throw new Error('no body') } })

    const res = await logout()

    expect(res).toBeUndefined()
  })
})

describe('requestPasswordReset / confirmPasswordReset', () => {
  it('requestPasswordReset sends the email and resolves on 204 regardless of whether the account exists', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 204, json: async () => { throw new Error('no body') } })

    await expect(requestPasswordReset('unknown@example.com')).resolves.toBeUndefined()
    const [, options] = globalThis.fetch.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({ email: 'unknown@example.com' })
  })

  it('confirmPasswordReset sends token + newPassword', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 204, json: async () => { throw new Error('no body') } })

    await confirmPasswordReset({ token: 'reset-tok', newPassword: 'newpassword123' })

    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/customer/auth/password-reset/confirm')
    expect(JSON.parse(options.body)).toEqual({ token: 'reset-tok', newPassword: 'newpassword123' })
  })

  it('throws CustomerApiError with fieldErrors on an invalid reset token', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Validation failed', fieldErrors: { token: 'invalid or expired' } }),
    })

    await expect(confirmPasswordReset({ token: 'bad', newPassword: 'newpassword123' })).rejects.toMatchObject({
      status: 400,
      fieldErrors: { token: 'invalid or expired' },
    })
  })
})

describe('customerApiFetch auth header + 401 refresh-and-retry', () => {
  it('attaches the Authorization header when an access token is set', async () => {
    setAccessToken('access-1')
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })

    await customerApiFetch('/api/v1/customer/protected')

    const [, options] = globalThis.fetch.mock.calls[0]
    expect(options.headers.get('Authorization')).toBe('Bearer access-1')
  })

  it('on a 401 from a non-auth endpoint, calls the configured refresh function and retries once', async () => {
    const refreshFn = vi.fn().mockResolvedValue('new-access-token')
    const onAuthFailure = vi.fn()
    configureAuth(refreshFn, onAuthFailure)

    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ message: 'expired' }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ ok: true }) })

    const res = await customerApiFetch('/api/v1/customer/protected')

    expect(res).toEqual({ ok: true })
    expect(refreshFn).toHaveBeenCalledTimes(1)
    expect(onAuthFailure).not.toHaveBeenCalled()
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
  })

  it('calls onAuthFailure and throws when refresh fails to produce a new token', async () => {
    const refreshFn = vi.fn().mockResolvedValue(null)
    const onAuthFailure = vi.fn()
    configureAuth(refreshFn, onAuthFailure)

    globalThis.fetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'expired' }) })

    await expect(customerApiFetch('/api/v1/customer/protected')).rejects.toBeInstanceOf(CustomerApiError)
    expect(onAuthFailure).toHaveBeenCalledTimes(1)
  })

  it('every request is sent with credentials: include so the httpOnly refresh cookie travels cross-origin', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })

    await customerApiFetch('/api/v1/customer/auth/login', { method: 'POST', body: JSON.stringify({}) })

    const [, options] = globalThis.fetch.mock.calls[0]
    expect(options.credentials).toBe('include')
  })
})

describe('uploadCustomerImage', () => {
  it('POSTs a FormData body to /api/v1/customer/uploads/image and returns the parsed response', async () => {
    setAccessToken('token-123')
    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ url: 'https://cdn.test/customer-uploads/abc/def.png' }),
    })

    const result = await uploadCustomerImage(file)

    expect(result).toEqual({ url: 'https://cdn.test/customer-uploads/abc/def.png' })
    const [calledUrl, calledOptions] = globalThis.fetch.mock.calls[0]
    expect(calledUrl).toContain('/api/v1/customer/uploads/image')
    expect(calledOptions.body).toBeInstanceOf(FormData)
  })

  it('does not force a JSON Content-Type header onto a FormData upload', async () => {
    setAccessToken('token-123')
    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ url: 'https://cdn.test/customer-uploads/abc/def.png' }),
    })

    await uploadCustomerImage(file)

    const [, calledOptions] = globalThis.fetch.mock.calls[0]
    const headers = new Headers(calledOptions.headers)
    expect(headers.has('Content-Type')).toBe(false)
  })

  it('surfaces a rejection the same way other customerApiFetch calls do', async () => {
    setAccessToken('token-123')
    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'file must be a PNG, JPEG, or WebP image' }),
    })

    await expect(uploadCustomerImage(file)).rejects.toThrow('file must be a PNG, JPEG, or WebP image')
  })
})
