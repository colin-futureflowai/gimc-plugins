/**
 * Keeps every word inside the safe area. A word cannot wrap, so one long word ("Ondernemersvaardigheden", a URL)
 * at a hero size runs out of the frame. fitText (theme.mjs) only estimates in ems; this measures the real font.
 *
 * Every text block that must stay inside the safe area gets `fitAttrs(width, min)`: the width its longest word may
 * take (the safe area minus the block's own padding) and the smallest size it may shrink to. In the page, after the
 * brand fonts have loaded and before the timeline is built, `fitAll` measures each block's longest word with the
 * real font (canvas measureText: independent of layout, of which clip is visible and of the network) and lowers
 * the font size only as far as needed. A block that already fits keeps its size, so a reel that fitted does not
 * change. Is the longest word still too wide at the minimum, then the block may break inside words
 * (`overflow-wrap: anywhere`) as a last resort.
 *
 * `nowrap` blocks (the CTA keyword field) are measured as one line.
 */

/** Smallest sizes a block may shrink to, by role (TYPE in theme.mjs: hero 96–320, body 56, caption 64, small 36). */
export const FIT_MIN = { hero: 40, body: 32, caption: 40, small: 28 }

/** Attributes for a text block: `width` px for its longest word, never smaller than `min` px. */
export const fitAttrs = (width, min) => `data-fit="${Math.floor(width)}" data-fit-min="${Math.floor(min)}"`

/**
 * The size at which the widest of `words` fits `maxWidth`. `measure(word, size)` gives the width in px of a word at a
 * size. Returns `{ size, wrap }`: the size (whole px, never above `size`, never below `min`) and whether the block
 * must still break inside a word. Pure and deterministic: the same widths give the same result.
 */
export function fitSize({ words, size, maxWidth, min, measure }) {
  const widest = (s) => Math.max(0, ...words.map((w) => measure(w, s)))
  if (widest(size) <= maxWidth) return { size, wrap: false }
  const floor = Math.min(size, min)
  // Text width scales with the size; start from that ratio, then step down a pixel at a time for rounding and kerning.
  let s = Math.max(floor, Math.floor((size * maxWidth) / widest(size)))
  while (s > floor && widest(s) > maxWidth) s -= 1
  return { size: s, wrap: widest(s) > maxWidth }
}

/**
 * Runs in the page (inlined by build.mjs with `fitSize`): fits every `[data-fit]` block. Must run after the fonts
 * have loaded and before the timeline is built (a tween never animates the font size, so the timeline is unchanged).
 */
export function fitAll(doc) {
  const ctx = doc.createElement('canvas').getContext('2d')
  for (const el of doc.querySelectorAll('[data-fit]')) {
    const cs = getComputedStyle(el)
    const size = parseFloat(cs.fontSize)
    const nowrap = cs.whiteSpace === 'nowrap' || cs.whiteSpace === 'pre'
    // Word by word per text node: Words.mjs puts each word in its own span without a space in between.
    const nodes = []
    for (let walk = doc.createTreeWalker(el, 4), n = walk.nextNode(); n; n = walk.nextNode()) nodes.push(n.nodeValue)
    const words = nowrap ? [nodes.join('').trim()].filter(Boolean) : nodes.flatMap((t) => t.split(/\s+/)).filter(Boolean)
    if (!words.length || !size) continue
    const spacing = (s) => (cs.letterSpacing === 'normal' ? 0 : (parseFloat(cs.letterSpacing) / size) * s)
    const measure = (word, s) => {
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${s}px ${cs.fontFamily}`
      return ctx.measureText(word).width + spacing(s) * [...word].length
    }
    const fit = fitSize({ words, size, maxWidth: Number(el.dataset.fit), min: Number(el.dataset.fitMin), measure })
    if (fit.size !== size) {
      el.style.fontSize = `${fit.size}px`
      if (el.style.columnGap) el.style.columnGap = `${Math.round(fit.size * 0.25)}px`
      el.dataset.fitted = String(fit.size)
    }
    if (fit.wrap) {
      for (const node of [el, ...el.querySelectorAll('*')]) {
        node.style.overflowWrap = 'anywhere'
        node.style.wordBreak = 'break-word'
        node.style.maxWidth = '100%'
      }
      if (nowrap) el.style.whiteSpace = 'normal'
      el.dataset.fitWrap = ''
    }
  }
}
