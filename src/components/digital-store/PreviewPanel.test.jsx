import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PreviewPanel from './PreviewPanel'
import * as api from '../../utils/digitalStoreApi'

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:fake-url')
  globalThis.URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  delete globalThis.URL.createObjectURL
  delete globalThis.URL.revokeObjectURL
})

describe('PreviewPanel', () => {
  it('requests a preview and renders an embed pointed at the resulting blob URL', async () => {
    vi.spyOn(api, 'requestDigitalStorePreview').mockResolvedValue(new Blob(['%PDF-'], { type: 'application/pdf' }))
    render(<PreviewPanel templateId="t1" fieldValues={{ brideName: 'Jane' }} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    await waitFor(() => expect(screen.getByTitle(/preview/i)).toHaveAttribute('src', 'blob:fake-url'))
    expect(api.requestDigitalStorePreview).toHaveBeenCalledWith('t1', { brideName: 'Jane' })
  })

  it('shows field validation errors returned by the backend', async () => {
    const error = Object.assign(new Error('Validation failed'), { status: 400, fieldErrors: { brideName: 'is required' } })
    vi.spyOn(api, 'requestDigitalStorePreview').mockRejectedValue(error)
    render(<PreviewPanel templateId="t1" fieldValues={{}} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    await waitFor(() => expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument())
  })

  it('shows a generic retry message on a non-validation error', async () => {
    const error = Object.assign(new Error('rate limited'), { status: 429, fieldErrors: null })
    vi.spyOn(api, 'requestDigitalStorePreview').mockRejectedValue(error)
    render(<PreviewPanel templateId="t1" fieldValues={{}} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    await waitFor(() => expect(screen.getByText(/try again/i)).toBeInTheDocument())
  })

  it('revokes the previous blob URL when a new preview is generated', async () => {
    vi.spyOn(api, 'requestDigitalStorePreview').mockResolvedValue(new Blob(['%PDF-'], { type: 'application/pdf' }))
    render(<PreviewPanel templateId="t1" fieldValues={{}} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))
    await waitFor(() => expect(screen.getByTitle(/preview/i)).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))
    await waitFor(() => expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake-url'))
  })

  it('guards against state updates and revokes URLs when unmounting during an in-flight request', async () => {
    let resolvePreview
    const previewPromise = new Promise((resolve) => {
      resolvePreview = resolve
    })
    vi.spyOn(api, 'requestDigitalStorePreview').mockReturnValue(previewPromise)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { unmount } = render(<PreviewPanel templateId="t1" fieldValues={{}} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    // Unmount before the promise resolves
    unmount()

    // Resolve the promise after unmount
    resolvePreview(new Blob(['%PDF-'], { type: 'application/pdf' }))

    // Give any pending microtasks a chance to run
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Verify the blob URL was revoked immediately (not stored in ref for later cleanup)
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake-url')

    // Verify no React "state update on unmounted component" warning
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('state update on an unmounted component')
    )

    consoleErrorSpy.mockRestore()
  })
})
