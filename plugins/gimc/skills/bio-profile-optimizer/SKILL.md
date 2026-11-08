---
name: bio-profile-optimizer
description: >
  FutureFlowAI Bio & Profile Optimizer skill.
  Rewrites your bio, name field and pinned-reel order to convert profile visits into follows and
  clicks.
  Use when the user says "rewrite my bio", "optimize my profile", "what should my bio say", "which reels should I pin".
user-invokable: true
argument-hint: "[your current bio and what you want visitors to do]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Bio & Profile Optimizer — the profile is the conversion page

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Bio & Profile Optimizer skill", e.g. "I'll use the FutureFlowAI Bio & Profile Optimizer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Rewrites your bio, name field and pinned-reel order to convert profile visits into follows and
clicks.


## When to use
Reels are getting views but visits aren't turning into follows.

## What you'll need
Your current bio, name field, link and pinned posts.

## Instructions
Give Claude the input and run this.

```
You are my profile strategist. Current bio: [paste]. Name field: [paste]. Link: [paste].
Pinned: [list]. I want visitors to: [follow / click / DM].

1. NAME FIELD: this is INDEXED by search — my actual name usually shouldn't be there. Give me 3 options
   built on what people search for.
2. BIO: line 1 = who it's for + what they get. Line 2 = proof. Line 3 = the ask. Above the fold.
3. LINK: one destination matched to the traffic I actually have.
4. PINNED THREE, in order: proof first, then the offer, then the best teach. Say which of my posts fits each.
5. THE 3-SECOND TEST: what a visitor concludes in three seconds. If that isn't what I want, fix the bio again.
```

**Honesty:** Reels earn the visit; the profile decides the follow. Don't write a clever bio that doesn't say
who it's for.

**Next:** [cta-writer](../cta-writer/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Profiel", with `skill: "bio-profile-optimizer"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'bio-profile-optimizer'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Profiel', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'note', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
