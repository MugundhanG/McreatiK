# McreatiK Website — Version History

All notable changes to the McreatiK website are documented here.
Format: `[Version] — Date — Summary`

---

## [v2.0.0] — 2026-09-02 — Two-Department Multipage Rebuild

### Architecture
- Restructured from a single-page site into a multipage app with React Router:
  - `/` — Landing, a split-screen department picker
  - `/tech` — McreatiK Tech & Creative Solutions (existing business: websites, logos, business cards, resumes, website revamps)
  - `/studios` — McreatiK Studios, a new photography department (portraits, weddings, events) — **content is placeholder**, no real photos/copy yet
- `vercel.json` added (SPA rewrite) so direct links to `/tech` / `/studios` resolve correctly
- Deployment moved from GitHub Pages to **Vercel**, connected to GitHub repo `MugundhanG/McreatiK`; `mcreatik.com` DNS now points to Vercel (GitHub Pages/`gh-pages` branch is vestigial, no longer live)
- Every push to `main` auto-deploys to production; `mcreatikv1.3` kept fast-forward-synced with `main` throughout

### Branding
- New logo set integrated: dark-bg and light-bg wordmark variants, plus circular badges for both departments
- Per-route favicon swapping (`src/utils/setFavicon.js`) — Tech and Studios each show their own badge as the browser tab icon
- Real hero photos (user-supplied) added for both departments, used on the Landing panels and each department's Hero section

### Design systems
- **Tech & Creative** — dark theme, indigo `#5B5FEF` + orange spot color `#FF6B35`, Archivo display font, "build spec" identity (registration-mark corner ticks, numbered service manifest)
- **Studios** — light theme on its own page (cream `#FAF7F0`, gold `#C9971F` + darkroom red `#8B2E2A`, Fraunces italic display font, "film-frame" sprocket-tick motif on images). Note: the Landing page's Studios *panel* specifically uses a dark treatment instead (the real hero photo is dark and unreadable through a light veil) — this is Landing-only, the actual `/studios` page is unaffected

### Known follow-ups
- Studios needs real content: service descriptions, gallery photos, about bio/stats are all placeholder (see `STUDIOS_*` in `src/utils/constants.js`)
- `src/components/ui/TechHeroGraphic.jsx` (an earlier abstract-SVG hero graphic) and the circular badge webp files are now unused for hero backgrounds (kept for favicons / in case they're wanted again) — safe to remove later if not needed
- ESLint reports 22 `no-unused-vars` errors (`motion`, `Icon`) across most components — confirmed pre-existing (present before this session's changes too, verified via `git stash`), likely an eslint config issue, not yet fixed

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
