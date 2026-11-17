import { esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter, frames, tween } from '../motion.mjs'
import { enterSeconds, fontStack, SPACE, TYPE } from '../theme.mjs'
import { Scene } from './Scene.mjs'
import { Symbol } from './Symbol.mjs'

/**
 * compare: two sides (before/after, long/short) stacked on one left edge, as wide as the safe area and equally
 * tall (motion-design §3: a side-by-side is rebuilt as a vertical sequence). Each side is a legend symbol with its
 * label next to it. `rightAt` (seconds into the beat) brings the second side in later; `winner` (`left` or `right`,
 * i.e. top or bottom) gets the accent border at `winnerAt` while the other side steps back.
 */
export const CompareBeat = (c, { title, left, right, winner, rightAt = frames(4), winnerAt }) => {
  const side = (key, s) => {
    const id = `${c.id}-${key}`
    const symbol = s.symbol ? Symbol(c, s.symbol, { id: `${id}-sym`, extra: { maxWidth: '45%' } }) : ''
    const label = `<div id="${id}-label" data-label-of="${key}" style="${style({ flex: '1 1 0', fontFamily: fontStack(c.theme, 'display'), fontSize: `${TYPE.body + 8}px`, fontWeight: 700, lineHeight: 1.1, color: c.theme.colors.text, textWrap: 'balance' })}">${esc(s.label)}</div>`
    return `<div id="${id}" data-slot="${key}" data-backdrop style="${style({ flex: '1 1 0', minHeight: 0, display: 'flex', alignItems: 'center', gap: `${SPACE[3]}px`, padding: `${SPACE[3]}px`, background: c.theme.colors.surface, border: `5px solid ${c.theme.colors.muted}`, borderRadius: '28px' })}">${symbol}${label}</div>`
  }
  const hero = `<div data-hero style="${style({ display: 'flex', flexDirection: 'column', gap: `${SPACE[2]}px`, width: `${c.area.width}px`, flex: '1 1 auto', alignSelf: 'stretch' })}">${side('left', left)}${side('right', right)}</div>`
  const scene = Scene(c, { title, hero })
  const t = enterSeconds(c.theme, 'hero')
  const tl = [...scene.tl, enter(`#${c.id}-left`, c.start, t, { opacity: CUT_OPACITY, y: 24 }, EASE.arrive), enter(`#${c.id}-right`, c.start + rightAt, t, { opacity: rightAt > frames(6) ? 0 : CUT_OPACITY, y: 24 }, EASE.arrive)]
  if (winner) {
    const at = c.start + (winnerAt ?? Math.max(rightAt + t + 0.3, c.duration / 2))
    const loser = winner === 'left' ? 'right' : 'left'
    tl.push(tween(`#${c.id}-${winner}`, at, t, { borderColor: c.theme.colors.muted }, { borderColor: c.theme.colors.accent }, EASE.camera))
    tl.push(tween(`#${c.id}-${loser}`, at, t, { opacity: 1 }, { opacity: 0.6 }, EASE.camera))
  }
  return { html: scene.html, tl }
}
