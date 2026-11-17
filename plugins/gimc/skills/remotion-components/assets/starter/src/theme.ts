/**
 * The reel's theme, made from the folder's brand in GIMC (gimc.canvas_get_brand) and written to props.json by the
 * agent. Colours are brand roles; font files live in public/fonts/ (never loaded from Google at render time).
 */
export type ThemeFont = {
  role: 'display' | 'body'
  family: string
  fallback: string
  files: { weight: number; file: string; style?: 'normal' | 'italic' }[]
}

export type Theme = {
  colors: { bg: string; surface: string; text: string; muted: string; accent: string; accentText: string }
  fonts: ThemeFont[]
  /** Logo file in public/, e.g. "logo.svg". */
  logo?: string
  /** From the brand's motion: "calm" slows entrances down, "snappy" speeds them up. */
  pace?: 'calm' | 'standard' | 'snappy'
}

/** Type sizes for 1080 px width (motion-design §4). */
export const TYPE = { hook: 120, headline: 96, body: 56, caption: 64, small: 36 } as const

export const fontStack = (theme: Theme, role: ThemeFont['role']) => {
  const font = theme.fonts.find((f) => f.role === role) ?? theme.fonts[0]
  return font ? `'${font.family}', ${font.fallback}` : 'system-ui, sans-serif'
}

/** Entrance length in frames at 30 fps (motion-design §7: 6–12 frames). */
export const enterFrames = (theme: Theme) => ({ calm: 12, standard: 9, snappy: 6 })[theme.pace ?? 'standard']
