---
name: video-components
description: >
  A ready Hyperframes starter (HTML, CSS, a GSAP timeline) for 9:16 reels: HookCard, TextBeat, MediaBeat,
  LowerThird, Captions, CTACard, and inspect.mjs, which checks every frame and makes a contact sheet before
  the render. Themed from the brand in GIMC; the render step reel-builder uses. Use when the user says "render the reel", "make the video", "use our brand in the video",
  "add subtitles", "show the safe zones" or "check how the reel looks". Design rules: motion-design.
user-invokable: true
argument-hint: "[the build table or props of the reel, the target platform]"
license: MIT
metadata:
  author: GIMC
  version: "2.1.0"
  category: content
---

# Video components — the reel library

> **GIMC skill.** Call it "the GIMC Video Components skill" in the user's language.

A small [Hyperframes](https://github.com/heygen-com/hyperframes) project with components that already
follow [motion-design](../motion-design/SKILL.md): brand colours and fonts from GIMC, type sizes for
1080×1920, everything that must be read inside the platform's safe area, entrances with a GSAP ease-out.
You fill in `props.json`; `build.mjs` turns it into `index.html` (the composition) and Hyperframes renders
that to an mp4. You do not write the components again for every reel. [reel-builder](../reel-builder/SKILL.md)
decides what the reel says; this skill turns that into an mp4.

The project is in [assets/starter/](assets/starter/): `build.mjs` (props → `index.html`), `src/components/`,
`src/theme.mjs`, `src/safe-zones.mjs`, `src/motion.mjs`, `inspect.mjs` (section 4), `props.json` (an example),
`assets/fonts/`.

## 0. Licences

- **Hyperframes** (HeyGen) is Apache-2.0: no licence per render or per company.
- **GSAP** (the animation library inside it) falls under GreenSock's *Standard "no charge" License*: free,
  also for commercial work, but not an open-source licence. Never call it open source.

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
4. Hyperframes has its own agent skills and docs (`npx hyperframes@0.9.61 docs`). Use them for its API.
   **Three exceptions** in GIMC, because the same composition must also render in a VM without network:
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

`props.json` is the whole reel. Never edit `index.html` by hand: the next build overwrites it.

| Field | What |
|---|---|
| `platform` | `instagram-reels`, `instagram-stories`, `facebook-reels`, `youtube-shorts`, `tiktok`, `linkedin` or `universal` (several platforms or unknown) |
| `lang` | the reel's language code, e.g. `nl` |
| `beats[]` | the build table of reel-builder, one beat per row, `seconds` from the voiceover's word timestamps |
| `voiceover` | file name in `assets/` |
| `captions` | the voiceover transcript as words: `{ text, startMs, endMs }`, one word per entry (from GIMC, ElevenLabs or `npx hyperframes@0.9.61 transcribe`) |

The components, one per beat type:

| Beat `type` | Component | Fields | Use for |
|---|---|---|---|
| `hook` | `HookCard` | `text`, `emphasis` | beat 1: big display type in the upper safe area, moving on frame 0 |
| `text` | `TextBeat` | `text`, `emphasis`, `kicker` | a value beat: one headline, optional small kicker ("Step 1") |
| `media` | `MediaBeat` (+ `LowerThird`) | `src`, `text`, `lowerThird: { name, title }` | b-roll (muted) or a photo full-bleed, with text on a backing panel |
| `cta` | `CTACard` | `label`, `keyword`, `promise` | the end card: "Comment KEYWORD" typed into a field; `label` in the reel's language ("Reageer"); the keyword of the reply campaign in GIMC |

Always on top: `Captions` (when `captions` is filled; pages of 1–4 words, the spoken word in the accent
colour, a lower third moves up to make room) and `SafeZoneOverlay` (only with `node build.mjs --safe-zones`).
`emphasis` is a word or phrase from `text` that gets the accent colour: one per beat.

## 4. See what you made

The code never shows you the frame. A caption can run straight through two figures and the props still look
fine. So you look, with `inspect.mjs`, and you never call a reel done on the code alone.

**The edit loop** (repeat until 0 errors):

1. `npm run inspect` (`node build.mjs && node inspect.mjs`). It first runs `hyperframes check` (text over
   text, the caption band build.mjs keeps free, WCAG contrast on the pixels, read time) and then adds what that
   check does not see. It loads `index.html` headless at 1080×1920 with the Hyperframes runtime, seeks the
   timeline the way the render does, every 0.25 s plus the start, middle and last frame of every beat. Errors
   (exit code 1):
   - text over a drawing, figure, panel, photo or video (also a caption box over other text);
   - text (partly) outside the safe area of the props' `platform`;
   - text or an element cut off by the frame or by a clipping box.

   Warnings: type under the minimum of [motion-design](../motion-design/SKILL.md) §4, more than one accent
   emphasis at once, a large empty zone, plus the check's warnings (marked `[check]`). It writes
   `out/inspect.json` (every problem with selector, text and boxes) and one line per problem, e.g.
   `0:27.27–0:28.27 ERROR text 'interviewen totdat die echt' overlaps #s-a (svg)`.
2. Fix the props (or the component), build, inspect again. For one moment: `node inspect.mjs --at 28.0`
   writes `out/still-28.0.png` with the problems boxed, in seconds. `--no-check` skips the Hyperframes check.
3. At 0 errors, **look at the three sheets yourself** (read the images); problems are boxed red (warnings
   amber), the danger zones tinted blue:
   - `out/contact-sheet.png`: start and middle of every beat, and every moment with an error;
   - `out/cut-strip.png`: −0.2 to +0.2 s around every cut, one row per cut: does anything jump?
   - `out/phone-sheet.png`: the beat middles at 360 px wide, as on a phone: can every line be read?

   Say per beat in one sentence what you see, as a stranger would, and what could be better.
4. **A fresh reviewer:** when your host can start a subagent, start a new one without this conversation. Give
   it only the brief or beat table, the three sheets, `out/inspect.json` and
   [references/visual-review.md](references/visual-review.md), never the code. It answers in lines
   `t · where · problem → exact change` with P0/P1/P2 and no score. You keep the editing: fix P0 and P1,
   inspect, and review once more. At most 2 rounds; stop when a round fixes nothing.
5. Only then render (section 5), and afterwards `node inspect.mjs --video out/reel.mp4`: a sheet from the real
   mp4 (one frame per beat and one every 2 s) in `out/video-contact-sheet.png`. Look at it: fonts, timing and
   what really ended up in the video.

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

A transparent PNG (a cut-out, a logo) only counts where it has ink. Give your own elements an `id`: the
report names them by it.

## 5. Render

1. **Lint:** `npm run inspect` already ran `hyperframes check`; `npm run check` runs it alone. Fix every
   error. The `nested_structure_needs_subcomposition` and `timeline_track_too_dense` warnings are expected:
   the composition is built from props, not edited in the Hyperframes app.
2. **Brand check:** in the contact sheet, the **brand font** and the accent colour show (a missing font
   is replaced silently). `npm run stills` (12 frames with the drawn danger zones in `out/check/`) is still
   there when you want the plain Hyperframes snapshots.
3. **Render:** `npm run render`: it rebuilds without the overlay and runs
   `hyperframes render --no-low-memory-mode --fps 30 --crf 18 --format mp4 --output out/reel.mp4`
   (h264, 1080×1920, 30 fps). The length follows the beats. Confirm with
   `ffprobe -v error -show_entries stream=codec_name,width,height:format=duration out/reel.mp4`.
4. **Watch the render:** the `--video` sheet (section 4, step 5), then as reel-builder describes (a frame
   strip at about 12 fps, and the whole video). Hand the mp4 back to reel-builder, which puts it on GIMC.

## 6. Changing or adding a component

Keep the library consistent; a new component follows the same rules:

- A component is a function `(context, beat) → { html, tl }`: the markup, plus GSAP timeline lines with
  absolute times (`c.start` is the beat's start). Use the helpers in `src/motion.mjs` (`enter`, `set`,
  `EASE`, `frames`); register nothing yourself, `build.mjs` builds the one paused timeline
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
