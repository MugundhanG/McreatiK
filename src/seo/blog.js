/* ============================================
   Blog post SEO — shared by the BlogPost pages
   (in the browser, via useSEO) and by
   scripts/prerender-seo.mjs (which writes each
   published post's own static HTML at build
   time). No imports beyond routes.js: loaded by
   a Node script.
   ============================================ */

import { SITE_URL } from './routes'

const BRAND = {
  TECH: { section: 'tech', suffix: 'McreatiK Tech', blogPath: '/tech/blog' },
  STUDIOS: { section: 'studios', suffix: 'McreatiK Studios', blogPath: '/studios/blog' },
}

const clip = (text, max) => {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim()
  return s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

/* Title/description/etc. for one post. Doesn't add the brand suffix twice
   when the post's own SEO title already names McreatiK. */
export function blogPostSeo(post) {
  const brand = BRAND[post.site] ?? BRAND.TECH
  const base = post.seoTitle || post.title
  const title = /mcreatik/i.test(base) ? base : `${base} | ${brand.suffix}`
  const description = clip(post.seoDescription || post.excerpt || `${post.title} — from the ${brand.suffix} blog.`, 160)
  return {
    path: `${brand.blogPath}/${post.slug}`,
    section: brand.section,
    title,
    description,
    image: post.cover?.url,
    h1: post.title,
    intro: clip(post.excerpt, 220),
    crumb: post.title,
    blogPath: brand.blogPath,
  }
}

/* The page already has the post title as its <h1>; headings inside the
   post body are demoted one level so there's exactly one <h1> per page. */
export function demoteHeadings(html) {
  return String(html ?? '').replace(/<(\/?)h1(\s[^>]*)?>/gi, '<$1h2$2>')
}

/* schema.org BlogPosting for one post */
export function blogPostingSchema(post, orgId) {
  const seo = blogPostSeo(post)
  const url = `${SITE_URL}${seo.path}`
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: clip(post.title, 110),
    description: seo.description,
    ...(seo.image ? { image: seo.image } : {}),
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: post.authorName ? { '@type': 'Person', name: post.authorName.replace(/_/g, ' ') } : { '@id': orgId },
    publisher: { '@id': orgId },
    mainEntityOfPage: url,
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
  }
}
