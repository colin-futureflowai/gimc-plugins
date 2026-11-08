---
name: viral-hook-writer
description: >
  FutureFlowAI Viral Hook Writer skill.
  Write scroll-stopping hooks for a short-form video (the first 1-3 seconds).
  Use when the user says "hook", "reel hook", "opening line", "scroll stopper",
  "first three seconds", "TikTok hook", or "how do I start this video".
user-invokable: true
argument-hint: "[reel topic / what the video is about]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Viral Hook Writer

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Viral Hook Writer skill", e.g. "I'll use the FutureFlowAI Viral Hook Writer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Generate a batch of scroll-stopping hooks for a reel — the make-or-break first 1-3 seconds.

## When to use
You have a reel topic but the opening is weak. The hook is ~80% of whether anyone watches — this gives you options to test.

## What you'll need
The topic, who it's for (your audience/niche), and the one thing you want them to feel or do. Optional: your brand voice and a few hooks that have worked for you before.

## Instructions
Collect the topic and audience, then run this prompt:

```
You are my short-form video hook writer. Topic: [topic]. Audience: [who it's for]. Desired reaction: [stop scrolling / save it / comment / DM me].

Write 10 hooks for the first 1-3 seconds. Use a spread of proven angles:
- Bold claim / contrarian take
- "If you [situation], do this"
- Mistake / "stop doing X"
- Number + payoff ("3 ways to…")
- Curiosity gap / open loop
- Result-first ("I went from X to Y")
- Question that names the pain

Rules: under 12 words each, spoken-language, no fluff, no hashtags. For each hook add a 3-5 word on-screen text version. Mark the 3 you'd test first and say why in one line.
```

**Obsidian memory tip:** If you've connected your Obsidian vault (Filesystem MCP), point Claude at your notes of past reels — "use the hooks that performed best in my vault as the pattern." Hooks grounded in *your* winners beat generic ones.

**Tip:** Always generate 10 and test 2-3. The hook you love is rarely the one that wins.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `hook` in frame "Hooks", with `skill: "viral-hook-writer"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- A reference video a hook is modelled on is a `link` card with its thumbnail as poster, with a line to the hooks; see `gimc-canvas` (media, "Social video from another account").
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
  const run_id = 'RUN_ID', skill = 'viral-hook-writer'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Hooks', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'hook', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
