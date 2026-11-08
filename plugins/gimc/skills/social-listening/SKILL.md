---
name: social-listening
description: FutureFlowAI Social Listening skill. Use when you need to turn a supplied set of comments, DMs, reviews, community posts, or call notes into an evidence-backed picture of what people ask, resist, and repeat. Trigger phrases include "what are people saying about this?", "mine these comments", "what language should we use?", "find recurring objections", and "summarise this community feedback". Do not use this to scrape platforms, infer demographics, or write positioning from a handful of anecdotes; use agent-reach to collect public evidence first, audience-personas to group people, and positioning-audit to decide the message.
---

# Social Listening

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Social Listening skill", e.g. "I'll use the FutureFlowAI Social Listening skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turn evidence the operator already has into a usable demand map without pretending that a small sample represents the whole market.

## 1. Set the evidence boundary

Ask for the source material, where it came from, its date range, and the decision it should inform. Keep comments, DMs, reviews, support tickets, and interview notes labelled by source. If the user has only a claim about what people say, ask for the underlying text before analysing it.

## 2. Extract the signal without flattening it

For each item, capture the speaker's own wording, the situation they describe, the job they are trying to do, the obstacle, and any stated outcome. Keep a short supporting excerpt beside every finding so a reader can check it. Separate direct customer language from the operator's interpretation.

## 3. Cluster by decision-relevant theme

Group repeated evidence into questions, desired outcomes, objections, alternatives, proof requests, and vocabulary. Count only the supplied evidence. Mark a theme as isolated when it appears once, recurring when it appears across independent items, and unresolved when the context is too thin to tell.

## 4. Produce a demand map

Return a compact table with: theme, evidence count, representative wording, likely stage of the journey, confidence, and the next action. Next actions can be a research question, an FAQ update, an input for audience-personas, or a test for positioning-audit. Call out contradictions instead of averaging them away.

## Hard rules

- Do not infer age, location, income, intent, or sentiment beyond what the evidence says.
- Never present supplied comments as a representative market sample without a sampling basis.
- Preserve anonymisation: do not expose names, handles, private messages, or customer details unnecessarily.
- Do not manufacture quotes or improve a speaker's wording inside quotation marks.
- Treat volume as a clue, not proof of importance; a repeated complaint from one thread is not independent corroboration.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| A loud minority becomes "the audience" | State the sample and test the theme with a wider, independently collected set. |
| Themes mix people at different stages | Split the cluster by situation or journey stage before recommending an action. |
| The result is a pile of quotes | Convert each cluster into a decision, uncertainty, and next move. |
| The user wants public-platform research | Use agent-reach to gather allowed public sources, then return here to analyse them. |

## Where it sits

Use agent-reach before this skill when evidence must be collected. Use audience-personas after this skill to turn recurring patterns into grounded audience groups. Use positioning-audit after that when those groups need a message and social-proof-mining when the evidence should become approved proof.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "social-listening"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'social-listening'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
