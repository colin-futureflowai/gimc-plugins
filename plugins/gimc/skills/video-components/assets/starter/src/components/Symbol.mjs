import { esc, style } from '../html.mjs'
import { FIGURE, grid, ICON } from '../theme.mjs'

/**
 * A symbol from the reel's legend (`props.legend`): one file, one meaning and one size for the whole reel, so the
 * same figure never changes size or meaning between beats. `icon` is `ICON.md` px; `sm`–`xl` are 2–6 columns.
 */
export const symbolWidth = (c, size = 'icon') => (size === 'icon' ? ICON.md : grid(c.area).span(FIGURE[size]))

export const Symbol = (c, name, { id, extra = {}, attrs = '' } = {}) => {
  const s = c.legend?.[name]
  if (!s) throw new Error(`Symbol "${name}" is not in the legend`)
  const width = symbolWidth(c, s.size)
  return `<img id="${id}" src="assets/${esc(s.src)}" alt="${esc(s.meaning)}" data-symbol="${esc(name)}" ${attrs} style="${style({ width: `${width}px`, height: 'auto', maxHeight: '100%', objectFit: 'contain', flex: 'none', display: 'block', ...extra })}">`
}
