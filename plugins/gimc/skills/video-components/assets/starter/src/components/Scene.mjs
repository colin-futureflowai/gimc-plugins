import { clipAttrs, esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter } from '../motion.mjs'
import { FIT_MIN, fitAttrs } from '../fit.mjs'
import { enterSeconds, fitText, fontStack, SPACE, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'

/**
 * The frame every scene type lays out in: an optional title slot on top (a keyword or label of at most a few words,
 * never the caption sentence), the hero slot under it, and the caption band kept free at the bottom. The title slot
 * keeps its height also without a title, so a diagram or figure stands on the same spot in every beat and a cut
 * between two beats of the same scene does not jump.
 */
export const TITLE = { size: 64, height: 88 + SPACE[3] }

export const heroBox = (c, { title = true } = {}) => ({ width: c.area.width, height: c.area.height - c.captionSpace - (title ? TITLE.height : 0) })

export const Title = (c, text) => {
  if (!text) return { html: `<div data-slot="title" style="height:${TITLE.height - SPACE[3]}px;flex:none"></div>`, tl: [] }
  const fit = fitText(text, { width: c.area.width, maxHeight: TITLE.height - SPACE[3] - SPACE[1], min: TYPE.body, max: TITLE.size, maxLines: 1 })
  return {
    html: `<div id="${c.id}-title" data-slot="title" ${fitAttrs(c.area.width, FIT_MIN.small)} style="${style({ height: `${TITLE.height - SPACE[3]}px`, flex: 'none', fontFamily: fontStack(c.theme, 'display'), fontSize: `${fit.size}px`, fontWeight: 700, lineHeight: 1.1, color: c.theme.colors.text, whiteSpace: 'nowrap', paddingTop: `${SPACE[1]}px` })}">${esc(text)}</div>`,
    // The same title as the beat before stays still over the cut: only what changes moves.
    tl: c.prev?.title === text ? [] : [enter(`#${c.id}-title`, c.start, enterSeconds(c.theme, 'small'), { opacity: CUT_OPACITY, filter: 'blur(6px)' }, EASE.arriveSoft)],
  }
}

/** A scene's section: title slot + hero slot inside the safe area, on the brand background. */
export const Scene = (c, { title, hero, align = 'center', withTitle = true }) => {
  const t = withTitle ? Title(c, title) : { html: '', tl: [] }
  const body = `${t.html}<div data-slot="hero" style="${style({ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: align, justifyContent: 'center' })}">${hero}</div>`
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}">${SafeArea(c, body, { gap: `${SPACE[3]}px`, paddingBottom: `${c.captionSpace}px` })}</section>`,
    tl: t.tl,
  }
}
