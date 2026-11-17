import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { clipAttrs, esc, style } from '../html.mjs'
import { CUT_OPACITY, EASE, enter, set } from '../motion.mjs'
import { enterSeconds, FIGURE, fitText, fontStack, grid, SPACE, TYPE } from '../theme.mjs'
import { Diagram } from './Diagram.mjs'
import { heroBox } from './Scene.mjs'
import { SafeArea } from './SafeArea.mjs'
import { Words } from './Words.mjs'

/** The presenter slot starts at this share of the safe area's height; the card slot is everything above it. */
export const PRESENTER_TOP = 0.42

/**
 * presenter-plus: a talking head in the lower slot and a card in the upper slot (motion-design
 * references/overlays.md). The card is a fitted line (`card.text`, `card.emphasis`) or the reel's diagram
 * (`card.diagram`, same `show`/`focus`/`attach` as a diagram beat), scaled down so it stays the same picture.
 *
 * `presenter` = { frames: 'av01', fps: 24, from: 0, headTop: 0.17, backdrop: 'room.png' } for a transparent PNG
 * sequence in assets/frames/<frames>/ (one frame per 1/fps s, so the lips stay on the voice), or { image } for a
 * still. `backdrop` (optional) is a room photo behind a transparent cut-out. `headTop` is where the head starts in the cut-out (share of its height): the head is placed just
 * under the card slot, so the face sits above the caption band and outside the danger zones. Without a presenter
 * the card slot takes the whole frame: use a text or diagram beat then.
 */
export const PresenterBeat = (c, { card = {}, presenter }) => {
  if (!presenter?.frames && !presenter?.image) throw new Error(`${c.id}: presenter needs frames or image (without a presenter, use a text or diagram beat)`)
  const a = c.area
  const top = Math.round(a.top + a.height * PRESENTER_TOP)
  const cardH = top - SPACE[3] - a.top
  const g = grid(a)
  const tl = []
  let cardHtml = ''
  if (card.diagram) {
    const { name, def, state, before } = c.diagram
    const full = heroBox(c)
    // The same diagram as in the diagram beats, scaled down as one picture: parts, labels and icons keep their ratios.
    const k = Math.min(1, cardH / full.height)
    const width = g.span(FIGURE[def.size ?? 'xl'])
    const d = Diagram(c, { id: `${c.id}-d`, name, def, width, height: full.height, state, before, at: c.start + (card.revealAt ?? 0.15) })
    cardHtml = `<div style="${style({ width: `${Math.round(width * k)}px`, height: `${cardH}px`, display: 'flex', justifyContent: 'center' })}"><div style="${style({ transform: `scale(${k.toFixed(4)})`, transformOrigin: 'top center', height: `${full.height}px`, display: 'flex', alignItems: 'center' })}">${d.html}</div></div>`
    tl.push(...d.tl)
  } else if (card.text) {
    const fit = fitText(card.text, { width: a.width, maxHeight: cardH - 2 * SPACE[3], min: TYPE.headline, max: 140 })
    const words = Words(c, { id: `${c.id}-text`, text: card.text, emphasis: card.emphasis, size: fit.size, lines: fit.lines, font: fontStack(c.theme, 'display'), at: c.start, entrance: card.entrance ?? 'ink' })
    cardHtml = `<div data-hero>${words.html}</div>`
    tl.push(...words.tl)
  }
  // The cut-out: 4 columns wide (`size` in columns), centred on the safe area, head top just under the card slot, so
  // the face stays above the caption band; the body runs off the frame. Captions may lie on the body (backdrop).
  const w = g.span(presenter.size ?? 4)
  const h = Math.round((w * 16) / 9)
  // Inside a rounded card that starts at the presenter slot and ends where the clip ends (in the bottom danger zone): a clip with its
  // own room behind the person reads as a card, not as a sticker floating on the background.
  const imgTop = Math.round(SPACE[2] - (presenter.headTop ?? 0.17) * h)
  const box = (src, id, opacity) => `<img id="${id}" src="${esc(src)}" alt="" data-backdrop data-layout-allow-overflow style="${style({ position: 'absolute', left: 0, top: `${imgTop}px`, width: `${w}px`, height: `${h}px`, opacity })}">`
  let imgs = ''
  if (presenter.frames) {
    const fps = presenter.fps ?? 24
    const files = readdirSync(join(c.dir, 'assets', 'frames', presenter.frames)).filter((f) => /\.png$/i.test(f)).sort()
    if (!files.length) throw new Error(`${c.id}: no PNG frames in assets/frames/${presenter.frames}/`)
    const first = Math.round((presenter.from ?? 0) * fps)
    const n = Math.max(1, Math.min(files.length - first, Math.floor(c.duration * fps + 1e-6)))
    imgs = files.slice(first, first + n).map((f, i) => box(`assets/frames/${presenter.frames}/${f}`, `${c.id}-f${i}`, i === 0 ? 1 : 0)).join('')
    // Hand-over without a gap: at each frame time the previous frame hides and the next one shows, in that order.
    for (let i = 1; i < n; i++) tl.push(set(`#${c.id}-f${i - 1}`, c.start + i / fps, { opacity: 0 }), set(`#${c.id}-f${i}`, c.start + i / fps, { opacity: 1 }))
  } else imgs = box(`assets/${presenter.image}`, `${c.id}-f0`, 1)
  // A room photo behind a transparent cut-out fills the same card, so the person never floats on the reel background.
  const backdrop = presenter.backdrop ? `<img src="assets/${esc(presenter.backdrop)}" alt="" data-backdrop style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : ''
  // Frame 0 is the thumbnail: the face is there in full. Later the presenter rises in from the cut.
  if (c.start > 0) tl.unshift(enter(`#${c.id}-presenter`, c.start, enterSeconds(c.theme, 'hero'), { opacity: CUT_OPACITY, y: 40 }, EASE.arrive))
  const cardSlot = SafeArea(c, `<div data-slot="card" style="${style({ height: `${cardH}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' })}">${cardHtml}</div>`, {})
  return {
    html: `<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${c.theme.colors.bg}"><div id="${c.id}-presenter" data-slot="presenter" data-layout-allow-overflow style="position:absolute;inset:0"><div data-backdrop data-layout-allow-overflow style="${style({ position: 'absolute', left: `${Math.round(a.left + (a.width - w) / 2)}px`, top: `${top}px`, width: `${w}px`, height: `${imgTop + h}px`, borderRadius: '32px', overflow: 'hidden', background: c.theme.colors.surface })}">${backdrop}${imgs}</div></div>${cardSlot}</section>`,
    tl,
  }
}
