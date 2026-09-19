import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadRazorpayCheckoutScript } from './razorpayScriptLoader'

beforeEach(() => {
  delete window.Razorpay
  document.querySelectorAll('script[data-razorpay-checkout]').forEach((el) => el.remove())
})

describe('loadRazorpayCheckoutScript', () => {
  it('resolves immediately if window.Razorpay already exists', async () => {
    window.Razorpay = vi.fn()

    await expect(loadRazorpayCheckoutScript()).resolves.toBeUndefined()
    expect(document.querySelectorAll('script[data-razorpay-checkout]')).toHaveLength(0)
  })

  it('injects the script tag once and resolves when it loads', async () => {
    const promise = loadRazorpayCheckoutScript()
    const script = document.querySelector('script[data-razorpay-checkout]')
    expect(script).not.toBeNull()
    expect(script.src).toBe('https://checkout.razorpay.com/v1/checkout.js')

    script.onload()

    await expect(promise).resolves.toBeUndefined()
  })

  it('reuses the same in-flight promise on a second call before the script loads', async () => {
    const first = loadRazorpayCheckoutScript()
    const second = loadRazorpayCheckoutScript()

    expect(document.querySelectorAll('script[data-razorpay-checkout]')).toHaveLength(1)

    document.querySelector('script[data-razorpay-checkout]').onload()
    await Promise.all([first, second])
  })
})
