/* ============================================
   useScrollReveal Hook
   Uses IntersectionObserver to detect when an
   element enters the viewport, triggering a
   one-time reveal animation. Returns a ref
   and a boolean `isVisible`.
   ============================================ */

import { useEffect, useRef, useState } from 'react'

/**
 * @param {Object}  options
 * @param {number}  options.threshold - visibility ratio to trigger (0-1)
 * @param {string}  options.rootMargin - margin around root
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export function useScrollReveal({ threshold = 0.1, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        /* Once visible, disconnect — animation plays only once */
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
