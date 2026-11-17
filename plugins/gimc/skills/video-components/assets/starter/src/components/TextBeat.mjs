import { clipAttrs, esc, style } from '../html.mjs'
import { enter, frames } from '../motion.mjs'
import { enterSeconds, fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'
import { Words } from './Words.mjs'

/** A value beat: an optional small kicker above one headline. */
export const TextBeat = (c, { text, emphasis, kicker }) => {
  const words = Words(c, { id: `${c.id}-text`, text, emphasis, size: TYPE.headline, font: fontStack(c.theme, 'display'), at: c.start + (kicker ? frames(4) : 0) })
  const kickerHtml = kicker
    ? `<div id="${c.id}-kicker" style="${style({ fontFamily: fontStack(c.theme, 'body'), fontSize: `${TYPE.small + 8}px`, fontWeight: 600, color: c.theme.colors.muted, letterSpacing: '0.04em' })}">${esc(kicker)}</div>`
    : ''
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}">${SafeArea(c, kickerHtml + words.html, { justifyContent: 'center', gap: '32px' })}</section>`,
    tl: [...(kicker ? [enter(`#${c.id}-kicker`, c.start, enterSeconds(c.theme), { x: -30 })] : []), ...words.tl],
  }
}
