const API_BASE = import.meta.env.VITE_API_BASE_URL

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`)
  }
  return res.json()
}

// All three content types expose the same public shape: published-only,
// Spring Data's Page envelope. Callers only need `.content`.

export async function fetchGalleryItems({ category } = {}) {
  const query = category ? `?category=${encodeURIComponent(category)}&size=50` : '?size=50'
  const page = await getJson(`/api/v1/gallery${query}`)
  return page.content
}

export async function fetchAlbums() {
  const page = await getJson('/api/v1/albums?size=50')
  return page.content
}

export async function fetchBlogPosts({ site } = {}) {
  const query = site ? `?site=${encodeURIComponent(site)}&size=50` : '?size=50'
  const page = await getJson(`/api/v1/blog${query}`)
  return page.content
}

export async function fetchBlogPost(slug) {
  return getJson(`/api/v1/blog/${encodeURIComponent(slug)}`)
}
