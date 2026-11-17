> Adopted from HeyGen Hyperframes skills v0.9.61 (`media-use/audio/references/bgm.md`), Apache-2.0. GIMC-specific rules are in motion-design/SKILL.md and video-components/SKILL.md and win where they differ.

# Background music (BGM)

One music bed per composition. In the original, the shared audio engine (`scripts/audio.mjs` → `scripts/lib/bgm.mjs`) either retrieves a track from HeyGen's music catalog (HeyGen credential) or generates one locally (Lyria with a Gemini key, else MusicGen). Neither the engine nor those credentials are used here: bring a music file in with

```bash
npx hyperframes@0.9.61 media-use resolve --type bgm --from <track.mp3> --intent "<mood>" --project .
```

and place it as the music `<audio>` (`data-timeline-role="music"`). A local MusicGen track (below) is ingested the same way.

## Level

`volume` defaults in the engine: `BGM_BED_VOLUME` `0.12` (≈ -18 dB — a bed under the voice) under narration, `BGM_SILENT_VOLUME` `0.9` for a silent film (no voice). An explicit `volume` always overrides this default.

## Edit point

For short launch videos, do not assume the beginning of the retrieved file is the best edit point. Check the opening against later five-second sections. If the track starts with a quiet build but a later section has a stronger, clean musical entrance, trim from that section and apply a short fade-in and longer fade-out. Repeat this check whenever the composition duration changes; the final music file must cover the full cut without a silent tail.

## Local generation — MusicGen

| Provider                             | Env / deps                                                                            | Speed                                   | Quality                     |
| ------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------- |
| MusicGen (`facebook/musicgen-small`) | Python `transformers + torch + soundfile + numpy` (~300 MB first run)                  | Slow on CPU; fast on Apple MPS / CUDA   | Decent; prompt-only control |

Output → `assets/bgm/track.wav`, target = total voice duration. Generate **one** seed clip (≤28–30s, under the decoder's positional limit) then crossfade-loop it up to the target (or trim down if shorter), avoiding per-segment seams. MusicGen ignores BPM, scale and similar knobs — put the mood in the prompt.

## Mood inference (the generate prompt)

The engine's `inferBgmPrompt()`: an explicit `prompt` wins; otherwise industry-keyword **base** → narrative-**archetype** shape → emotional-**arc** tiebreaker. Use the same table to write a prompt or a search mood by hand.

| Match in `blob` / `query`                              | Base prompt                                                                 | BPM |
| ------------------------------------------------------ | --------------------------------------------------------------------------- | --- |
| `crypto / nft / web3 / defi / token / blockchain`      | atmospheric electronic, deep bass, futuristic synths, restrained percussion | 100 |
| `finance / fintech / bank / payment / invest / wealth` | calm cinematic, soft strings, subtle piano, restrained percussion           | 92  |
| `creative / agency / design / studio / art / brand`    | playful electronic, warm pads, light percussion                             | 115 |
| _(default: SaaS / tech / platform)_                    | uplifting corporate tech, bright modern piano with synth pads               | 108 |

Archetype then reshapes the arc — PAS → "MINOR to MAJOR" build; BAB / future-pacing → aspirational rising; feature-cascade → +10 BPM driving; demo-loop → −8 BPM minimal. The emotional arc breaks remaining ties (tension→relief, excitement, trust/reassurance).

## Failure modes

| Failure                          | Behavior                                                       |
| -------------------------------- | -------------------------------------------------------------- |
| No music file or match           | No BGM. Render proceeds without it.                            |
| MusicGen cannot run              | No BGM, with a `pip install …` hint. Voice + SFX still render. |

BGM failure never blocks a render.
