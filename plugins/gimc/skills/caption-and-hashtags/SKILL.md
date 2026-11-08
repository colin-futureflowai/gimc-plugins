---
name: caption-and-hashtags
description: >
  FutureFlowAI Caption & Hashtags skill.
  Write the caption, hashtag set, and first comment for a reel or post. Use when
  the user says "caption", "hashtags", "write the description", "what do I write
  under this", "first comment", or "post copy".
user-invokable: true
argument-hint: "[what the reel/post is about]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Caption & Hashtags

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Caption & Hashtags skill", e.g. "I'll use the FutureFlowAI Caption & Hashtags skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Write the caption, a tiered hashtag set, and a first comment that drives saves, follows, and reach.

## When to use
The video's done — now you need the copy that gets it shared and the hashtags that get it found, without looking spammy.

## What you'll need
What the reel is about, the platform, your niche, and the goal (saves / follows / comments / link). Optional: your handle and brand voice.

## Instructions
Run this prompt:

```
You are my social copywriter. Write the post copy for this reel.

Reel: [what it's about]   Platform: [Reels/TikTok/Shorts]   Niche: [niche]
Goal: [saves / follows / comments / DMs]

Give me:
1. CAPTION — a strong first line (it's the only line shown before "more"), then 2-4 short lines of value, then one clear CTA. No hashtag soup in the caption.
2. HASHTAGS — 12-15, tiered: a few broad (1M+), several mid (100k-1M), several niche (<100k). Put them in the first comment, not the caption.
3. FIRST COMMENT — the hashtags + a question that sparks replies (comments boost reach).
4. ALT TEXT — one accessible description of the video.

Match the niche's language. No emojis-as-bullets unless on-brand.
```

**Obsidian memory tip:** With your vault connected (Filesystem MCP), ask Claude to "reuse the hashtag sets and CTA style from my best-saved posts." Your proven tags beat a generic list.

**Tip:** The first line of the caption is a second hook. Make it earn the "…more" tap.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Publicatie", with `skill: "caption-and-hashtags"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'caption-and-hashtags'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Publicatie', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'note', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
