---
name: remotion-components
description: >
  A ready Remotion starter project for 9:16 reels with standard components (HookCard, TextBeat,
  MediaBeat, LowerThird, Captions synced to the voiceover, CTACard, SafeZoneOverlay), themed from the
  folder's brand in GIMC with local font files. The render step reel-builder uses. Use when a reel has
  to be rendered with Remotion, or the user says "render the reel", "set up Remotion", "use our brand
  in the video", "add subtitles to the reel" or "show the safe zones". Design rules: motion-design.
user-invokable: true
argument-hint: "[the build table or props of the reel, the target platform]"
license: MIT
metadata:
  author: GIMC
  version: "1.0.0"
  category: content
---

# Remotion components — the reel library

> **GIMC skill.** Call it "the GIMC Remotion Components skill" in the user's language.

A small Remotion project with components that already follow [motion-design](../motion-design/SKILL.md):
brand colours and fonts from GIMC, type sizes for 1080×1920, everything that must be read inside the
platform's safe area, entrances with a damped spring. You fill in `props.json`; you do not write the
components again for every reel. [reel-builder](../reel-builder/SKILL.md) decides what the reel says;
this skill turns that into an mp4.

The project is in [assets/starter/](assets/starter/): `src/Reel.tsx` (the composition), `src/components/`,
`src/theme.ts`, `src/safe-zones.ts`, `src/motion.ts`, `src/fonts.ts`, `props.json` (an example).

## 0. Licence — ask once

Remotion is free only for individuals and companies of **up to 3 people**. A bigger company needs a
company licence (remotion.pro: per seat, or per render with a monthly minimum). Ask once per company,
remember the answer in the folder note, and never call the render "free" for a bigger company:

- 3 people or fewer: render as below.
- More: render with `--license-key=<key>` (the user's key, from their own environment; never look for
  one) and add `--is-production=false` for test renders. No key: say so and stop before the final render.

## 1. Set up the project

1. Copy `assets/starter/` to the user's working folder, for example `reels/<run_id>/`, and run
   `npm install`. Node 18+ is needed.
2. Recommended once per machine: install Remotion's official agent skills with `npx remotion skills add`.
   They hold Remotion's own API rules and stay current. **One exception:** they recommend Google Fonts;
   in GIMC, fonts are always local files (section 2).
3. A sandbox without internet for Chrome (Cowork): see `gimc-canvas` → references/media.md, "Rendering
   video in a sandbox".

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
| `fonts[]` | one entry per `display` and `body` family: `family`, `fallback`, and `files` (weight + file name in `public/fonts/`) |
| `logo` | the stored logo (prefer `light` on a dark reel, `dark` on a light one), downloaded to `public/` |
| `pace` | from `motion.duration_ms.base`: under 160 ms `snappy`, over 280 ms `calm`, else `standard` |

**Fonts are files in the project, never loaded over the network while rendering:**

- `source: upload` → download the URL from the matching `@font-face` rule in `font_faces` to
  `public/fonts/`.
- `source: google` → download the font files once (the `.woff2` URLs inside the `font_links` stylesheet)
  to `public/fonts/`. They end up baked into the mp4; viewers never contact Google.
- `source: system` → no file; set `files: []` and rely on `fallback`.

`src/fonts.ts` loads every file with `@remotion/fonts` before the first frame; a missing file stops the
render, so it never falls back to another font without anyone noticing.

## 3. Fill in the beats

`props.json` is the whole reel. Types are in `src/types.ts`.

| Field | What |
|---|---|
| `platform` | `instagram-reels`, `instagram-stories`, `facebook-reels`, `youtube-shorts`, `tiktok`, `linkedin` or `universal` (several platforms or unknown) |
| `beats[]` | the build table of reel-builder, one beat per row, `seconds` from the voiceover's word timestamps |
| `voiceover` | file name in `public/` |
| `captions` | the voiceover transcript as words: `{ text, startMs, endMs, timestampMs, confidence }`; every word after the first starts with a space |
| `showSafeZones` | `true` only for checking |

The components, one per beat type:

| Beat `type` | Component | Fields | Use for |
|---|---|---|---|
| `hook` | `HookCard` | `text`, `emphasis` | beat 1: big display type in the upper safe area, moving on frame 0 |
| `text` | `TextBeat` | `text`, `emphasis`, `kicker` | a value beat: one headline, optional small kicker ("Step 1") |
| `media` | `MediaBeat` (+ `LowerThird`) | `src`, `text`, `lowerThird: { name, title }` | b-roll or a photo full-bleed, with text on a backing panel |
| `cta` | `CTACard` | `keyword`, `promise` | the end card: "Comment KEYWORD" typed into a field; the keyword of the reply campaign in GIMC |

Always on top: `Captions` (when `captions` is filled) and `SafeZoneOverlay` (when `showSafeZones` is true).
`emphasis` is a word or phrase from `text` that gets the accent colour: one per beat.

## 4. Check, then render

1. **Check stills with the overlay:** set `showSafeZones: true` in a copy of the props and render a still
   per beat, for example `npx remotion still Reel out/b1.png --frame=<frame> --props=./props-check.json`.
   Look at them against [motion-design](../motion-design/SKILL.md) §9; fix the props, not the
   components, unless a component is wrong for every reel.
2. **Render:** `npx remotion render Reel out/reel.mp4 --props=./props.json --codec=h264 --crf=18`
   (plus `--license-key` per section 0). The length follows the beats.
3. **Watch the render** as reel-builder describes (a frame strip at about 12 fps, and the whole video),
   then hand the mp4 back to reel-builder, which puts it on GIMC.

## 5. Changing or adding a component

Keep the library consistent; a new component follows the same rules:

- Animate only with `useCurrentFrame()`, `interpolate()` and `spring()` (helpers in `src/motion.ts`).
  CSS transitions, CSS animations and Tailwind animation classes do not render.
- Everything that must be read goes inside `<SafeArea>`; backgrounds may run full-bleed.
- Colours only through `theme.colors` roles, sizes only from `TYPE` in `src/theme.ts`, fonts through
  `fontStack()`.
- Files in `public/` via `staticFile()`; no `Math.random()` (use `random(seed)` from `remotion`).
- Install Remotion packages with `npx remotion add <package>` so the versions match.
- A component that should help every company belongs in this skill: tell the user it can be added to the
  GIMC plugin instead of only changing the local copy.
