import { clipAttrs, esc, style } from '../html.mjs'
import { EASE, enter, frames, set } from '../motion.mjs'
import { enterSeconds, fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'

/**
 * The end card: "Comment KEYWORD" typed into a comment field, plus the promise. The keyword must be the one the
 * reply campaign in GIMC listens for (social-engagement). At least 2 s on screen (motion-design §8).
 * `label` is the action word in the reel's language ("Comment", "Reageer").
 */
export const CTACard = (c, { label = 'Comment', keyword, promise }) => {
  const d = enterSeconds(c.theme)
  const display = fontStack(c.theme, 'display')
  const chars = [...keyword].map((ch, i) => `<span id="${c.id}-k${i}" style="opacity:0">${esc(ch)}</span>`).join('')
  const logo = c.theme.logo ? `<img id="${c.id}-logo" src="assets/${esc(c.theme.logo)}" alt="" style="height:72px;object-fit:contain;align-self:flex-start">` : ''
  const body = `<div id="${c.id}-label" style="${style({ fontFamily: display, fontSize: `${TYPE.headline}px`, fontWeight: 700, lineHeight: 1.05, color: c.theme.colors.text })}">${esc(label)}</div>
<div id="${c.id}-field" style="${style({ alignSelf: 'flex-start', minWidth: '360px', background: c.theme.colors.accent, color: c.theme.colors.accentText, fontFamily: display, fontSize: `${TYPE.headline}px`, fontWeight: 800, padding: '12px 32px', borderRadius: '24px', whiteSpace: 'nowrap' })}">${chars}</div>
<div id="${c.id}-promise" style="${style({ fontFamily: fontStack(c.theme, 'body'), fontSize: `${TYPE.body}px`, lineHeight: 1.2, color: c.theme.colors.text, textWrap: 'balance' })}">${esc(promise)}</div>
${logo}`
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}">${SafeArea(c, body, { justifyContent: 'center', gap: '40px' })}</section>`,
    tl: [
      enter(`#${c.id}-label`, c.start, d, { y: 30 }),
      enter(`#${c.id}-field`, c.start, d + 0.1, { scale: 0.92 }, EASE.pop),
      ...[...keyword].map((_, i) => set(`#${c.id}-k${i}`, c.start + frames(8 + 2 * i), { opacity: 1 })),
      enter(`#${c.id}-promise`, c.start + frames(10), d, { y: 20 }),
      ...(logo ? [enter(`#${c.id}-logo`, c.start + frames(10), d)] : []),
    ],
  }
}
