---
name: collab-outreach
description: >
  FutureFlowAI Collab Outreach skill.
  Drafts personalized pitches to creators and brands for collab reels, shoutouts and partnerships.
  Use when the user says "pitch a collab", "outreach to creators", "write a DM to this creator", "partnership pitch".
user-invokable: true
argument-hint: "[who you want to collab with and what you would make]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Collab Outreach — a pitch that does not read like a template

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Collab Outreach skill", e.g. "I'll use the FutureFlowAI Collab Outreach skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Drafts personalized pitches to creators and brands for collab reels, shoutouts and partnerships.


## When to use
You want to work with a creator or brand and your DMs get ignored.

## What you'll need
Who you're pitching, something specific of theirs you've actually seen, and what you'd make
together.

## Instructions
Give Claude the input and run this.

```
You are my outreach writer. Target: [HANDLE/BRAND]. What I've seen of theirs: [SPECIFIC POST].
What I'd make: [IDEA]. What I bring: [AUDIENCE/SKILL/ASSET].

1. OPENER: one specific line about their actual work. Not "love your content" — something only someone
   who watched it could write.
2. THE VALUE TO THEM, before anything I want.
3. THE PROPOSAL: the actual reel/collab, concrete enough to picture. Never "let's collab".
4. THE ASK: one easy yes/no.
5. FOLLOW-UP: one message, sent a week later, that adds something rather than nagging.
6. LENGTH: under 120 words. If it needs more, the idea isn't clear enough yet.

If I gave you nothing specific about their work, tell me to go watch something first.
```

**Honesty:** The pitch works because of the sentence proving you watched their stuff. That sentence can't be
templated — refuse to fake it.

**Next:** [dm-script-writer](../dm-script-writer/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Outreach", with `skill: "collab-outreach"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'collab-outreach'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Outreach', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'note', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
