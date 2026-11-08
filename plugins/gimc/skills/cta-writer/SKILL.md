---
name: cta-writer
description: >
  FutureFlowAI CTA Writer skill.
  Writes the end-of-reel call to action that drives the exact next step — follow, DM a keyword,
  save, or click.
  Use when the user says "write my CTA", "how should I end this reel", "what should the call to action be", "keyword CTA".
user-invokable: true
argument-hint: "[the reel, and what you want them to do]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# CTA Writer — one ask, matched to the reel

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI CTA Writer skill", e.g. "I'll use the FutureFlowAI CTA Writer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Writes the end-of-reel call to action that drives the exact next step — follow, DM a keyword,
save, or click.


## When to use
The reel works but the ending fizzles.

## What you'll need
The reel or script, and the one next step you want.

## Instructions
Give Claude the input and run this.

```
You are my CTA writer. Reel: [paste]. I want: [follow / DM keyword / save / click].

1. ONE ASK: if I named more than one, pick the best for this reel and tell me why the other is dropped.
2. THE REASON LINE: the sentence before the ask — why they should. This does more work than the ask.
3. THE ASK: the exact words, spoken and on-screen.
4. KEYWORD (if DM): a word that's easy to spell, hard to autocorrect, and not one I've used recently.
5. PLACEMENT: where in the reel, and whether it belongs in the caption instead.
6. DELIVERY CHECK: state exactly what I must have ready to send. If I can't deliver it, say don't run this CTA.
```

**Honesty:** Only promise what actually exists and actually sends. An unwired keyword burns the trust of
everyone who comments.

**Next:** [dm-script-writer](../dm-script-writer/SKILL.md) → [comment-responder](../comment-responder/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "CTA", with `skill: "cta-writer"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'cta-writer'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'CTA', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'note', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
