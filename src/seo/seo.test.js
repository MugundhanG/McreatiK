import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { ROUTES, PRERENDER_PATHS, PHONE_E164, seoFor } from './routes'
import { structuredDataFor } from './structuredData'
import { DEMO_CONCEPTS, DEMO_INDUSTRIES } from '../data/demoConcepts'

const vercel = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../vercel.json'), 'utf8'))

describe('SEO routes', () => {
  it.each(Object.entries(ROUTES))('%s has a search-friendly title and description', (_, route) => {
    expect(route.title.length).toBeGreaterThan(10)
    expect(route.title.length).toBeLessThanOrEqual(65)
    expect(route.description.length).toBeGreaterThan(30)
    expect(route.description.length).toBeLessThanOrEqual(170)
  })

  it('every indexable page has a unique title and description', () => {
    const indexable = Object.values(ROUTES).filter((r) => !r.noindex)
    expect(new Set(indexable.map((r) => r.title)).size).toBe(indexable.length)
    expect(new Set(indexable.map((r) => r.description)).size).toBe(indexable.length)
  })

  it('every prerendered page (except /) is routed to its own file in vercel.json', () => {
    const rewrites = new Map(vercel.rewrites.map((r) => [r.source, r.destination]))
    for (const p of PRERENDER_PATHS.filter((p) => p !== '/')) {
      expect(rewrites.get(p), `missing vercel.json rewrite for ${p}`).toBe(`${p}/index.html`)
    }
  })

  it('the catch-all serves the neutral spa.html shell, and comes last', () => {
    const last = vercel.rewrites[vercel.rewrites.length - 1]
    expect(last).toEqual({ source: '/(.*)', destination: '/spa.html' })
  })

  it('the website-concepts wording matches the real demo data', () => {
    const { title, description } = ROUTES['/tech/demos']
    expect(title).toContain(String(DEMO_CONCEPTS.length))
    expect(description).toContain(`${DEMO_CONCEPTS.length} fully built`)
    expect(description).toContain(`${DEMO_INDUSTRIES.length} industries`)
  })

  it('seoFor throws for an unknown path instead of shipping blank SEO', () => {
    expect(() => seoFor('/nope')).toThrow()
  })
})

describe('structured data', () => {
  it('uses the real phone number everywhere', () => {
    const json = JSON.stringify(structuredDataFor('/'))
    expect(json).toContain(PHONE_E164)
    expect(json).not.toContain('9600129267')
  })

  it('describes Studios as Chennai-based and Tech as worldwide', () => {
    const graph = structuredDataFor('/')['@graph']
    const studios = graph.find((n) => n.name === 'McreatiK Studios')
    const tech = graph.find((n) => n.name === 'McreatiK Tech')
    expect(studios.address.addressLocality).toBe('Chennai')
    expect(studios.address.streetAddress).toBeUndefined()
    expect(tech.areaServed).toBe('Worldwide')
  })

  it('adds FAQ markup only on the FAQ page, and breadcrumbs on sub-pages', () => {
    const types = (p) => structuredDataFor(p)['@graph'].map((n) => n['@type'])
    expect(types('/tech/faq')).toContain('FAQPage')
    expect(types('/tech')).not.toContain('FAQPage')
    expect(types('/studios/gallery')).toContain('BreadcrumbList')
    expect(types('/studios')).not.toContain('BreadcrumbList')
  })

  it('never lists placeholder social links', () => {
    const org = structuredDataFor('/')['@graph'].find((n) => n['@type'] === 'Organization')
    expect(org.sameAs.every((u) => u.startsWith('https://'))).toBe(true)
  })
})
