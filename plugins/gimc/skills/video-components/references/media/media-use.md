> Adopted from HeyGen Hyperframes skills v0.9.61 (`media-use/SKILL.md`), Apache-2.0. GIMC-specific rules are in motion-design/SKILL.md and video-components/SKILL.md and win where they differ.

**Running the CLI:** every `npx hyperframes@0.9.61 <command>` here runs the pinned CLI in a project copied from `assets/starter/`, with `HYPERFRAMES_NO_TELEMETRY=1`, `HYPERFRAMES_NO_UPDATE_CHECK=1` and `HYPERFRAMES_SKIP_SKILLS=1` set. `<SKILL_DIR>` is the video-components skill folder: its scripts are in `<SKILL_DIR>/scripts/media/`; run them with `node` from the project.

# Media in HyperFrames

Media lands as a local file in the project's `assets/` with a ledger record; renders never fetch. One verb finds it:

```bash
npx hyperframes@0.9.61 media-use resolve --type <type> --intent "<what you need>" --project <dir>
```

It prints one line, `resolved <id> → <path> (<type>, <metadata>)`. List reusable assets first with `--candidates` and judge the fit yourself; reuse, ingest (`--from`) and adopt are in [resolve.md](resolve.md).

## Where it comes from

The HeyGen-account routes (catalog, asset search, paid generation, sign-in) are left out. What remains:

| Need | Free, no account | Local (only when the person asks or it is installed) |
| --- | --- | --- |
| Music (`bgm`) | a file the person provides, ingested with `--from` | Local MusicGen ([audio/bgm.md](audio/bgm.md)) |
| Sound effects (`sfx`) | Openverse (credit CC BY) | |
| Images, icons | a file the person provides (`--from`) | Local FLUX (mflux), if installed |
| Logos (`logo`) | theSVG, GitHub avatar, favicon; never redrawn | |
| Voiceover (`voice`) | a recording or voice file the person provides (`--from`) | `npx hyperframes@0.9.61 tts` (Kokoro on device) |
| A presenter speaking | | Local LTX for generic clips, if installed |
| Transcripts | `npx hyperframes@0.9.61 transcribe` (Parakeet or whisper) | |
| Cutouts | | `npx hyperframes@0.9.61 remove-background` |
| Grades, LUTs, looks | `npx hyperframes@0.9.61 media-treatment` | |

**Host apps.** Inside an app with its own media tools, use those first.

## Looks on real footage

Feedback that footage is dark, flat or dull, should feel retro or printed, needs a face hidden, or needs a reveal is media intent. Inspect the real `<img>`/`<video>`, pick one intent, and follow [media-treatments.md](media-treatments.md); persist with `npx hyperframes@0.9.61 media-treatment`, never a CSS, SVG or `.cube` stand-in.

## Offer once, never add silently

Scan a piece you build or review once for concrete gaps (on-screen text with no voiceover, emoji standing in for icons, placeholder images, silent cuts, 10 s+ with no music, a colour cast) and offer the fixes in one ask. No signal, no suggestion; respect "leave it".

## Where to look

| Task | Read |
| --- | --- |
| Resolve, reuse, adopt, ingest, flags | [resolve.md](resolve.md) |
| Grading, LUTs, `grade-compare` | [grading.md](grading.md) |
| Voiceover, music, sound effects, captions, transcription | [audio.md](audio.md) |
| Cut, reframe or transform media | [operations.md](operations.md) |
| Treatments, realtime effects, overlays, reveals | [media-treatments.md](media-treatments.md), [media-treatment-recipes.md](media-treatment-recipes.md) |
| Install local tools, `--provider`, `--local-only`, RAM ladders | [setup-providers.md](setup-providers.md) |
| Fades, gain, ducking, automation, effects, buses on placed tracks | [mixing.md](mixing.md) |
| Local commands: grade, cutout, loudness, beats | [local.md](local.md) |
| Tested ffmpeg recipes (GIMC) | [ffmpeg-recipes.md](ffmpeg-recipes.md) |
