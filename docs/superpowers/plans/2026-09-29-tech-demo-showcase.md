# Tech "Website Concepts" Showcase — Spec + Plan

**Date:** 2026-09-29 · **Approved in chat** (hosting: mcreatik.com/demos/…, placement: new page + home teaser, scope: approved demos only)

> For agentic workers: executed task-by-task by subagents; each task ends with `npm run build` + lint (known false positive: `'motion' is defined but never used`) and a commit whose message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push. Never commit unrelated files.

## Goal
Showcase the approved industry demo sites on the Tech site so prospects can browse by industry and open each live demo.

## Global constraints
- Website repo: `D:\Websites\mcreatik` (Vite + React 19 + Tailwind v4 + framer-motion + react-router). Demos: `D:\Websites\demos\<slug>` (each a standalone Vite + React + Tailwind v4 + `motion` one-pager; NOT a git repo — edits there are uncommitted by design).
- **Approved demos (15, in this order):**
  - Dental: `dental-smile-studio`, `dental-dentique`, `dental-pearl-care`
  - Skin: `skin-lumiere`, `skin-dermalab`, `skin-aarogya`
  - Interior: `interior-aalaya`, `interior-modulo`, `interior-arcform`
  - Coaching: `edu-vertex`, `edu-brightpath`, `edu-milestone`
  - Photography: `photo-kadhai`, `photo-littlepebble`, `photo-objekt`
- Hosted path: `https://mcreatik.com/demos/<slug>/` (trailing slash). Built with `vite build --base=/demos/<slug>/`, output copied to `mcreatik/public/demos/<slug>/`.
- Every hosted demo's `index.html` gets `<meta name="robots" content="noindex, nofollow">` (fictional businesses must not be indexed).
- Tech brand: match the existing Tech pages' look (read `src/pages/TechWorkPage.jsx` and `src/components/tech/*` for tokens/typography) — do not invent a new palette.
- Respect reduced motion; no horizontal scroll at 375px.
- WhatsApp CTAs use the existing helper `getWhatsAppHref(message)` from `src/utils/whatsapp`.

## Task 1 — Build & host the demos
1. Fix the known viewport-margin bug in the 9 earlier demos (dental ×3, skin ×3, interior ×3): any `whileInView`/`useInView` viewport `margin` written as a single value like `'-40px'` or `'-80px'` must become `'-40px 0px'` (vertical only) — single values also inset left/right so elements near the screen edge never trigger on mobile. Grep each demo's `src` for `margin:` inside viewport/useInView options; change only those. Run each demo's `npm run build` to confirm it still builds.
2. Create `mcreatik/scripts/build-demos.mjs` (Node, no new deps): reads the slug list from `mcreatik/scripts/demos.config.json` (`{ "demosRoot": "D:/Websites/demos", "slugs": [...] }`), for each slug runs `npx vite build --base=/demos/<slug>/ --outDir <tmp>` in the demo folder, injects the robots meta into the built `index.html` (right after `<head>`), then replaces `public/demos/<slug>/` with the output. Prints a size summary. Add npm script `"build:demos": "node scripts/build-demos.mjs"`.
3. `vercel.json`: before the catch-all `/(.*)` rewrite add `{ "source": "/demos/:slug/", "destination": "/demos/:slug/index.html" }` and `{ "source": "/demos/:slug", "destination": "/demos/:slug/index.html" }` so demo folders never fall through to the main SPA.
4. Run it; verify with `npx vite preview --port 4173` of the main site after `npm run build`: each `/demos/<slug>/` returns 200, its JS/CSS assets load (curl the HTML, then 200 on every `/demos/<slug>/assets/*` it references), and the HTML contains the robots meta.
5. Commit (`public/demos/**`, `scripts/**`, `package.json`, `vercel.json`).

## Task 2 — Screenshots + concept data
1. In a scratch dir, `npm i playwright-core` and use `chromium.launch({ channel: 'chrome' })`. For each slug, open `http://localhost:4173/demos/<slug>/` (main site preview from Task 1) and capture:
   - **desktop**: viewport 1440×900, scroll slowly to the bottom first (triggers whileInView reveals), back to top, then a full-page screenshot; save a 1440-wide cropped tall image.
   - **mobile**: viewport 390×844 (deviceScaleFactor 2), same scroll trick, a first-screen screenshot (above the fold only).
   Convert with Python PIL to WebP: desktop → width 900, full height capped at 5000px, quality 72; mobile → width 390, quality 75. Save to `mcreatik/src/assets/demo-shots/<slug>-desktop.webp` and `<slug>-mobile.webp`. Target ≤ 250 KB desktop, ≤ 60 KB mobile each; lower quality if over.
   Dismiss any first-visit popups/modals the demo shows before shooting (look for them).
2. Create `mcreatik/src/data/demoConcepts.js` exporting `DEMO_INDUSTRIES` (id, label, one-line description of what those sites focus on) and `DEMO_CONCEPTS` (array, order as above): `{ slug, name, industry, tagline, features: [3 short strings], palette: [3–4 hex], fonts: [display, body], url: '/demos/<slug>/', desktopShot, mobileShot }` (shots imported from assets). Derive name/tagline/features/palette/fonts from each demo's source (`src/config/business.js`, `index.html` title/meta, `src/index.css` @theme tokens, Google Fonts link, section components). Taglines ≤ 70 chars, features ≤ 28 chars each, benefit-led for a business owner.
3. Commit.

## Task 3 — Showcase page, nav, home teaser
1. Route `/tech/demos` → new `src/pages/TechDemosPage.jsx` (lazy like the other Tech pages, same page shell/nav/footer, `useSEO` title "Website Concepts | McreatiK Tech", description about industry-ready website concepts).
2. Add `{ label: 'Website Concepts', href: '/tech/demos', type: 'page' }` to `TECH_NAV_LINKS` right after Portfolio.
3. Page sections:
   - Hero: eyebrow, H1 "Websites built for your industry", subline, stats ("15 concepts · 5 industries" computed from data), primary CTA "Get one for your business" (WhatsApp prefill).
   - Sticky industry filter pills (All + each industry, with counts); active indicator slides via `layoutId`; selected industry shows its description; filter kept in URL `?industry=`.
   - Grid (1 col mobile, 2 cols md, 3 cols xl) of `DemoConceptCard`s that glide/fade on filter change (`layout` + AnimatePresence `popLayout`).
   - `DemoConceptCard`: browser-chrome frame (3 dots + faux URL `mcreatik.com/demos/<slug>`) containing the desktop shot; on hover/focus the shot scrolls smoothly from top to bottom within the frame (CSS transform transition over ~6s, returns on leave; disabled for reduced motion); a phone-frame mobile shot overlapping the bottom-right corner; below: industry chip, name, tagline, 3 feature chips, palette swatches + font names line; buttons "View live demo ↗" (`target=_blank rel=noopener`) and "Get this for my business" (WhatsApp prefill: `Hi McreatiK, I saw the <name> concept and want a website like this for my business.`).
   - Closing band: "Don't see your industry? We design from scratch." + WhatsApp CTA.
4. Tech home teaser: new section component on `TechPage` (place it right after the existing portfolio/work section, or after services if none) — heading, 3 featured cards (one each from Dental, Interior, Photography) reusing `DemoConceptCard` (compact variant allowed), link "Browse all N concepts →" to `/tech/demos`.
5. Verify in browser (desktop + 375px): filters, URL param, card hover scroll, both buttons' hrefs, teaser link, no overflow. Commit.

## Rollout
User reviews locally (`mcreatik-dev` preview; demos served from `public/` in dev too at `/demos/<slug>/index.html`), then push `main`. Adding a later-approved demo = add slug to `scripts/demos.config.json` + entry in `demoConcepts.js` + rerun build:demos + screenshots.
