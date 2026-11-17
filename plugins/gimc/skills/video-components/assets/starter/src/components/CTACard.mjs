import { clipAttrs, esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter, frames, set } from '../motion.mjs'
import { BRAND_COLUMNS, enterSeconds, fontStack, grid, SPACE, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'

/**
 * end-card (`cta` is its old name): "Comment KEYWORD" typed into a comment field, plus the promise, and the logo in
 * the brand slot: always 3 columns wide (BRAND_COLUMNS), on column 1, at the bottom of the content (the brand lands once, here,
 * with weight; never docked small in a corner of another beat). The keyword must be the one the
 * reply campaign in GIMC listens for (social-engagement). At least 2 s on screen (motion-design §9).
 * `label` is the action word in the reel's language ("Comment", "Reageer").
 *
 * The field is the hero: as wide as the keyword allows in the safe area. Label and promise are on the cut frame already (faint) and land first (overlapping,
 * 3 frames apart), the field pops in on scale only, and the keyword is typed after a 0.3 s hold: the payoff comes
 * after a short silence (motion-design §7).
 */
export const CTACard = (c, { label = 'Comment', keyword, promise }) => {
  const hero = enterSeconds(c.theme, 'hero')
  const small = enterSeconds(c.theme, 'small')
  const display = fontStack(c.theme, 'display')
  const padX = 32
  const size = Math.floor(Math.min(TYPE.heroMax, Math.max(TYPE.headline, (c.area.width - 2 * padX) / ([...keyword].length * 0.66))))
  const chars = [...keyword].map((ch, i) => `<span id="${c.id}-k${i}" style="opacity:0">${esc(ch)}</span>`).join('')
  const logo = c.theme.logo
    ? `<img id="${c.id}-logo" src="assets/${esc(c.theme.logo)}" alt="" data-brand data-slot="brand" style="${style({ width: `${grid(c.area).span(BRAND_COLUMNS)}px`, height: 'auto', flex: 'none', alignSelf: 'flex-start' })}">`
    : ''
  const body = `<div style="${style({ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: `${SPACE[3]}px` })}"><div id="${c.id}-label" style="${style({ fontFamily: display, fontSize: `${TYPE.headline}px`, fontWeight: 700, lineHeight: 1.05, color: c.theme.colors.text })}">${esc(label)}</div>
<div id="${c.id}-field" data-hero style="${style({ alignSelf: 'flex-start', minWidth: '360px', background: c.theme.colors.accent, color: c.theme.colors.accentText, fontFamily: display, fontSize: `${size}px`, lineHeight: 1.1, fontWeight: 800, padding: `12px ${padX}px`, borderRadius: '24px', whiteSpace: 'nowrap', transformOrigin: 'left center' })}">${chars}</div>
<div id="${c.id}-promise" style="${style({ fontFamily: fontStack(c.theme, 'body'), fontSize: `${TYPE.body}px`, lineHeight: 1.2, color: c.theme.colors.text, textWrap: 'balance' })}">${esc(promise)}</div></div>
${logo}`
  const fieldAt = c.start + frames(6)
  const typeAt = fieldAt + hero + 0.3
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}">${SafeArea(c, body, { gap: `${SPACE[3]}px`, paddingBottom: `${c.captionSpace + SPACE[2]}px` })}</section>`,
    tl: [
      enter(`#${c.id}-label`, c.start, small, { opacity: CUT_OPACITY, filter: 'blur(8px)' }, EASE.arriveSoft),
      enter(`#${c.id}-promise`, c.start + frames(3), small, { opacity: CUT_OPACITY, y: 20 }, EASE.arriveSoft),
      enter(`#${c.id}-field`, fieldAt, hero, { scale: 0.92 }, EASE.pop),
      ...[...keyword].map((_, i) => set(`#${c.id}-k${i}`, typeAt + frames(2 * i), { opacity: 1 })),
      ...(logo ? [enter(`#${c.id}-logo`, typeAt + frames(2 * keyword.length + 6), small, {}, EASE.arriveSoft)] : []),
    ],
  }
}

/** The scene type `end-card`; `cta` is the same card under its old name. */
export const EndCard = CTACard
