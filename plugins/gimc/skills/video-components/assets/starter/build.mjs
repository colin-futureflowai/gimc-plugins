// Builds index.html (a Hyperframes composition) from props.json. Run: node build.mjs [props.json] [--safe-zones] [--grid]
// The HTML comes from composeReel (compose.mjs, pure); this file reads the props, puts GSAP in vendor/ and writes
// index.html. Fails loudly on a missing font, a CDN or any external URL.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { composeReel } from './compose.mjs'

const dir = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const propsPath = args.find((a) => !a.startsWith('--')) ?? 'props.json'
const showSafeZones = args.includes('--safe-zones')
const showGrid = args.includes('--grid')
const props = JSON.parse(readFileSync(join(dir, propsPath), 'utf8'))

// GSAP from the pinned Hyperframes CLI, as a local file: a CDN fails the render in a VM without network. GIMC puts
// the same file at vendor/gsap.min.js next to every composition it renders, so without npm install the build goes on
// (only a local preview or render needs it here).
const gsap = join(dir, 'vendor', 'gsap.min.js')
if (!existsSync(gsap)) {
  const bundled = join(dir, 'node_modules', 'hyperframes', 'dist', 'vendor', 'npm', 'gsap@3.15.0', 'dist', 'gsap.min.js')
  if (existsSync(bundled)) {
    mkdirSync(dirname(gsap), { recursive: true })
    copyFileSync(bundled, gsap)
  } else console.warn('vendor/gsap.min.js missing: run npm install for a local render (hyperframes@0.9.61 ships GSAP 3.15.0); GIMC brings its own.')
}

const { html, beats, seconds } = composeReel(props, { dir, source: propsPath, safeZones: showSafeZones, grid: showGrid })
writeFileSync(join(dir, 'index.html'), html)
console.log(`index.html: ${beats} beats, ${seconds} s${showSafeZones ? ', safe-zone overlay ON (check only, never export)' : ''}${showGrid ? ', grid overlay ON (check only, never export)' : ''}`)
