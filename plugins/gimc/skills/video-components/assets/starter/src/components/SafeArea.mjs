import { style } from '../html.mjs'

/** Lays its children out inside the platform's safe area. Everything that must be read goes in here. */
export const SafeArea = (c, children, extra = {}) =>
  `<div class="safe" style="${style({ position: 'absolute', top: `${c.area.top}px`, left: `${c.area.left}px`, width: `${c.area.width}px`, height: `${c.area.height}px`, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', ...extra })}">${children}</div>`
