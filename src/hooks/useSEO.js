/* ============================================
   useSEO
   Sets title, meta description, canonical URL,
   and Open Graph/Twitter tags for the current
   route. index.html only ever describes the
   homepage — without this, every shared link and
   every search result for any other route shows
   that same homepage title/description/image
   instead of its own.
   ============================================ */

import { useEffect } from 'react'

const SITE_URL = 'https://mcreatik.com'
const DEFAULT_IMAGE = `${SITE_URL}/share-image.png`

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
 * @param {{ title: string, description: string, path: string, image?: string }} seo
 *   `path` is the route's path (e.g. '/tech/services'), used to build the
 *   canonical URL and og:url.
 */
export function useSEO({ title, description, path, image }) {
  useEffect(() => {
    if (!title || !description || !path) return
    const url = `${SITE_URL}${path}`
    const resolvedImage = image || DEFAULT_IMAGE

    document.title = title
    setMetaByName('description', description)
    setCanonical(url)

    setMetaByProperty('og:title', title)
    setMetaByProperty('og:description', description)
    setMetaByProperty('og:url', url)
    setMetaByProperty('og:image', resolvedImage)

    setMetaByName('twitter:title', title)
    setMetaByName('twitter:description', description)
    setMetaByName('twitter:image', resolvedImage)
  }, [title, description, path, image])
}
