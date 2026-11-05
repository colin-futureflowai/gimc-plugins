# GIMC

GIMC is a plugin that brings 54 content skills (hooks, reels, carousels, captions, research and more) and
GIMC's own skills together with a connection to your GIMC workspace. When you ask for it, a skill puts its
result as a card on your GIMC canvas, so the whole content process stays in one place. Version 0.12.0.

## Skills at a glance

| Group | What for | Skills |
|---|---|---|
| Research | Trends, competitors, audience, sources and memory. | `agent-reach`, `ai-brain`, `audience-personas`, `competitor-positioning`, `competitor-teardown`, `content-research`, `hashtag-keyword-research`, `hook-mining`, `positioning-audit`, `social-listening`, `social-proof-mining`, `trend-spotter` |
| Strategy and planning | Pillars, calendars, series, campaigns, briefs and budgets on paper. | `best-time-scheduler`, `campaign-brief`, `community-engagement-plan`, `content-calendar`, `content-pillar-builder`, `cross-platform-distribution`, `going-viral`, `influencer-partnerships`, `paid-social-brief`, `series-planner`, `utm-campaign-plan`, `virality` |
| Create | Hooks, scripts, reels, carousels, captions, covers and ready-to-use builds. | `ab-hook-tester`, `b-roll-shot-list`, `canvas-builds`, `caption-and-hashtags`, `carousel-builder`, `content-factory`, `content-repurposer`, `cover-thumbnail-brief`, `cross-platform-reformatter`, `cta-writer`, `linkedin-thought-leadership`, `on-screen-text-writer`, `reel-builder`, `reel-scripter`, `story-sequencer`, `ugc-creator-brief`, `viral-carousel`, `viral-hook-writer`, `x-thread-strategy` |
| Plan and publish | Approval, the content calendar and posting at the platform. | `content-planning`, `social-ads` |
| Measure | Numbers, audits, readouts and retrospectives. | `analytics-readout`, `bio-profile-optimizer`, `content-audit`, `launch-retrospective`, `profile-conversion-audit`, `reel-analyzer`, `social-analytics-report`, `social-insights` |
| Engage and outreach | Comments, DMs, collaborations and creators. | `collab-outreach`, `comment-mining`, `comment-responder`, `creator-outreach`, `dm-script-writer`, `social-engagement` |
| Brand | The brand and design system of a folder. | `brandbook` |
| Hub | Canvas rules and which skill takes the next step | `gimc-canvas` |

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
