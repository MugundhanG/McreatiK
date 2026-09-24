/* ============================================
   Gallery sample posts — LOCAL DEV ONLY
   Placeholder event posts (picsum.photos) so the
   grid and post viewer can be reviewed with
   realistic volume before real posts exist in
   the CMS. Gallery.jsx only uses these when
   import.meta.env.DEV is true, so they never
   ship to production. Delete this file once the
   real posts are in.
   ============================================ */

const CATEGORIES = [
  'Portrait Session',
  'Wedding Photography',
  'Pre and Post Wedding',
  'Baby & Kids Outdoor Shoots',
  'Model Outdoor Shoots',
  'Maternity and Baby Shower',
  'Birthday Parties',
  'Ring Ceremony',
  'House Warming',
  'Photo Album Design',
]

const LOCATIONS = ['Chennai', 'Kumbakonam', 'Pondicherry', null]

// Photo counts per post, rotated per category — covers the 1-photo, typical, and 20-photo cases.
const PHOTO_COUNTS = [
  [1, 6, 20],
  [4, 9, 2],
  [12, 3, 7],
]

// Mixed portrait / landscape / square shapes so the viewer's object-contain gets exercised.
const SIZES = [
  [800, 1100],
  [1200, 800],
  [900, 900],
  [800, 1200],
  [1200, 850],
]

export const GALLERY_SAMPLES = CATEGORIES.flatMap((category, c) =>
  PHOTO_COUNTS[c % PHOTO_COUNTS.length].map((count, p) => ({
    id: `sample-${c}-${p}`,
    title: `${category} — Sample Event ${p + 1}`,
    description: 'Sample caption. Replace this post with a real event from the admin panel.',
    category,
    location: LOCATIONS[(c + p) % LOCATIONS.length],
    photos: Array.from({ length: count }, (_, i) => {
      const [w, h] = SIZES[(c + p + i) % SIZES.length]
      return {
        media: { id: `sample-${c}-${p}-${i}`, url: `https://picsum.photos/seed/mcreatik-${c}-${p}-${i}/${w}/${h}` },
        altText: null,
      }
    }),
  }))
)
