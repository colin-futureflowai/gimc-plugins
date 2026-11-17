> Adopted from HeyGen Hyperframes skills v0.9.61 (`media-use/audio/references/tts-to-captions.md`), Apache-2.0. GIMC-specific rules are in motion-design/SKILL.md and video-components/SKILL.md and win where they differ.

# TTS → Captions

When no recorded voiceover exists, generate one and obtain word-level caption timing. (The original's Path A, HeyGen TTS with word timestamps in one call, and the Gemini route need a HeyGen account or a Gemini key and are left out.)

## ElevenLabs / Kokoro (TTS → transcription)

These supply audio without word data: generate the audio, then transcribe:

```bash
npx hyperframes@0.9.61 tts script.txt --voice af_heart --output narration.wav
npx hyperframes@0.9.61 transcribe narration.wav --model small.en   # voice af_heart is American English
```

Whisper extracts precise word boundaries from the generated audio, so caption timing matches delivery without hand-tuning. Match `--model` to the voice's language (use `small.en` for `a`/`b` prefixes, `small --language <code>` otherwise). Then consume `transcript.json` via the caption references in `captions/`.

Verify that transcription preserved the script, especially names,
numbers, and delivery pauses. If `words` is empty, resolve the transcription
failure before captioning. Generate and align again after changing the read.
