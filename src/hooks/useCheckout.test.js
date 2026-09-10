import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCheckout } from './useCheckout'
import * as api from '../utils/digitalStoreApi'
import * as scriptLoader from '../utils/razorpayScriptLoader'

const TEMPLATE = { id: 'template-1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR' }

beforeEach(() => {
  sessionStorage.clear()
  vi.restoreAllMocks()
  vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockResolvedValue(undefined)
})

function mockRazorpayCapturingOptions() {
  let capturedOptions = null
  const openMock = vi.fn()
  class RazorpayMock {
    constructor(options) {
      capturedOptions = options
    }
    open() {
      return openMock()
    }
  }
  window.Razorpay = RazorpayMock
  return { getOptions: () => capturedOptions, openMock }
}

describe('useCheckout', () => {
  it('goes idle -> creating_order -> awaiting_payment and opens Razorpay on a successful order creation', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR',
    })
    const { openMock } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    expect(result.current.status).toBe('idle')

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    expect(result.current.status).toBe('awaiting_payment')
    expect(openMock).toHaveBeenCalledTimes(1)
  })

  it('reuses the same idempotency key across two calls to startCheckout', async () => {
    const createOrderSpy = vi
      .spyOn(api, 'createDigitalStoreOrder')
      .mockResolvedValue({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR' })
    mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const details = { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} }

    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })
    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })

    const [firstKey] = createOrderSpy.mock.calls[0]
    const [secondKey] = createOrderSpy.mock.calls[1]
    expect(firstKey).toBe(secondKey)
  })

  it('persists payment details to sessionStorage and calls onSuccess when Razorpay reports success', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR',
    })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const onSuccess = vi.fn()

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess }
      )
    })

    act(() => {
      getOptions().handler({
        razorpay_order_id: 'rzp_order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'sig_1',
      })
    })

    expect(onSuccess).toHaveBeenCalledWith('order-1')
    const stored = JSON.parse(sessionStorage.getItem('digital-store-order-order-1'))
    expect(stored).toEqual({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
    expect(result.current.status).toBe('idle')
  })

  it('returns to idle when the buyer dismisses the Razorpay modal', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR',
    })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    act(() => {
      getOptions().modal.ondismiss()
    })

    expect(result.current.status).toBe('idle')
  })

  it('sets status to error and captures the error when order creation fails', async () => {
    const failure = Object.assign(new Error('rate limited'), { status: 429 })
    vi.spyOn(api, 'createDigitalStoreOrder').mockRejectedValue(failure)
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe(failure)
  })
})
