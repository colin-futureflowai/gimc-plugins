import { clipAttrs } from '../html.mjs'
import { fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'
import { Words } from './Words.mjs'

/** The first beat: big display type in the upper half of the safe area, moving on frame 0. */
export const HookCard = (c, { text, emphasis }) => {
  const words = Words(c, { id: `${c.id}-text`, text, emphasis, size: TYPE.hook, font: fontStack(c.theme, 'display'), at: c.start, fromOpacity: c.start === 0 ? 0.35 : 0 })
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}">${SafeArea(c, words.html, { justifyContent: 'flex-start', paddingTop: '80px' })}</section>`,
    tl: words.tl,
  }
}
