import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { useRequireAuthOrRedirect } from './useRequireAuthOrRedirect'

const AUTH_RESPONSE = { accessToken: 'access-1', tokenType: 'Bearer', expiresInSeconds: 900, name: 'Jane Doe' }

function DemoButton({ onAuthenticated }) {
  const requireAuthOrRedirect = useRequireAuthOrRedirect()
  return <button onClick={() => requireAuthOrRedirect(onAuthenticated)}>do the thing</button>
}

function LoginStub() {
  return <div>login page</div>
}

function renderAt(path, onAuthenticated) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/store/product/:id" element={<DemoButton onAuthenticated={onAuthenticated} />} />
          <Route path="/store/login" element={<LoginStub />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  globalThis.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useRequireAuthOrRedirect', () => {
  it('does not run the action and redirects to /store/login while the signed-out visitor is unauthenticated', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'no session' }) })
    const onAuthenticated = vi.fn()
    const user = userEvent.setup()

    renderAt('/store/product/abc', onAuthenticated)
    await waitFor(() => expect(screen.getByText('do the thing')).toBeInTheDocument())

    await user.click(screen.getByText('do the thing'))

    expect(onAuthenticated).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.getByText('login page')).toBeInTheDocument())
  })

  it('runs the action immediately without redirecting when a customer is signed in', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => AUTH_RESPONSE })
    const onAuthenticated = vi.fn()
    const user = userEvent.setup()

    renderAt('/store/product/abc', onAuthenticated)
    await waitFor(() => expect(screen.getByText('do the thing')).toBeInTheDocument())

    await user.click(screen.getByText('do the thing'))

    expect(onAuthenticated).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('login page')).not.toBeInTheDocument()
  })

  it('does nothing while auth state is still loading (no premature redirect or action run)', async () => {
    let resolveFetch
    globalThis.fetch.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve }))
    const onAuthenticated = vi.fn()
    const user = userEvent.setup()

    renderAt('/store/product/abc', onAuthenticated)

    await user.click(screen.getByText('do the thing'))

    expect(onAuthenticated).not.toHaveBeenCalled()
    expect(screen.queryByText('login page')).not.toBeInTheDocument()

    resolveFetch({ ok: false, status: 401, json: async () => ({ message: 'no session' }) })
  })
})
