import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DigitalStoreOrderPage from './DigitalStoreOrderPage'
import * as api from '../utils/digitalStoreApi'
import * as checkoutHook from '../hooks/useCheckout'

function renderAt(orderId) {
  return render(
    <MemoryRouter initialEntries={[`/digital_store/t1/order/${orderId}`]}>
      <Routes>
        <Route path="/digital_store/:templateId/order/:orderId" element={<DigitalStoreOrderPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('DigitalStoreOrderPage', () => {
  it('shows a recovery message when no payment details are stored for this order', async () => {
    vi.spyOn(checkoutHook, 'readStoredPaymentDetails').mockReturnValue(null)

    renderAt('order-missing')

    expect(await screen.findByText(/contact us/i)).toBeInTheDocument()
  })

  it('shows "preparing" then transitions to the download-ready state once /verify reports fulfilled', async () => {
    vi.spyOn(checkoutHook, 'readStoredPaymentDetails').mockReturnValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
    const verifySpy = vi
      .spyOn(api, 'verifyDigitalStoreOrder')
      .mockResolvedValueOnce({ orderId: 'order-1', fulfilled: false })
      .mockResolvedValueOnce({ orderId: 'order-1', fulfilled: true, downloadToken: 'tok', downloadTokenExpiresAt: '2099-01-01T00:00:00Z' })

    renderAt('order-1')

    expect(await screen.findByText(/preparing your document/i)).toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(5000)

    expect(await screen.findByRole('link', { name: /download/i })).toBeInTheDocument()
    expect(verifySpy).toHaveBeenCalledTimes(2)
  })

  it('the download link points at the correct download URL', async () => {
    vi.spyOn(checkoutHook, 'readStoredPaymentDetails').mockReturnValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
    vi.spyOn(api, 'verifyDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', fulfilled: true, downloadToken: 'tok-abc', downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
    })

    renderAt('order-1')

    const link = await screen.findByRole('link', { name: /download/i })
    expect(link).toHaveAttribute('href', api.digitalStoreDownloadUrl('order-1', 'tok-abc'))
  })
})
