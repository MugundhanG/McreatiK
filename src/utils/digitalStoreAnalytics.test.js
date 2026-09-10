import { describe, it, expect, vi, afterEach } from 'vitest'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from './digitalStoreAnalytics'

afterEach(() => {
  delete window.gtag
})

describe('trackDigitalStoreEvent', () => {
  it('calls window.gtag with the event name and params when gtag is available', () => {
    window.gtag = vi.fn()

    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PRODUCT_VIEWED, { template_id: 't1' })

    expect(window.gtag).toHaveBeenCalledWith('event', DIGITAL_STORE_EVENTS.PRODUCT_VIEWED, { template_id: 't1' })
  })

  it('does not throw when window.gtag is unavailable', () => {
    expect(() => trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PRODUCT_VIEWED)).not.toThrow()
  })
})
