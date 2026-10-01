/* ============================================
   useFinePointer
   True only on devices with a real hovering
   mouse/trackpad. Cursor-driven effects
   (Magnetic, Tilt) switch themselves off on
   touch screens, where they'd only misfire.
   ============================================ */

import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

export default function useFinePointer() {
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia?.(QUERY)
    if (!mql) return undefined
    const onChange = (e) => setFine(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return fine
}
