---
name: agent-reach
description: >
  Research and read anything on the internet: web search, any URL or article, Reddit, X/Twitter,
  YouTube (metadata, subtitles, comments, transcripts), GitHub, LinkedIn and RSS. Use when the user
  says "research this", "look this up", "what are people saying about X", "read this link", "find
  Reddit threads about", or shares a URL to study. Only fetches content; it does not write reports,
  post, comment or like.
triggers:
  - research: research / look into / deep dive / find out what people think
  - search: search / look up / find
  - social: reddit, twitter, x.com, tweet
  - career: linkedin / jobs / hiring
  - dev: github / repo / issue / pull request / commit
  - web: link / url / article / rss / read this page
  - video: youtube / video / podcast / subtitles / transcript
user-invokable: true
license: MIT
metadata:
  openclaw:
    homepage: https://github.com/Panniantong/Agent-Reach
---

# Agent Reach — internet access router

Several platforms, several backends. **When this skill is installed, use it to reach these platforms; don't invent your own approach.**

> **Bundled with these content skills** as the factory's **research · scrape · download** engine —
> the **FIND** step that feeds [reel-analyzer](../reel-analyzer/SKILL.md). Vendored from
> **[Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach)** (MIT — full credit to the
> author). It's a *router*: don't load everything, read only the reference for the capability you
> need. For the content factory you mainly use three:
> - **Reddit** ([references/social.md](references/social.md)) — mine real demand: what people actually
>   ask/upvote in your niche → your reel topics.
> - **Search / web** ([references/search.md](references/search.md) · [references/web.md](references/web.md))
>   — find trending reels to model + read any page as clean text (Exa / Jina, no login).
> - **Video** ([references/video.md](references/video.md)) — download a reel/Short → transcript to study.
>
> **First-time channel setup:** follow `https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md`
> — web, Exa search and YouTube subtitles work zero-config; Reddit and Twitter need a browser login
> or cookies.

## Standing rules (always)

1. **Check health first:** for platforms with several backends (Reddit, Twitter)
   run `agent-reach doctor --json` and pick the command group from that platform's `active_backend`.
2. **Say what you use:** before you start, say "using agent-reach, platform X / backend Y".
3. **On failure, follow the retry chain in the references**; don't guess commands.
4. **Broad research tasks:** combine platforms (Exa search + Reddit/Twitter for discussion + YouTube
   for video), collect in parallel, then summarise.
5. **Watch for updates:** after a larger research or multi-platform task, run `agent-reach check-update`
   (fast, one API call). If there is a new version, add one line to your wrap-up: "Agent Reach vX.Y.Z is
   available; to update, ask me: update Agent Reach via
   https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/update.md". Don't interrupt the
   current task to update, and don't repeat the reminder for the same version.

## Routing table

| What the user wants | Category | Reference |
|---|---|---|
| Web search / code search | search | [references/search.md](references/search.md) |
| Reddit, Twitter/X | social | [references/social.md](references/social.md) |
| Jobs / LinkedIn | career | [references/career.md](references/career.md) |
| GitHub / code | dev | [references/dev.md](references/dev.md) |
| Web pages / articles / RSS | web | [references/web.md](references/web.md) |
| YouTube subtitles, comments and transcripts | video | [references/video.md](references/video.md) |

## Zero-config quick commands

```bash
# Exa web search
mcporter call 'exa.web_search_exa(query: "query", numResults: 5)'

# Read any web page as text
curl -s "https://r.jina.ai/URL"

# GitHub search
gh search repos "query" --sort stars --limit 10

# YouTube subtitles
yt-dlp --write-sub --skip-download -o "/tmp/%(id)s" "URL"
```

## Platforms that need a login (pick commands by the doctor's active_backend)

```bash
# Twitter search (twitter-cli first; retry chain in social.md)
twitter search "query" -n 10

# Reddit (no zero-config path: OpenCLI or rdt-cli, both need a login)
opencli reddit search "query" -f yaml   # desktop
rdt search "query" --limit 10            # legacy / server
```

## Environment check

```bash
# Available channels and the active backend per platform
agent-reach doctor --json
```

## Workspace rule

**Don't create files in the agent workspace.** Use `/tmp/` for temporary output and `~/.agent-reach/` for persistent data.

## References

Read the reference that matches the request:

- [Search](references/search.md) — Exa AI search
- [Social media](references/social.md) — Reddit, Twitter/X (backend command groups)
- [Career](references/career.md) — LinkedIn
- [Developer tools](references/dev.md) — GitHub CLI
- [Web reading](references/web.md) — Jina Reader, RSS
- [Video and podcasts](references/video.md) — YouTube

## Setting up a channel

If a channel needs setup, get the install guide:
https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md

The user only provides cookies or a browser login; the agent does the rest.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Onderzoek", with `skill: "agent-reach"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- Facts in a card (numbers, prices, names, dates, claims) come only from the brand, the folder note, GIMC data or a source you name; anything else is marked "aanname" on the card.
- In code mode this is one `gimc_execute` (fill in the CAPITALS; folder and board as `gimc-canvas` §3 says). The next step of the same run reuses `frame_id`, or makes the next frame in the same `gimc.canvas_create_items` call. Pass the returned `org_id` on every later `gimc_execute`. `board_not_found`: create that board only when the user asked for it or `gimc-canvas` §3 names it as the default, then run again. `inbox`: pick those up first (`gimc-canvas` §4).

```js
async () => {
  const c = await gimc.canvas_get_context({ workspace: 'WORKSPACE', folder: 'FOLDER' })
  if (c.choose_workspace || c.folder_not_found || c.folder_matches) return c
  const board = c.boards.find(b => b.name.toLowerCase() === 'BOARD'.toLowerCase())
  // A new board only when the user asked for one: gimc.canvas_create_board({ folder_id: c.folder.id, name }).
  if (!board) return { board_not_found: 'BOARD', boards: c.boards.map(b => b.name) }
  const inbox = await gimc.canvas_inbox({ board_id: board.id })
  if (inbox.tasks.length || inbox.notes.length) return { board_id: board.id, inbox: {
    tasks: inbox.tasks.map(t => ({ task_id: t.id, item_id: t.item_id, instruction: t.instruction })),
    notes: inbox.notes.map(n => ({ comment_id: n.comment_id, item_id: n.item_id, body: n.body.slice(0, 200) })),
  } } // pick these up first (gimc-canvas §4), then run this again
  const { next_free } = await gimc.canvas_board_overview({ board_id: board.id })
  const run_id = 'RUN_ID', skill = 'agent-reach'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Onderzoek', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
