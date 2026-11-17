import { clipAttrs } from '../html.mjs'
import { fitText, fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'
import { Words } from './Words.mjs'

/**
 * The first beat: display type fitted to the width of the safe area, in its upper part, readable and moving on
 * frame 0. Its default entrance is `ink` (the words turn from muted to full colour), which never starts from
 * nothing; `entrance` overrides it.
 */
export const HookCard = (c, { text, emphasis, entrance = 'ink' }) => {
  const fit = fitText(text, { width: c.area.width, maxHeight: c.area.height - c.captionSpace - 120, min: TYPE.hook })
  const words = Words(c, { id: `${c.id}-text`, text, emphasis, size: fit.size, lines: fit.lines, font: fontStack(c.theme, 'display'), at: c.start, entrance })
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}">${SafeArea(c, words.html, { justifyContent: 'flex-start', paddingTop: '80px' })}</section>`,
    tl: words.tl,
  }
}
