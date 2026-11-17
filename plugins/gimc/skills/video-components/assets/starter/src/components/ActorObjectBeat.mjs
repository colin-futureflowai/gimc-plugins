import { esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter, frames } from '../motion.mjs'
import { enterSeconds, fontStack, SPACE, TYPE } from '../theme.mjs'
import { Scene } from './Scene.mjs'
import { Symbol } from './Symbol.mjs'

/**
 * actor-object: a figure and what it acts on, standing on one ground line, each at its legend size (so the scale
 * ratio stays the same in every beat). Each side can have a `label` under it and a short bubble (`says`, one or
 * two words or a sign) above it; both belong to their figure. `objectAt` (seconds into the beat) brings the object in.
 */
export const ActorObjectBeat = (c, { title, actor, object, objectAt = frames(6) }) => {
  const col = (key, s) => {
    const id = `${c.id}-${key}`
    const bubble = s.says ? `<div id="${id}-says" data-relation="on" data-anchor="${key}" data-backdrop style="${style({ fontFamily: fontStack(c.theme, 'display'), fontSize: `${TYPE.body}px`, fontWeight: 700, lineHeight: 1, color: c.theme.colors.text, background: c.theme.colors.surface, border: `5px solid ${c.theme.colors.text}`, borderRadius: '28px', padding: `${SPACE[1]}px ${SPACE[3]}px` })}">${esc(s.says)}</div>` : ''
    const label = s.label ? `<div id="${id}-label" data-label-of="${key}" style="${style({ fontFamily: fontStack(c.theme, 'body'), fontSize: `${TYPE.body}px`, fontWeight: 600, lineHeight: 1.1, color: c.theme.colors.text, textAlign: 'center' })}">${esc(s.label)}</div>` : ''
    return `<div id="${id}" data-slot="${key}" style="${style({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${SPACE[2]}px` })}">${bubble}${Symbol(c, s.symbol, { id: `${id}-sym` })}${label}</div>`
  }
  // The ground line is the shared baseline both figures stand on (relation `below`).
  const hero = `<div data-hero style="${style({ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: `${c.area.width}px`, paddingBottom: `${SPACE[2]}px`, borderBottom: `5px solid ${c.theme.colors.muted}` })}">${col('actor', actor)}${col('object', object)}</div>`
  const scene = Scene(c, { title, hero })
  const t = enterSeconds(c.theme, 'hero')
  return {
    html: scene.html,
    tl: [...scene.tl, enter(`#${c.id}-actor`, c.start, t, { opacity: CUT_OPACITY, y: 30 }, EASE.arrive), enter(`#${c.id}-object`, c.start + objectAt, t, { opacity: objectAt > frames(6) ? 0 : CUT_OPACITY, scale: 0.92 }, EASE.pop)],
  }
}
