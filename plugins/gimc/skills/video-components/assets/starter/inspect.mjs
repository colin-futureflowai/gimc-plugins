// Looks at the composition the way a viewer will: seeks index.html with the Hyperframes runtime, checks the layout
// on many moments and writes stills you can look at. No extra dependencies: it uses the puppeteer-core and the
// headless Chrome that hyperframes@0.9.61 already brings.
//
//   node inspect.mjs                     hyperframes check + layout check every 0.25 s and every beat → out/inspect.json,
//                                        out/contact-sheet.png, out/cut-strip.png, out/phone-sheet.png (--no-check: faster)
//   node inspect.mjs --at 28.0           one moment → out/still-28.0.png (with boxes), for quick edit loops
//   node inspect.mjs --video out/reel.mp4  frames of the real render → out/video-contact-sheet.png
//
// Options: --props props.json, --platform <name> (default: props.platform), --step 0.25. Exit code 1 when the
// layout check finds an error. Inspects index.html as it is: run `node build.mjs` first.
import { spawnSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { HEIGHT, safeArea, WIDTH } from './src/safe-zones.mjs'

const dir = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const propsPath = join(dir, opt('props') ?? 'props.json')
const props = existsSync(propsPath) ? JSON.parse(readFileSync(propsPath, 'utf8')) : {}
const platform = opt('platform') ?? props.platform ?? 'universal'
const area = safeArea(platform)
const step = Number(opt('step') ?? 0.25)
const outDir = join(dir, 'out')
mkdirSync(outDir, { recursive: true })

const FPS = 30
const frame = (t) => Math.round(t * FPS) / FPS
const clock = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`

// The beats from props.json (same rounding as build.mjs), for "a still per beat" and the moments around cuts.
const beats = []
{
  let start = 0
  for (const [i, b] of (props.beats ?? []).entries()) {
    const d = frame(Number(b.seconds) || 0)
    beats.push({ n: i + 1, type: b.type, start, end: frame(start + d) })
    start = frame(start + d)
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Browser: the Chrome Hyperframes renders with, driven by the puppeteer-core it ships.
// ---------------------------------------------------------------------------------------------------------------
const hfDir = join(dir, 'node_modules', 'hyperframes')
if (!existsSync(hfDir)) throw new Error('node_modules/hyperframes missing: run npm install first.')
const quiet = { ...process.env, HYPERFRAMES_NO_TELEMETRY: '1', HYPERFRAMES_NO_UPDATE_CHECK: '1', HYPERFRAMES_SKIP_SKILLS: '1' }
const browserPath = () => {
  if (process.env.HYPERFRAMES_BROWSER_PATH) return process.env.HYPERFRAMES_BROWSER_PATH
  const r = spawnSync(process.execPath, [join(hfDir, 'bin', 'hyperframes.mjs'), 'browser', 'path'], { env: quiet, encoding: 'utf8' })
  const path = r.stdout.trim().split('\n').at(-1)
  if (r.status !== 0 || !path || !existsSync(path)) throw new Error('No Chrome found: run `npx hyperframes@0.9.61 browser ensure` or set HYPERFRAMES_BROWSER_PATH.')
  return path
}
const puppeteer = (await import(pathToFileURL(createRequire(join(hfDir, 'package.json')).resolve('puppeteer-core')).href)).default

// A small static server: index.html gets the Hyperframes runtime injected, exactly like `hyperframes preview`.
const RUNTIME = join(hfDir, 'dist', 'hyperframe.runtime.iife.js')
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' }
const serve = () =>
  new Promise((ok) => {
    const server = createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url, 'http://local').pathname)
      if (path === '/__hyperframes_runtime.js') {
        res.writeHead(200, { 'content-type': 'text/javascript' })
        return createReadStream(RUNTIME).pipe(res)
      }
      if (path === '/' || path === '/index.html') {
        const html = readFileSync(join(dir, 'index.html'), 'utf8').replace(/<head[^>]*>/i, (m) => `${m}<script src="/__hyperframes_runtime.js"></script>`)
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
        return res.end(html)
      }
      const file = normalize(join(dir, path))
      if (!file.startsWith(dir + sep) || !existsSync(file) || !statSync(file).isFile()) {
        res.writeHead(404)
        return res.end()
      }
      const size = statSync(file).size
      const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream'
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '')
      if (range) {
        const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]))
        const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
        res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1 })
        return createReadStream(file, { start, end }).pipe(res)
      }
      res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': size })
      createReadStream(file).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => ok(server))
  })

const launch = () => puppeteer.launch({ executablePath: browserPath(), headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] })

const openComposition = async (browser, port) => {
  const page = await browser.newPage()
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'load', timeout: 60000 })
  await page.waitForFunction(() => window.__renderReady || typeof window.__hfStartupError === 'string', { timeout: 30000 })
  const startup = await page.evaluate(() => window.__hfStartupError)
  if (typeof startup === 'string') throw new Error(`Composition did not start: ${startup}`)
  if (errors.length) throw new Error(`Script error in index.html: ${errors[0]}`)
  await page.evaluate(() => document.fonts.ready)
  const duration = await page.evaluate(() => {
    const root = document.querySelector('[data-composition-id]')
    const d = Number(root?.getAttribute('data-duration'))
    return d > 0 ? d : (window.__timelines?.main?.duration() ?? 0)
  })
  return { page, duration }
}

// The seek Hyperframes itself uses while rendering (renderSeek, then wait for videos and fonts to settle).
const seek = async (page, t) => {
  await page.evaluate((time) => {
    const player = window.__player
    if (typeof player?.renderSeek === 'function') player.renderSeek(time)
    else if (typeof window.__hf?.seek === 'function') window.__hf.seek(time)
    else for (const tl of Object.values(window.__timelines ?? {})) { tl.pause(); tl.seek(time) }
    window.gsap?.ticker?.tick()
  }, t)
  await page.evaluate(async () => {
    if (typeof window.__hfWaitForSeekCompletion === 'function') await window.__hfWaitForSeekCompletion({ videoFrames: true, timeoutMs: 5000 })
    await document.fonts.ready
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  })
}

// ---------------------------------------------------------------------------------------------------------------
// The layout check. Runs inside the page; returns the problems at the current moment.
// ---------------------------------------------------------------------------------------------------------------
function analyze(cfg) {
  const { W, H, area, accent, minOpacity } = cfg
  const root = document.querySelector('[data-composition-id]') || document.body
  const safe = { x0: area.left, y0: area.top, x1: W - area.right, y1: H - area.bottom }
  const frameRect = { x0: 0, y0: 0, x1: W, y1: H }
  const cs = (el) => getComputedStyle(el)
  const R = (r) => ({ x0: r.left, y0: r.top, x1: r.right, y1: r.bottom })
  const area_ = (r) => Math.max(0, r.x1 - r.x0) * Math.max(0, r.y1 - r.y0)
  const meet = (a, b) => ({ x0: Math.max(a.x0, b.x0), y0: Math.max(a.y0, b.y0), x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1) })
  const join = (a, b) => (a ? { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) } : { ...b })
  const real = (r) => r.x1 - r.x0 > 0.5 && r.y1 - r.y0 > 0.5
  const round = (r) => ({ x: Math.round(r.x0), y: Math.round(r.y0), w: Math.round(r.x1 - r.x0), h: Math.round(r.y1 - r.y0) })
  const color = (s) => {
    const m = /rgba?\(([^)]+)\)/.exec(s ?? '')
    if (!m) return null
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
  }
  const hex = (h) => (/^#[0-9a-f]{6}$/i.test(h ?? '') ? { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16), a: 1 } : null)
  const near = (a, b) => a && b && Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b) < 12
  const accentColor = hex(accent)

  const opacityCache = new Map()
  const opacity = (el) => {
    if (!el || el === document.documentElement) return 1
    if (opacityCache.has(el)) return opacityCache.get(el)
    const o = parseFloat(cs(el).opacity) * (el === root ? 1 : opacity(el.parentElement))
    opacityCache.set(el, o)
    return o
  }
  const shown = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && opacity(el) >= minOpacity
  // Ancestors that clip (overflow other than visible, an <svg> viewport); the frame itself is checked apart.
  const clipOf = (el) => {
    let c = { ...frameRect, x0: -1e6, y0: -1e6, x1: 1e6, y1: 1e6 }
    let by = null
    for (let e = el.parentElement; e && e !== root && e !== document.body; e = e.parentElement) {
      const s = cs(e)
      if (s.overflowX !== 'visible' || s.overflowY !== 'visible') {
        const n = meet(c, R(e.getBoundingClientRect()))
        if (area_(n) < area_(c)) by = by ?? e
        c = n
      }
    }
    return { rect: c, by }
  }
  const label = (el) => {
    if (el.id) return `#${el.id}`
    let a = el.parentElement
    while (a && a !== root && !a.id) a = a.parentElement
    const own = el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/)[0]}` : '')
    return a && a !== root ? `#${a.id} ${own}` : own
  }
  const group = (el) => {
    for (let e = el; e && e !== root; e = e.parentElement) if (e.id) return e
    return el
  }
  const marked = (el, attr, value) => !!el.closest(value ? `[${attr}="${value}"]` : `[${attr}]`)
  const backdropMarked = (el) => marked(el, 'data-backdrop')
  // The markings of `hyperframes check`, so one marking serves both tools.
  const ignored = (el) => marked(el, 'data-layout-ignore')
  const mayOverlap = (el) => !!el.closest('[data-layout-allow-overlap],[data-layout-allow-occlusion]')

  // --- Text: every visible text node, grouped into its block (the nearest box that is not inline). ---
  const blockOf = (owner) => {
    if (owner instanceof SVGElement) return owner.closest('text') ?? owner
    // Up through inline boxes, and through word boxes laid out by a flex or grid row (text split into words).
    const wordRow = (e) => e.childElementCount === 0 && /flex|grid/.test(cs(e.parentElement).display) && [...e.parentElement.children].every((k) => k.childElementCount === 0)
    let b = owner
    while (b.parentElement && b.parentElement !== root && (cs(b).display.startsWith('inline') || wordRow(b))) b = b.parentElement
    return b
  }
  const blocks = new Map()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.data.trim()) continue
    const owner = n.parentElement
    if (!owner || owner.closest('script,style,noscript,title,audio,video') || ignored(owner)) continue
    if (!shown(owner)) continue
    const s = cs(owner)
    const fg = owner instanceof SVGElement ? color(s.fill) : color(s.color)
    if (!fg || fg.a < 0.05) continue
    const range = document.createRange()
    range.selectNodeContents(n)
    const { rect: clip, by } = clipOf(owner)
    const block = blockOf(owner)
    if (!blocks.has(block)) blocks.set(block, { el: block, lines: [], owners: new Set(), clipped: null })
    const B = blocks.get(block)
    for (const r of range.getClientRects()) {
      const raw = R(r)
      if (!real(raw)) continue
      const vis = meet(raw, clip)
      if (!real(vis)) continue
      if (area_(vis) < area_(raw) * 0.95) B.clipped = B.clipped ?? by
      B.lines.push({ rect: vis, owner })
    }
    B.owners.add(owner)
  }
  const texts = [...blocks.values()].filter((b) => b.lines.length)
  for (const b of texts) {
    b.rect = b.lines.reduce((u, l) => join(u, l.rect), null)
    b.text = (b.el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 70)
    b.caption = marked(b.el, 'data-role', 'caption')
    b.allow = mayOverlap(b.el) || [...b.owners].some(mayOverlap)
    b.safeOk = [...b.owners].some((o) => marked(o, 'data-layout-allow-safe-zone'))
    b.opacity = Math.min(...[...b.owners].map(opacity))
  }

  // --- Visuals: everything that paints itself (media, SVG shapes, boxes with a background or border). ---
  const SHAPES = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'image', 'use'])
  const visuals = []
  const media = []
  for (const el of root.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase()
    if (['script', 'style', 'audio', 'source', 'br', 'defs', 'clippath', 'mask', 'lineargradient', 'radialgradient'].includes(tag)) continue
    let paints = false
    let isMedia = false
    const s = cs(el)
    if (el instanceof SVGElement) {
      if (!SHAPES.has(tag) || el.closest('defs,clipPath,mask,pattern,symbol')) continue
      paints = (s.fill !== 'none' && (color(s.fill)?.a ?? 1) > 0.02) || (s.stroke !== 'none' && parseFloat(s.strokeWidth) > 0)
      isMedia = tag === 'image'
    } else {
      isMedia = ['img', 'video', 'canvas', 'iframe'].includes(tag) || s.backgroundImage !== 'none'
      const bg = color(s.backgroundColor)
      const border = ['Top', 'Right', 'Bottom', 'Left'].some((k) => parseFloat(s[`border${k}Width`]) > 0 && (color(s[`border${k}Color`])?.a ?? 0) > 0.05)
      paints = isMedia || (bg && bg.a > 0.02) || border
    }
    if (!paints || !shown(el) || ignored(el)) continue
    const raw = R(el.getBoundingClientRect())
    const rect = meet(raw, clipOf(el).rect)
    if (!real(rect) || !real(meet(rect, frameRect))) continue
    const full = area_(meet(rect, frameRect)) >= 0.9 * W * H
    // A backdrop is what text may lie on: full-bleed media and backgrounds. A backing panel (a backdrop with its own
    // text inside, like the caption box) still counts against other text: it covers it or is covered by it.
    const panel = backdropMarked(el) && !full && /\S/.test(el.closest('[data-backdrop]').textContent)
    const v = { el, rect, label: label(el), group: group(el), backdrop: (backdropMarked(el) && !panel) || full, bleed: marked(el, 'data-layout-allow-overflow'), allow: mayOverlap(el), opacity: opacity(el), media: isMedia }
    if (isMedia) media.push(v)
    if (!v.backdrop) visuals.push(v)
  }

  // An image with transparent parts (a cut-out, a logo) only counts where it has ink: sample its alpha in the area.
  const inkCache = new Map()
  const ink = (el, m) => {
    if (el.tagName !== 'IMG' || !el.naturalWidth) return true
    try {
      let data = inkCache.get(el.currentSrc)
      if (!data) {
        const cv = document.createElement('canvas')
        cv.width = el.naturalWidth
        cv.height = el.naturalHeight
        const cx = cv.getContext('2d', { willReadFrequently: true })
        cx.drawImage(el, 0, 0)
        data = cx.getImageData(0, 0, cv.width, cv.height)
        inkCache.set(el.currentSrc, data)
      }
      const r = el.getBoundingClientRect()
      const fit = cs(el).objectFit
      let sx = data.width / r.width
      let sy = data.height / r.height
      let ox = 0
      let oy = 0
      if (fit === 'cover' || fit === 'contain') {
        const k = (fit === 'cover' ? Math.min : Math.max)(sx, sy)
        ox = (data.width - r.width * k) / 2
        oy = (data.height - r.height * k) / 2
        sx = sy = k
      }
      let hits = 0
      let total = 0
      const N = 24
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++) {
          const x = Math.floor(ox + (m.x0 + ((m.x1 - m.x0) * (i + 0.5)) / N - r.left) * sx)
          const y = Math.floor(oy + (m.y0 + ((m.y1 - m.y0) * (j + 0.5)) / N - r.top) * sy)
          if (x < 0 || y < 0 || x >= data.width || y >= data.height) continue
          total++
          if (data.data[(y * data.width + x) * 4 + 3] > 40) hits++
        }
      return total === 0 || hits / total >= 0.02
    } catch {
      return true
    }
  }

  const issues = []
  const add = (i) => issues.push(i)
  const solid = (op) => op >= 0.5

  // Errors: text over another element or other text.
  const overlapPairs = new Map()
  for (const b of texts) {
    if (b.allow || !solid(b.opacity)) continue
    for (const v of visuals) {
      if (!solid(v.opacity) || v.allow || v.el.contains(b.el) || b.el.contains(v.el)) continue
      if ([...b.owners].some((o) => v.el.contains(o))) continue
      for (const l of b.lines) {
        const m = meet(l.rect, v.rect)
        if (m.x1 - m.x0 > 3 && m.y1 - m.y0 > 3 && ink(v.el, m)) {
          const key = `${b.text}|${v.group.id || v.label}`
          const p = overlapPairs.get(key) ?? { b, other: v.group.id ? `#${v.group.id}` : v.label, kind: v.el instanceof SVGElement ? 'svg' : v.el.tagName.toLowerCase(), rect: null, hit: null }
          p.rect = join(p.rect, v.rect)
          p.hit = join(p.hit, m)
          overlapPairs.set(key, p)
        }
      }
    }
  }
  for (const p of overlapPairs.values())
    add({ severity: 'error', type: 'overlap', selector: label(p.b.el), text: p.b.text, other: p.other, rect: round(p.b.rect), otherRect: round(p.rect), hit: round(p.hit), message: `text '${p.b.text}' overlaps ${p.other} (${p.kind})` })
  // Text over other text is `hyperframes check` (content_overlap); a caption box over other text is caught above.

  // Errors: text outside the safe area, text or element cut off by the frame or by a clipping box.
  for (const b of texts) {
    if (!solid(b.opacity)) continue
    const r = b.rect
    if (r.x1 <= 0 || r.y1 <= 0 || r.x0 >= W || r.y0 >= H) continue
    const out = [['top', safe.y0 - r.y0], ['bottom', r.y1 - safe.y1], ['left', safe.x0 - r.x0], ['right', r.x1 - safe.x1]].filter(([, px]) => px > 2)
    if (out.length && !b.safeOk) add({ severity: 'error', type: 'safe-area', selector: label(b.el), text: b.text, rect: round(r), message: `text '${b.text}' outside the safe area (${out.map(([s, px]) => `${s} ${Math.round(px)} px`).join(', ')})` })
    if (r.x0 < -1 || r.y0 < -1 || r.x1 > W + 1 || r.y1 > H + 1) add({ severity: 'error', type: 'cut-off', selector: label(b.el), text: b.text, rect: round(r), message: `text '${b.text}' runs off the frame` })
    else if (b.clipped) add({ severity: 'error', type: 'cut-off', selector: label(b.el), text: b.text, rect: round(r), message: `text '${b.text}' is cut off by ${label(b.clipped)} (overflow)` })
  }
  const cut = new Map()
  for (const v of visuals) {
    if (v.bleed || !solid(v.opacity)) continue
    const r = v.rect
    if (r.x0 < -2 || r.y0 < -2 || r.x1 > W + 2 || r.y1 > H + 2) {
      const key = v.group.id ? `#${v.group.id}` : v.label
      cut.set(key, join(cut.get(key), r))
    }
  }
  for (const [key, r] of cut) add({ severity: 'error', type: 'cut-off', selector: key, rect: round(meet(r, frameRect)), message: `${key} is cut off by the frame (mark data-layout-allow-overflow if that is on purpose)` })

  // Warnings: size, contrast, emphasis, empty space.
  for (const b of texts) {
    if (b.opacity < 0.9) continue
    let size = Infinity
    for (const o of b.owners) {
      const fs = parseFloat(cs(o).fontSize)
      let scale = 1
      if (o instanceof SVGGraphicsElement) scale = o.getScreenCTM()?.d ?? 1
      else if (o.offsetHeight > 0) scale = o.getBoundingClientRect().height / o.offsetHeight
      size = Math.min(size, fs * scale)
    }
    const min = b.caption ? 52 : 44
    if (size < min - 0.5)
      add({ severity: 'warning', type: 'font-size', selector: label(b.el), text: b.text, rect: round(b.rect), message: `text '${b.text}' is ${Math.round(size)} px, under the ${b.caption ? 'caption' : 'supporting-line'} minimum of ${min} px${!b.caption && size >= 32 ? ' (fine only for small print)' : ''}` })
  }
  // Contrast is `hyperframes check` (WCAG, measured on the pixels).
  if (accentColor) {
    const emph = new Map()
    for (const b of texts) {
      if (b.caption || b.opacity < 0.9) continue
      const own = [...b.owners].some((o) => near(color(cs(o).color), accentColor))
      let panel = false
      for (let e = b.el; e && e !== root && !panel; e = e.parentElement) panel = near(color(cs(e).backgroundColor), accentColor)
      if (own || panel) emph.set(b.text, b)
    }
    if (emph.size > 1) {
      const list = [...emph.values()]
      add({ severity: 'warning', type: 'emphasis', selector: list.map((b) => label(b.el)).join(', '), text: list.map((b) => b.text).join(' | '), rect: round(list.reduce((u, b) => join(u, b.rect), null)), message: `${emph.size} accent emphases at once: ${list.map((b) => `'${b.text}'`).join(', ')}` })
    }
  }
  {
    const ROW = 16
    const rows = Math.floor((safe.y1 - safe.y0) / ROW)
    const filled = new Array(rows).fill(false)
    // Media counts as content, also full-bleed (a photo is not empty space); a plain background does not.
    const boxes = [...texts.filter((b) => solid(b.opacity)).flatMap((b) => b.lines.map((l) => l.rect)), ...[...visuals, ...media].filter((v) => solid(v.opacity)).map((v) => v.rect)]
    for (const r of boxes) {
      if (r.x1 <= safe.x0 || r.x0 >= safe.x1) continue
      for (let i = Math.max(0, Math.floor((r.y0 - safe.y0) / ROW)); i < Math.min(rows, Math.ceil((r.y1 - safe.y0) / ROW)); i++) filled[i] = true
    }
    let best = { len: 0, at: 0 }
    for (let i = 0, run = 0; i < rows; i++) {
      run = filled[i] ? 0 : run + 1
      if (run > best.len) best = { len: run, at: i - run + 1 }
    }
    const used = filled.filter(Boolean).length
    const rest = rows - best.len
    if (used && best.len >= rows * 0.4 && used >= rest * 0.5) {
      const y0 = safe.y0 + best.at * ROW
      add({ severity: 'warning', type: 'empty-zone', selector: 'safe area', rect: round({ x0: safe.x0, y0, x1: safe.x1, y1: y0 + best.len * ROW }), message: `${Math.round((best.len / rows) * 100)} % of the safe area is empty (y ${Math.round(y0)}–${Math.round(y0 + best.len * ROW)}) while the rest is full` })
    }
  }
  return { issues, texts: texts.length, visuals: visuals.length }
}

// Boxes over the frame for a screenshot: errors red, warnings amber, the danger zones lightly tinted.
function drawOverlay({ W, H, area, issues, label }) {
  document.getElementById('__inspect')?.remove()
  const o = document.createElement('div')
  o.id = '__inspect'
  o.style.cssText = `position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:2147483647;pointer-events:none;font-family:sans-serif`
  const box = (x, y, w, h, css) => {
    const d = document.createElement('div')
    d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;box-sizing:border-box;${css}`
    o.appendChild(d)
    return d
  }
  const tint = 'background:rgba(40,110,255,0.16)'
  box(0, 0, W, area.top, tint)
  box(0, H - area.bottom, W, area.bottom, tint)
  box(0, area.top, area.left, H - area.top - area.bottom, tint)
  box(W - area.right, area.top, area.right, H - area.top - area.bottom, tint)
  for (const i of issues) {
    const red = i.severity === 'error'
    const r = i.hit ?? i.rect
    if (i.otherRect && red) box(i.otherRect.x, i.otherRect.y, i.otherRect.w, i.otherRect.h, 'border:6px dashed rgba(230,0,0,0.9)')
    box(r.x - 6, r.y - 6, r.w + 12, r.h + 12, red ? 'border:12px solid rgb(230,0,0)' : 'border:8px dashed rgb(255,170,0)')
  }
  if (label) {
    const t = box(24, 24, W - 48, 0, 'height:auto;font:700 44px sans-serif;color:#fff;text-shadow:0 0 8px #000')
    t.textContent = label
  }
  document.body.appendChild(o)
}

const shot = async (page, issues, scale, label, overlay = true) => {
  if (overlay) await page.evaluate(drawOverlay, { W: WIDTH, H: HEIGHT, area, issues, label })
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale }, type: 'png' })
  await page.evaluate(() => document.getElementById('__inspect')?.remove())
  return Buffer.from(png)
}

// A contact sheet: thumbnails in a grid, each with its time and what is wrong. `tw` is the thumbnail width.
const sheet = async (browser, cards, path, title, { tw = 270, cols = 6 } = {}) => {
  const th = Math.round((tw * HEIGHT) / WIDTH)
  cols = Math.min(cols, Math.max(1, cards.length))
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  const k = tw / WIDTH
  const mid = (HEIGHT - area.top - area.bottom) * k
  const zones = [`left:0;top:0;width:${tw}px;height:${area.top * k}px`, `left:0;bottom:0;width:${tw}px;height:${area.bottom * k}px`, `left:0;top:${area.top * k}px;width:${area.left * k}px;height:${mid}px`, `right:0;top:${area.top * k}px;width:${area.right * k}px;height:${mid}px`]
    .map((css) => `<div style="position:absolute;${css};background:rgba(40,110,255,0.16)"></div>`)
    .join('')
  const html = `<!doctype html><html><body style="margin:0;background:#1b1b1b;color:#eee;font:13px/1.3 -apple-system,Helvetica,Arial,sans-serif">
<div style="padding:12px 16px;font-size:16px;font-weight:700">${esc(title)}</div>
<div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:16px;padding:0 16px 16px">
${cards
  .map(
    (c) => `<div style="width:${tw}px"><div style="position:relative;width:${tw}px;height:${th}px;outline:${c.errors ? '3px solid #e60000' : '1px solid #444'}"><img src="data:image/png;base64,${c.png.toString('base64')}" style="width:${tw}px;height:${th}px;display:block">${c.zones ? zones : ''}</div>
<div style="padding:6px 2px"><b style="font-size:15px">${esc(c.title)}</b>${(c.lines ?? []).map((l) => `<div style="color:${l.error ? '#ff5c5c' : l.warning ? '#ffb020' : '#aaa'}">${esc(l.text)}</div>`).join('')}</div></div>`,
  )
  .join('\n')}
</div></body></html>`
  const page = await browser.newPage()
  await page.setViewport({ width: cols * (tw + 16) + 16, height: 600, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.screenshot({ path, fullPage: true })
  await page.close()
}

const cardLines = (issues, max = 4) => {
  const lines = issues.slice(0, max).map((i) => ({ error: i.severity === 'error', warning: i.severity === 'warning', text: `${i.severity === 'error' ? 'ERROR' : 'warn'} ${i.type}: ${i.text ? `'${i.text.slice(0, 28)}'` : i.selector}${i.other ? ` × ${i.other.slice(0, 24)}` : ''}` }))
  if (issues.length > max) lines.push({ text: `+${issues.length - max} more` })
  return lines
}

// Runs of numbered elements (frame 12, 13, 14 of a cut-out; caption page 4, 5) count as one problem.
const stable = (s) => String(s).replace(/(#[\w-]*?)\d+(?![\w-])/g, '$1*')

const beatAt = (t) => beats.find((b) => t >= b.start && t < b.end)

// `hyperframes check` first: it already measures text over text, the caption band, WCAG contrast on the pixels and
// read time. inspect.mjs adds what it does not see (text over drawings, figures, panels and media; the platform's
// safe area; cut-offs; type minimums; emphasis; empty space) and the sheets. The caption band is the room build.mjs
// keeps free for captions at the bottom of the safe area.
const runCheck = () => {
  const cli = ['check', '--json', '--safe-zone', 'off']
  if (props.captions?.length) {
    const y1 = (HEIGHT - area.bottom) / HEIGHT
    const y0 = (HEIGHT - area.bottom - 220) / HEIGHT
    cli.push('--caption-zone', `x0=${(area.left / WIDTH).toFixed(3)};y0=${y0.toFixed(3)};x1=${((WIDTH - area.right) / WIDTH).toFixed(3)};y1=${y1.toFixed(3)};severity=error`)
  }
  const r = spawnSync(process.execPath, [join(hfDir, 'bin', 'hyperframes.mjs'), ...cli], { cwd: dir, env: quiet, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  const json = r.stdout.slice(r.stdout.indexOf('{'))
  let report
  try {
    report = JSON.parse(json)
  } catch {
    throw new Error(`hyperframes check gave no report: ${(r.stderr || r.stdout).slice(0, 400)}`)
  }
  const out = []
  for (const pass of ['lint', 'runtime', 'layout', 'motion', 'contrast', 'craft']) {
    for (const f of report[pass]?.findings ?? []) {
      // Lint warnings about the file's structure are expected for a composition built from props.
      if (f.severity === 'info' || (pass === 'lint' && f.severity !== 'error')) continue
      const b = f.bbox && f.bbox.width ? { x: Math.round(f.bbox.x), y: Math.round(f.bbox.y), w: Math.round(f.bbox.width), h: Math.round(f.bbox.height) } : null
      out.push({ severity: f.severity === 'error' ? 'error' : 'warning', type: `check:${f.code}`, selector: f.selector ?? '', text: f.text, rect: b, t: f.time ?? 0, to: f.lastSeen ?? f.time ?? 0, message: `${f.message}${f.fixHint ? ` (${f.fixHint})` : ''}` })
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------------------------
// Modes
// ---------------------------------------------------------------------------------------------------------------
const cfg = { W: WIDTH, H: HEIGHT, area, accent: props.theme?.colors?.accent, minOpacity: 0.1 }

const video = opt('video')
const at = opt('at')
const server = await serve()
const port = server.address().port
const browser = await launch()
let exit = 0
try {
  if (video) {
    // Frames of the real render: one per beat (middle) and one every 2 s.
    const file = resolve(dir, video)
    if (!existsSync(file)) throw new Error(`Video not found: ${video}`)
    const ffmpeg = process.env.FFMPEG_PATH ?? 'ffmpeg'
    const ffprobe = process.env.FFPROBE_PATH ?? 'ffprobe'
    const probe = spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' })
    const duration = Number(probe.stdout.trim())
    if (!(duration > 0)) throw new Error(`ffprobe could not read ${video}: ${probe.stderr || 'is ffmpeg installed?'}`)
    const times = new Map()
    for (const b of beats) times.set(frame((b.start + b.end) / 2), `beat ${b.n} ${b.type} (middle)`)
    for (let t = 0; t < duration - 0.05; t += 2) if (![...times.keys()].some((k) => Math.abs(k - t) < 0.4)) times.set(frame(t), '')
    const cards = []
    for (const t of [...times.keys()].sort((a, b) => a - b)) {
      const r = spawnSync(ffmpeg, ['-v', 'error', '-ss', String(t), '-i', file, '-frames:v', '1', '-vf', 'scale=270:480', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 64 * 1024 * 1024 })
      if (r.status !== 0 || !r.stdout.length) throw new Error(`ffmpeg could not read a frame at ${t}s: ${r.stderr}`)
      cards.push({ png: r.stdout, title: clock(t), lines: times.get(t) ? [{ text: times.get(t) }] : [], zones: true })
    }
    const out = join(outDir, 'video-contact-sheet.png')
    await sheet(browser, cards, out, `${video} · ${duration.toFixed(2)} s · ${cards.length} frames · danger zones of ${platform} tinted blue`)
    console.log(`${out}: ${cards.length} frames from the render (beats + every 2 s). Look at it: fonts, timing, what really ended up in the video.`)
  } else {
    const { page, duration } = await openComposition(browser, port)
    if (at !== undefined) {
      const t = Math.min(Number(at), Math.max(0, duration - 1 / FPS))
      await seek(page, t)
      const { issues } = await page.evaluate(analyze, cfg)
      const errors = issues.filter((i) => i.severity === 'error').length
      const out = join(outDir, `still-${Number(at).toFixed(1)}.png`)
      writeFileSync(out, await shot(page, issues, 0.5, `${clock(t)} · ${errors} errors · ${issues.length - errors} warnings`))
      for (const i of issues) console.log(`${clock(t)} ${i.severity === 'error' ? 'ERROR' : 'warn '} ${i.message}`)
      console.log(`${out}${issues.length ? '' : ': no problems at this moment'} (hyperframes check not run; the full \`node inspect.mjs\` does)`)
      exit = errors ? 1 : 0
    } else {
      const checked = args.includes('--no-check') ? [] : runCheck()
      // Every step, plus each beat's start, middle and last frame.
      const set = new Set()
      for (let t = 0; t < duration - 1e-6; t += step) set.add(frame(t))
      for (const b of beats) for (const t of [b.start, (b.start + b.end) / 2, b.end - 1 / FPS]) if (t < duration) set.add(frame(t))
      const moments = [...set].sort((a, b) => a - b)
      const results = []
      for (const t of moments) {
        await seek(page, t)
        const r = await page.evaluate(analyze, cfg)
        results.push({ t, ...r })
      }
      // One line per problem, merged over the moments it lasts.
      const runs = []
      const open = new Map()
      results.forEach((r, k) => {
        for (const i of r.issues) {
          const key = `${i.severity}|${i.type}|${stable(i.selector)}|${stable(i.other ?? '')}|${i.type === 'empty-zone' || i.type === 'emphasis' ? '' : i.text ?? ''}`
          const run = open.get(key)
          if (run && run.last === results[k - 1]?.t) {
            run.last = r.t
            run.count++
          } else {
            const nr = { key, first: r.t, last: r.t, count: 1, issue: i }
            runs.push(nr)
            open.set(key, nr)
          }
        }
      })
      // An empty zone only counts when it stays (not the frames where a new beat is still fading in).
      for (let i = runs.length - 1; i >= 0; i--) if (runs[i].issue.type === 'empty-zone' && runs[i].last - runs[i].first < 0.45) runs.splice(i, 1)
      for (const c of checked) runs.push({ key: `check|${c.type}|${c.selector}|${c.t}`, first: c.t, last: c.to, count: 1, issue: c })
      runs.sort((a, b) => a.first - b.first)
      const errorRuns = runs.filter((r) => r.issue.severity === 'error')
      const warnRuns = runs.filter((r) => r.issue.severity === 'warning')
      for (const r of runs) console.log(`${clock(r.first)}${r.last > r.first ? `–${clock(r.last)}` : ''} ${r.issue.severity === 'error' ? 'ERROR' : 'warn '} ${r.issue.type.startsWith('check:') ? `[check] ${r.issue.selector} ` : ''}${r.issue.message}`)
      const errorMoments = results.filter((r) => r.issues.some((i) => i.severity === 'error')).length
      writeFileSync(
        join(outDir, 'inspect.json'),
        `${JSON.stringify({ file: 'index.html', platform, safeArea: area, duration, step, checked: moments.length, hyperframesCheck: !args.includes('--no-check'), errors: errorRuns.length, warnings: warnRuns.length, errorMoments, problems: runs.map((r) => ({ from: r.first, to: r.last, ...r.issue })), moments: results.filter((r) => r.issues.length).map((r) => ({ t: r.t, time: clock(r.t), issues: r.issues })) }, null, 2)}\n`,
      )

      // Issues at a moment: our own plus the check findings seen then (with their box when they have one).
      const issuesAt = async (t) => {
        await seek(page, t)
        const { issues } = await page.evaluate(analyze, cfg)
        for (const c of checked) if (c.rect && t >= c.t - 0.05 && t <= c.to + 0.05) issues.push({ ...c, rect: c.rect })
        return issues
      }

      // 1. Contact sheet: start and middle of every beat (every 3 s without beats) and the first moment of each error.
      const picks = new Map()
      if (beats.length) for (const b of beats) for (const t of [b.start + 0.1, (b.start + b.end) / 2]) picks.set(frame(t), '')
      else for (let t = 1.5; t < duration; t += 3) picks.set(frame(t), '')
      let added = 0
      for (const r of errorRuns) {
        const t = frame(Math.min(r.first, duration - 1 / FPS))
        if (added >= 24 || [...picks.keys()].some((k) => Math.abs(k - t) < 0.5)) continue
        picks.set(t, 'error')
        added++
      }
      const cards = []
      for (const t of [...picks.keys()].sort((a, b) => a - b)) {
        const issues = await issuesAt(t)
        const beat = beatAt(t)
        const errors = issues.filter((i) => i.severity === 'error')
        cards.push({ png: await shot(page, issues, 0.25), title: `${clock(t)}${beat ? ` · beat ${beat.n} ${beat.type}` : ''}`, errors: errors.length, lines: cardLines([...errors, ...issues.filter((i) => i.severity !== 'error')]) })
      }
      const sheetPath = join(outDir, 'contact-sheet.png')
      await sheet(browser, cards, sheetPath, `index.html · ${platform} · ${moments.length} moments checked · ${errorRuns.length} errors, ${warnRuns.length} warnings · red = error, amber = warning, blue = danger zones`)

      // 2. Cut strip: -0.2, -0.1, cut, +0.1, +0.2 s around every cut, one row per cut (does anything jump?).
      const cuts = beats.length
        ? beats.slice(1).map((b) => b.start)
        : await page.evaluate(() => [...document.querySelectorAll('[data-composition-id] .clip[data-start]')].filter((e) => e.tagName !== 'AUDIO' && Number(e.dataset.duration) >= 1.5).flatMap((e) => [Number(e.dataset.start), Number(e.dataset.start) + Number(e.dataset.duration)]))
      const cutTimes = [...new Set(cuts.map(frame))].filter((t) => t > 0.2 && t < duration - 0.2).sort((a, b) => a - b).slice(0, 12)
      const strip = []
      for (const c of cutTimes)
        for (const d of [-0.2, -0.1, 0, 0.1, 0.2]) {
          await seek(page, frame(c + d))
          strip.push({ png: await shot(page, [], 0.25), title: `${clock(frame(c + d))}${d === 0 ? ' · cut' : ` · ${d > 0 ? '+' : ''}${d}`}` })
        }
      const stripPath = join(outDir, 'cut-strip.png')
      if (strip.length) await sheet(browser, strip, stripPath, `Cuts ±0.2 s · one row per cut · does a position or colour jump, does motion keep its direction?`, { cols: 5, tw: 180 })

      // 3. Phone sheet: the beat middles at 360 px wide, as on a phone, without boxes (only the danger zones).
      const phone = []
      for (const t of beats.length ? beats.map((b) => frame((b.start + b.end) / 2)) : [...picks.keys()].filter((t) => picks.get(t) === '')) {
        await seek(page, t)
        phone.push({ png: await shot(page, [], 360 / WIDTH, '', false), title: clock(t), zones: true })
      }
      const phonePath = join(outDir, 'phone-sheet.png')
      await sheet(browser, phone, phonePath, `At phone width (360 px) · can every line that must be read be read? danger zones tinted blue`, { cols: 4, tw: 360 })

      console.log(`\n${moments.length} moments checked: ${errorRuns.length} errors (${errorMoments} moments), ${warnRuns.length} warnings${args.includes('--no-check') ? ' (hyperframes check skipped)' : ', hyperframes check included'}.`)
      console.log(`${join(outDir, 'inspect.json')}\n${sheetPath}\n${strip.length ? `${stripPath}\n` : ''}${phonePath}\nLook at the sheets before you render.`)
      exit = errorRuns.length ? 1 : 0
    }
  }
} finally {
  await browser.close()
  server.close()
}
process.exit(exit)
