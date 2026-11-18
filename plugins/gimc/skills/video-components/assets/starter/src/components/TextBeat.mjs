import { clipAttrs, esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter, frames } from '../motion.mjs'
import { FIT_MIN, fitAttrs } from '../fit.mjs'
import { enterSeconds, fitText, fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'
import { ENTRANCES, Words } from './Words.mjs'

/**
 * A value beat: an optional small kicker above one headline fitted to the width of the safe area. Without an
 * `entrance`, text beats take turns (`blur`, `rise`, `line`, by `c.textIndex`), so two value beats never enter the
 * same way.
 */
export const TextBeat = (c, { text, emphasis, kicker, entrance }) => {
  const turn = ['blur', 'rise', 'line'][(c.textIndex ?? 0) % 3]
  const how = entrance && ENTRANCES.includes(entrance) ? entrance : turn
  const fit = fitText(text, { width: c.area.width, maxHeight: c.area.height - c.captionSpace - (kicker ? 120 : 40), min: TYPE.headline })
  const words = Words(c, { id: `${c.id}-text`, text, emphasis, size: fit.size, lines: fit.lines, font: fontStack(c.theme, 'display'), at: c.start + (kicker ? frames(4) : 0), entrance: how, fit: { width: c.area.width, min: FIT_MIN.hero } })
  const kickerHtml = kicker
    ? `<div id="${c.id}-kicker" ${fitAttrs(c.area.width, FIT_MIN.small)} style="${style({ fontFamily: fontStack(c.theme, 'body'), fontSize: `${TYPE.small + 8}px`, fontWeight: 600, color: c.theme.colors.muted, letterSpacing: '0.04em' })}">${esc(kicker)}</div>`
    : ''
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}">${SafeArea(c, kickerHtml + words.html, { justifyContent: 'center', gap: '32px', paddingBottom: `${c.captionSpace}px` })}</section>`,
    // The kicker un-blurs in place: a slide from outside would cross the edge of the safe area while it moves.
    tl: [...(kicker ? [enter(`#${c.id}-kicker`, c.start, enterSeconds(c.theme, 'small'), { opacity: CUT_OPACITY, filter: 'blur(6px)' }, EASE.arriveSoft)] : []), ...words.tl],
  }
}
