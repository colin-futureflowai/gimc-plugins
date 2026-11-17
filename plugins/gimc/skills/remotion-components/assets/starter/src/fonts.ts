import { loadFont } from '@remotion/fonts'
import { staticFile } from 'remotion'
import type { Theme } from './theme'

/** Loads every brand font file from public/fonts/. A missing file fails the render instead of falling back silently. */
export const loadThemeFonts = (theme: Theme) =>
  Promise.all(
    theme.fonts.flatMap((font) =>
      font.files.map((f) =>
        loadFont({ family: font.family, url: staticFile(`fonts/${f.file}`), weight: String(f.weight), style: f.style ?? 'normal' }),
      ),
    ),
  )
