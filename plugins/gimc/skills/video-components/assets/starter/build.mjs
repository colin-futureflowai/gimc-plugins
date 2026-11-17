// Builds index.html (a Hyperframes composition) from props.json. Run: node build.mjs [props.json] [--safe-zones]
// Pure: the same props always give the same HTML. Fails loudly on a missing font, a CDN or any external URL.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Captions } from './src/components/Captions.mjs'
import { CTACard } from './src/components/CTACard.mjs'
import { HookCard } from './src/components/HookCard.mjs'
import { MediaBeat } from './src/components/MediaBeat.mjs'
import { SafeZoneOverlay } from './src/components/SafeZoneOverlay.mjs'
import { TextBeat } from './src/components/TextBeat.mjs'
import { esc, num, sec } from './src/html.mjs'
import { HEIGHT, safeArea, WIDTH } from './src/safe-zones.mjs'
import { fontFaces } from './src/theme.mjs'

const dir = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const propsPath = args.find((a) => !a.startsWith('--')) ?? 'props.json'
const showSafeZones = args.includes('--safe-zones')
const props = JSON.parse(readFileSync(join(dir, propsPath), 'utf8'))

const external = JSON.stringify(props).match(/(?:https?:)?\/\/[^"\s]+/)
if (external) throw new Error(`External URL in props (${external[0]}): download the file into assets/ and use its file name.`)

// GSAP from the pinned Hyperframes CLI, as a local file: a CDN fails the render in a VM without network.
const gsap = join(dir, 'vendor', 'gsap.min.js')
if (!existsSync(gsap)) {
  const bundled = join(dir, 'node_modules', 'hyperframes', 'dist', 'vendor', 'npm', 'gsap@3.15.0', 'dist', 'gsap.min.js')
  if (!existsSync(bundled)) throw new Error('vendor/gsap.min.js missing: run npm install first (hyperframes@0.9.61 ships GSAP 3.15.0).')
  mkdirSync(dirname(gsap), { recursive: true })
  copyFileSync(bundled, gsap)
}

const COMPONENTS = { hook: HookCard, text: TextBeat, media: MediaBeat, cta: CTACard }
const area = safeArea(props.platform ?? 'universal')
const theme = props.theme
// Room kept free at the bottom of the safe area for the captions (a page can wrap to two lines), so a lower third
// never sits under them.
const captionSpace = props.captions?.length ? 220 : 0
let start = 0
let textIndex = 0
const parts = props.beats.map((beat, i) => {
  const component = COMPONENTS[beat.type]
  if (!component) throw new Error(`Beat ${i + 1}: unknown type "${beat.type}" (hook, text, media, cta)`)
  const duration = sec(beat.seconds)
  // textIndex: text beats take turns in their entrance (TextBeat), so two value beats never enter the same way.
  const part = component({ theme, area, captionSpace, id: `b${i + 1}`, start, duration, textIndex: beat.type === 'text' ? textIndex++ : 0 }, beat)
  start = sec(start + duration)
  return part
})
const total = start
// Caption pages follow the energy of the reel (motion-design §6): high 2–3 words, normal 3–4, calm 4–6.
const CAPTION_WORDS = { high: 3, normal: 4, calm: 6 }
if (props.captionEnergy && !CAPTION_WORDS[props.captionEnergy]) throw new Error(`captionEnergy "${props.captionEnergy}": use high, normal or calm`)
const captions = props.captions?.length ? Captions({ theme, area }, props.captions, CAPTION_WORDS[props.captionEnergy ?? 'normal']) : { html: '', tl: [] }
const voiceover = props.voiceover
  ? `<audio id="voiceover" src="assets/${esc(props.voiceover)}" data-start="0" data-duration="${num(total)}" data-track-index="3"></audio>`
  : ''

const html = `<!doctype html>
<html lang="${esc(props.lang ?? 'en')}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${WIDTH}, height=${HEIGHT}" />
    <!-- Built by build.mjs from ${esc(propsPath)}; edit the props, not this file. -->
    <script src="./vendor/gsap.min.js"></script>
    <style>
${fontFaces(theme, dir)}
      html, body { margin: 0; background: ${theme.colors.bg}; }
      #root { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${theme.colors.bg}; }
      #root > section { position: absolute; inset: 0; z-index: 1; }
      #root * { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${num(total)}" data-width="${WIDTH}" data-height="${HEIGHT}">
${parts.map((p) => p.html).join('\n')}
${captions.html}
${voiceover}
${showSafeZones ? SafeZoneOverlay({ area }) : ''}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
${[...parts.flatMap((p) => p.tl), ...captions.tl].map((line) => `      ${line}`).join('\n')}
      tl.set({}, {}, ${num(total)});
      window.__timelines.main = tl;
    </script>
  </body>
</html>
`
if (/NaN|undefined/.test(html)) throw new Error('index.html would contain NaN or undefined: check the seconds and word timestamps in the props.')
writeFileSync(join(dir, 'index.html'), html)
console.log(`index.html: ${props.beats.length} beats, ${num(total)} s${showSafeZones ? ', safe-zone overlay ON (check only, never export)' : ''}`)
