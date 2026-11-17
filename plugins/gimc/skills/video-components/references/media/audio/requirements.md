> Adopted from HeyGen Hyperframes skills v0.9.61 (`media-use/audio/references/requirements.md`), Apache-2.0. GIMC-specific rules are in motion-design/SKILL.md and video-components/SKILL.md and win where they differ.

# Requirements & Caches

## Keys and local dependencies

The HeyGen credential chain and `auth status` of the original are left out (no HeyGen account). What remains:

| Provider                         | Key                    | Local deps when used                             |
| -------------------------------- | ---------------------- | ------------------------------------------------ |
| **ElevenLabs** (TTS)             | `$ELEVENLABS_API_KEY`  | `pip install elevenlabs`                         |
| **Kokoro** (TTS, no key)         | always — final voice fallback | `pip install kokoro-onnx soundfile`       |
| **MusicGen** (BGM, no key)       | always — final music fallback | `pip install transformers torch soundfile numpy` |

`hyperframes doctor` reports whether those local deps are installed.

## Model caches & system dependencies

Each command downloads its own model on first run and caches it under `~/.cache/hyperframes/`:

- **TTS (ElevenLabs)** — API key + `ffmpeg` (to transcode the mp3 response to `.wav`).
- **TTS (Kokoro)** — Kokoro-82M (~311 MB) + voices (~27 MB) in `tts/`. Requires Python 3.8+ with `kokoro-onnx` and `soundfile` (`pip install kokoro-onnx soundfile`). Non-English text also needs `espeak-ng` system-wide.
- **BGM (MusicGen)** — `pip install transformers torch soundfile`. `facebook/musicgen-small` (~300 MB) cached under `~/.cache/huggingface/` on first run.
- **Transcribe** — Whisper model size depending on choice (75 MB – 3.1 GB) in `whisper/`, downloaded from HuggingFace on first use. `whisper.cpp` itself is NOT bundled: the CLI resolves it from PATH, installs via Homebrew (macOS), or builds it from source with git+cmake on first use (`$HYPERFRAMES_WHISPER_PATH` overrides).
- **Remove-background** — `u2net_human_seg` (~168 MB ONNX) in `background-removal/models/`. Peak inference RAM ~1.5 GB.

Run `npx hyperframes@0.9.61 doctor` if a command fails because of a missing dependency.
