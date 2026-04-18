# McreatiK Website — Version History

All notable changes to the McreatiK website are documented here.
Format: `[Version] — Date — Summary`

---

## [v1.1.0] — 2026-04-18 — SEO & Deployment

### Added
- Full SEO optimization in `index.html`
  - Primary meta tags (title, description, keywords, author, robots)
  - Open Graph tags for Facebook and LinkedIn sharing
  - Twitter Card meta tags
  - JSON-LD structured data (LocalBusiness schema)
  - Canonical URL tag
  - Geo and language meta tags
- `public/sitemap.xml` — all sections listed with priorities and change frequency
- `public/robots.txt` — allows all crawlers, blocks /src and .env, links to sitemap
- Google Fonts (Inter + Space Grotesk) via preconnect links
- `public/CNAME` file for custom domain persistence on GitHub Pages
- `public/favicon.jpeg` — McreatiK logo as site favicon

### Deployment
- Deployed to GitHub Pages via `gh-pages` package
- Custom domain configured: `mcreatik.com`
- GoDaddy DNS — A records and CNAME set up
- v1.0 branch created as stable snapshot before SEO push

---

## [v1.0.0] — 2026-04-16 — Initial Production Release

### Website Sections
- **Navbar** — Floating pill style, McreatiK logo, mobile drawer
- **Hero** — Split layout with service preview grid and stats
- **Services** — 6 service cards with icons and descriptions
- **Portfolio** — Project cards with lightbox popups
- **About** — Editorial split layout with story, stats, mission, vision, values
- **Contact** — EmailJS-powered contact form
- **Footer** — Logo, nav links, social links, copyright

---

## Features by Section

### Navbar
- Floating pill design (`max-w-5xl`, `rounded-2xl`, `h-14`)
- McreatiK logo image
- M and K letters styled in gold (`amber-400`) by default
- Hover: nav links turn sky blue (`sky-400`) with light blue background
- Mobile: hamburger menu with slide-down drawer

### Hero
- Split layout: text content left, visual panel right
- Service preview grid (6 services with icons)
- Stats row: 30+ Projects, 2+ Years Experience, 99% Client Satisfaction
- CTA buttons: Get Started (scrolls to contact), View Work (scrolls to portfolio)
- Animated gradient background orbs

### Services
- 6 cards: Website Development, Digital Cards, Logo Design, Photo Albums, Resume Design, UI/UX Design
- Icons from `react-icons/fi`
- Hover lift animation with Framer Motion

### Portfolio
- 4 projects: Photography Website, Luxury Brand Identity, Engineering Solutions Website, Elegance Resume Suite
- Custom thumbnails from `/src/assets/`
- Lightbox popup system:
  - **Website** — iframe with browser chrome bar
  - **Logo** — full image popup
  - **Resume** — PDF viewer popup
  - External link buttons in browser bar

### About
- Left panel: Story card + Stats grid (3 stats)
- Right panel: Mission card + Vision card stacked
- Bottom: Core values as horizontal cards (Quality, Speed, Transparency, Innovation)

### Contact
- Fields: Name, Email, Phone, Service (dropdown), Message
- EmailJS integration sending to `connect@mcreatik.com`
- Success/error toast feedback
- Service dropdown with 7 options

### Footer
- McreatiK logo with gold M and K
- Navigation links
- Social links: Instagram, LinkedIn
- Copyright notice

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| Vite | 6 | Build tool |
| Tailwind CSS | v4 | Styling |
| Framer Motion | latest | Animations |
| EmailJS | latest | Contact form emails |
| react-icons | latest | Icon library |
| gh-pages | latest | GitHub Pages deployment |

---

## Assets

| File | Location | Used In |
|------|----------|---------|
| mcreatik logo.jpeg | src/assets/ | Navbar, Footer |
| photography_website_thumbnail.jpg | src/assets/ | Portfolio card |
| logo_design.webp | src/assets/ | Portfolio card |
| ADthumbnail.jpg | src/assets/ | Portfolio card |
| sampleresume.pdf | public/ | Portfolio lightbox |
| favicon.jpeg | public/ | Browser tab icon |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| VITE_EMAILJS_SERVICE_ID | EmailJS service ID |
| VITE_EMAILJS_TEMPLATE_ID | EmailJS template ID |
| VITE_EMAILJS_PUBLIC_KEY | EmailJS public key |

> Note: `.env` file is excluded from Git. Keep credentials secure.

---

## Deployment Info

| Property | Value |
|----------|-------|
| Hosting | GitHub Pages |
| Domain | mcreatik.com |
| Repository | github.com/MugundhanG/mcreatik |
| Deploy command | `npm run deploy` |
| Build output | `/dist` |
| Live branch | `gh-pages` |
| Stable snapshot | `v1.0` branch |

---

## Known Issues & Fixes Log

| Issue | Fix Applied |
|-------|------------|
| Mobile horizontal overflow (extra space on right) | `overflow-x: hidden` on html, body, and #root |
| Contact form service dropdown invisible text | Inline style `backgroundColor: '#111827'` on select |
| Footer M/K hover not working | Added `group` class to anchor tag |
| EmailJS "From Name" showing personal Gmail name | Advised creating dedicated McreatiK Gmail account |
| Vite manualChunks object format error | Converted from object to function format |
| FiPaint icon undefined in Hero | Replaced with FiLayout (UI/UX) and FiImage (Photo Album) |
| Bad import in constants.js | Removed broken import, fixed image reference |

---

## Roadmap / Planned Features

- [ ] Google Analytics integration
- [ ] Blog / Articles section
- [ ] Testimonials / Reviews section
- [ ] Pricing section
- [ ] WhatsApp chat button
- [ ] Dark/Light mode toggle
- [ ] More portfolio projects
- [ ] Case study pages (individual project detail pages)

---

*Document maintained by McreatiK — update this file with every release.*
