import { frames } from '../motion.mjs'
import { FIGURE, grid } from '../theme.mjs'
import { Diagram } from './Diagram.mjs'
import { heroBox, Scene } from './Scene.mjs'

/**
 * diagram-focus: one diagram from `props.diagrams` as the hero, its parts labelled on the part. `show` adds parts
 * (they stay for the rest of the reel), `focus` (default: the last part of `show`) gets the accent, `attach` hangs
 * legend symbols in a part (`relation`: `inside` before the label, `next-to` after it). `revealAt` (seconds into the
 * beat, default 4 frames) is when the voice names the new part.
 */
export const DiagramBeat = (c, beat) => {
  const { name, def, state, before } = c.diagram
  const box = heroBox(c)
  const d = Diagram(c, { id: `${c.id}-d`, name, def, width: grid(c.area).span(FIGURE[def.size ?? 'xl']), height: box.height, state, before, at: c.start + (beat.revealAt ?? frames(4)) })
  const scene = Scene(c, { title: beat.title, hero: d.html })
  return { html: scene.html, tl: [...scene.tl, ...d.tl] }
}
