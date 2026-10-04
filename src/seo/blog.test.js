import { describe, it, expect } from 'vitest'
import { blogPostSeo, demoteHeadings, blogPostingSchema } from './blog'
import { blogPostStructuredData } from './structuredData'

const post = {
  title: 'Beyond the Social Feed',
  slug: 'beyond-the-social-feed',
  site: 'TECH',
  seoTitle: '',
  seoDescription: '',
  excerpt: 'Social media is great, but a website is yours.',
  content: '<h1>Beyond the Social Feed</h1><p>Body</p><h2>More</h2>',
  cover: { url: 'https://cdn.example/cover.webp' },
  tags: ['SEO', 'Small Business Tips'],
  authorName: 'Mugundhan_G',
  createdAt: '2026-09-16T19:05:40Z',
  updatedAt: '2026-09-19T15:16:29Z',
}

describe('blogPostSeo', () => {
  it('builds the path, section and branded title from the post', () => {
    const seo = blogPostSeo(post)
    expect(seo.path).toBe('/tech/blog/beyond-the-social-feed')
    expect(seo.section).toBe('tech')
    expect(seo.title).toBe('Beyond the Social Feed | McreatiK Tech')
    expect(seo.image).toBe('https://cdn.example/cover.webp')
  })

  it("doesn't add the brand twice when the SEO title already names McreatiK", () => {
    const seo = blogPostSeo({ ...post, seoTitle: 'Why You Need a Website | McreatiK' })
    expect(seo.title).toBe('Why You Need a Website | McreatiK')
  })

  it('keeps descriptions within 160 characters', () => {
    const seo = blogPostSeo({ ...post, seoDescription: 'word '.repeat(80) })
    expect(seo.description.length).toBeLessThanOrEqual(160)
  })

  it('routes Studios posts under /studios/blog', () => {
    expect(blogPostSeo({ ...post, site: 'STUDIOS' }).path).toBe('/studios/blog/beyond-the-social-feed')
  })
})

describe('demoteHeadings', () => {
  it('turns <h1> in a post body into <h2> so the page keeps one <h1>', () => {
    expect(demoteHeadings('<h1 class="x">A</h1><h2>B</h2>')).toBe('<h2 class="x">A</h2><h2>B</h2>')
  })
})

describe('blog post structured data', () => {
  it('describes the post as a BlogPosting with author, dates and breadcrumbs', () => {
    const graph = blogPostStructuredData(post)['@graph']
    const article = graph.find((n) => n['@type'] === 'BlogPosting')
    expect(article.author).toEqual({ '@type': 'Person', name: 'Mugundhan G' })
    expect(article.datePublished).toBe(post.createdAt)
    expect(article.dateModified).toBe(post.updatedAt)
    expect(graph.find((n) => n['@type'] === 'BreadcrumbList').itemListElement).toHaveLength(4)
  })

  it('falls back to the organisation as author when none is set', () => {
    expect(blogPostingSchema({ ...post, authorName: '' }, 'org').author).toEqual({ '@id': 'org' })
  })
})
