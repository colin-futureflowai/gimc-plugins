---
name: b-roll-shot-list
description: >
  FutureFlowAI B-Roll & Shot List skill.
  Turns a script into a shoot-ready shot list — every clip, angle and visual you need to film, in
  order.
  Use when the user says "what do I need to film", "shot list for this", "b-roll list", "how do I shoot this reel".
user-invokable: true
argument-hint: "[your script]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# B-Roll & Shot List — everything you need to film, in shooting order

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI B-Roll & Shot List skill", e.g. "I'll use the FutureFlowAI B-Roll & Shot List skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turns a script into a shoot-ready shot list — every clip, angle and visual you need to film, in
order.


## When to use
The script is done and you need to know exactly what to film.

## What you'll need
The final script.

## Instructions
Give Claude the input and run this.

```
You are my first AD. Script: [paste].

1. SHOT LIST in FILMING order (not script order) — group by location and setup so I shoot everything in
   one place before moving. Number them.
2. PER SHOT: what's in frame, the angle, the duration to film, and THE LINE IT COVERS.
3. NO ORPHANS: if a shot doesn't cover a line, cut it and say so.
4. COVERAGE: mark which shots are essential vs nice-to-have, so I know what to drop when time runs out.
5. STOCK FALLBACK: for anything I can't film, the exact search term to find it.
6. KIT: what I actually need, in one short list.
```

**Honesty:** Every shot needs a job. Pretty footage with no line to cover is what makes reels drag.

**Next:** [reel-builder](../reel-builder/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Shotlist", with `skill: "b-roll-shot-list"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'b-roll-shot-list'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Shotlist', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
