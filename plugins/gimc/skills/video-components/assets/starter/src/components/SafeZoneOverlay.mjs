import { WIDTH } from '../safe-zones.mjs'
import { style } from '../html.mjs'

/** Draws the danger zones in red. Only for checking frames (`node build.mjs --safe-zones`); never in the export. */
export const SafeZoneOverlay = (c) => {
  const a = c.area
  const zone = (box) => `<div style="${style({ position: 'absolute', background: 'rgba(255,0,0,0.35)', ...box })}"></div>`
  return `<div id="safe-zone-overlay" data-backdrop style="position:absolute;inset:0;z-index:10;pointer-events:none">
${zone({ top: 0, left: 0, width: `${WIDTH}px`, height: `${a.top}px` })}
${zone({ bottom: 0, left: 0, width: `${WIDTH}px`, height: `${a.bottom}px` })}
${zone({ top: `${a.top}px`, left: 0, width: `${a.left}px`, height: `${a.height}px` })}
${zone({ top: `${a.top}px`, right: 0, width: `${a.right}px`, height: `${a.height}px` })}
</div>`
}
