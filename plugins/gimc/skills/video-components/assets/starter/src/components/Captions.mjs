import { clipAttrs, esc, sec, style } from '../html.mjs'
import { set } from '../motion.mjs'
import { fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'

/**
 * Splits word timestamps into pages of 1–4 words; a new page on a pause of 150 ms or more or after a sentence end.
 * captions = [{ text, startMs, endMs }] from the voiceover transcript.
 */
export const captionPages = (captions, maxWords = 4) => {
  const pages = []
  for (const word of captions) {
    const page = pages.at(-1)
    const prev = page?.words.at(-1)
    const breakHere = !page || page.words.length >= maxWords || word.startMs - prev.endMs >= 150 || /[.!?]$/.test(prev.text.trim())
    if (breakHere) pages.push({ words: [word] })
    else page.words.push(word)
  }
  return pages.map((p, i) => {
    const start = p.words[0].startMs / 1000
    const lastEnd = p.words.at(-1).endMs / 1000
    const next = pages[i + 1] ? pages[i + 1].words[0].startMs / 1000 : Infinity
    return { words: p.words, start, end: Math.min(next, lastEnd + 0.5) }
  })
}

/**
 * Subtitles from the voiceover's word timestamps: one page at a time at the bottom of the safe area, the spoken
 * word in the accent colour. Each page is its own clip, so a page can never stay on screen too long. Start and end are
 * rounded to whole frames apart, so two pages never share a frame (rounding start and length apart did that once).
 * The box is the text's backing (`data-backdrop`); `data-role="caption"` gives it the caption checks of inspect.mjs;
 * each word may sit in the caption band of `hyperframes check` (`data-layout-allow-caption-zone`, on the text itself).
 */
export const Captions = (c, captions) => {
  const pages = captionPages(captions)
  const tl = []
  const html = pages
    .map((p, i) => {
      const words = p.words
        .map((w, j) => {
          const id = `cap${i}-w${j}`
          tl.push(set(`#${id}`, w.startMs / 1000, { color: c.theme.colors.accent }), set(`#${id}`, w.endMs / 1000, { color: c.theme.colors.text }))
          return `<span id="${id}" data-layout-allow-caption-zone>${esc(w.text.trim())}</span>`
        })
        .join(' ')
      const box = `<div data-backdrop data-role="caption" style="${style({ alignSelf: 'center', background: c.theme.colors.bg, padding: '12px 24px', borderRadius: '16px', fontFamily: fontStack(c.theme, 'body'), fontSize: `${TYPE.caption}px`, fontWeight: 700, lineHeight: 1.15, textAlign: 'center', color: c.theme.colors.text })}">${words}</div>`
      return `<div id="cap${i}" ${clipAttrs(sec(p.start), sec(p.end) - sec(p.start), 2)} style="position:absolute;inset:0;z-index:5">${SafeArea(c, box, { justifyContent: 'flex-end', paddingBottom: '24px' })}</div>`
    })
    .join('\n')
  return { html, tl }
}
