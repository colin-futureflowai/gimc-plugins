import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { esc } from './html.mjs'

/**
 * The reel's theme, made from the folder's brand in GIMC (gimc.canvas_get_brand) and written to props.json by the
 * agent. Colours are brand roles; font files live in assets/fonts/ (never loaded from the network at render time).
 *
 * theme = {
 *   colors: { bg, surface, text, muted, accent, accentText },
 *   fonts: [{ role: 'display'|'body', family, fallback, files: [{ weight, file, style? }] }],
 *   logo?: 'logo.svg'            // in assets/
 *   pace?: 'calm'|'standard'|'snappy'
 * }
 */

/** Type sizes for 1080 px width (motion-design §5). `heroMax` caps a hero that is fitted to the width (`fitText`). */
export const TYPE = { hook: 120, headline: 96, heroMax: 320, body: 56, caption: 64, small: 36 }

/**
 * The grid every scene lays out on (motion-design references/grid-and-scenes.md): 6 columns inside the platform's safe
 * area with 24 px gutters, an 8 px vertical base, and a named anchor grid of 6 columns (A–F) × 8 rows (1–8) over the
 * safe area, so a maker and a reviewer speak in cells ("the target from C4 to C3"), never in pixels.
 */
export const COLUMNS = 6
export const ROWS = 8
export const GUTTER = 24
/** Spacing scale in px: every gap and padding is one of these. */
export const SPACE = [8, 16, 24, 40, 64, 104]
/** Figure widths in columns. One symbol keeps one size for the whole reel (its `size` in the legend). */
export const FIGURE = { sm: 2, md: 3, lg: 4, xl: 6 }
/** Icon sizes in px: an icon inside a hero (a symbol inside a diagram part) is at least `ICON.md`. */
export const ICON = { md: 96, lg: 160 }

/** Column geometry of a safe area: `span(n)` is the width of n columns with their gutters, `x(c)` the left of column c (1–6). */
export const grid = (area) => {
  const col = (area.width - GUTTER * (COLUMNS - 1)) / COLUMNS
  return { col, span: (n) => Math.round(n * col + (n - 1) * GUTTER), x: (c) => Math.round(area.left + (c - 1) * (col + GUTTER)) }
}

/** The box of an anchor cell such as `B3` (column A–F, row 1–8) on the safe area. */
export const cell = (area, name) => {
  const m = /^([A-F])([1-8])$/.exec(name)
  if (!m) throw new Error(`Anchor cell "${name}": use A1 to F8 (6 columns × 8 rows of the safe area)`)
  const w = area.width / COLUMNS
  const h = area.height / ROWS
  const c = m[1].charCodeAt(0) - 65
  const r = Number(m[2]) - 1
  return { left: Math.round(area.left + c * w), top: Math.round(area.top + r * h), width: Math.round(w), height: Math.round(h) }
}

/** The brand slot of the end card: the logo is always 3 columns wide, on column 1, at the bottom of the content. */
export const BRAND_COLUMNS = 3

/** A brand colour with an alpha, for the tint of a filled diagram part (`#31a029` → `rgba(49,160,41,0.28)`). */
export const tint = (hex, alpha = 0.28) => {
  const h = hex.replace('#', '')
  const v = h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6)
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16))
  return `rgba(${r},${g},${b},${alpha})`
}

export const fontStack = (theme, role) => {
  const font = theme.fonts.find((f) => f.role === role) ?? theme.fonts[0]
  return font ? `'${font.family}', ${font.fallback}` : 'sans-serif'
}

/**
 * Entrance length in seconds by role (motion-design §7): a hero or a card 0.3–0.6 s, a small element (kicker,
 * panel, line of body text) 4–12 frames, one word of a word-by-word entrance about 0.13 s. The brand's pace picks
 * where in the range. A longer build comes from a stagger, never from one slow move.
 */
const DURATIONS = {
  calm: { hero: 0.6, small: 0.4, word: 0.2 },
  standard: { hero: 0.45, small: 0.3, word: 0.13 },
  snappy: { hero: 0.35, small: 0.2, word: 0.1 },
}
export const enterSeconds = (theme, role = 'hero') => DURATIONS[theme.pace ?? 'standard'][role]

/**
 * Fits a hero line to the width it has (motion-design §3: a hero word fills 60–90 % of the frame width, as far as
 * the safe area allows). Breaks the text into balanced lines and picks the largest size whose longest line fits
 * `width` (with 5 % to spare) and whose lines fit `maxHeight`. The width is an estimate in ems for a bold sans (`wide` scales it for a
 * wide display face); inspect.mjs measures the real result. Returns `lines: null` when even `min` does not fit with
 * forced breaks; the text then wraps by itself at `min`, and the line is too long for a hero: cut words.
 */
const ems = (line) => [...line].reduce((w, ch) => w + (ch === ' ' ? 0.28 : /[A-Z0-9MW]/.test(ch) ? 0.7 : /[iljtf.,'!:;|]/.test(ch) ? 0.32 : 0.58), 0)
export const fitText = (text, { width, maxHeight, min, max = TYPE.heroMax, maxLines = 4, lineHeight = 1.05, wide = 1 }) => {
  const words = text.split(/\s+/).filter(Boolean)
  const len = (ws) => ems(ws.join(' '))
  let best = { size: min, lines: null }
  for (let n = 1; n <= Math.min(maxLines, words.length); n++) {
    // Balanced greedy break into n lines: close a line once it would pass the average length.
    const target = len(words) / n
    const lines = [[]]
    for (const w of words) {
      const cur = lines.at(-1)
      if (cur.length && lines.length < n && len([...cur, w]) > target * 1.15) lines.push([w])
      else cur.push(w)
    }
    const longest = Math.max(...lines.map(len)) * wide
    const size = Math.floor(Math.min(max, (width * 0.95) / longest, maxHeight / (lines.length * lineHeight)))
    if (size >= min && (!best.lines || size > best.size)) best = { size, lines: lines.map((l) => l.join(' ')) }
  }
  return best
}

const FORMAT = { woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype' }

/**
 * One @font-face per brand font file. A missing file stops the build: Hyperframes would otherwise swap the
 * font for another one without any error.
 */
export const fontFaces = (theme, dir) =>
  theme.fonts
    .flatMap((font) =>
      font.files.map((f) => {
        const path = join(dir, 'assets', 'fonts', f.file)
        if (!existsSync(path)) throw new Error(`Font file missing: assets/fonts/${f.file} (${font.family} ${f.weight}). Download it first.`)
        const format = FORMAT[f.file.split('.').pop().toLowerCase()]
        return `@font-face{font-family:'${esc(font.family)}';src:url('assets/fonts/${esc(f.file)}')${format ? ` format('${format}')` : ''};font-weight:${Number(f.weight)};font-style:${f.style ?? 'normal'};font-display:block}`
      }),
    )
    .join('\n')
