---
name: competitor-teardown
description: >
  FutureFlowAI Competitor Teardown skill.
  Reverse-engineers a rival account's best posts into the patterns, hooks, and posting cadence
  actually driving their growth.
  Use when the user says "break down this account", "why is this competitor growing", "what is @x doing right", "teardown their content".
user-invokable: true
argument-hint: "[competitor handle or a few of their post links]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Competitor Teardown — the pattern behind a rival's best posts

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Competitor Teardown skill", e.g. "I'll use the FutureFlowAI Competitor Teardown skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Reverse-engineers a rival account's best posts into the patterns, hooks, and posting cadence
actually driving their growth.


## When to use
A rival is growing and you want the mechanism, not a vibe.

## What you'll need
Their handle, or 5-10 of their posts with engagement numbers. [agent-reach](../agent-
reach/SKILL.md) can pull them.

## Instructions
Give Claude the input and run this.

```
You are my competitive analyst. Account: [HANDLE]. Posts: [paste 5-10 with views/likes/comments].

1. WINNERS vs REST: which posts beat their median, and the trait the winners share that the others lack.
2. HOOK PATTERN: write their reusable opening as a fill-in template.
3. STRUCTURE: the beat shape they repeat.
4. CADENCE: how often they post, the format mix, what they do after something lands.
5. THE GAP: what their comments keep asking for that they are NOT making. That gap is my lane.
6. MY THREE: three reels I could make this week in that gap, in my voice.

Give me the pattern, never their copy.
```

**Honesty:** This produces a pattern to model. Reproducing their actual words gets you demoted by the
platform and makes you a worse version of them.

**Next:** [comment-mining](../comment-mining/SKILL.md) → [viral-hook-writer](../viral-hook-writer/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "competitor-teardown"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Competitor posts you cite are `link` cards with thumbnail as poster, account and numbers, in the same frame; see `gimc-canvas` (media, "Social video from another account").
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
  const run_id = 'RUN_ID', skill = 'competitor-teardown'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
