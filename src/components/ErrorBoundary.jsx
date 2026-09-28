/* ============================================
   ErrorBoundary — site-wide crash screen
   Catches render errors anywhere below it and
   shows a friendly "Something went wrong" page
   (styled like NotFound) instead of a blank
   white screen. Resets itself when the route
   changes, so navigating away recovers.
   ============================================ */

import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info?.componentStack)
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        className="min-h-screen bg-[#0e0e10] text-white flex flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Error</p>
        <h1 className="text-3xl sm:text-4xl font-semibold">Something went wrong</h1>
        <p className="text-gray-400 max-w-md">
          This page hit an unexpected problem. Reloading usually fixes it.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Reload page
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-white/15 hover:border-white/30 text-white text-sm font-semibold transition-colors"
          >
            Go to home
          </a>
        </div>
      </div>
    )
  }
}
