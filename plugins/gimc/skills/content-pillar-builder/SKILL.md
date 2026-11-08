---
name: content-pillar-builder
description: >
  FutureFlowAI Content Pillar Builder skill.
  Defines the 3-5 themes your account posts against, so every reel ladders up to a clear position.
  Use when the user says "what are my content pillars", "define my themes", "what should my account be about".
user-invokable: true
argument-hint: "[your business and audience]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Pillar Builder — the 3-5 themes everything ladders up to

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Content Pillar Builder skill", e.g. "I'll use the FutureFlowAI Content Pillar Builder skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Defines the 3-5 themes your account posts against, so every reel ladders up to a clear position.


## When to use
Your feed feels random and you can't say what the account is about.

## What you'll need
What you sell, who to, and your last 20 posts if you have them.

## Instructions
Give Claude the input and run this.

```
You are my brand strategist. Business: [WHAT]. Audience: [WHO]. Recent posts: [paste if available].

1. PILLARS: 3-5, no more. Each a THEME with a point of view, not a topic bucket.
2. WHY EACH EARNS ITS PLACE: the audience need it serves and the business job it does.
3. ROTATION: how often each appears in a week.
4. THE POSITION: in one sentence, what someone would say I'm about after scrolling ten posts.
5. OUT OF SCOPE: what does NOT fit. This is the part that keeps an account coherent.
6. AUDIT: if I gave you recent posts, sort them into pillars and show me what's over- and under-served.

If more than five pillars fit, the framework is too loose — force it down.
```

**Honesty:** Six pillars is no pillars. If everything fits, the framework isn't doing any work.

**Next:** [content-calendar](../content-calendar/SKILL.md) → [series-planner](../series-planner/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "content-pillar-builder"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'content-pillar-builder'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Planning', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
