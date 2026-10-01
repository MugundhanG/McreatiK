/* ============================================
   Motion kit — the site's shared signature
   motions. Prefer these over ad-hoc
   whileInView fade-ups so every page speaks
   the same motion language. All of them honour
   prefers-reduced-motion; the cursor-driven ones
   also switch off on touch devices.
   ============================================ */

export { default as RevealText } from './RevealText'
export { default as RevealBlock } from './RevealBlock'
export { Parallax, ParallaxImage } from './Parallax'
export { default as Magnetic } from './Magnetic'
export { default as Tilt } from './Tilt'
export { default as ScrollLine } from './ScrollLine'
export { default as useFinePointer } from './useFinePointer'
