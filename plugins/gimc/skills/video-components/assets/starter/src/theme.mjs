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

/** Type sizes for 1080 px width (motion-design §4). */
export const TYPE = { hook: 120, headline: 96, body: 56, caption: 64, small: 36 }

export const fontStack = (theme, role) => {
  const font = theme.fonts.find((f) => f.role === role) ?? theme.fonts[0]
  return font ? `'${font.family}', ${font.fallback}` : 'sans-serif'
}

/** Entrance length in seconds (motion-design §7: 6–12 frames at 30 fps). */
export const enterSeconds = (theme) => ({ calm: 0.4, standard: 0.3, snappy: 0.2 })[theme.pace ?? 'standard']

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
