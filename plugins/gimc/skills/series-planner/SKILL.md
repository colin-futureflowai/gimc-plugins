---
name: series-planner
description: >
  FutureFlowAI Series Planner skill.
  Designs a recurring, named reel series — a repeatable format viewers come back for and follow so
  they do not miss.
  Use when the user says "plan a series", "recurring format", "what series should I run", "make this a weekly thing".
user-invokable: true
argument-hint: "[your niche and what you want to be known for]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Series Planner — a format people come back for

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Series Planner skill", e.g. "I'll use the FutureFlowAI Series Planner skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Designs a recurring, named reel series — a repeatable format viewers come back for and follow so
they do not miss.


## When to use
You want a format people follow you for, not one-off posts.

## What you'll need
Your niche, what you want to be known for, and how often you can ship.

## Instructions
Give Claude the input and run this.

```
You are my format designer. Niche: [NICHE]. Known for: [POSITION]. I can ship [N] per week.

1. THE NAME: 3-5 candidates. This is what people will refer to you by — make it sayable.
2. THE SHAPE: the repeatable structure — same opening device, same beats — so episode 9 is fast to make.
3. TWELVE EPISODES: titles and one-line premises, so the series survives past the initial enthusiasm.
4. THE FOLLOW REASON: why missing one would bother someone. If you can't answer this, the series is weak
   and you should tell me.
5. PRODUCTION REALITY: how long each episode takes once the format is set.
```

**Honesty:** A series is a promise. Weekly means weekly — one that skips trains people not to expect you.

**Next:** [content-calendar](../content-calendar/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `idea` in frame "Ideeën", with `skill: "series-planner"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Also put every dated post in the GIMC content calendar with `gimc.canvas_schedule_posts` (Amsterdam time, one call for the whole plan), following the `content-planning` skill; the document alone is not enough. Whether a post really goes live is in the answer (`at_platform`, `publish_note`): tell the user once, in one sentence.

  ```js
  async () => {
    const posts = [{ item_id: 'ITEM_ID', scheduled_at: 'YYYY-MM-DDTHH:MM', platforms: ['instagram'] }]
    await gimc.canvas_request_review({ item_ids: posts.map(p => p.item_id), comment: 'COMMENT' })
    const planned = await gimc.canvas_schedule_posts({ skill: 'SKILL', run_id: 'RUN_ID', posts })
    return { schedule_ids: planned.schedule.map(p => p.id), at_platform: planned.schedule.filter(p => p.at_platform).length, note: planned.schedule[0]?.publish_note, app_url: planned.app_url }
  }
  ```

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
  const run_id = 'RUN_ID', skill = 'series-planner'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Ideeën', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'idea', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
