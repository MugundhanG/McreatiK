/* ============================================
   Gallery posts — response normalisation
   The CMS returns photos[] per gallery item from
   the multi-photo backend onward; older backends
   only send a single `media`. toPost() gives the
   UI one shape either way.
   ============================================ */

export function toPost(item) {
  const photos = item.photos?.length ? item.photos : [{ media: item.media, altText: item.media?.altText ?? null }]
  return { ...item, location: item.location ?? null, photos }
}

export function photoAlt(post, photo) {
  return photo.altText || post.title
}
