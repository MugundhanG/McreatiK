/* ============================================
   setFavicon
   Swaps the browser tab icon to match whichever
   department page is currently mounted.
   ============================================ */

export function setFavicon(href) {
  const link = document.querySelector('link[rel="icon"]')
  if (link) link.href = href
}
