# Video and podcasts

Subtitles, comments and transcripts from YouTube, and transcripts of any audio or video file.

## YouTube (yt-dlp)

### Video metadata

```bash
yt-dlp --dump-json "URL"
```

### Download subtitles

```bash
# Subtitles only (no video); list the languages you want, e.g. Dutch and English
yt-dlp --write-sub --write-auto-sub --sub-lang "nl,en" --skip-download -o "/tmp/%(id)s" "URL"

# Then read the .vtt file
cat /tmp/VIDEO_ID.*.vtt
```

### Comments

```bash
# Extract comments (best-effort, not guaranteed complete)
yt-dlp --write-comments --skip-download --write-info-json \
  --extractor-args "youtube:max_comments=20" \
  -o "/tmp/%(id)s" "URL"
# The comments are in the `comments` field of the .info.json
```

### Search videos

```bash
yt-dlp --dump-json "ytsearch5:query"
```

> **Subtitles:** manually uploaded subtitles are reliable; auto-generated ones can repeat lines and need clean-up.
> **Comments:** `--write-comments` scrapes the web page (not the YouTube Data API); some comments may be missing.

### No subtitles: Whisper transcription

```bash
# Fallback when a video has no subtitles: download the audio and transcribe it with Whisper (a free Groq key is enough)
agent-reach transcribe "https://www.youtube.com/watch?v=VIDEO_ID"
agent-reach transcribe ./local_audio.mp3 -o /tmp/transcript.txt
```

> Set a key first: `agent-reach configure groq-key gsk_xxx` (free, console.groq.com)
> or `agent-reach configure openai-key sk-xxx`. Default auto mode: if Groq fails it falls back to OpenAI.


## Which tool

| Need | Tool |
|---|---|
| YouTube subtitles | yt-dlp |
| YouTube comments | yt-dlp `--write-comments` |
| Audio/video without subtitles | agent-reach transcribe |
