import '@testing-library/jest-dom/vitest'

// jsdom has no IntersectionObserver, so any framer-motion `whileInView`
// animation throws ("IntersectionObserver is not defined") the instant such
// a component mounts under test - not a real bug, just an unimplemented
// browser API. This no-op stub lets those components mount normally; their
// content stays in the DOM at its `initial` animation state (e.g. opacity 0
// via inline style), which is exactly what RTL's text/role queries already
// don't care about.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver = IntersectionObserverStub
