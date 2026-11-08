---
name: cover-thumbnail-brief
description: >
  FutureFlowAI Cover & Thumbnail Brief skill.
  Writes the cover-frame text and visual brief that makes your reel stop the scroll on the grid
  and in Explore.
  Use when the user says "write my cover text", "thumbnail brief", "what should the cover say", "grid cover for this reel".
user-invokable: true
argument-hint: "[the reel topic or script]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Cover & Thumbnail Brief — the frame that stops the scroll on the grid

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Cover & Thumbnail Brief skill", e.g. "I'll use the FutureFlowAI Cover & Thumbnail Brief skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Writes the cover-frame text and visual brief that makes your reel stop the scroll on the grid and
in Explore.


## When to use
The reel is made and the grid cover decides whether anyone opens it.

## What you'll need
The reel topic or script, and a look at your current grid.

## Instructions
Give Claude the input and run this.

```
You are my cover designer. Reel: [TOPIC/SCRIPT]. My grid currently looks like: [describe or paste].

1. COVER TEXT: 3-5 words max. Give me three options, ranked, each legible at thumbnail size.
2. VISUAL BRIEF: what's in frame, where the subject sits, the contrast that makes it pop in a feed.
3. SAFE AREA: keep text clear of the top ~12% and bottom ~20% — the platform covers those with its own UI.
4. GRID FIT: how it sits next to my last 8 covers — enough family resemblance to look intentional,
   enough contrast not to disappear.
5. TEST: describe it at 150px wide. If it's unreadable there, give me a simpler option.
```

**Honesty:** Legibility beats cleverness. A clever cover nobody can read at thumbnail size does not exist.

**Next:** [caption-and-hashtags](../caption-and-hashtags/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `image` in frame "Cover", with `skill: "cover-thumbnail-brief"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- The result has media (image): upload it as described in `gimc-canvas` (media) and attach it to the card.
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
  const run_id = 'RUN_ID', skill = 'cover-thumbnail-brief'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Cover', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'image', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
