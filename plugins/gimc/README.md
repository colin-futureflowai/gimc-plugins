# GIMC

GIMC is a plugin that brings 54 content skills (hooks, reels, carousels, captions, research and more) and the
`brandbook` skill together with a connection to your GIMC workspace. When you ask for it, a skill puts its result as a card
on your GIMC canvas, so the whole content process stays in one place. Version 0.7.1.

## What this plugin connects to

- **GIMC (MCP server)**: `https://gimc-app.vercel.app/api/mcp`. The `gimc-canvas` skill uses it to read your canvas boards and to
  create cards, lines and media on them. You sign in with your own GIMC account the first time; nothing is
  sent before you sign in. The plugin only sends what you ask a skill to put on the canvas: the card text, and media you
  choose to attach. It does not collect anything else and has no analytics of its own.
- **Skills never put anything on the canvas without a request.** The canvas never blocks a skill: without a connection the
  skill still gives its result in the chat.

## External services that skills may mention

The content skills are based on claude-content-skills and describe optional tools. They only call these when you connect
them and ask for that step, and they stop and ask you first if a connection is missing:

- Apify, for tearing down and scraping reels and posts (`content-factory`, `reel-analyzer`).
- Composio, as a bridge to post to or message from your own Instagram account (`content-factory`).
- Runway (Seedance image-to-video) for acting beats in a reel, billed in your own Runway credits (`reel-builder`).
- Remotion and ffmpeg, which run on your own machine to render video.
- Research sources through `agent-reach`: Twitter/X, Reddit, YouTube, LinkedIn, GitHub, Bilibili, Xiaohongshu, podcasts and
  RSS feeds, optionally with Exa, Jina, Groq or OpenAI for search and transcription.

Review the permissions each of these services asks for. This plugin never stores your keys for them.

## License

MIT. The content skills are the unchanged originals by Ootto with a "Put it on GIMC" section appended; see
`LICENSE` and `NOTICE`. The `brandbook` and `gimc-canvas` skills are made by GIMC.
