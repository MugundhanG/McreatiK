let inFlightPromise = null

// Deliberately NOT added to index.html globally - this codebase lazy-loads every
// page specifically so a visitor only downloads what they chose (see App.jsx's own
// header comment). Razorpay's checkout.js only loads when a buyer actually reaches
// the point of paying.
export function loadRazorpayCheckoutScript() {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve()
  }
  if (inFlightPromise) {
    return inFlightPromise
  }
  inFlightPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.dataset.razorpayCheckout = 'true'
    script.onload = () => {
      inFlightPromise = null
      resolve()
    }
    script.onerror = () => {
      inFlightPromise = null
      reject(new Error('Failed to load the Razorpay checkout script'))
    }
    document.body.appendChild(script)
  })
  return inFlightPromise
}
