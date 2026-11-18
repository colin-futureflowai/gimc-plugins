import { clipAttrs, esc, style } from '../html.mjs'
import { FIT_MIN } from '../fit.mjs'
import { fontStack, TYPE } from '../theme.mjs'
import { LowerThird } from './LowerThird.mjs'
import { SafeArea } from './SafeArea.mjs'
import { Words } from './Words.mjs'

const isVideo = (src) => /\.(mp4|mov|webm)$/i.test(src)
const cover = style({ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' })

/**
 * B-roll or a photo full-bleed (it may run through the danger zones), with optional text on a readable backing.
 * A video is timed itself (Hyperframes times the <video>, never its wrapper) and plays muted. The text un-blurs as
 * one line (`line`) unless `entrance` says otherwise: the footage already moves.
 */
export const MediaBeat = (c, { src, text, lowerThird, entrance }) => {
  const file = `assets/${esc(src)}`
  const media = isVideo(src)
    ? `<video id="${c.id}-media" ${clipAttrs(c.start, c.duration, 0)} src="${file}" muted playsinline data-backdrop style="${cover};z-index:0"></video>`
    : ''
  const image = isVideo(src) ? '' : `<img src="${file}" alt="" data-backdrop style="${cover}">`
  const words = text ? Words(c, { id: `${c.id}-text`, text, size: TYPE.body + 8, font: fontStack(c.theme, 'display'), at: c.start, entrance: entrance ?? 'line', fit: { width: c.area.width - 2 * 28, min: FIT_MIN.body } }) : null
  const textHtml = words
    ? SafeArea(c, `<div data-backdrop style="${style({ background: c.theme.colors.bg, padding: '24px 28px', alignSelf: 'flex-start' })}">${words.html}</div>`, { justifyContent: 'flex-start', paddingTop: '40px' })
    : ''
  const lower = lowerThird ? LowerThird(c, lowerThird) : null
  return {
    html: `${media}<section id="${c.id}" ${clipAttrs(c.start, c.duration, 1)} style="background:${isVideo(src) ? 'transparent' : c.theme.colors.bg}">${image}${textHtml}${lower?.html ?? ''}</section>`,
    tl: [...(words?.tl ?? []), ...(lower?.tl ?? [])],
  }
}
