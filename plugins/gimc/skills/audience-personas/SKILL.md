---
name: audience-personas
description: FutureFlowAI Audience Personas skill. Build evidence-led social audience personas from customer interviews, comments, reviews, or CRM notes.
user-invokable: true
argument-hint: "[paste customer evidence]"
license: MIT
metadata: { author: Ootto, version: "1.0.0", category: marketing }
---
# Audience Personas

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Audience Personas skill", e.g. "I'll use the FutureFlowAI Audience Personas skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turn supplied customer evidence into grounded audience segments. Use it when a marketer has interviews, comments, reviews, or CRM notes and needs to decide who a message is for. It is not for inventing demographics, market size, or personas from intuition.

## 1. Establish the evidence

Ask for the source, date range, decision owner, offer, and desired audience action. Keep direct quotes separate from summaries and name material that is missing.

## 2. Group observable patterns

Cluster the evidence by job-to-be-done, desired outcome, objection, exact language, and trigger. Cite the source for each cluster. Do not manufacture a segment just to reach a round number.

## 3. Produce a usable segment

For each evidence-backed segment, return its job, language, objections, useful message angles, and the question it is already asking. Label confidence and unresolved questions.

## 4. Hold claims for review

Flag any demographic statement, outcome claim, or customer quote that needs approval before public use.

## Hard rules

- Do not infer demographics, income, identity, or intent not present in the source.
- Do not turn one loud comment into a market-wide claim.
- Keep observed language distinct from suggested copy.
- If evidence is thin, ask for more comments, reviews, or interviews.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Generic personas | source has no concrete language | ask for verbatim comments or interviews |
| False certainty | inference appears as fact | label it as a hypothesis |
| Too many segments | minor differences treated as groups | merge around the shared job-to-be-done |

## Where it sits

`social-listening` gathers recurring conversation → **audience-personas** groups it → `positioning-audit` turns it into a message.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "audience-personas"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'audience-personas'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
