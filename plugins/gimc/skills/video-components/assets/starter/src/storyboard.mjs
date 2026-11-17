/**
 * The storyboard: the scene design written down before any code (motion-design references/storyboard.md).
 *
 * In props.json every beat carries `message` (what a viewer gets without sound, at most 8 words). The reel has a
 * `legend` (symbol → one meaning, one file, one size) and optional `diagrams` (named diagrams with their parts).
 * Every element a beat adds beyond its scene type (`attach`) names its `relation` to a part. The scene types build
 * the other relations themselves; build.mjs writes the whole storyboard into index.html
 * (`<script type="application/json" id="storyboard">`) and onto the elements as data attributes, so inspect.mjs
 * can test it:
 *
 * | attribute | on | meaning |
 * |---|---|---|
 * | `data-scene`, `data-message` | the beat's section | scene type and message |
 * | `data-slot` | a slot container | `title`, `hero`, `card`, `presenter`, `left`, `right`, `actor`, `object`, `items`, `brand` |
 * | `data-hero` | the hero element | the one focal point of the beat |
 * | `data-part` | a diagram part | `<diagram>.<part>` |
 * | `data-label-of` | a label | the part or slot it names |
 * | `data-anchor`, `data-relation` | an attached element | the part it hangs on and how |
 * | `data-symbol` | a legend symbol | the symbol's name (one meaning per reel) |
 * | `data-brand` | the logo | only in the end card's brand slot |
 */

/** Relations an element can have to the hero, a part or a slot. Anything without one is dropped from the design. */
export const RELATIONS = ['inside', 'on', 'label-of', 'aligned-with', 'next-to', 'below', 'replaces']

/** The scene types (beat `type`). `cta` is the old name of `end-card`. */
export const SCENES = ['hook', 'text', 'media', 'diagram', 'compare', 'actor-object', 'stack', 'presenter', 'end-card', 'cta']

const SIZES = ['icon', 'sm', 'md', 'lg', 'xl']
const words = (s) => String(s ?? '').trim().split(/\s+/).filter(Boolean).length

/** Checks the storyboard in the props; throws one error listing every problem, so the design is fixed before code. */
export const validateStoryboard = (props) => {
  const problems = []
  const legend = props.legend ?? {}
  const diagrams = props.diagrams ?? {}
  for (const [name, s] of Object.entries(legend)) {
    if (!s.meaning) problems.push(`legend.${name}: give its one meaning ("meaning")`)
    if (!s.src) problems.push(`legend.${name}: give its file in assets/ ("src")`)
    if (s.size && !SIZES.includes(s.size)) problems.push(`legend.${name}: size "${s.size}" (use ${SIZES.join(', ')})`)
  }
  const meanings = new Map()
  for (const [name, s] of Object.entries(legend)) {
    const m = String(s.meaning ?? '').toLowerCase()
    if (m && meanings.has(m)) problems.push(`legend: "${name}" and "${meanings.get(m)}" both mean "${s.meaning}"; one meaning, one symbol`)
    meanings.set(m, name)
  }
  for (const [id, d] of Object.entries(diagrams)) {
    if (!['pyramid', 'flow'].includes(d.kind)) problems.push(`diagrams.${id}: kind "${d.kind}" (use pyramid or flow)`)
    if (!d.parts?.length || d.parts.length > 6) problems.push(`diagrams.${id}: 1–6 parts`)
    for (const p of d.parts ?? []) if (!p.id || !p.label) problems.push(`diagrams.${id}: every part has an id and a label (labels sit on the part they name)`)
  }
  const symbol = (where, name) => {
    if (name && !legend[name]) problems.push(`${where}: symbol "${name}" is not in the legend`)
  }
  for (const [i, b] of (props.beats ?? []).entries()) {
    const at = `beat ${i + 1} (${b.type})`
    if (!SCENES.includes(b.type)) problems.push(`${at}: unknown scene type; use ${SCENES.join(', ')}. An own element goes into a scene type, or the scene type gets added to video-components`)
    if (!b.message) problems.push(`${at}: write its message first (what a viewer gets without sound, at most 8 words)`)
    else if (words(b.message) > 8) problems.push(`${at}: message has ${words(b.message)} words; at most 8`)
    const diagram = b.diagram ?? b.card?.diagram
    if (diagram && !diagrams[diagram]) problems.push(`${at}: diagram "${diagram}" is not in props.diagrams`)
    const parts = new Set((diagrams[diagram]?.parts ?? []).map((p) => p.id))
    for (const p of [...(b.show ?? b.card?.show ?? []), ...(b.focus ? [b.focus] : [])]) if (diagram && !parts.has(p)) problems.push(`${at}: part "${p}" is not in diagram "${diagram}"`)
    for (const a of b.attach ?? []) {
      symbol(at, a.symbol)
      if (!RELATIONS.includes(a.relation)) problems.push(`${at}: attach "${a.symbol}" needs a relation (${RELATIONS.join(', ')}); an element without one is dropped`)
      if (legend[a.symbol] && (legend[a.symbol].size ?? 'icon') !== 'icon') problems.push(`${at}: "${a.symbol}" sits inside a part, so its legend size is "icon" (one size per symbol for the whole reel)`)
      if (!parts.has(a.to)) problems.push(`${at}: attach "${a.symbol}" hangs on "${a.to}", which is not a part of the diagram`)
    }
    for (const side of ['left', 'right', 'actor', 'object']) symbol(`${at} ${side}`, b[side]?.symbol)
    for (const item of b.items ?? []) symbol(`${at} item`, item.symbol)
    if (b.card?.symbol) symbol(`${at} card`, b.card.symbol)
  }
  if (problems.length) throw new Error(`Storyboard incomplete:\n- ${problems.join('\n- ')}`)
}

/** The hero per scene type when the beat does not name one. */
const HERO = { hook: 'text', text: 'text', media: 'media', diagram: 'diagram', compare: 'both sides', 'actor-object': 'actor and object', stack: 'items', presenter: 'card', 'end-card': 'keyword field', cta: 'keyword field' }

/** The storyboard as data: one row per beat, with the relations the scene type builds and those the beat adds. */
export const storyboardOf = (props, starts) => ({
  legend: props.legend ?? {},
  beats: (props.beats ?? []).map((b, i) => ({
    n: i + 1,
    start: starts[i],
    scene: b.type === 'cta' ? 'end-card' : b.type,
    message: b.message,
    hero: b.hero ?? HERO[b.type],
    support: (b.attach ?? []).map((a) => ({ el: a.symbol, relation: a.relation, to: `${b.diagram ?? b.card?.diagram}.${a.to}` })),
  })),
})
