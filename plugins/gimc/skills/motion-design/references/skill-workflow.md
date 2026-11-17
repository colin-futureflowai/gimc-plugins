> Adopted from HeyGen Hyperframes skills v0.9.61 (`hyperframes/SKILL.md`), Apache-2.0. GIMC-specific rules (brand, safe zones, captions on the voiceover, CTA keyword) are in motion-design/SKILL.md and win where they differ.

**Running the CLI:** every `npx hyperframes@0.9.61 <command>` here runs in a project copied from `video-components/assets/starter` (after `npm install`), always at the pinned version 0.9.61. Preview and render go through that project's scripts: `npm run inspect` (build, `check`, every frame and a contact sheet) and `npm run render` ([video-components](../../video-components/SKILL.md), [cli.md](../../video-components/references/cli.md)).

# HyperFrames

HyperFrames renders HTML to video by seeking a paused timeline frame by frame, so every render is identical. Use it unless another framework or a plain browser recording is asked for. Run the CLI as `npx hyperframes@0.9.61 <command>` ([cli.md](../../video-components/references/cli.md)).

`index.html` is the root composition: it declares the video's variables and mounts one scene per sub-composition from `compositions/`. Media and fonts live in `assets/`. A new project: copy `video-components/assets/starter`. A website as the subject: `npx hyperframes@0.9.61 capture <url> --json`.

Build what was asked: no voiceover or captions and no new aspect ratio unless the request or the source calls for them; a film over ~15 s that tells something gets music and sound on its visible actions unless the person asked for silence (`sound.md`). A new video is 1920×1080 at 30 fps. A question, a hold or a loose idea gets an answer or a proposal, not an edit. Before hand-writing a named effect, transition, caption style, chart or card, search the catalog (`npx hyperframes@0.9.61 catalog --query "<what>" --json`). Any media (a presenter or avatar, footage, voice, music): [media-use.md](../../video-components/references/media/media-use.md), which says what is free. Show real things from their source (the product's screens, the brand's logo, a real place's imagery); draw only what has none.

## Contract

`npx hyperframes@0.9.61 check --json` reports most violations with a `Fix:` line.

1. Every timed element has `class="clip"`, `data-start` and `data-duration` in seconds, and shows over `[start, start + duration)`: land an end state just before its end. `data-track-index` is only a Studio lane (clips that never overlap share one: [format.md](../../video-components/references/format.md)); paint order is `z-index`.
2. The video's length is the root's `data-duration`: overrun is cut, an early end holds the last frame.
3. Each composition builds one paused timeline and registers it after its tweens: `window.__timelines["<data-composition-id>"] = tl`.
4. No `Date.now()`, unseeded `Math.random()`, network fetches, timers or `repeat: -1`. Everything visible is a function of timeline time.
5. Never tween `display`, `visibility` or `autoAlpha` on a `.clip`; animate a child.
6. No CSS `transform` on an element GSAP transforms; animate transforms, not `left`/`top`/`width`/`height`.
7. Never `play()`, `pause()` or seek media. A `<video>` keeps its sound with `data-has-audio="true"`, else it is `muted`; music, voice, replacement sound and J/L cuts are a separate `<audio>`.
8. Every `<audio>` has an `id` or it is left out of the mix. No `crossorigin` on media. Time the `<video>`, never its wrapper.
9. Only the bundled fonts ([format.md](../../video-components/references/format.md)) resolve by name; any other family needs `@font-face` to a file in `assets/fonts/`.
10. Asset paths: `assets/...` (no leading `/`), in sub-compositions too.
11. Grades, grain, blur and vignettes on footage go through `npx hyperframes@0.9.61 media-treatment` ([media-treatments.md](../../video-components/references/media/media-treatments.md)), never CSS filters.
12. A scene file puts its styles, markup and scripts inside `<template>` and styles its root as `#root`. Intended overflow or overlap: `data-layout-allow-overflow`, `data-layout-allow-overlap`.

## Keep it editable

The HyperFrames Studio edits the tags you write.

- One scene per sub-composition, short readable ids; the root holds only scene hosts, media and audio.
- Timed elements are written in the HTML, not made by script, each with a stable `id`.
- Copy, brand colours and swappable media are variables (`data-var-text`, `data-var-src`, `var(--id)`).
- One kind per track: `data-track-kind="graphics"` on scene and overlay hosts, `captions` on the one host that holds every caption group.
- Content stays inside the 90% action-safe box, captions and key text inside 80% title-safe; never draw the guides into the export.

## Work loop

- An existing project: `npx hyperframes@0.9.61 timeline --json` shows what plays when ([cli.md](../../video-components/references/cli.md)).
- A new film over ~15 s that tells something: its type's file (below), then `story.md`: three storylines that are three different films, in words only; the person picks unless they asked for the file or no stops. Then `SPEC.md` (`spec.md`): every adjective as a number, the defaults banned by name, the shots by frame.
- After your last edit: `npx hyperframes@0.9.61 check --json` (part of `npm run inspect`); fix every error, weigh every warning. A film: `npx hyperframes@0.9.61 snapshot --review` and `review.md`, ending in `REVIEW.md`. A small edit: snapshot what you changed (`--at`, `--range`, `--composition`) and look before you reply.
- Render (`npm run render`) when the person approves the preview, asks for the file or asks for no stops, after your check and review pass; otherwise stop at the preview and wait.

## What to read

| The request | Read |
| --- | --- |
| Another film's style on a new topic | `look.md` |
| Launch, promo, feature | `types/launch.md` |
| Explainer, tutorial | `types/explainer.md` |
| Music video | `types/music.md` |
| Chart, numbers | `types/data.md` |
| Vertical or social clip | `types/vertical.md` |
| 3D, simulation, generative | `types/3d.md` |
| Character, mascot, story short | `types/character.md` |
| A real place or map; a website, PR or script; kinetic type | `film.md` |
| Captions; cards over a talking head | `captions.md`; `overlays.md` |
| Motion: eases, titles, cuts, punch-ins, speed, holds | `motion.md` |
| Storyboard stills for approval; the `STORYBOARD.md` file | `storyboard-stills.md`; `storyboard-format.md` |
| Scenes, attributes, media, lint; GSAP, Lottie, 3D, canvas | [format.md](../../video-components/references/format.md); [runtimes.md](../../video-components/references/runtimes.md) |
