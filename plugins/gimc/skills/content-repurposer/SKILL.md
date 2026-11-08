---
name: content-repurposer
description: >
  FutureFlowAI Content Repurposer skill.
  Turn one long-form source (blog post, podcast, YouTube video, webinar,
  transcript) into a batch of short-form reel ideas and scripts. Use when the
  user says "repurpose", "turn this into reels", "atomize", "clip this",
  "content from my blog/podcast", or "make videos from this".
user-invokable: true
argument-hint: "[paste the source, transcript, or link summary]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Repurposer

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Content Repurposer skill", e.g. "I'll use the FutureFlowAI Content Repurposer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turn one long source into a week of short-form videos — the heart of a content factory.

## When to use
You have a blog post, podcast episode, YouTube video, or webinar and want 5+ reels out of it instead of one.

## What you'll need
The source text or transcript (paste it, or a detailed summary), your audience, and the platform. Optional: brand voice.

## Instructions
Give Claude the source, then run this prompt:

```
You are my content repurposing engine. From the source below, extract the short-form video gold.

Source:
"""
[paste blog post / transcript / detailed summary]
"""

Audience: [who it's for]   Platform: [Reels/TikTok/Shorts]

Do this:
1. Pull the 5 most reel-worthy ideas (a surprising claim, a how-to, a myth, a story, a result). One line each.
2. For each idea: write 1 scroll-stopping hook + a 3-beat outline (hook → value → CTA).
3. Flag which 2 have the highest viral potential and why (emotion, specificity, or contrarian angle).

Keep it concrete and lifted from the source — no generic filler.
```

**Obsidian memory tip:** Keep your long-form library in your Obsidian vault (Filesystem MCP), and Claude can repurpose *across* sources — "find the 5 best reel ideas across everything I published this quarter," not just one post.

**Tip:** One good podcast can become 8-10 reels. Batch the scripts, then film in one sitting.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `video` in frame "Clips", with `skill: "content-repurposer"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `repurpose` from that source card to the new card(s).
- The result has media (video): upload it as described in `gimc-canvas` (media) and attach it to the card.
- If the source is a video or audio file, cut the chosen moments with ffmpeg into 9:16 clips, with subtitles and the hook on screen (optionally via reel-builder). Each clip becomes its own video card with a line to the source card.
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
  const run_id = 'RUN_ID', skill = 'content-repurposer'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Clips', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'video', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
