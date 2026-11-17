import { clipAttrs, esc, sec, style } from '../html.mjs'
import { set } from '../motion.mjs'
import { fontStack, TYPE } from '../theme.mjs'
import { SafeArea } from './SafeArea.mjs'

/**
 * Words a caption page never ends on (articles, prepositions, conjunctions, pronouns that open a clause), in the
 * languages GIMC reels are made in. A page that would end on one takes the next word too.
 */
const WEAK = new Set(
  (
    'de het een te die dat en of om van in op aan met voor naar bij als dan maar want je jij ik we wij ze zij er ' +
    'the a an to of in on at for with and or but that which who as by from it is ' +
    'der die das ein eine und oder zu mit von im am auf für dass'
  ).split(' '),
)
const bare = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
const ends = (w) => /[.!?:;,]$/.test(w.text.trim())

/**
 * Splits word timestamps into pages by meaning (motion-design references/captions.md): at most `maxWords` words
 * (build.mjs: 3, 4 or 6 by `captionEnergy`), a new page on a pause of 150 ms or more or after a sentence end, never
 * a page that ends on a weak word ("de", "te", "and"), and never one word left alone before a sentence end: the page
 * takes one word more instead (at most `maxWords + 1`).
 * captions = [{ text, startMs, endMs }] from the voiceover transcript.
 */
export const captionPages = (captions, maxWords = 4) => {
  const pages = []
  for (const [i, word] of captions.entries()) {
    const page = pages.at(-1)
    const prev = page?.words.at(-1)
    const hardBreak = !page || word.startMs - prev.endMs >= 150 || /[.!?]$/.test(prev.text.trim())
    let full = page && page.words.length >= maxWords
    if (full && page.words.length < maxWords + 1) {
      // One word more instead of a weak ending or a lone last word of the sentence (or of the reel).
      const lone = ends(word) || i === captions.length - 1
      if (WEAK.has(bare(prev.text)) || (lone && !ends(prev))) full = false
    }
    if (hardBreak || full) pages.push({ words: [word] })
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
export const Captions = (c, captions, maxWords = 4) => {
  const pages = captionPages(captions, maxWords)
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
