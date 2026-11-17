import { esc, num, style } from '../html.mjs'
import { EASE, enter, frames, tween } from '../motion.mjs'
import { enterSeconds, fitText, fontStack, ICON, SPACE, TYPE, tint } from '../theme.mjs'
import { Symbol } from './Symbol.mjs'

/**
 * A diagram that grows (motion-design references/grid-and-scenes.md): every part is drawn from the first beat on, as an
 * outline; a part fills and its label appears when the voice names it (`show`), the part being talked about gets
 * the accent (`focus`). Labels and attached symbols are children of their part, so whatever moves the part moves
 * them too; nothing hangs loose next to it. The label and icons lie on their part's shape on purpose
 * (`data-layout-allow-overlap` on their row, as video-components §4 describes).
 *
 * `def` = { kind: 'pyramid' | 'flow', parts: [{ id, label }] } (pyramid: the first part is the base).
 * `state` = { show: [ids], focus, attach: [{ symbol, to, relation, at? }] } now, `before` the same for the previous beat
 * with this diagram (parts and symbols already there stay still on the cut; only what is new enters).
 * Returns { html, tl }; html is a block of `width` × `height` px.
 */
export const Diagram = (c, { id, name, def, width, height, state, before = null, at }) => {
  const n = def.parts.length
  const gap = def.kind === 'pyramid' ? SPACE[0] : SPACE[3]
  const h = Math.floor(Math.min(def.kind === 'pyramid' ? 168 : 152, (height - gap * (n - 1)) / n))
  const pad = SPACE[2]
  const accent = c.theme.colors.accent
  const fill = { outline: 'rgba(0,0,0,0)', shown: tint(accent), focus: accent }
  const ink = { outline: c.theme.colors.text, shown: c.theme.colors.text, focus: c.theme.colors.accentText }
  const stateOf = (s, p) => (!s ? 'outline' : s.focus === p ? 'focus' : s.show.includes(p) || s.focus === p ? 'shown' : 'outline')
  // Pyramid edges: the base is `width`, the top edge 40 % of it, so a label and an icon still fit in the top layer.
  const edge = (k) => width * (1 - (k * 0.6) / n)
  const partWidth = (i) => (def.kind === 'pyramid' ? edge(i) : width)
  // A label sits on the middle of its part: the room is the part's width there.
  const roomFor = (i) => (def.kind === 'pyramid' ? (edge(i) + edge(i + 1)) / 2 - 2 * pad : width - 2 * pad)
  const icons = (p) => (state.attach ?? []).filter((a) => a.to === p)
  // One label size for the whole diagram: the largest that fits every part next to its icons.
  const size = Math.min(
    ...def.parts.map((p, i) => {
      const room = roomFor(i) - icons(p.id).length * (ICON.md + SPACE[2])
      return fitText(p.label, { width: room, maxHeight: h - 2 * SPACE[1], min: 44, max: TYPE.body, maxLines: 1 }).size
    }),
  )
  const tl = []
  const parts = def.parts.map((p, i) => {
    const pid = `${id}-${p.id}`
    const w = partWidth(i)
    const was = stateOf(before, p.id)
    const now = stateOf(state, p.id)
    const shape =
      def.kind === 'pyramid'
        ? (() => {
            const inset = (w - edge(i + 1)) / 2
            return `<svg viewBox="0 0 ${num(w)} ${h}" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><polygon id="${pid}-shape" points="0,${h} ${num(w)},${h} ${num(w - inset)},0 ${num(inset)},0" style="fill:${fill[was]}" stroke="${accent}" stroke-width="5" stroke-linejoin="round"/></svg>`
          })()
        : `<svg viewBox="0 0 ${num(w)} ${h}" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><rect id="${pid}-shape" x="0" y="0" width="${num(w)}" height="${h}" rx="24" style="fill:${fill[was]}" stroke="${accent}" stroke-width="5"/></svg>`
    // A flow part points to the next one with a short line below it (it belongs to the part, relation `below`).
    const link = def.kind === 'flow' && i < n - 1 ? `<div data-relation="below" data-anchor="${name}.${p.id}" data-layout-ignore style="${style({ position: 'absolute', left: '50%', bottom: `-${gap}px`, width: '5px', height: `${gap}px`, marginLeft: '-2px', background: accent })}"></div>` : ''
    const attached = icons(p.id).map((a, k) => {
      const aid = `${pid}-a${k}`
      const old = (before?.attach ?? []).some((b) => b.to === a.to && b.symbol === a.symbol)
      // A symbol lands when the voice names it (`at`, seconds into the beat), else just after its part.
      if (!old) tl.push(enter(`#${aid}`, a.at !== undefined ? c.start + a.at : at + (now === was ? 0 : frames(6)), enterSeconds(c.theme, 'small'), { scale: 0.9 }, EASE.pop))
      return { relation: a.relation, html: Symbol(c, a.symbol, { id: aid, attrs: `data-anchor="${name}.${p.id}" data-relation="${a.relation}"`, extra: { width: `${ICON.md}px`, opacity: old ? 1 : 0 } }) }
    })
    const before_ = attached.filter((a) => a.relation !== 'next-to').map((a) => a.html).join('')
    const after = attached.filter((a) => a.relation === 'next-to').map((a) => a.html).join('')
    const label = `<span id="${pid}-label" data-label-of="${name}.${p.id}" style="${style({ fontFamily: fontStack(c.theme, 'display'), fontSize: `${size}px`, fontWeight: 700, lineHeight: 1.05, whiteSpace: 'nowrap', color: ink[was], opacity: was === 'outline' ? 0 : 1 })}">${esc(p.label)}</span>`
    if (was !== now) {
      const t = at // every change starts on the beat's reveal moment
      tl.push(tween(`#${pid}-shape`, t, enterSeconds(c.theme, 'hero'), { fill: fill[was] }, { fill: fill[now] }, EASE.camera))
      tl.push(tween(`#${pid}-label`, t, enterSeconds(c.theme, 'small'), { color: ink[was] }, { color: ink[now] }, EASE.arriveSoft))
      if (was === 'outline') tl.push(enter(`#${pid}-label`, t, enterSeconds(c.theme, 'small'), { opacity: 0, filter: 'blur(6px)' }, EASE.arriveSoft))
    }
    return `<div id="${pid}" data-part="${name}.${p.id}" style="${style({ position: 'relative', width: `${num(w)}px`, height: `${h}px`, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${SPACE[2]}px`, padding: `0 ${pad}px` })}">${shape}<div data-layout-allow-overlap style="position:relative;display:flex;align-items:center;gap:${SPACE[2]}px">${before_}${label}${after}</div>${link}</div>`
  })
  const html = `<div id="${id}" data-hero data-diagram="${esc(name)}" style="${style({ display: 'flex', flexDirection: def.kind === 'pyramid' ? 'column-reverse' : 'column', alignItems: 'center', gap: `${gap}px`, width: `${num(width)}px`, flex: 'none' })}">${parts.join('')}</div>`
  return { html, tl }
}
