import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* Vite's dev-server SPA fallback intercepts any request that doesn't look
   like a file (no extension) — including /demos/<slug> and /demos/<slug>/ —
   and serves the main site's index.html instead of falling through to the
   static file in public/. vite build + vite preview don't have this
   problem (they serve the static directory index correctly), only `vite
   dev`. This plugin rewrites those two URL shapes to the demo's own
   index.html before Vite's own middleware sees them, so the hosted-path
   links (which use the clean, no-filename form everywhere else) also work
   locally in `npm run dev`. */
const rootDir = path.dirname(fileURLToPath(import.meta.url))

function demosDevMiddleware() {
  const demoIndexRewrite = (req, res, next) => {
    const [urlPath] = req.url.split('?')
    const match = urlPath.match(/^\/demos\/([^/]+)\/?$/)
    if (match) {
      const indexPath = path.join(rootDir, 'public', 'demos', match[1], 'index.html')
      if (fs.existsSync(indexPath)) {
        req.url = `/demos/${match[1]}/index.html`
      }
    }
    next()
  }

  return {
    name: 'demos-dev-middleware',
    configureServer(server) {
      server.middlewares.use(demoIndexRewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(demoIndexRewrite)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), demosDevMiddleware()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'framer-motion'
          if (id.includes('react-icons')) return 'react-icons'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
