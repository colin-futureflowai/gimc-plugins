import { esc, style } from '../html.mjs'
import { enter, frames } from '../motion.mjs'
import { enterSeconds, fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'

/** Name and role of the speaker, on a panel at the bottom of the safe area, above the captions when there are any. */
export const LowerThird = (c, { name, title }) => {
  const id = `${c.id}-lower`
  const panel = `<div id="${id}" data-backdrop style="${style({ alignSelf: 'flex-start', background: c.theme.colors.surface, padding: '20px 28px', borderLeft: `8px solid ${c.theme.colors.accent}` })}">
  <div style="${style({ fontFamily: fontStack(c.theme, 'display'), fontSize: `${TYPE.body}px`, fontWeight: 700, color: c.theme.colors.text })}">${esc(name)}</div>
  <div style="${style({ fontFamily: fontStack(c.theme, 'body'), fontSize: `${TYPE.small + 8}px`, color: c.theme.colors.muted })}">${esc(title)}</div>
</div>`
  return { html: SafeArea(c, panel, { justifyContent: 'flex-end', paddingBottom: `${c.captionSpace}px` }), tl: [enter(`#${id}`, c.start + frames(6), enterSeconds(c.theme), { x: -40 })] }
}
