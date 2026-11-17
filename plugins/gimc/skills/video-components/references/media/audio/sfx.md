> Adopted from HeyGen Hyperframes skills v0.9.61 (`media-use/audio/references/sfx.md`), Apache-2.0. GIMC-specific rules are in motion-design/SKILL.md and video-components/SKILL.md and win where they differ.

# Sound effects (SFX)

Named sound effects, through `npx hyperframes@0.9.61 media-use resolve --type sfx --intent "<effect>"` (the original's shared audio engine, `scripts/audio.mjs`, follows the same order and is not adopted). No account or key is needed:

- **Openverse first, per cue.** Each cue is searched on [Openverse](https://openverse.org)'s free audio API (most sound effects come from Freesound). Search-and-download, **not** generation.
- **The bundled 21-file library is the fallback** (inside the pinned CLI package, with its `manifest.json`): a cue Openverse has no usable match for, and every cue once Openverse is offline or rate limited, is matched against it and the file copied into the project.

There is no `npx hyperframes@0.9.61 sfx` command. SFX is never generated — it is retrieved from Openverse (online) or taken from the bundled library (offline). `npx hyperframes@0.9.61 media-use resolve --type sfx` follows the same order (`--local-only` skips Openverse).

## Licences

Only **CC0** and **CC BY** sounds are used: never NonCommercial, ShareAlike or NoDerivatives. Each CC BY sound is credited in the project's `assets/sfx/CREDITS.md` (title, creator, licence, source link; for `resolve`, in a `CREDITS.md` beside the sound files it saves). Tell the person to include those credits wherever the video is published.

## No match

A cue that matches nothing is **skipped**; SFX never blocks a render. A file of yours already at the output name is never replaced: the cue gets the next free name (`whoosh-2.mp3`).

## Openverse

One search per distinct effect name (20 results, `license=cc0,by`; each result's licence is checked again). The pick keeps Openverse's relevance order, prefers clips that fit a cue (15 s at most; past ~4 s ranks lower) and CC0 over CC BY when they are close. The file lands at `assets/sfx/<slug>.<ext>` and `duration_s` comes from the result. Name effects concretely (`glass shatter`, not `dramatic sound`); a vague query returns a poor match. Anonymous use allows 20 searches a minute and 200 a day: past that, the rest of the run uses the bundled library.

## Bundled library (fallback)

21 curated files bundled with the pinned CLI, indexed by its `manifest.json` — `{ file, duration, description }` per key (e.g. `whoosh`, `pop`, `click`, `chime`, `riser`, `impact-bass-1`, `glitch-1`, `typing`, …). A cue name resolves by **manifest key, file basename, or slug**, so `whoosh`, `whoosh.mp3`, or `"ui click"` (→ slug) all match. Matched files are copied into the project's `assets/sfx/`; `duration_s` comes from the manifest, so timing is known **offline** — e.g. `riser` is 10.03s, so trigger it at `climax − 10.03s`. The manifest's `description` field carries placement hints per effect (Pixabay Content License).

## Rules

- **Volume ~0.35.** SFX must sit under narration and BGM, not fight them.
- **No match → skip, don't fail.** A missing effect logs an anomaly and moves on; never a render blocker.
- **Retrieval (Openverse) or bundled library (offline) — never generation.**
- **One asset per distinct name.** Reuse across lines is deduped to a single search and download, many cues.
- **Credit CC BY sounds.** `CREDITS.md` lists them; keep it with the project.
