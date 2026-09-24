import { describe, expect, it } from 'vitest'
import { photoAlt, toPost } from './galleryPosts'

const media = { id: 7, url: 'https://cdn.test/7.jpg', altText: 'Media alt' }

describe('toPost', () => {
  it('keeps the photos array from the new API shape', () => {
    const photos = [{ media, altText: 'Bride' }, { media: { id: 8, url: 'u8' }, altText: null }]
    const post = toPost({ id: 1, title: 'Wedding', media, photos, location: 'Kumbakonam' })

    expect(post.photos).toBe(photos)
    expect(post.location).toBe('Kumbakonam')
  })

  it('falls back to a single photo when the API has no photos field (old backend)', () => {
    const post = toPost({ id: 1, title: 'Legacy', media })

    expect(post.photos).toEqual([{ media, altText: 'Media alt' }])
    expect(post.location).toBeNull()
  })

  it('falls back when photos is an empty array', () => {
    expect(toPost({ id: 1, title: 'Empty', media, photos: [] }).photos).toHaveLength(1)
  })
})

describe('photoAlt', () => {
  it('prefers the per-photo alt text, then the post title', () => {
    const post = { title: 'Wedding' }
    expect(photoAlt(post, { altText: 'Bride' })).toBe('Bride')
    expect(photoAlt(post, { altText: null })).toBe('Wedding')
  })
})
