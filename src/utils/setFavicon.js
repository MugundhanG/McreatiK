/* ============================================
   setFavicon
   Swaps the browser tab icon to match whichever
   department page is currently mounted.
   ============================================ */

export function setFavicon(href) {
  const link = document.querySelector('link[rel="icon"]')
  if (!link) return
  link.type = href.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
  link.href = href
}
