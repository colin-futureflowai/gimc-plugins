import { style } from '../html.mjs'
import { cell, COLUMNS, grid, ROWS } from '../theme.mjs'

/**
 * Draws the 6 columns and the anchor cells A1–F8 over the safe area, so a still can be reviewed in cells
 * ("the target from C4 to C3"). Only for checking frames (`node build.mjs --grid`); never in the export.
 */
export const GridOverlay = (c) => {
  const g = grid(c.area)
  const cols = Array.from({ length: COLUMNS }, (_, i) => `<div style="${style({ position: 'absolute', left: `${g.x(i + 1)}px`, top: `${c.area.top}px`, width: `${Math.round(g.col)}px`, height: `${c.area.height}px`, background: 'rgba(0,120,255,0.07)' })}"></div>`)
  const cells = []
  for (let r = 1; r <= ROWS; r++)
    for (let k = 0; k < COLUMNS; k++) {
      const name = `${String.fromCharCode(65 + k)}${r}`
      const b = cell(c.area, name)
      cells.push(`<div style="${style({ position: 'absolute', left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px`, border: '1px dashed rgba(0,120,255,0.45)', font: '600 20px sans-serif', color: 'rgba(0,90,200,0.8)', padding: '4px 6px' })}">${name}</div>`)
    }
  return `<div id="grid-overlay" data-layout-ignore style="position:absolute;inset:0;z-index:11;pointer-events:none">${cols.join('')}${cells.join('')}</div>`
}
