/* ============================================
   Structured data (JSON-LD) per route
   Built at prerender time and written into each
   page's static HTML. Describes McreatiK as one
   parent organisation with two departments:
   - McreatiK Tech: remote web design service
     serving clients worldwide, with the real
     TECH_PACKAGES prices as offers;
   - McreatiK Studios: a Chennai photographer
     serving Tamil Nadu and nearby states.
   Only facts that are true and shown on the
   site — no ratings, reviews or street address.
   ============================================ */

import { TECH_FAQ, TECH_PACKAGES, SOCIAL_LINKS, STUDIOS_INSTAGRAM_URL } from '../utils/constants'
import { ROUTES, SITE_URL, SITE_NAME, PHONE_E164, EMAIL, SHARE_IMAGES } from './routes'

const ORG_ID = `${SITE_URL}/#organization`
const TECH_ID = `${SITE_URL}/tech#business`
const STUDIOS_ID = `${SITE_URL}/studios#business`

/* Only real, working profiles (placeholder '#' links are skipped) */
const realProfiles = SOCIAL_LINKS.map((s) => s.href).filter((h) => h && h !== '#')

const priceNumber = (price) => Number(String(price).replace(/[^\d]/g, ''))

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: SHARE_IMAGES.home,
    email: EMAIL,
    telephone: PHONE_E164,
    sameAs: [...realProfiles, STUDIOS_INSTAGRAM_URL],
    department: [{ '@id': TECH_ID }, { '@id': STUDIOS_ID }],
  }
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': ORG_ID },
  }
}

function techBusiness() {
  return {
    '@type': 'ProfessionalService',
    '@id': TECH_ID,
    name: 'McreatiK Tech',
    url: `${SITE_URL}/tech`,
    image: SHARE_IMAGES.tech,
    description: ROUTES['/tech'].description,
    email: EMAIL,
    telephone: PHONE_E164,
    parentOrganization: { '@id': ORG_ID },
    areaServed: 'Worldwide',
    knowsAbout: ['Website design', 'Website development', 'Landing pages', 'Logo design', 'Branding', 'SEO'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website development packages',
      itemListElement: TECH_PACKAGES.map((pkg) => ({
        '@type': 'Offer',
        name: `${pkg.name} — ${pkg.displayName}`,
        description: pkg.tagline,
        price: priceNumber(pkg.price),
        priceCurrency: 'INR',
        itemOffered: { '@type': 'Service', name: `${pkg.displayName} website` },
      })),
    },
  }
}

function studiosBusiness() {
  return {
    '@type': 'LocalBusiness',
    '@id': STUDIOS_ID,
    name: 'McreatiK Studios',
    url: `${SITE_URL}/studios`,
    image: SHARE_IMAGES.studios,
    description: ROUTES['/studios'].description,
    email: EMAIL,
    telephone: PHONE_E164,
    parentOrganization: { '@id': ORG_ID },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'State', name: 'Tamil Nadu' },
      { '@type': 'State', name: 'Puducherry' },
      { '@type': 'State', name: 'Karnataka' },
      { '@type': 'State', name: 'Kerala' },
      { '@type': 'State', name: 'Andhra Pradesh' },
    ],
    sameAs: [STUDIOS_INSTAGRAM_URL],
    knowsAbout: ['Wedding photography', 'Pre-wedding shoots', 'Portrait photography', 'Event photography', 'Photo album design'],
  }
}

function breadcrumbs(path) {
  const route = ROUTES[path]
  if (!route.crumb) return null
  const root = route.section === 'tech'
    ? { name: 'McreatiK Tech', url: `${SITE_URL}/tech` }
    : { name: 'McreatiK Studios', url: `${SITE_URL}/studios` }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: root.name, item: root.url },
      { '@type': 'ListItem', position: 3, name: route.crumb, item: `${SITE_URL}${path}` },
    ],
  }
}

function faqPage(path) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${path}#faq`,
    mainEntity: TECH_FAQ.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

/* The JSON-LD @graph for one route */
export function structuredDataFor(path) {
  const route = ROUTES[path]
  const graph = [organization(), website()]
  if (route.section === 'home' || route.section === 'tech') graph.push(techBusiness())
  if (route.section === 'home' || route.section === 'studios') graph.push(studiosBusiness())
  const crumbs = breadcrumbs(path)
  if (crumbs) graph.push(crumbs)
  if (route.faq) graph.push(faqPage(path))
  return { '@context': 'https://schema.org', '@graph': graph }
}
