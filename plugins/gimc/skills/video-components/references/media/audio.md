> Adopted from HeyGen Hyperframes skills v0.9.61 (`media-use/references/audio.md`), Apache-2.0. GIMC-specific rules are in motion-design/SKILL.md and video-components/SKILL.md and win where they differ.

# Audio — voiceover, music, SFX, captions, transcription

The original's shared audio engine (`audio/scripts/audio.mjs`, one `audio_request.json` for TTS + music + SFX) is not adopted: it runs through a HeyGen or Gemini credential. Each part runs on its own here, through the pinned CLI:

| Part | Command | Guide |
| --- | --- | --- |
| Voiceover (Kokoro, on device) | `npx hyperframes@0.9.61 tts "<text>" -o assets/voice/vo.wav` | [audio/tts.md](audio/tts.md) |
| Your own recording | copy it into the project, then `npx hyperframes@0.9.61 transcribe <file> --json` for word timings | [audio/transcribe.md](audio/transcribe.md) |
| Music bed | `npx hyperframes@0.9.61 media-use resolve --type bgm --from <file>` | [audio/bgm.md](audio/bgm.md) |
| Sound effects | `npx hyperframes@0.9.61 media-use resolve --type sfx --intent "<sound>"` | [audio/sfx.md](audio/sfx.md) |
| Captions from the voice | transcribe, then author | [audio/tts-to-captions.md](audio/tts-to-captions.md), [audio/captions/](audio/captions/authoring.md) |
| Cutouts | `npx hyperframes@0.9.61 remove-background` | [audio/remove-background.md](audio/remove-background.md) |
| Requirements | | [audio/requirements.md](audio/requirements.md) |

- **Your own recording**: a recording is the voice as is. Copy a recording from elsewhere into the project first; `speed` changes need ffmpeg `atempo` (pitch kept) and the word timings scaled the same, or transcribe again after the change.
- **Output** to keep per voice file: its path, `duration_s` (`ffprobe`), and `words[]` (word timestamps for captions).
- Ducking the music under the voice: `node <SKILL_DIR>/scripts/media/audio-duck.mjs` ([operations.md](operations.md), Ducking) or `node <SKILL_DIR>/scripts/media/audio/carve.mjs` ([mixing.md](mixing.md)).

Transcription: `npx hyperframes@0.9.61 transcribe` picks its own engine: Parakeet when installed (better than whisper.cpp: 6.05% vs 7.44% WER, 5-10x faster), otherwise whisper with the `small.en` model by default (see [operations.md](operations.md)).
