import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PreviewPanel from './PreviewPanel'
import * as api from '../../utils/digitalStoreApi'

beforeEach(() => {
  vi.restoreAllMocks()
  global.URL.createObjectURL = vi.fn(() => 'blob:fake-url')
  global.URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  delete global.URL.createObjectURL
  delete global.URL.revokeObjectURL
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
    await waitFor(() => expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake-url'))
  })
})
