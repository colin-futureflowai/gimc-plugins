---
name: x-thread-strategy
description: FutureFlowAI X Thread Strategy skill. Use when a real lesson, analysis, launch explanation, or resource needs a structured X thread rather than a single post. Trigger phrases include "make this an X thread", "outline a thread", "break this down for X", "turn this research into a thread", and "what is the thread angle?". Do not use this to manufacture hot takes, publish unverified breaking news, or create a long-form blog post; use content-research for the source material, campaign-brief for a coordinated launch, and linkedin-thought-leadership for a LinkedIn-native argument.
---

# X Thread Strategy

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI X Thread Strategy skill", e.g. "I'll use the FutureFlowAI X Thread Strategy skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Build a thread that rewards a reader for continuing: one defensible point, a clear sequence, and evidence they can evaluate.

## 1. Choose the thread-worthy claim

Ask for the source material, the audience's immediate question, the claim that can be defended, and what the reader should do with it. A thread needs progression: a process, comparison, analysis, or lesson with several necessary steps. If one post can carry it, do not inflate it.

## 2. Create the argument spine

Write the opening claim, why it matters, the sequence of evidence or steps, the limitation, and the ending action. Each post must move the reader forward; eliminate setup that merely repeats the hook. Keep links, screenshots, and examples attached to the exact claim they support.

## 3. Make each post independently legible

Use direct language, one idea per post, and enough context that a quote-post does not distort the point. Put caveats near the claim they qualify. If a post depends on data, name the source and date rather than implying current truth.

## 4. Publish with an evidence loop

Plan the first reply only when it adds a useful resource, correction policy, or data source. Track saves, qualified replies, and link outcomes appropriate to the campaign rather than treating impressions as proof. Feed recurring confusion back to social-listening or revise the next thread.

## Hard rules

- Do not invent data, quotes, experiments, screenshots, or access to a platform.
- Never split a weak idea into a thread to simulate substance.
- Do not promise a result the source cannot support.
- Avoid engagement bait, pile-ons, and commentary on individuals without verifiable context.
- Preserve disclosure and attribution for partner, customer, or sponsored material.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| The thread repeats its hook ten times | Give every post a distinct evidentiary or instructional job. |
| Context disappears in quote-posts | Include a precise claim and caveat in each standalone post. |
| The thread chases a fast-moving event | Verify the source and timestamp or leave it as a question, not a fact. |
| The ending is a forced CTA | Close with the one useful next action the evidence supports. |

## Where it sits

Use content-research, social-listening, or campaign-brief to supply an approved source. Use cross-platform-distribution to define X's role within a wider plan. Use social-analytics-report to review outcomes and content-repurposer only after the original thread has a clear lesson worth adapting.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Publicatie", with `skill: "x-thread-strategy"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'x-thread-strategy'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Publicatie', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
