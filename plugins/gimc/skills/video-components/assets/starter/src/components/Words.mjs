import { esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter, frames, tween } from '../motion.mjs'
import { fitAttrs } from '../fit.mjs'
import { enterSeconds } from '../theme.mjs'

const bare = (word) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

/**
 * The entrances a line of text can make (motion-design §7: vary them within a reel, never fade + slide-up on every
 * beat). Recipes after Hyperframes `references/motion.md`:
 * - `ink`: each word turns from the muted colour to its own colour, 3 frames apart; no position change, readable on
 *   frame 0 (the hook);
 * - `blur`: each word un-blurs (6 px → 0) and fades in, 2 frames apart, no translate;
 * - `line`: the whole line un-blurs (8 px → 0) at once;
 * - `rise`: each word fades in and rises 30 px, 3 frames apart (one option, not the default).
 * A landed line stays still: none of these loop or drift.
 */
export const ENTRANCES = ['ink', 'blur', 'line', 'rise']

/**
 * Text that enters word by word or as one line. `emphasis` (a word or phrase from `text`) gets the accent colour.
 * `lines` (from `fitText`) forces the line breaks of a fitted hero; without it the text wraps by itself.
 * `fromOpacity` (`CUT_OPACITY` by default) keeps a `blur`, `line` or `rise` entrance visible on the cut frame;
 * 0 only for text that enters later inside a beat, when something else is already on screen.
 * `fit` ({ width, min }, fit.mjs): the page shrinks the size until the longest word fits `width`.
 */
export const Words = (c, { id, text, emphasis, size, font, at, entrance = 'blur', lines = null, fromOpacity = CUT_OPACITY, fit = null }) => {
  if (!ENTRANCES.includes(entrance)) throw new Error(`Unknown entrance "${entrance}" (${ENTRANCES.join(', ')})`)
  const emphasised = new Set((emphasis ?? '').split(/\s+/).map(bare).filter(Boolean))
  const rows = (lines ?? [text]).map((l) => l.split(/\s+/).filter(Boolean))
  const words = rows.flat()
  const colorOf = (word) => (emphasised.has(bare(word)) ? c.theme.colors.accent : c.theme.colors.text)
  let i = 0
  const spans = rows
    .map((row, r) => {
      const html = row.map((word) => `<span id="${id}-w${i++}" class="word" style="${style({ display: 'inline-block', color: colorOf(word) })}">${esc(word)}</span>`).join('')
      // A forced break: an empty full-width item ends the flex row (a fitted hero keeps its balanced lines).
      return r < rows.length - 1 ? `${html}<span style="flex-basis:100%;height:0"></span>` : html
    })
    .join('')
  const html = `<div id="${id}" ${fit ? `${fitAttrs(fit.width, fit.min)} ` : ''}style="${style({ fontFamily: font, fontSize: `${size}px`, fontWeight: 700, lineHeight: 1.05, color: c.theme.colors.text, display: 'flex', flexWrap: 'wrap', columnGap: `${Math.round(size * 0.25)}px` })}">${spans}</div>`
  const word = enterSeconds(c.theme, 'word')
  const sel = (k) => `#${id}-w${k}`
  let tl
  if (entrance === 'line') tl = [enter(`#${id}`, at, enterSeconds(c.theme, 'small'), { opacity: fromOpacity, filter: 'blur(8px)' }, EASE.arriveSoft)]
  else if (entrance === 'ink') tl = words.map((w, k) => tween(sel(k), at + k * frames(3), word * 2, { color: c.theme.colors.muted }, { color: colorOf(w) }, EASE.arriveSoft))
  else if (entrance === 'blur') tl = words.map((_, k) => enter(sel(k), at + k * frames(2), word, { opacity: fromOpacity, filter: 'blur(6px)' }, EASE.arriveSoft))
  else {
    // Rise: more than 5 words enter as one block (a stagger stays under ~0.5 s in total).
    const stagger = words.length <= 5 ? frames(3) : 0
    tl = words.map((_, k) => enter(sel(k), at + k * stagger, enterSeconds(c.theme, 'small'), { opacity: fromOpacity, y: 30 }, EASE.arriveSoft))
  }
  return { html, tl }
}
