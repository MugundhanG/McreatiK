export const DIGITAL_STORE_EVENTS = {
  PRODUCT_VIEWED: 'digital_store_product_viewed',
  FORM_STARTED: 'digital_store_form_started',
  PREVIEW_REQUESTED: 'digital_store_preview_requested',
  PREVIEW_GENERATED: 'digital_store_preview_generated',
  CHECKOUT_INITIATED: 'digital_store_checkout_initiated',
  PAYMENT_SUCCESSFUL: 'digital_store_payment_successful',
  DOWNLOAD_INITIATED: 'digital_store_download_initiated',
  ADD_TO_CART_CLICKED: 'digital_store_add_to_cart_clicked',
}

// Reuses the same window.gtag mechanism already wired in index.html and already
// used by hooks/useForm.js - this is real analytics from day one, not a deferred
// stub, since the mechanism already exists and costs nothing extra to call.
export function trackDigitalStoreEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}
