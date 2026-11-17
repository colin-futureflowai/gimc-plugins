> Adopted from HeyGen Hyperframes skills v0.9.61 (`media-use/audio/references/tts.md`), Apache-2.0. GIMC-specific rules are in motion-design/SKILL.md and video-components/SKILL.md and win where they differ.

# Text To Speech

`npx hyperframes@0.9.61 tts` synthesizes locally with Kokoro. It does not accept a
`--provider` or `--words` flag. The HeyGen (Starfish, cloned voices) and Gemini routes of the original need a HeyGen account or a Gemini key and the bundled HeyGen/engine scripts; they are left out.

## Available routes

| Order | Provider          | Env trigger                                                               | Voice IDs                                                                                  | Word timestamps                           | Audio format         |
| ----- | ----------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- | -------------------- |
| 1     | ElevenLabs        | `$ELEVENLABS_API_KEY`                                                     | UUIDs from elevenlabs.io dashboard                                                         | No                                        | mp3 → wav via ffmpeg |
| 2     | Kokoro-82M        | always (local fallback)                                                   | `am_michael`, `af_heart`, … (54 voices)                                                    | No                                        | wav direct           |

```bash
# Local Kokoro CLI
npx hyperframes@0.9.61 tts "Welcome to HyperFrames" -o narration.wav
```

## When to use which provider

| Goal                                                      | Use                                                       |
| --------------------------------------------------------- | --------------------------------------------------------- |
| Drop-in cloud TTS, big voice catalog                      | **ElevenLabs**                                            |
| Offline, no API key, fast iteration                       | **Kokoro**                                                |
| Non-English multilingual with deterministic phonemization | **Kokoro** (`ef_dora`, `jf_alpha`, `zf_xiaobei`, …)       |

## ffmpeg requirement

ElevenLabs returns mp3; transcode it to wav (`ffmpeg -i take.mp3 take.wav`), the format downstream `ffprobe` +
Whisper expect. The local Kokoro CLI writes wav directly.

## Voice selection (Kokoro)

Default `af_heart`. Curated picks:

| Content type      | Voice                  |
| ----------------- | ---------------------- |
| Product demo      | `af_heart`, `af_nova`  |
| Tutorial / how-to | `am_adam`, `bf_emma`   |
| Marketing / promo | `af_sky`, `am_michael` |
| Documentation     | `bf_emma`, `bm_george` |
| Casual / social   | `af_heart`, `af_sky`   |

Run `npx hyperframes@0.9.61 tts --list` for the bundled set.

## Multilingual (Kokoro voice prefix → language)

The first letter of a Kokoro voice ID picks the phonemizer language; `--lang` overrides auto-detection.

| Prefix | Language             |
| ------ | -------------------- |
| `a`    | American English     |
| `b`    | British English      |
| `e`    | Spanish              |
| `f`    | French               |
| `h`    | Hindi                |
| `i`    | Italian              |
| `j`    | Japanese             |
| `p`    | Brazilian Portuguese |
| `z`    | Mandarin             |

```bash
npx hyperframes@0.9.61 tts "La reunión empieza a las nueve" --voice ef_dora
npx hyperframes@0.9.61 tts "Today is a nice day" --voice af_heart
```

Valid `--lang` codes (only needed to override the voice's auto-detected language): `en-us`, `en-gb`, `es`, `fr-fr`, `hi`, `it`, `pt-br`, `ja`, `zh`.

Non-English phonemization requires `espeak-ng` system-wide (`brew install espeak-ng` / `apt-get install espeak-ng`).

## Speed

- `0.7-0.8` — tutorial, complex content, accessibility
- `1.0` — natural pace (default)
- `1.1-1.2` — intros, transitions, upbeat content
- `1.5+` — rarely appropriate, test carefully

The `hyperframes tts` command honors `--speed` for Kokoro. Provider-specific
helpers document their own pacing controls.

## Long scripts

Past a few paragraphs, write the text to a `.txt` file and pass the path. Inputs over ~5 minutes of speech may benefit from splitting into segments.

## Word-timestamp shape

The flat shape `transcribe` produces — drop-in compatible with the captions pipeline:

```json
[
  { "id": "w0", "text": "Hi", "start": 0.0, "end": 0.21 },
  { "id": "w1", "text": "there", "start": 0.22, "end": 0.55 }
]
```

For ElevenLabs / Kokoro, run `npx hyperframes@0.9.61 transcribe narration.wav --model small.en` to get the same shape.
