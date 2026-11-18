// props → the HTML of index.html (a Hyperframes composition). Pure: the same props always give the same HTML, nothing
// is written. build.mjs runs it on props.json; GIMC runs it to turn a reel from before the free composition into one.
// The file system is only read for font files (theme.fonts[].files) and presenter frames, both under `dir`.
import { ActorObjectBeat } from './src/components/ActorObjectBeat.mjs'
import { Captions } from './src/components/Captions.mjs'
import { CompareBeat } from './src/components/CompareBeat.mjs'
import { EndCard } from './src/components/CTACard.mjs'
import { DiagramBeat } from './src/components/DiagramBeat.mjs'
import { GridOverlay } from './src/components/GridOverlay.mjs'
import { HookCard } from './src/components/HookCard.mjs'
import { MediaBeat } from './src/components/MediaBeat.mjs'
import { PresenterBeat } from './src/components/PresenterBeat.mjs'
import { SafeZoneOverlay } from './src/components/SafeZoneOverlay.mjs'
import { StackBeat } from './src/components/StackBeat.mjs'
import { TextBeat } from './src/components/TextBeat.mjs'
import { fitAll, fitSize } from './src/fit.mjs'
import { esc, num, sec } from './src/html.mjs'
import { HEIGHT, safeArea, WIDTH } from './src/safe-zones.mjs'
import { storyboardOf, validateStoryboard } from './src/storyboard.mjs'
import { fontFaces } from './src/theme.mjs'

// The scene types (motion-design references/storyboard.md). An element that fits none of them is a new scene type
// here, never a free-standing component with its own coordinates.
const COMPONENTS = {
  hook: HookCard,
  text: TextBeat,
  media: MediaBeat,
  diagram: DiagramBeat,
  compare: CompareBeat,
  'actor-object': ActorObjectBeat,
  stack: StackBeat,
  presenter: PresenterBeat,
  'end-card': EndCard,
  cta: EndCard,
}
// Caption pages follow the energy of the reel (motion-design §6): high 2–3 words, normal 3–4, calm 4–6.
const CAPTION_WORDS = { high: 3, normal: 4, calm: 6 }

/**
 * @param {object} props the reel (props.json)
 * @param {{ dir: string, source?: string, safeZones?: boolean, grid?: boolean }} opts `dir`: the starter folder (fonts,
 *   presenter frames); `source`: the props file named in the HTML comment; `safeZones`/`grid`: check overlays.
 * @returns {{ html: string, beats: number, seconds: number }}
 */
export function composeReel(props, { dir, source = 'props.json', safeZones = false, grid = false }) {
  const external = JSON.stringify(props).match(/(?:https?:)?\/\/[^"\s]+/)
  if (external) throw new Error(`External URL in props (${external[0]}): download the file into assets/ and use its file name.`)

  // The storyboard comes before the code: every beat has its message, every symbol its one meaning, every added
  // element its relation. An incomplete storyboard stops the build.
  validateStoryboard(props)
  const area = safeArea(props.platform ?? 'universal')
  const theme = props.theme
  // Room kept free at the bottom of the safe area for the captions (a page can wrap to two lines), so a lower third
  // never sits under them.
  const captionSpace = props.captions?.length ? 220 : 0
  let start = 0
  let textIndex = 0
  const starts = []
  // A diagram grows over the reel: what a beat shows and attaches stays for the next beat with that diagram.
  const diagramStates = {}
  const parts = props.beats.map((beat, i) => {
    const component = COMPONENTS[beat.type]
    const duration = sec(beat.seconds)
    const name = beat.diagram ?? beat.card?.diagram
    let diagram = null
    if (name) {
      const before = diagramStates[name] ?? null
      const added = beat.show ?? beat.card?.show ?? []
      const show = [...new Set([...(before?.show ?? []), ...added])]
      const state = { show, focus: beat.focus ?? beat.card?.focus ?? added.at(-1) ?? null, attach: [...(before?.attach ?? []), ...(beat.attach ?? beat.card?.attach ?? [])] }
      diagramStates[name] = state
      diagram = { name, def: props.diagrams[name], state, before }
    }
    const id = `b${i + 1}`
    // textIndex: text beats take turns in their entrance (TextBeat), so two value beats never enter the same way.
    const c = { theme, area, captionSpace, id, start, duration, textIndex: beat.type === 'text' ? textIndex++ : 0, legend: props.legend ?? {}, diagram, dir, prev: props.beats[i - 1] ?? null }
    const part = component(c, beat)
    // The scene type and the message go onto the beat's section, for inspect.mjs and the reviewer.
    const html = part.html.replace(`<section id="${id}"`, `<section id="${id}" data-scene="${beat.type === 'cta' ? 'end-card' : beat.type}" data-message="${esc(beat.message ?? '')}"`)
    starts.push(start)
    start = sec(start + duration)
    return { ...part, html }
  })
  const storyboard = JSON.stringify(storyboardOf(props, starts)).replace(/</g, '\\u003c')
  const total = start
  if (props.captionEnergy && !CAPTION_WORDS[props.captionEnergy]) throw new Error(`captionEnergy "${props.captionEnergy}": use high, normal or calm`)
  const captions = props.captions?.length ? Captions({ theme, area }, props.captions, CAPTION_WORDS[props.captionEnergy ?? 'normal']) : { html: '', tl: [] }
  const voiceover = props.voiceover
    ? `<audio id="voiceover" src="assets/${esc(props.voiceover)}" data-start="0" data-duration="${num(total)}" data-track-index="3"></audio>`
    : ''

  const html = `<!doctype html>
<html lang="${esc(props.lang ?? 'en')}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${WIDTH}, height=${HEIGHT}" />
    <!-- Built by build.mjs from ${esc(source)}; edit the props, not this file. -->
    <script src="./vendor/gsap.min.js"></script>${theme.css ? `\n    <link rel="stylesheet" href="${esc(theme.css)}" />` : ''}
    <style>
${fontFaces(theme, dir)}
      html, body { margin: 0; background: ${theme.colors.bg}; }
      #root { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${theme.colors.bg}; }
      #root > section { position: absolute; inset: 0; z-index: 1; }
      #root * { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${num(total)}" data-width="${WIDTH}" data-height="${HEIGHT}">
${parts.map((p) => p.html).join('\n')}
${captions.html}
${voiceover}
${safeZones ? SafeZoneOverlay({ area }) : ''}
${grid ? GridOverlay({ area }) : ''}
    </div>
    <script type="application/json" id="storyboard">${storyboard}</script>
    <script>
      window.__timelines = window.__timelines || {};
      // Fit every [data-fit] text block to the safe area with the real brand font (src/fit.mjs), then build the
      // timeline and register it last. The fonts are local files; until the timeline is built the Hyperframes runtime
      // waits (__hfTimelinesBuilding, then the event hf-timelines-built), so no frame is taken before the fit.
      window.__hfTimelinesBuilding = true;
${fitSize.toString().replace(/^/gm, '      ')}
${fitAll.toString().replace(/^/gm, '      ')}
      Promise.all([...document.fonts].map((f) => f.load().catch(() => {})))
        .then(() => document.fonts.ready)
        .then(() => {
          fitAll(document);
          const tl = gsap.timeline({ paused: true });
${[...parts.flatMap((p) => p.tl), ...captions.tl].map((line) => `          ${line}`).join('\n')}
          tl.set({}, {}, ${num(total)});
          window.__timelines.main = tl;
          window.__hfTimelinesBuilding = false;
          window.dispatchEvent(new Event('hf-timelines-built'));
        });
    </script>
  </body>
</html>
`
  if (/NaN|undefined/.test(html)) throw new Error('index.html would contain NaN or undefined: check the seconds and word timestamps in the props.')
  return { html, beats: props.beats.length, seconds: total }
}
