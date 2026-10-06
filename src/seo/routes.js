/* ============================================
   SEO routes — single source of truth
   Every public page's title, description,
   heading and intro live here. Used twice:
   - in the browser, by useSEO (via seoFor) to
     set the head on client-side navigation;
   - at build time, by scripts/prerender-seo.mjs
     to write a real HTML file per route, so
     crawlers and link previews (WhatsApp,
     Facebook, LinkedIn — none of which run
     JavaScript) get the right page without JS.
   That script also builds sitemap.xml from
   the `sitemap: true` entries.

   Keep this file free of asset/component
   imports — it is loaded by a Node script.

   Fields:
   - title (≤ ~60 chars), description (~150–160)
   - h1 / intro: the page's real heading and a
     short summary, rendered as static content
   - section: 'home' | 'tech' | 'studios' |
     'legal' | 'store' — picks share image,
     structured data and breadcrumb root
   - noindex: keep out of search results
   - sitemap: include in sitemap.xml
   ============================================ */

export const SITE_URL = 'https://mcreatik.com'
export const SITE_NAME = 'McreatiK'
export const PHONE = '+91 99527 58545'
export const PHONE_E164 = '+919952758545'
export const EMAIL = 'connect@mcreatik.com'

export const SHARE_IMAGES = {
  home: `${SITE_URL}/share-image.png`,
  tech: `${SITE_URL}/share-tech.jpg`,
  studios: `${SITE_URL}/share-studios.jpg`,
  legal: `${SITE_URL}/share-image.png`,
  store: `${SITE_URL}/share-image.png`,
}

export const ROUTES = {
  '/': {
    section: 'home',
    title: 'McreatiK | Websites Worldwide & Event Photography in Chennai',
    description:
      'McreatiK designs and develops websites for businesses worldwide (McreatiK Tech) and photographs weddings, birthdays, portraits and events in Chennai (McreatiK Studios).',
    h1: 'McreatiK',
    intro:
      'One brand, two crafts: McreatiK Tech designs websites and branding for businesses anywhere, and McreatiK Studios photographs weddings, portraits and events in Chennai, Tamil Nadu and nearby states.',
    sitemap: true,
    priority: 1.0,
  },

  /* ---------- Tech ---------- */
  '/tech': {
    section: 'tech',
    crumb: null,
    title: 'Website Design & Development for Businesses | McreatiK Tech',
    description:
      'Website design and development, landing pages, branding and SEO for businesses worldwide. Clear packages from ₹25,000 — see 37 live concepts in 11 industries.',
    h1: 'Build a stronger digital presence for your business',
    intro:
      'Modern websites, branding and digital design that help businesses look professional online and get more customers — delivered remotely, wherever you are.',
    sitemap: true,
    priority: 0.9,
  },
  '/tech/services': {
    section: 'tech',
    crumb: 'Services',
    title: 'Website Design, Development & SEO Services | McreatiK Tech',
    description:
      'Website development and redesign, landing pages, logo and brand identity, SEO, Google Business Profile and WhatsApp setup for small businesses, worldwide.',
    h1: 'Services That Grow With Your Business',
    intro:
      'Website development is our core focus — branding and digital design round out a complete online presence.',
    sitemap: true,
    priority: 0.8,
  },
  '/tech/industries': {
    section: 'tech',
    crumb: 'Industries',
    title: 'Websites for Clinics, Gyms, Shops & More | McreatiK Tech',
    description:
      'Websites designed for dental and skin clinics, gyms, coaching centres, restaurants, boutiques, interior studios, real estate and B2B manufacturers.',
    h1: 'Websites Designed for Businesses Like Yours',
    intro:
      'Whatever your business, your website should make a strong first impression and make it easier to get enquiries.',
    sitemap: true,
    priority: 0.7,
  },
  '/tech/demos': {
    section: 'tech',
    crumb: 'Website Concepts',
    title: '37 Live Website Concepts by Industry | McreatiK Tech',
    description:
      'Browse 37 fully built website concepts across 11 industries — clinics, gyms, restaurants, real estate and more. Open any as a live demo and get one for your business.',
    h1: 'Website concepts, built for your industry',
    intro:
      '37 fully built website concepts across 11 industries. Open any of them as a live demo, then ask for one tailored to your business.',
    sitemap: true,
    priority: 0.8,
  },
  '/tech/faq': {
    section: 'tech',
    crumb: 'FAQ',
    title: 'Website Design FAQs: Cost, Timeline, SEO | McreatiK Tech',
    description:
      'Straight answers about website design with McreatiK Tech — timelines, ownership of your site and domain, changes, payments, SEO and support after launch.',
    h1: 'Questions You Might Have',
    intro: 'Straight answers before you reach out.',
    sitemap: true,
    priority: 0.6,
    faq: true,
  },
  '/tech/blog': {
    section: 'tech',
    crumb: 'Blog',
    title: 'Web Design & SEO Blog | McreatiK Tech',
    description:
      'Web design tips, SEO basics and lessons from client projects for small business owners, from the McreatiK Tech team.',
    h1: 'Blog',
    intro: 'Web design, SEO, and lessons from client projects.',
    sitemap: true,
    priority: 0.5,
  },

  /* ---------- Studios ---------- */
  '/studios': {
    section: 'studios',
    crumb: null,
    title: 'Wedding & Event Photographer in Chennai | McreatiK Studios',
    description:
      'Photography for every occasion in Chennai — weddings, birthdays, portraits, maternity, house warmings and traditional events, across Tamil Nadu and nearby states.',
    h1: 'Photographs worth keeping, made worth remembering.',
    intro:
      'McreatiK Studios captures weddings, pre and post-wedding shoots, portraits, birthdays and traditional events in Chennai, Tamil Nadu and nearby states.',
    sitemap: true,
    priority: 0.9,
  },
  '/studios/gallery': {
    section: 'studios',
    crumb: 'Gallery',
    title: 'Wedding & Event Photo Gallery, Chennai | McreatiK Studios',
    description:
      'Recent wedding, post-wedding, birthday and portrait shoots by McreatiK Studios in Chennai — open any event to see the full set of photographs.',
    h1: 'Gallery',
    intro: 'Moments from recent events — open any post to see the full set.',
    sitemap: true,
    priority: 0.8,
  },
  '/studios/albums': {
    section: 'studios',
    crumb: 'Albums',
    title: 'Wedding Album Designs | McreatiK Studios Chennai',
    description:
      'Flip through real wedding and event albums designed and printed by McreatiK Studios in Chennai — layouts built around your best moments.',
    h1: 'Albums',
    intro: "A look inside the albums we've designed for clients — click one to flip through it.",
    sitemap: true,
    priority: 0.7,
  },
  '/studios/experience': {
    section: 'studios',
    crumb: 'Experience',
    title: 'Our Photography Process & Reviews | McreatiK Studios',
    description:
      'What working with McreatiK Studios looks like — from first enquiry and planning to the shoot and delivery — plus what our clients say.',
    h1: 'The Process',
    intro: 'What to expect working with McreatiK Studios, from enquiry to delivery — and what clients say.',
    sitemap: true,
    priority: 0.6,
  },
  '/studios/blog': {
    section: 'studios',
    crumb: 'Blog',
    title: 'Photography Tips & Wedding Stories | McreatiK Studios',
    description:
      'Photography tips, behind-the-scenes stories and real wedding features from McreatiK Studios, Chennai.',
    h1: 'Blog',
    intro: 'Photography tips, behind-the-scenes stories and real wedding features.',
    sitemap: true,
    priority: 0.5,
  },

  /* ---------- Legal ---------- */
  '/privacy': {
    section: 'legal',
    title: 'Privacy Policy | McreatiK',
    description:
      'How McreatiK collects, uses, shares and protects your personal data across McreatiK Tech, McreatiK Studios and the McreatiK Digital Store.',
    h1: 'Privacy Policy',
    intro: 'How McreatiK collects, uses, shares and protects your personal data.',
    sitemap: true,
    priority: 0.2,
  },
  '/terms': {
    section: 'legal',
    title: 'Terms of Service | McreatiK',
    description:
      'The terms governing your use of mcreatik.com and any service booked or bought from McreatiK Tech, McreatiK Studios or the McreatiK Digital Store.',
    h1: 'Terms of Service',
    intro: 'The terms governing your use of mcreatik.com and any McreatiK service.',
    sitemap: true,
    priority: 0.2,
  },

  /* ---------- Store — kept out of search until it launches ---------- */
  '/store': {
    section: 'store',
    noindex: true,
    title: 'Digital Store | McreatiK',
    description:
      'Ready-to-buy and ready-to-customize digital products — fill in your details, preview instantly, and download.',
    h1: 'Ready-made and customizable digital products',
    intro: 'Fill in your details, preview instantly, and download — ready in minutes.',
  },
  '/store/refund-policy': {
    section: 'store',
    noindex: true,
    title: 'Refund & Cancellation Policy | McreatiK Digital Store',
    description: 'Refund and cancellation policy for McreatiK Digital Store’s instant-download document products.',
    h1: 'Refund & Cancellation Policy',
    intro: 'Refund and cancellation policy for instant-download document products.',
  },
  '/store/cart': { section: 'store', noindex: true, title: 'Your Cart | McreatiK Digital Store', description: 'Review your items before checkout.' },
  '/store/login': { section: 'store', noindex: true, title: 'Log In | McreatiK Digital Store', description: 'Log in to your McreatiK Digital Store account.' },
  '/store/signup': { section: 'store', noindex: true, title: 'Create Your Account | McreatiK Digital Store', description: 'Create a McreatiK Digital Store account to buy and download digital products.' },
  '/store/forgot-password': { section: 'store', noindex: true, title: 'Forgot Password | McreatiK Digital Store', description: 'Reset the password for your McreatiK Digital Store account.' },
  '/store/reset-password': { section: 'store', noindex: true, title: 'Reset Password | McreatiK Digital Store', description: 'Set a new password for your McreatiK Digital Store account.' },
}

/* SEO props for useSEO: the route's entry plus its path */
export function seoFor(path) {
  const route = ROUTES[path]
  if (!route) throw new Error(`No SEO entry for ${path} — add it to src/seo/routes.js`)
  return { ...route, path }
}

/* Routes that get their own prerendered HTML file at build time */
export const PRERENDER_PATHS = Object.keys(ROUTES).filter((p) => ROUTES[p].h1)
