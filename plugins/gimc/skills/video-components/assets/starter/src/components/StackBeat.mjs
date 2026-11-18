import { esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter, frames } from '../motion.mjs'
import { FIT_MIN, fitAttrs } from '../fit.mjs'
import { enterSeconds, fontStack, SPACE, TYPE } from '../theme.mjs'
import { Scene } from './Scene.mjs'
import { Symbol, symbolWidth } from './Symbol.mjs'

/**
 * stack: 2–4 items on one left edge with equal gaps, each an optional legend symbol (`icon` size) and a short line.
 * An item enters when the voice names it (`at`, seconds into the beat; default 6 frames apart), rising into place: a
 * slide from the left would cross the left edge of the safe area while it moves.
 */
export const StackBeat = (c, { title, items }) => {
  if (!items?.length || items.length > 4) throw new Error(`${c.id}: a stack has 2–4 items`)
  const rows = items.map((it, k) => {
    const id = `${c.id}-i${k}`
    const sym = it.symbol ? Symbol(c, it.symbol, { id: `${id}-sym` }) : ''
    return `<div id="${id}" data-slot="items" style="${style({ display: 'flex', alignItems: 'center', gap: `${SPACE[2]}px` })}">${sym}<div data-label-of="${id}" ${fitAttrs(c.area.width - (it.symbol ? symbolWidth(c, c.legend?.[it.symbol]?.size) + SPACE[2] : 0), FIT_MIN.body)} style="${style({ fontFamily: fontStack(c.theme, 'display'), fontSize: `${TYPE.body + 8}px`, fontWeight: 700, lineHeight: 1.1, color: c.theme.colors.text })}">${esc(it.text)}</div></div>`
  })
  const hero = `<div data-hero style="${style({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: `${SPACE[4]}px`, width: `${c.area.width}px` })}">${rows.join('')}</div>`
  const scene = Scene(c, { title, hero, align: 'flex-start' })
  const t = enterSeconds(c.theme, 'small')
  return {
    html: scene.html,
    tl: [...scene.tl, ...items.map((it, k) => enter(`#${c.id}-i${k}`, c.start + (it.at ?? k * frames(6)), t, { opacity: (it.at ?? 0) > frames(6) ? 0 : CUT_OPACITY, y: 24 }, EASE.arriveSoft))],
  }
}
