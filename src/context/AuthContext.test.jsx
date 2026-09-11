import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

const AUTH_RESPONSE = { accessToken: 'access-1', tokenType: 'Bearer', expiresInSeconds: 900, name: 'Jane Doe' }

function Probe() {
  const { customer, loading, error, login, signup, logout } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="customer">{customer ? customer.name : 'none'}</span>
      <span data-testid="error">{error || 'none'}</span>
      <button onClick={() => login({ email: 'jane@example.com', password: 'password123' }).catch(() => {})}>login</button>
      <button onClick={() => signup({ email: 'jane@example.com', password: 'password123', name: 'Jane Doe' }).catch(() => {})}>signup</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}

beforeEach(() => {
  globalThis.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AuthProvider', () => {
  it('starts loading, then settles to signed-out when the refresh cookie has no session', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'no session' }) })

    render(<AuthProvider><Probe /></AuthProvider>)

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('customer').textContent).toBe('none')
  })

  it('picks up an existing session from the refresh cookie on mount', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => AUTH_RESPONSE })

    render(<AuthProvider><Probe /></AuthProvider>)

    await waitFor(() => expect(screen.getByTestId('customer').textContent).toBe('Jane Doe'))
  })

  it('login() sets the customer on success', async () => {
    const user = userEvent.setup()
    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ message: 'no session' }) }) // mount refresh
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => AUTH_RESPONSE }) // login

    render(<AuthProvider><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))

    await user.click(screen.getByText('login'))

    await waitFor(() => expect(screen.getByTestId('customer').textContent).toBe('Jane Doe'))
  })

  it('login() surfaces the backend error message and leaves the customer signed out', async () => {
    const user = userEvent.setup()
    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ message: 'no session' }) }) // mount refresh
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ message: 'Invalid email or password' }) }) // login

    render(<AuthProvider><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))

    await user.click(screen.getByText('login'))

    await waitFor(() => expect(screen.getByTestId('error').textContent).toBe('Invalid email or password'))
    expect(screen.getByTestId('customer').textContent).toBe('none')
  })

  it('logout() clears the customer even if the server call fails', async () => {
    const user = userEvent.setup()
    globalThis.fetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => AUTH_RESPONSE }) // mount refresh -> signed in
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ message: 'boom' }) }) // logout fails server-side

    render(<AuthProvider><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('customer').textContent).toBe('Jane Doe'))

    await user.click(screen.getByText('logout'))

    await waitFor(() => expect(screen.getByTestId('customer').textContent).toBe('none'))
  })

  it('useAuth throws when used outside an AuthProvider', () => {
    function Bare() {
      useAuth()
      return null
    }
    // Suppress the expected React error-boundary console noise for this one assertion.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Bare />)).toThrow('useAuth must be used within an AuthProvider')
    spy.mockRestore()
  })
})
