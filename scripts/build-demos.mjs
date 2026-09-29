#!/usr/bin/env node
// Builds each approved demo site (from demos.config.json) with a /demos/<slug>/
// base path, injects a noindex robots meta tag, and drops the output into
// public/demos/<slug>/. No new dependencies — uses Node's fs/path/child_process/os.

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(__dirname, 'demos.config.json')

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const demosRoot = config.demosRoot
const slugs = config.slugs

const ROBOTS_META = '\n    <meta name="robots" content="noindex, nofollow">'

function dirSize(dir) {
  let total = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) total += dirSize(full)
    else total += fs.statSync(full).size
  }
  return total
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

function buildDemo(slug) {
  const demoDir = path.join(demosRoot, slug)
  if (!fs.existsSync(demoDir)) {
    throw new Error(`Demo folder not found: ${demoDir}`)
  }

  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), `mcreatik-demo-${slug}-`))

  const isWin = process.platform === 'win32'
  const npxCmd = isWin ? 'npx.cmd' : 'npx'
  const result = spawnSync(
    npxCmd,
    ['vite', 'build', `--base=/demos/${slug}/`, '--outDir', outDir, '--emptyOutDir'],
    { cwd: demoDir, stdio: 'inherit', shell: isWin }
  )
  if (result.status !== 0) {
    throw new Error(`Build failed for ${slug} (exit ${result.status})`)
  }

  const indexPath = path.join(outDir, 'index.html')
  let html = fs.readFileSync(indexPath, 'utf8')
  if (!html.includes('name="robots"')) {
    html = html.replace(/<head>/, `<head>${ROBOTS_META}`)
    fs.writeFileSync(indexPath, html, 'utf8')
  }

  const destDir = path.join(repoRoot, 'public', 'demos', slug)
  fs.rmSync(destDir, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(destDir), { recursive: true })
  fs.cpSync(outDir, destDir, { recursive: true })

  const size = dirSize(destDir)
  fs.rmSync(outDir, { recursive: true, force: true })

  return size
}

console.log(`Building ${slugs.length} demos from ${demosRoot}...\n`)

const results = []
for (const slug of slugs) {
  process.stdout.write(`> ${slug} ... `)
  const size = buildDemo(slug)
  results.push({ slug, size })
  console.log(`done (${formatSize(size)})`)
}

const total = results.reduce((sum, r) => sum + r.size, 0)

console.log('\nSize summary:')
for (const r of results) {
  console.log(`  ${r.slug.padEnd(24)} ${formatSize(r.size)}`)
}
console.log(`  ${'TOTAL'.padEnd(24)} ${formatSize(total)}`)
