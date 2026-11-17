# Hyperframes skills — inventory and decisions

Every file of the pinned Hyperframes skills v0.9.61 (`hyperframes`, `hyperframes-cli`, `media-use`; 235 files), each exactly once, and what GIMC does with it.
Rule (owner, 17-11-2026): our skills can do what the Hyperframes skills can do. Where a file gives a capability it is **adopted** near-verbatim, changed only where technically needed (CLI pinned to `hyperframes@0.9.61`, GSAP and fonts as local files, no CDN, preview and render via video-components, no HeyGen account, launcher or telemetry steps). GIMC's own rules (brand from GIMC, safe zones, captions on the voiceover, CTA keyword, grid and scene types) stay in motion-design and video-components and are not woven into adopted files.

**adopt** = a copy lives in our plugin (target named); **learn** = absorbed into our rules, no file; **no** = not for GIMC (reason); **later** = useful, not now (reason).

Counts: **adopt 102**, **learn 0**, **no 95**, **later 38** (total 235).

| Folder | Files | adopt | learn | no | later |
|---|---|---|---|---|---|
| `hyperframes` | 77 | 59 | 0 | 4 | 14 |
| `hyperframes-cli` | 13 | 9 | 0 | 4 | 0 |
| `media-use` | 145 | 34 | 0 | 87 | 24 |

Paths are relative to the skills folder of the package; targets are relative to `plugin/skills/`. Decisions for `hyperframes-cli` and `media-use` come from the video-components pass.

## hyperframes

| File | About | Decision |
|---|---|---|
| `assets/frame-presets/biennale-yellow/caption-skin.html` | biennale-yellow caption style reference code | **adopt** → motion-design/assets/frame-presets/biennale-yellow/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/biennale-yellow/frame-showcase.html` | biennale-yellow contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/biennale-yellow/FRAME.md` | biennale-yellow preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/biennale-yellow/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/blockframe/caption-skin.html` | blockframe caption style reference code | **adopt** → motion-design/assets/frame-presets/blockframe/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/blockframe/frame-showcase.html` | blockframe contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/blockframe/FRAME.md` | blockframe preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/blockframe/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/blue-professional/caption-skin.html` | blue-professional caption style reference code | **adopt** → motion-design/assets/frame-presets/blue-professional/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/blue-professional/frame-showcase.html` | blue-professional contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/blue-professional/FRAME.md` | blue-professional preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/blue-professional/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/bold-poster/caption-skin.html` | bold-poster caption style reference code | **adopt** → motion-design/assets/frame-presets/bold-poster/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/bold-poster/frame-showcase.html` | bold-poster contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/bold-poster/FRAME.md` | bold-poster preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/bold-poster/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/broadside/caption-skin.html` | broadside caption style reference code | **adopt** → motion-design/assets/frame-presets/broadside/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/broadside/frame-showcase.html` | broadside contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/broadside/FRAME.md` | broadside preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/broadside/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/capsule/caption-skin.html` | capsule caption style reference code | **adopt** → motion-design/assets/frame-presets/capsule/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/capsule/frame-showcase.html` | capsule contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/capsule/FRAME.md` | capsule preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/capsule/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/cartesian/caption-skin.html` | cartesian caption style reference code | **adopt** → motion-design/assets/frame-presets/cartesian/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/cartesian/frame-showcase.html` | cartesian contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/cartesian/FRAME.md` | cartesian preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/cartesian/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/cobalt-grid/caption-skin.html` | cobalt-grid caption style reference code | **adopt** → motion-design/assets/frame-presets/cobalt-grid/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/cobalt-grid/frame-showcase.html` | cobalt-grid contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/cobalt-grid/FRAME.md` | cobalt-grid preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/cobalt-grid/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/code-editorial/caption-skin.html` | code-editorial caption style reference code | **adopt** → motion-design/assets/frame-presets/code-editorial/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/code-editorial/fonts/EBGaramond-400.woff2` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/EBGaramond-400.woff2 (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/EBGaramond-700.woff2` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/EBGaramond-700.woff2 (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/Inter-400.woff2` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/Inter-400.woff2 (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/Inter-700.woff2` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/Inter-700.woff2 (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/JetBrainsMono-400.woff2` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/JetBrainsMono-400.woff2 (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/JetBrainsMono-700.woff2` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/JetBrainsMono-700.woff2 (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/OFL-eb-garamond.txt` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/OFL-eb-garamond.txt (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/OFL-inter.txt` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/OFL-inter.txt (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/fonts/OFL-jetbrains-mono.txt` | Font files and OFL licences of one preset | **adopt** → motion-design/assets/frame-presets/code-editorial/fonts/OFL-jetbrains-mono.txt (OFL font file or licence of the code-editorial look, local (no Google Fonts)) |
| `assets/frame-presets/code-editorial/frame-showcase.html` | code-editorial contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/code-editorial/FRAME.md` | code-editorial preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/code-editorial/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/coral/caption-skin.html` | coral caption style reference code | **adopt** → motion-design/assets/frame-presets/coral/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/coral/frame-showcase.html` | coral contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/coral/FRAME.md` | coral preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/coral/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/creative-mode/caption-skin.html` | creative-mode caption style reference code | **adopt** → motion-design/assets/frame-presets/creative-mode/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/creative-mode/frame-showcase.html` | creative-mode contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/creative-mode/FRAME.md` | creative-mode preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/creative-mode/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/daisy-days/caption-skin.html` | daisy-days caption style reference code | **adopt** → motion-design/assets/frame-presets/daisy-days/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/daisy-days/frame-showcase.html` | daisy-days contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/daisy-days/FRAME.md` | daisy-days preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/daisy-days/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `assets/frame-presets/editorial-forest/caption-skin.html` | editorial-forest caption style reference code | **adopt** → motion-design/assets/frame-presets/editorial-forest/caption-skin.html (reference code for the fallback look; GSAP CDN script replaced by local vendor/gsap.min.js) |
| `assets/frame-presets/editorial-forest/frame-showcase.html` | editorial-forest contact sheet showing the look | **later**: contact sheet only; loads its fonts from Google Fonts, so adopting needs ~20 families downloaded as local woff2 (network) and each page rewritten |
| `assets/frame-presets/editorial-forest/FRAME.md` | editorial-forest preset look spec: palette, type, components | **adopt** → motion-design/assets/frame-presets/editorial-forest/FRAME.md (fallback look while a company has no brand in GIMC yet; unchanged) |
| `references/captions.md` | Caption words, timings, groups, fit, text behind speaker | **adopt** → motion-design/references/captions.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/film.md` | Measured facts: script pacing, music hits, maps, websites | **adopt** → motion-design/references/film.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/format.md` | Composition format: scenes, attributes, lanes, variables, fonts, media | **adopt** → video-components/references/format.md (composition format and runtimes, kept with the CLI files) |
| `references/look.md` | Where a look comes from: design spec, brand, reference, presets | **adopt** → motion-design/references/look.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/motion.md` | Eases, entrances, holds, rhythm, transitions, camera mechanisms | **adopt** → motion-design/references/motion.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/overlays.md` | Cards and layouts over talking-head footage | **adopt** → motion-design/references/overlays.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/path-tracing.md` | Path-traced 3D scenes with raster preview | **adopt** → video-components/references/path-tracing.md (composition format and runtimes, kept with the CLI files) |
| `references/plugin-installation.md` | How to run the CLI through the CLI wrapper of the skills folder | **no**: runs the CLI through their skills-folder launcher; we call npx hyperframes@0.9.61 in the starter |
| `references/review.md` | Review pass: measure, look, P0/P1/P2 notes, delivery note | **adopt** → motion-design/references/review.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/runtimes.md` | GSAP, Lottie, 3D and canvas runtimes; seek-safe rules | **adopt** → video-components/references/runtimes.md (composition format and runtimes, kept with the CLI files) |
| `references/skill-lifecycle.md` | Installing and updating Hyperframes skills | **no**: installing and updating HeyGen skills; GIMC pins and ships its own copy |
| `references/sound.md` | Music bed, effects, clock, levels for a film | **adopt** → motion-design/references/sound.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/spec.md` | SPEC.md: adjectives into numbers, composition numbers, banned defaults | **adopt** → motion-design/references/spec.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/story.md` | One thing, storylines, hook, beats, worlds, copy, brand | **adopt** → motion-design/references/story.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/storyboard-format.md` | STORYBOARD.md format and parsed manifest | **adopt** → motion-design/references/storyboard-format.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/storyboard.md` | Storyboard as posed stills before animating | **adopt** → motion-design/references/storyboard-stills.md (near-verbatim; CLI pinned to 0.9.61, HeyGen account steps and links to absent skills removed) |
| `references/types/3d.md` | 3D, simulations and generative pieces | **adopt** → motion-design/references/types/3d.md (near-verbatim; CLI pinned to 0.9.61, links to our copies) |
| `references/types/character.md` | Characters and mascots: acting, idle, take | **adopt** → motion-design/references/types/character.md (near-verbatim; CLI pinned to 0.9.61, links to our copies) |
| `references/types/data.md` | Numbers and charts: one number at a time, reading order | **adopt** → motion-design/references/types/data.md (near-verbatim; CLI pinned to 0.9.61, links to our copies) |
| `references/types/explainer.md` | Explainers: ground it, devices, shapes of information, labels | **adopt** → motion-design/references/types/explainer.md (near-verbatim; CLI pinned to 0.9.61, links to our copies) |
| `references/types/launch.md` | Launch films: real UI, product on screen, end card | **adopt** → motion-design/references/types/launch.md (near-verbatim; CLI pinned to 0.9.61, links to our copies) |
| `references/types/music.md` | Music videos cut to a track | **adopt** → motion-design/references/types/music.md (near-verbatim; CLI pinned to 0.9.61, links to our copies) |
| `references/types/vertical.md` | Vertical 9:16: platform UI band, first second, pacing | **adopt** → motion-design/references/types/vertical.md (near-verbatim; CLI pinned to 0.9.61, links to our copies) |
| `scripts/bake-basemap.mjs` | Bakes a real-imagery map camera move to MP4 | **later**: map bakes need puppeteer-core, headless Chrome and network (MapLibre from a CDN, Esri/Carto tiles); revisit when a reel needs a real map |
| `scripts/lib/main-module.mjs` | Wrapper helpers: module check, safe PATH on Windows | **no**: only used by the launcher plugin-cli.mjs |
| `scripts/lib/windows-exe-search.mjs` | Wrapper helpers: module check, safe PATH on Windows | **adopt** → motion-design/scripts/lib/windows-exe-search.mjs (imported by locate.mjs; unchanged) |
| `scripts/locate.mjs` | Finds a point in an image via numbered grid narrowing | **adopt** → motion-design/scripts/locate.mjs (finds a point in an image with node + ffmpeg, no key or account; unchanged) |
| `scripts/plugin-cli.mjs` | Wrapper that starts the CLI from npm | **no**: launcher that resolves the CLI release from the plugin manifest or npm; we pin npx hyperframes@0.9.61 |
| `SKILL.md` | Render contract, work loop, what to read per video | **adopt** → motion-design/references/skill-workflow.md (design and work-loop part, near-verbatim; usage beacon, telemetry, launcher, desktop app and history/catch-up steps removed; CLI pinned to 0.9.61; preview and render via video-components) |

## hyperframes-cli

| File | About | Decision |
|---|---|---|
| `references/beats.md` | Beat-grid file for a music track | **adopt** → video-components/references/beats.md (beat grid for music-cut reels) |
| `references/cloud.md` | HeyGen-hosted cloud rendering | **no**: HeyGen cloud render and account; we render locally |
| `references/cloudrun.md` | Self-managed Google Cloud Run rendering | **no**: Google Cloud Run render deployment, not our setup |
| `references/compare-and-batch.md` | Compare variants and grades; batch renders from variables | **adopt** → video-components/references/compare-and-batch.md (variant sheets, grade compare, batch renders) |
| `references/conventions.md` | CLI conventions for agents: --json, exit codes, non-TTY | **adopt** → video-components/references/conventions.md (JSON, strict flags, clean: usable with pinned CLI) |
| `references/doctor-browser.md` | doctor and bundled Chrome management | **adopt** → video-components/references/doctor-browser.md (environment and Chrome troubleshooting) |
| `references/feedback.md` | Send rating and feedback reports to HeyGen | **no**: feedback and telemetry to HeyGen |
| `references/init-and-scaffold.md` | init, website capture, skills install | **adopt** → video-components/references/init-and-scaffold.md (capture a website; init only beside our starter) |
| `references/lambda.md` | Self-managed AWS Lambda rendering | **no**: AWS Lambda render deployment, not our setup |
| `references/lint-validate-inspect.md` | lint, check and snapshot: layout, motion, contrast audits | **adopt** → video-components/references/lint-validate-inspect.md (check gate, snapshots, motion sidecars) |
| `references/preview-render.md` | preview, play, render and publish commands | **adopt** → video-components/references/preview-render.md (preview and local render flags; cloud parts removed) |
| `references/upgrade-info-misc.md` | info, upgrade, timeline, docs, telemetry, preprocessing | **adopt** → video-components/references/upgrade-info-misc.md (info, compositions, timeline, docs; upgrade stays pinned) |
| `SKILL.md` | CLI overview: scaffold, check, preview, render, history | **adopt** → video-components/references/cli.md (CLI command map and edit-check-render loop) |

## media-use

| File | About | Decision |
|---|---|---|
| `audio/assets/sfx/chime.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/click-soft.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/click.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/CREDITS.md` | Pixabay licence notice for bundled sound effects | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/error.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/glitch-1.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/glitch-2.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/glitch-3.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/impact-bass-1.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/impact-bass-2.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/key-press.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/manifest.json` | Index of bundled sound effects with placement hints | **later**: goes with the sfx files, licence pending |
| `audio/assets/sfx/notification.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/ping.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/pop.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/riser.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/sparkle.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/typing.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/whoosh-cinematic.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/whoosh-short.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/assets/sfx/whoosh.mp3` | 19 bundled sound effects (Pixabay Content License) | **later**: Pixabay licence, not CC0: no standalone redistribution |
| `audio/references/bgm.md` | Music bed: retrieval, generation, bed volume, entry point | **adopt** → video-components/references/media/audio/bgm.md (music bed rules; local generation route) |
| `audio/references/captions/authoring.md` | Caption style detection, grouping, fit, exit guarantee | **adopt** → video-components/references/media/audio/captions/authoring.md (caption authoring technique) |
| `audio/references/captions/motion.md` | Karaoke highlight, emphasis words, audio-reactive captions | **adopt** → video-components/references/media/audio/captions/motion.md (caption motion and audio-reactive data) |
| `audio/references/captions/transcript-handling.md` | Transcript formats, quality check, cleaning, retry rules | **adopt** → video-components/references/media/audio/captions/transcript-handling.md (transcript cleanup for captions) |
| `audio/references/remove-background.md` | Background removal for a transparent talking head | **adopt** → video-components/references/media/audio/remove-background.md (local cutouts of video and images) |
| `audio/references/requirements.md` | Credential priority and caches for HeyGen and Gemini | **adopt** → video-components/references/media/audio/requirements.md (audio tool requirements) |
| `audio/references/sfx.md` | Sound effects from Openverse or bundled; licences; volume | **adopt** → video-components/references/media/audio/sfx.md (sound effects placement and Openverse) |
| `audio/references/transcribe.md` | Word-level transcription; always pass the model and language | **adopt** → video-components/references/media/audio/transcribe.md (local transcription to word timestamps) |
| `audio/references/tts-to-captions.md` | TTS that returns word timings feeds captions directly | **adopt** → video-components/references/media/audio/tts-to-captions.md (voiceover word timings to captions) |
| `audio/references/tts.md` | Text to speech via HeyGen, Kokoro, Gemini, ElevenLabs | **adopt** → video-components/references/media/audio/tts.md (local Kokoro voiceover; HeyGen voices removed) |
| `audio/scripts/audio.mjs` | Shared audio engine: TTS, music, effects in one run | **no**: engine wired to HeyGen/Gemini auth; use CLI tts, transcribe |
| `audio/scripts/carve.mjs` | Carves voice bands out of the music bed | **adopt** → video-components/scripts/media/audio/carve.mjs (voiceover carve into music bed, ffmpeg only) |
| `audio/scripts/extract-audio-data.py` | Per-frame audio bands for audio-reactive visuals | **adopt** → video-components/scripts/media/audio/extract-audio-data.py (per-frame audio data for reactive visuals) |
| `audio/scripts/heygen-tts.mjs` | HeyGen TTS helper with word timings | **no**: HeyGen TTS account |
| `audio/scripts/heygen-voice.mjs` | HeyGen voice cloning helper | **no**: HeyGen voice account |
| `audio/scripts/lib/audio-carve.mjs` | Generated carve analysis bundle | **adopt** → video-components/scripts/media/audio/lib/audio-carve.mjs (needed by carve.mjs) |
| `audio/scripts/lib/audio-meta.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/bgm-volume.mjs` | Bed volume constants: 0.12 under voice, 0.9 silent | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/bgm.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/concurrency.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/gemini-auth.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: HeyGen or Gemini account helper |
| `audio/scripts/lib/gemini-auth.py` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: HeyGen or Gemini account helper |
| `audio/scripts/lib/gemini-auth_test.py` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: HeyGen or Gemini account helper |
| `audio/scripts/lib/gemini-tts.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: HeyGen or Gemini account helper |
| `audio/scripts/lib/heygen.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: HeyGen or Gemini account helper |
| `audio/scripts/lib/main-module.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **adopt** → video-components/scripts/media/audio/lib/main-module.mjs (needed by carve.mjs) |
| `audio/scripts/lib/media-record.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/openverse.mjs` | CC0/CC BY sound search on Openverse | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/project-path.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/python.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/recording.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/sfx.mjs` | Resolves effect cues via Openverse or bundled set | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/tts.mjs` | Plumbing of their audio engine: HeyGen, Gemini, TTS, paths | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lib/voice-credit.mjs` | Credit line naming where each voice came from | **no**: internal to resolve or engine; pinned CLI runs its own |
| `audio/scripts/lyria-recipe.py` | Generates music with Google Lyria | **no**: needs Gemini/Google API key |
| `audio/scripts/trusted_program.py` | Finds helper programs safely on PATH | **adopt** → video-components/scripts/media/audio/trusted_program.py (needed by extract-audio-data.py) |
| `audio/scripts/wait-bgm.mjs` | Waits for detached music generation | **no**: only for engine background generation |
| `luts/index.json` | Three LUT looks: teal-orange, bleach-bypass, film-fade | **no**: pinned CLI bundles it; resolve --type lut reads its copy |
| `luts/README.md` | How operators host LUTs on HeyGen's CDN | **no**: operator steps for HeyGen S3 LUT hosting |
| `references/audio.md` | Audio engine overview; word timings for captions | **adopt** → video-components/references/media/audio.md (audio overview: voice, music, sfx, captions) |
| `references/grading.md` | Grade blocks and LUTs; never read a .cube | **adopt** → video-components/references/media/grading.md (grading, LUTs, grade-compare via pinned CLI) |
| `references/heygen.md` | HeyGen generation, transcription and prices from the CLI | **no**: HeyGen generate, account and prices |
| `references/local.md` | Local commands: grade, cutout, loudness, beats | **adopt** → video-components/references/media/local.md (local commands: grade, cutout, loudness, beats) |
| `references/media-treatment-recipes.md` | Tested treatment recipes: portrait, product, UI, stylised | **adopt** → video-components/references/media/media-treatment-recipes.md (treatment recipes on real footage) |
| `references/media-treatments.md` | Choosing a footage treatment; vague feedback translated conservatively | **adopt** → video-components/references/media/media-treatments.md (treatments, overlays, reveals) |
| `references/memory.md` | Remembered preferences and frozen recipes | **later**: prefs/recipes overlap GIMC folder note memory; decide later |
| `references/meta.md` | Maintainer reference: ownership, usage stats, telemetry, privacy | **no**: maintainer notes and telemetry |
| `references/mixing.md` | Volume, fades, envelopes, effect chains, ducking, buses | **adopt** → video-components/references/media/mixing.md (fades, gain, ducking, buses on placed tracks) |
| `references/operations.md` | Cutting, reframing, transcoding media with local tools | **adopt** → video-components/references/media/operations.md (cut, reframe, transform with ffmpeg; heygen recipes removed) |
| `references/resolve.md` | resolve command: find, reuse, ingest media into a ledger | **adopt** → video-components/references/media/resolve.md (resolve, reuse, adopt, ingest via pinned CLI) |
| `references/setup-providers.md` | Installing providers, sign-in, RAM ladders | **adopt** → video-components/references/media/setup-providers.md (local tool installs; HeyGen sign-in parts removed) |
| `references/telemetry-dashboard.md` | Usage dashboard definition for an authorised analytics project | **no**: HeyGen telemetry dashboard |
| `scripts/audio-duck.mjs` | Writes a ducking envelope from speech spans | **adopt** → video-components/scripts/media/audio-duck.mjs (ducking lane from word timings; telemetry removed) |
| `scripts/dither.mjs` | Error-diffusion dithering of images and video | **adopt** → video-components/scripts/media/dither.mjs (error-diffusion dither with ffmpeg, standalone) |
| `scripts/eval.mjs` | Evaluation harness comparing blocks with and without media-use | **no**: maintainer eval against HeyGen repo blocks |
| `scripts/lib/adopt.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/bgm-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/brand-provider.mjs` | Reads brand from frame.md or design.md | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/bundled-sfx-provider.mjs` | Matches cues to the bundled sfx library | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/cache.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/candidates.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/codex-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/config-lock.d.mts` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/config-lock.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/credit-limit.d.mts` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/credit-limit.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/cube-build.mjs` | Builds parametric LUT cubes | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/cube-validate.mjs` | Validates .cube LUT files | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/cutlist.mjs` | Cut list from transcript; 0.15 s silence pad | **adopt** → video-components/scripts/media/lib/cutlist.mjs (needed by transcript-cut.mjs) |
| `scripts/lib/duck.mjs` | Speech spans and duck keyframes; merge gap 0.6 s | **adopt** → video-components/scripts/media/lib/duck.mjs (needed by audio-duck.mjs) |
| `scripts/lib/error-diffusion.mjs` | Dither kernels for error diffusion | **adopt** → video-components/scripts/media/lib/error-diffusion.mjs (needed by dither.mjs) |
| `scripts/lib/ff-binaries.mjs` | Runtime helpers: ffmpeg paths, npx, probing, terminal text | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/freeze.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/grade-analyzer.mjs` | Signalstats evidence before grading | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/heygen-cli.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: HeyGen or Gemini account helper |
| `scripts/lib/heygen-search.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: HeyGen or Gemini account helper |
| `scripts/lib/heygen-video-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: HeyGen or Gemini account helper |
| `scripts/lib/image-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/index-gen.d.mts` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/index-gen.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/local-media-search.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/local-models.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/local-run.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/logo-provider.mjs` | Fetches official logos from theSVG, GitHub, favicons | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/ltx-video-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/lut-preset-provider.mjs` | Resolves LUT presets from the library | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/main-module.mjs` | Runtime helpers: ffmpeg paths, npx, probing, terminal text | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/manifest.d.mts` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/manifest.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/match.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/media-fetch.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/media-home.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/media-search.d.mts` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/media-search.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/mflux-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/misses.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/npx-sync.mjs` | Runtime helpers: ffmpeg paths, npx, probing, terminal text | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/openverse.mjs` | CC0/CC BY sound search on Openverse | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/parakeet-words.mjs` | Joins sub-word tokens into word timings | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/prefs-store.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/probe.mjs` | Runtime helpers: ffmpeg paths, npx, probing, terminal text | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/providers.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/recipe-store.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/registry.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/search.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/sfx-provider.mjs` | Effect search provider with confidence floor | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/specs.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/stats.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/svg-sanitize.mjs` | Generated SVG sanitiser bundle | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/telemetry.mjs` | Usage telemetry shared with the CLI identity | **no**: telemetry; calls removed from adopted scripts |
| `scripts/lib/terminal-text.d.mts` | Runtime helpers: ffmpeg paths, npx, probing, terminal text | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/terminal-text.mjs` | Runtime helpers: ffmpeg paths, npx, probing, terminal text | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/transcriptCutFade.mjs` | 30 ms fades at splices against clicks | **adopt** → video-components/scripts/media/lib/transcriptCutFade.mjs (needed by transcript-cut.mjs) |
| `scripts/lib/tts-local-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/usage.mjs` | Media ledger, cache, search and preference store | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/voice-provider.mjs` | Media providers: HeyGen catalog, credits, local generators | **no**: internal to resolve or engine; pinned CLI runs its own |
| `scripts/lib/windows-exe-search.mjs` | Runtime helpers: ffmpeg paths, npx, probing, terminal text | **adopt** → video-components/scripts/media/lib/windows-exe-search.mjs (needed by dither, transcript-cut, carve) |
| `scripts/lib/words.mjs` | Normalises word-timestamp arrays | **adopt** → video-components/scripts/media/lib/words.mjs (needed by duck and cutlist) |
| `scripts/prefs.mjs` | CLI for remembered media preferences | **later**: memory tier; overlaps GIMC folder note |
| `scripts/recipe.mjs` | CLI that freezes a run as a recipe | **later**: memory tier; overlaps GIMC folder note |
| `scripts/resolve.mjs` | Main resolve command for the media ledger | **no**: pinned CLI media-use resolve runs its own copy |
| `scripts/transcribe.mjs` | Transcription with Parakeet, whisper fallback | **no**: pinned CLI transcribe covers Parakeet and whisper |
| `scripts/transcript-cut.mjs` | Cuts footage by transcript: fillers, silences | **adopt** → video-components/scripts/media/transcript-cut.mjs (cut footage by transcript words; telemetry removed) |
| `SKILL.md` | Media sourcing via HeyGen or local tools; gap scan | **adopt** → video-components/references/media/media-use.md (media entry point; HeyGen sign-in and credits removed) |

## Newest upstream compared (checked 17-11-2026)

Pinned npm `hyperframes@0.9.61` against `heygen-com/hyperframes` main (`bc5259d2`, release v0.9.64, 39 commits later).

- **Skills text unchanged.** All 63 Markdown files of `hyperframes/`, `hyperframes-cli/` and `media-use/` are
  byte-identical to main; nothing added, removed or renamed. No change to composition numbers, motion rules,
  caption guidance or CLI flags.
- **Skills only in the repo:** `figma/`, `hyperframes-registry/`, `remotion-to-hyperframes/`, `reverse-any-video/`,
  `slideshow/`, `style-sampling/`. The pinned `hyperframes/SKILL.md` links to four of them, so those links are dead in
  an npm install. Not adopted; `reverse-any-video` and `style-sampling` are worth a look later.
- **CLI since 0.9.61:** `check` flags text over a face (#8074, in 0.9.64): the reason to move the pin once presenter
  beats ship, after `npm run inspect` and a render of the starter. Lint timing through the parser (#8032, #8037),
  parallel still checks (#7997) and render-path fixes (#7985, #7971) change no flags.
- **media-use code:** a project's `.env` provider key no longer overrides the user's own (#8041, #8056, #8086);
  private per-run output folders (#8030). Not relevant: GIMC uses none of those providers.

Verdict: stay on 0.9.61; re-check in a week.
