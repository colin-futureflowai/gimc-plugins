/** Escapes text for HTML content and attribute values. */
export const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** Inline style from an object: { fontSize: '96px' } → "font-size:96px". Skips null/undefined. */
export const style = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${v}`)
    .join(';')

/** Seconds rounded to whole frames at 30 fps, printed without float noise. */
export const FPS = 30
export const sec = (s) => Math.round(s * FPS) / FPS
export const num = (s) => Number(sec(s).toFixed(4))

/** A clip: shown over [start, start + duration) by Hyperframes. */
export const clipAttrs = (start, duration, track) =>
  `class="clip" data-start="${num(start)}" data-duration="${num(duration)}" data-track-index="${track}"`
