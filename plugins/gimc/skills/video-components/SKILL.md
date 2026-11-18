---
name: video-components
description: >
  A ready Hyperframes starter (HTML, CSS, a GSAP timeline) for 9:16 reels: scene types with slots on a grid (hook,
  text, media, diagram, compare, actor-object, stack, presenter, end-card), a storyboard the build checks, and
  inspect.mjs, which checks every frame and makes a contact sheet before the render. Themed from the brand in GIMC.
  Use when the user says "render the reel", "make the video", "add subtitles", "show the safe zones" or "check how
  the reel looks". Design rules: motion-design.
user-invokable: true
argument-hint: "[the build table or props of the reel, the target platform]"
license: MIT
metadata:
  author: GIMC
  version: "3.0.0"
  category: content
---

# Video components — the reel library

> **GIMC skill.** Call it "the GIMC Video Components skill" in the user's language.

A small [Hyperframes](https://github.com/heygen-com/hyperframes) project with scene types that already
follow [motion-design](../motion-design/SKILL.md): brand colours and fonts from GIMC, a 6-column grid with spacing
and figure tokens, type sizes for 1080×1920 with heroes fitted to the width, everything that must be read inside the
platform's safe area, eases and durations per role, and entrances that change from beat to beat. Every element sits
in a slot of its scene type or hangs on a part, so whatever moves the group moves it too.
You fill in `props.json`; `build.mjs` turns it into `index.html` (the composition) and Hyperframes renders
that to an mp4. You do not write the components again for every reel. [reel-builder](../reel-builder/SKILL.md)
decides what the reel says; GIMC renders these props (`gimc.canvas_render_reel`), section 5 locally.

The project is in [assets/starter/](assets/starter/): `build.mjs` (props → `index.html`), `src/components/`,
`src/theme.mjs` (grid, tokens, type), `src/storyboard.mjs` (the storyboard check), `src/safe-zones.mjs`,
`src/motion.mjs`, `inspect.mjs` (section 4), `props.json` (an example with a diagram), `assets/`.

The references are HeyGen's Hyperframes CLI and media skills 0.9.61, adopted (Apache-2.0, see [NOTICE](NOTICE)) and
changed only where GIMC's setup needs it; the rules of this file win where they differ:

| Read | When |
|---|---|
| [cli.md](references/cli.md) | the CLI; detail in [lint-validate-inspect.md](references/lint-validate-inspect.md), [preview-render.md](references/preview-render.md), [doctor-browser.md](references/doctor-browser.md) and the other files next to it |
| [format.md](references/format.md), [runtimes.md](references/runtimes.md) | what the runtime needs from a composition; other runtimes in a clip |
| [media/media-use.md](references/media/media-use.md) | footage, audio, grading, treatments, transcripts, captions |
| [media/ffmpeg-recipes.md](references/media/ffmpeg-recipes.md) | tested ffmpeg commands (GIMC's own) |
| `scripts/media/` | adopted helpers (ducking, transcript cuts, dither, audio carve); `build.mjs` overwrites what they write into `index.html` |

## 0. Licences

- **Hyperframes** (HeyGen) is Apache-2.0: no licence per render or per company.
- **GSAP** (the animation library inside it) falls under GreenSock's *Standard "no charge" License*: free,
  also for commercial work, but not an open-source licence. Never call it open source.
- **Media in a reel:** only footage, music, fonts and effects whose licence allows commercial use and
  redistribution in the video (your own, CC0, or a stock licence you hold); keep the source and licence of each file
  next to it in `assets/`. Fonts under the OFL are fine; a Pixabay sound may be used in a reel but not shipped on.

## 1. Set up the project

1. Copy `assets/starter/` to the user's working folder, for example `reels/<run_id>/`, and run
   `npm install`. Node 22+ and ffmpeg are needed; the version is pinned: `hyperframes@0.9.61` exactly.
   Always call the CLI at that version (`npx hyperframes@0.9.61 …` or the `npm run` scripts), never a newer
   one: it is pre-1.0 and changes almost daily.
2. Turn off telemetry and the update check in the shell: `HYPERFRAMES_NO_TELEMETRY=1`,
   `HYPERFRAMES_NO_UPDATE_CHECK=1`, `HYPERFRAMES_SKIP_SKILLS=1`.
3. Once per machine, `npx hyperframes@0.9.61 browser ensure` installs the headless Chrome it renders with.
   A sandbox that cannot download it (Cowork): see `gimc-canvas` → references/media.md, "Rendering video
   in a sandbox".
4. What the CLI does and which of its commands GIMC uses: [references/cli.md](references/cli.md).
   **Three rules** in GIMC, because the same composition must also render in a VM without network:
   - GSAP is a local file (`vendor/gsap.min.js`, copied by `build.mjs` from the pinned CLI), never a CDN
     script. A CDN fails the render without network.
   - Fonts are always local files with `@font-face` (section 2), never Google Fonts at render time.
   - No external URL at all in the composition: every image, video, logo and voiceover is a file in `assets/`.
     `build.mjs` refuses props with a URL.

## 2. The theme from the brand in GIMC

Read the brand of the run's folder in one `gimc_execute`:

```js
async () => {
  const b = await gimc.canvas_get_brand({ folder_id: 'FOLDER_ID' })
  if (!b.brand) return { brand: null }
  const t = b.brand.tokens
  return {
    colors: t.colors, families: t.type?.families ?? [], motion: t.motion ?? null,
    logos: b.brand.assets?.logos ?? null, font_faces: b.css?.match(/@font-face\{[^}]+\}/g) ?? [], font_links: b.font_links ?? [],
  }
}
```

No brand: say so in one sentence, offer [brandbook](../brandbook/SKILL.md), and continue with the example
theme marked as "aanname". Otherwise write `theme` in `props.json`:

| `theme` field | From the brand |
|---|---|
| `colors.bg`, `surface`, `text`, `muted`, `accent` | `colors.dark` for a dark reel when it exists, else `colors.light`, same roles |
| `colors.accentText` | `accent_text` of the same palette |
| `fonts[]` | one entry per `display` and `body` family: `role`, `family`, `fallback`, and `files` (`weight` + file name in `assets/fonts/`) |
| `logo` | the stored logo (prefer `light` on a dark reel, `dark` on a light one), downloaded to `assets/` |
| `pace` | from `motion.duration_ms.base`: under 160 ms `snappy`, over 280 ms `calm`, else `standard` |

**Fonts are files in the project, never loaded over the network while rendering:**

- `source: upload` → download the URL from the matching `@font-face` rule in `font_faces` to
  `assets/fonts/`.
- `source: google` → download the font files once (the `.woff2` URLs inside the `font_links` stylesheet)
  to `assets/fonts/`. A variable font is one file for every weight: list it once per weight. The fonts end
  up baked into the mp4; viewers never contact Google.
- `source: system` → no file; set `files: []` and rely on `fallback`.

`build.mjs` writes one `@font-face` per file and stops when a file is missing. Hyperframes itself does not
stop: a font without a local file is **silently replaced** by another one. So always check a still for the
brand font (section 5).

## 3. Fill in the beats

`props.json` is the whole reel. Never edit `index.html` by hand: the next build overwrites it. First the storyboard
([motion-design references/storyboard.md](../motion-design/references/storyboard.md)): `build.mjs` stops, listing
every gap, when a beat has no `message` (at most 8 words), a symbol is not in the legend, a legend entry has no
meaning, or an attached element has no relation.

| Field | What |
|---|---|
| `platform` | `instagram-reels`, `instagram-stories`, `facebook-reels`, `youtube-shorts`, `tiktok`, `linkedin` or `universal` (several platforms or unknown) |
| `lang` | the reel's language code, e.g. `nl` |
| `legend` | `{ name: { meaning, src, size } }`: every symbol of the reel, one meaning, a file in `assets/`, one size (`icon` 96 px, or `sm`/`md`/`lg`/`xl` = 2/3/4/6 columns) |
| `diagrams` | `{ id: { kind: 'pyramid' \| 'flow', parts: [{ id, label }], size? } }`: the reel's diagrams (pyramid: first part is the base) |
| `beats[]` | the build table of reel-builder, one beat per row: `type`, `seconds` (from the voiceover's word timestamps), `message`, and the fields of its scene type |
| `voiceover` | file name in `assets/` |
| `captions` | the voiceover transcript as words: `{ text, startMs, endMs }`, one word per entry (from GIMC, ElevenLabs or `npx hyperframes@0.9.61 transcribe`) |

The scene types, one per beat; every one but `hook`, `text` and `media` takes an optional `title` (a keyword, never
the caption sentence) in a title slot that keeps its height, so a cut between two beats does not jump:

| Beat `type` | Fields | Use for |
|---|---|---|
| `hook` | `text`, `emphasis`, `entrance` | beat 1: display type fitted to the width of the upper safe area, readable and moving on frame 0 |
| `text` | `text`, `emphasis`, `kicker`, `entrance` | a value beat: one headline fitted to the width, optional small kicker ("Step 1") |
| `media` | `src`, `text`, `lowerThird: { name, title }`, `entrance` | b-roll (muted) or a photo full-bleed, with text on a backing panel |
| `diagram` | `diagram`, `show`, `focus`, `attach: [{ symbol, to, relation, at }]`, `revealAt` | one diagram that grows: parts are outlines until `show` fills them and shows their label; `focus` (default: last shown) gets the accent; `attach` hangs a legend `icon` in a part at `at` s; what is shown stays |
| `compare` | `left`, `right` (`{ label, symbol }`), `winner`, `rightAt`, `winnerAt` | two sides stacked on one left edge; the winner gets the accent |
| `actor-object` | `actor`, `object` (`{ symbol, label, says }`), `objectAt` | figure and object on one ground line at their legend sizes; `says` is a bubble on the figure |
| `stack` | `items: [{ text, symbol, at }]` | 2–4 items on one left edge, each entering on its cue |
| `presenter` | `presenter: { frames, fps, from, headTop, backdrop, size } \| { image }`, `card: { text, emphasis } \| { diagram, show, focus }` | talking head in a rounded card below (PNG frames in `assets/frames/<frames>/`, one per 1/fps s), face above the caption band; above it a line or the same diagram, scaled as one picture |
| `end-card` (`cta`) | `label`, `keyword`, `promise` | "Comment KEYWORD" typed into a field; the keyword of the reply campaign in GIMC; the logo in the brand slot (3 columns, column 1, bottom of the content) |

An element no scene type covers is a new scene type in `build.mjs` (section 6), never a component of its own with
pixel coordinates; one outside a scene type only with a reason in the storyboard, placed on an anchor cell
(`cell('C3')` in `src/theme.mjs`).

Always on top: `Captions` (when `captions` is filled; the spoken word in the accent colour, a lower third moves up
to make room) and `SafeZoneOverlay` (only with `node build.mjs --safe-zones`). `captionEnergy` (`high`, `normal`,
`calm`) sets the caption pages to at most 3, 4 or 6 words. `emphasis` is the one word or phrase from `text` that
carries the meaning and gets the accent colour: one per beat.

**Entrances** (`entrance`): `ink` (muted to full colour; the hook's default), `blur` (each word un-blurs), `line`
(the line un-blurs; media's default), `rise` (each word rises). Without one, text beats take turns. Every entrance
starts on the cut frame at `CUT_OPACITY` (0.4), so a cut never shows an empty frame. A hero line that only fits at
the minimum size (`fitText`) is too long for a hero: cut words (motion-design §5).
**Long words** stay inside the safe area: `src/fit.mjs` measures each text block in the brand font before the
timeline and shrinks only one that does not fit (to `FIT_MIN`; then words break); inspect.mjs warns. New text
needs `fitAttrs(width, min)`.

## 4. See what you made

The code never shows you the frame: a caption can run through two figures while the props look fine. So look
with `inspect.mjs`; never call a reel done on the code alone.

**The edit loop** (repeat until 0 errors):

1. `npm run inspect` (`node build.mjs && node inspect.mjs`). It first runs `hyperframes check` (text over
   text, the caption band build.mjs keeps free, WCAG contrast on the pixels, read time) and then adds what that
   check does not see. It loads `index.html` headless at 1080×1920 with the Hyperframes runtime, seeks the
   timeline the way the render does, every 0.25 s plus the start, middle and last frame of every beat. Errors
   (exit code 1):
   - text over a drawing, figure, panel, photo or video (also a caption box over other text);
   - text (partly) outside the safe area of the props' `platform`;
   - text or an element cut off by the frame or by a clipping box.

   Warnings: type under the minimum of [motion-design](../motion-design/SKILL.md) §5, more than one accent
   emphasis at once, a large empty zone, a beat whose biggest element fills less than 40 % of the frame
   (`hero-size`), plus what the GSAP timeline says: a hero or card (≥ 40 %) that moves in faster than 0.3 s or
   slower than 0.8 s (`entrance-duration`), a springy ease on opacity, colour or blur (`spring-on-opacity`), a
   repeating tween (`loop`), three or more beats that all enter the same way (`same-entrance`), and a cut with no
   text or hero on screen from 0.1 s before to 0.1 s after it (`empty-cut`; captions do not count). Then the
   check's warnings (marked `[check]`). It writes
   `out/inspect.json` (every problem with selector, text and boxes) and one line per problem, e.g.
   `0:27.27–0:28.27 ERROR text 'interviewen totdat die echt' overlaps #s-a (svg)`.
2. Fix the props or component, build, inspect again. For one moment: `node inspect.mjs --at 28.0`
   writes `out/still-28.0.png` with the problems boxed, in seconds. `--no-check` skips the Hyperframes check.
3. At 0 errors, **look at the three sheets yourself** (read the images); problems are boxed red (warnings
   amber), the danger zones tinted blue:
   - `out/contact-sheet.png`: start and middle of every beat, and every moment with an error;
   - `out/cut-strip.png`: −0.2 to +0.2 s around every cut, one row per cut: does anything jump?
   - `out/phone-sheet.png`: the beat middles at 360 px wide, as on a phone: can every line be read?

   Say per beat in one sentence what you see, as a stranger would, and what could be better, and name every
   banned default of motion-design §4 you still see (each one gets fixed).
4. **A fresh reviewer:** when your host can start a subagent, start a new one without this conversation. Give
   it only the brief or beat table, the three sheets, `out/inspect.json` and
   [references/visual-review.md](references/visual-review.md), never the code. It answers in lines
   `t · where · problem → exact change` with P0/P1/P2 and no score. You keep the editing: fix P0 and P1,
   inspect, and review once more. At most 2 rounds; stop when a round fixes nothing.
5. Only then render (section 5), and afterwards `node inspect.mjs --video out/reel.mp4`: a sheet from the
   mp4 (a frame per beat, one per 2 s) in `out/video-contact-sheet.png`. Check fonts, timing.

**Markings** for compositions with your own elements (the starter components already carry them). Put them
on the element itself, not on a wrapper; the `data-layout-*` ones are those of `hyperframes check`, so both
tools read them:

| Attribute | Meaning |
|---|---|
| `data-backdrop` | a background text may lie on: a full-bleed photo or video, a decorative layer. A backing panel with its own text (the caption box, the lower-third panel) is marked too, but still counts against *other* text. Anything covering ≥ 90 % of the frame is a backdrop anyway. (Not `data-layer`: Hyperframes reserves that name.) |
| `data-layout-allow-overlap`, `data-layout-allow-occlusion` | this overlap is on purpose (a label on a diagram) |
| `data-layout-allow-overflow` | this element runs off the frame on purpose (a presenter cut off at the bottom) |
| `data-layout-allow-safe-zone`, `data-layout-allow-caption-zone` | this text may sit in the danger zone or the caption band |
| `data-layout-ignore` | texture, not something to read: no layout checks |
| `data-role="caption"` | captions: 52 px minimum |

The scene types also write the storyboard onto the elements (`data-scene`, `data-message`, `data-slot`,
`data-hero`, `data-part`, `data-label-of`, `data-anchor`, `data-relation`, `data-symbol`, `data-brand`; list in
`src/storyboard.mjs`) and into `index.html` as `<script type="application/json" id="storyboard">`. `node build.mjs --grid` draws the columns and the anchor cells
A1–F8 over the frame (check only, never export), so a review can say "the target from C4 to C3".

A transparent PNG (a cut-out, a logo) only counts where it has ink. Give your own elements an `id`: the
report names them by it.

## 5. Render

1. **Lint:** `npm run inspect` already ran `hyperframes check`; `npm run check` runs it alone. Fix every
   error. The `nested_structure_needs_subcomposition` and `timeline_track_too_dense` warnings are expected
   (the composition is built from props).
2. **Brand check:** in the contact sheet, the **brand font** and the accent colour show (a missing font
   is replaced silently). `npm run stills` gives plain Hyperframes snapshots
   in `out/check/`.
3. **Render:** `npm run render`: it rebuilds without the overlay and runs
   `hyperframes render --no-low-memory-mode --fps 30 --crf 18 --format mp4 --output out/reel.mp4`
   (h264, 1080×1920, 30 fps). The length follows the beats. Confirm with
   `ffprobe -v error -show_entries stream=codec_name,width,height:format=duration out/reel.mp4`.
4. **Watch the render:** the `--video` sheet (section 4, step 5), then as reel-builder describes (a frame
   strip at about 12 fps, and the whole video). Hand the mp4 back to reel-builder, which puts it on GIMC.

## 6. Changing or adding a component

A new component follows the same rules:

- A scene type is a function `(context, beat) → { html, tl }`: the markup, plus GSAP timeline lines with
  absolute times (`c.start` is the beat's start), registered in `COMPONENTS` in `build.mjs` and in `SCENES` in
  `src/storyboard.mjs`. Lay it out with `Scene` (title slot + hero slot) and flex/grid slots, sizes from `grid()`,
  `SPACE`, `FIGURE` and `ICON` in `src/theme.mjs`: no absolute pixel positions for content. Labels and attached
  symbols are children of what they name, and carry the storyboard attributes (section 4). Use the helpers: `src/motion.mjs` (`EASE` by role, `enter`,
  `exit`, `tween`, `set`, `frames`), `enterSeconds(theme, role)` and `fitText` in `src/theme.mjs`, the entrances of
  `Words`; register nothing yourself, `build.mjs` builds the one paused timeline
  `window.__timelines.main`.
- Hyperframes seeks the timeline frame by frame: no CSS transitions or animations, no `Date.now()`, no
  unseeded `Math.random()`, no timers, no `repeat: -1`. Never tween `display` or `visibility` on a `.clip`.
- Everything that must be read goes inside `SafeArea`; backgrounds may run full-bleed. Give backgrounds and
  backing panels `data-backdrop` (section 4), and run `inspect.mjs` on a reel that uses the component.
- Colours only through `theme.colors` roles, sizes only from `TYPE` in `src/theme.mjs`, fonts through
  `fontStack()`. Escape every text with `esc()`.
- Files in `assets/` with a relative path (`assets/x.jpg`); a `<video>` is timed itself and `muted`.
- A component that should help every company belongs in this skill: tell the user it can be added to the
  GIMC plugin instead of only changing the local copy.
