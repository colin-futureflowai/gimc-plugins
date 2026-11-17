import { esc, style } from '../html.mjs'
import { enter, frames } from '../motion.mjs'
import { enterSeconds } from '../theme.mjs'

const bare = (word) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

/**
 * Text that enters word by word (3 frames apart, motion-design §7); more than 5 words enter as one block.
 * `emphasis` (a word or phrase from `text`) gets the accent colour. `fromOpacity` above 0 keeps the words
 * readable on the first frame (the hook moves on frame 0, it never fades in from black).
 */
export const Words = (c, { id, text, emphasis, size, font, at, fromOpacity = 0 }) => {
  const words = text.split(/\s+/).filter(Boolean)
  const emphasised = new Set((emphasis ?? '').split(/\s+/).map(bare).filter(Boolean))
  const stagger = words.length <= 5 ? frames(3) : 0
  const spans = words
    .map((word, i) => `<span id="${id}-w${i}" class="word" style="${style({ display: 'inline-block', color: emphasised.has(bare(word)) ? c.theme.colors.accent : undefined })}">${esc(word)}</span>`)
    .join('')
  const html = `<div id="${id}" style="${style({ fontFamily: font, fontSize: `${size}px`, fontWeight: 700, lineHeight: 1.05, color: c.theme.colors.text, display: 'flex', flexWrap: 'wrap', columnGap: `${Math.round(size * 0.25)}px` })}">${spans}</div>`
  const tl = words.map((_, i) => enter(`#${id}-w${i}`, at + i * stagger, enterSeconds(c.theme), { opacity: fromOpacity, y: 30 }))
  return { html, tl }
}
