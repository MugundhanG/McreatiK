/* ============================================
   useSEO
   Sets title, meta description, robots,
   canonical URL, and Open Graph/Twitter tags as
   the user navigates between routes in the
   browser.

   The first page load is already right without
   JavaScript: scripts/prerender-seo.mjs writes
   the same tags into each route's static HTML
   at build time. Both read src/seo/routes.js —
   pages pass seoFor('/path') so the two never
   drift. Dynamic pages (blog posts, store
   products/orders) pass their own values.
   ============================================ */

import { useEffect } from 'react'
import { SITE_URL, SHARE_IMAGES } from '../seo/routes'

function setMetaByName(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setMetaByProperty(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * @param {{ title: string, description: string, path: string, image?: string,
 *           section?: string, noindex?: boolean }} seo
 *   `path` is the route's path (e.g. '/tech/services'), used to build the
 *   canonical URL and og:url. `section` picks the default share image.
 *   `noindex` keeps the page out of search results.
 */
export function useSEO({ title, description, path, image, section, noindex = false }) {
  useEffect(() => {
    if (!title || !description || !path) return
    const url = `${SITE_URL}${path}`
    const resolvedImage = image || SHARE_IMAGES[section] || SHARE_IMAGES.home

    document.title = title
    setMetaByName('description', description)
    setMetaByName('robots', noindex ? 'noindex, follow' : 'index, follow')
    setCanonical(url)

    setMetaByProperty('og:title', title)
    setMetaByProperty('og:description', description)
    setMetaByProperty('og:url', url)
    setMetaByProperty('og:image', resolvedImage)

    setMetaByName('twitter:title', title)
    setMetaByName('twitter:description', description)
    setMetaByName('twitter:image', resolvedImage)
  }, [title, description, path, image, section, noindex])
}
