/* ============================================
   prerender-seo — runs after `vite build`
   The site is a single-page app: without this,
   every URL is served the same index.html, so
   crawlers and link previews (WhatsApp,
   Facebook, LinkedIn don't run JavaScript) see
   the homepage's title and a canonical pointing
   at the homepage for every page.

   For each route in src/seo/routes.js that has
   a heading, this writes dist/<route>/index.html
   with that page's own head (title, description,
   canonical, robots, Open Graph, Twitter, JSON-
   LD) and a static <h1> + intro inside #root,
   which React replaces as soon as it boots.

   Also writes:
   - dist/<section>/blog/<slug>.html for every
     published CMS blog post (fetched from the
     API at build time) with the full, sanitised
     article in the static HTML; Vercel's
     cleanUrls serves it at /<section>/blog/<slug>.
     Posts published after a deploy fall back to
     spa.html until the next deploy;
   - dist/spa.html — a neutral shell (no
     canonical) for every other URL (dynamic
     store/blog pages, 404s); vercel.json's
     catch-all points there;
   - dist/sitemap.xml — from `sitemap: true`.

   Route data is loaded through Vite's SSR
   loader so it can reuse src/utils/constants
   (FAQ, packages) despite its asset imports.
   ============================================ */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'

const API_BASE = (process.env.VITE_API_BASE_URL || 'https://api.mcreatik.com').replace(/\/$/, '')
const DOMPurify = createDOMPurify(new JSDOM('').window)

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(route, routePath, { SITE_URL, SITE_NAME, SHARE_IMAGES }, jsonLd) {
  const url = `${SITE_URL}${routePath}`
  const image = route.image || SHARE_IMAGES[route.section] || SHARE_IMAGES.home
  const lines = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta name="robots" content="${route.noindex ? 'noindex, follow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${route.ogType || 'website'}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ]
  if (jsonLd) {
    // "</" inside a script would end it early — escape it
    lines.push(`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>`)
  }
  return lines.map((l) => `    ${l}`).join('\n')
}

/* Sub-pages to link from a page's static HTML, so crawlers can discover
   every indexable page by following links (not only via the sitemap):
   a Tech page links to all Tech sub-pages, a Studios page to all Studios
   sub-pages, and the homepage / legal pages to both sets. */
function sectionLinks(routes, route, currentPath) {
  const sections = route.section === 'tech' || route.section === 'studios'
    ? [route.section]
    : ['tech', 'studios']
  return Object.entries(routes)
    .filter(([href, r]) => href !== currentPath && sections.includes(r.section) && r.crumb && r.sitemap && !r.noindex)
    .map(([href, r]) => [href, r.section === 'studios' ? `Studios ${r.crumb}` : r.crumb])
}

/* Static first paint: the page's heading and summary plus the main and
   section links, on the same dark ground as the app's loading screen. */
function staticBody(route, routes, currentPath, { extraLinks = [], articleHtml = '' } = {}) {
  const link = (href, label) =>
    `<a href="${href}" style="color:#D8AE55;text-decoration:none;margin:0 10px;display:inline-block">${esc(label)}</a>`
  const subLinks = [...sectionLinks(routes, route, currentPath), ...extraLinks]
    .map(([href, label]) => link(href, label)).join('')
  return `<div id="root"><main style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;background:#0a0b10;color:#f1f2f5;font-family:Inter,system-ui,sans-serif">` +
    `<h1 style="margin:0;font-size:28px;line-height:1.2;max-width:720px">${esc(route.h1)}</h1>` +
    `<p style="margin:0;max-width:560px;color:#8890ae;font-size:15px;line-height:1.6">${esc(route.intro)}</p>` +
    (articleHtml ? `<article style="max-width:680px;text-align:left;color:#c9cbd6;font-size:15px;line-height:1.7">${articleHtml}</article>` : '') +
    `<nav aria-label="Main" style="font-size:14px">${link('/', 'McreatiK')}${link('/tech', 'McreatiK Tech')}${link('/studios', 'McreatiK Studios')}</nav>` +
    (subLinks ? `<nav aria-label="Section" style="font-size:13px;max-width:720px;line-height:2">${subLinks}</nav>` : '') +
    `</main></div>`
}

function replaceSeoBlock(html, tags) {
  const re = /<!--seo:start-->[\s\S]*?<!--seo:end-->/
  if (!re.test(html)) throw new Error('index.html is missing the <!--seo:start--> … <!--seo:end--> block')
  return html.replace(re, `<!--seo:start-->\n${tags}\n    <!--seo:end-->`)
}

function sitemap(routes, SITE_URL, extra = []) {
  const today = new Date().toISOString().slice(0, 10)
  const entries = [
    ...Object.entries(routes)
      .filter(([, r]) => r.sitemap && !r.noindex)
      .map(([p, r]) => ({ path: p, lastmod: today, priority: r.priority ?? 0.5 })),
    ...extra,
  ]
  const urls = entries.map(({ path: p, lastmod, priority }) =>
    `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

/* Published blog posts from the CMS. A failed fetch must not fail the
   deploy — the posts simply fall back to the client-rendered shell. */
async function fetchPublishedPosts() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/blog?size=200`, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const page = await res.json()
    return (page.content ?? []).filter((p) => p.status === 'PUBLISHED' && p.slug && (p.site === 'TECH' || p.site === 'STUDIOS'))
  } catch (err) {
    console.warn(`prerender-seo: couldn't fetch blog posts (${err.message}) — skipping post pages`)
    return []
  }
}

async function main() {
  const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  const server = await createServer({
    root,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  })

  try {
    const seo = await server.ssrLoadModule('/src/seo/routes.js')
    const { structuredDataFor, blogPostStructuredData } = await server.ssrLoadModule('/src/seo/structuredData.js')
    const { blogPostSeo, demoteHeadings } = await server.ssrLoadModule('/src/seo/blog.js')
    const posts = await fetchPublishedPosts()
    const postsBySection = (section) =>
      posts.map((p) => blogPostSeo(p)).filter((p) => p.section === section).map((p) => [p.path, p.h1])

    for (const routePath of seo.PRERENDER_PATHS) {
      const route = seo.ROUTES[routePath]
      const jsonLd = route.noindex ? null : structuredDataFor(routePath)
      let html = replaceSeoBlock(template, headTags(route, routePath, seo, jsonLd))
      // Blog index pages also link every published post
      const extraLinks = routePath === '/tech/blog' ? postsBySection('tech')
        : routePath === '/studios/blog' ? postsBySection('studios') : []
      html = html.replace('<div id="root"></div>', staticBody(route, seo.ROUTES, routePath, { extraLinks }))

      const out = routePath === '/'
        ? path.join(dist, 'index.html')
        : path.join(dist, ...routePath.split('/').filter(Boolean), 'index.html')
      fs.mkdirSync(path.dirname(out), { recursive: true })
      fs.writeFileSync(out, html)
    }

    // One static page per published blog post, full article included
    const postEntries = []
    for (const post of posts) {
      const meta = blogPostSeo(post)
      const route = { ...meta, ogType: 'article' }
      const articleHtml = DOMPurify.sanitize(demoteHeadings(post.content))
      let html = replaceSeoBlock(template, headTags(route, meta.path, seo, blogPostStructuredData(post)))
      html = html.replace('<div id="root"></div>', staticBody(route, seo.ROUTES, meta.path, {
        extraLinks: [[meta.blogPath, 'All posts']],
        articleHtml,
      }))
      const out = path.join(dist, ...meta.path.split('/').filter(Boolean)) + '.html'
      fs.mkdirSync(path.dirname(out), { recursive: true })
      fs.writeFileSync(out, html)
      postEntries.push({ path: meta.path, lastmod: String(post.updatedAt || post.createdAt).slice(0, 10), priority: 0.6 })
    }

    // Neutral shell for every other URL — no canonical, so dynamic pages
    // and 404s never claim to be the homepage. useSEO fills in the rest.
    const spa = replaceSeoBlock(template, [
      `    <title>${esc(seo.SITE_NAME)}</title>`,
      `    <meta name="description" content="${esc(seo.ROUTES['/'].description)}" />`,
    ].join('\n'))
    fs.writeFileSync(path.join(dist, 'spa.html'), spa)

    fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap(seo.ROUTES, seo.SITE_URL, postEntries))

    console.log(`prerender-seo: ${seo.PRERENDER_PATHS.length} pages, ${postEntries.length} blog posts, spa.html, sitemap.xml`)
  } finally {
    await server.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
