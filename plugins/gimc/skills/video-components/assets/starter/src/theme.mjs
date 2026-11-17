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
