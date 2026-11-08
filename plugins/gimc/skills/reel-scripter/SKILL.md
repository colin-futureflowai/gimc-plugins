---
name: reel-scripter
description: >
  FutureFlowAI Reel Scripter skill.
  Turn an idea or hook into a full 30-45 second reel script — hook, value beats,
  payoff, and CTA, with on-screen text. Use when the user says "reel script",
  "video script", "script this", "write a reel", "short-form script", or "turn
  this idea into a video".
user-invokable: true
argument-hint: "[idea or hook to script]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Reel Scripter

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Reel Scripter skill", e.g. "I'll use the FutureFlowAI Reel Scripter skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turn one idea (or hook) into a tight, postable 30-45s reel script.

## When to use
You have a hook or topic and need the whole script — what to say, in what order, with the on-screen text and a CTA that earns the follow.

## What you'll need
The idea or hook, the platform (Reels / TikTok / Shorts), the audience, and the goal (follows / saves / DMs / link clicks). Optional: your brand voice.

## Instructions
Collect the inputs, then run this prompt:

```
You are my short-form video scriptwriter. Write a [30/45]-second [Reels/TikTok/Shorts] script.

Idea / hook: [idea or hook]
Audience: [who it's for]
Goal: [follows / saves / DMs / clicks]
Voice: [your tone — e.g. punchy, warm, expert-next-door]

Structure:
1. HOOK (0-3s) — stop the scroll, restate the promise.
2. CONTEXT (3-8s) — name the problem or stakes.
3. VALUE (8-30s) — 3 fast, concrete beats. Show, don't lecture.
4. PAYOFF + CTA (last 5s) — the takeaway + one specific action.

Output a two-column script: [SPOKEN line] | [ON-SCREEN text]. Keep spoken lines to ~140 words total. Add a 1-line B-roll/visual suggestion per beat. End with 2 alternate CTAs.
```

**Obsidian memory tip:** With your vault connected (Filesystem MCP), ask Claude to "match the pacing and structure of my best-performing reels in my vault." It scripts in your proven format, not a generic one.

**Tip:** Read it out loud and cut 20%. Short-form rewards tight.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `script` in frame "Script", with `skill: "reel-scripter"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'reel-scripter'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Script', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'script', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
