---
name: campaign-brief
description: FutureFlowAI Campaign Brief skill. Use when a social campaign needs a decision-ready brief before anyone writes posts, books creators, or spends budget. Trigger phrases include "brief this launch", "turn this into a campaign plan", "what should this campaign say?", "make a social brief", and "align the team on this promotion". Do not use this for a content calendar, a single caption, or an unapproved product claim; use content-calendar for scheduling, caption-and-hashtags for a post, and positioning-audit when the core message is still unclear.
---

# Campaign Brief

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Campaign Brief skill", e.g. "I'll use the FutureFlowAI Campaign Brief skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Create the shared decision document that keeps a social campaign focused on one real outcome, one truthful promise, and clear channel roles.

## 1. Confirm the business decision

Ask what must change, by when, and for whom. Name one primary outcome such as qualified sign-ups, waitlist intent, event attendance, product education, or retained attention. Record the measurement source before choosing a vanity metric.

## 2. Establish the claim boundary

Collect the approved offer, audience evidence, product facts, proof, limitations, and required legal or brand constraints. Separate facts the team can say now from hypotheses the campaign may test. If proof is missing, make the campaign ask a question or demonstrate a workflow rather than assert an outcome.

## 3. Define the campaign spine

Write the audience situation, the useful tension, the promise, the proof available, and the action requested. Add the explicit non-goal so the team does not turn every campaign into a broad awareness exercise. Give each channel a role rather than copying one message everywhere.

## 4. Turn the brief into execution decisions

Provide message pillars, approved examples, prohibited claims, required assets, owners, timing, measurement events, and review gates. Include open questions with a named owner. The output should let a writer, creator manager, and operator make consistent choices without inventing strategy in the comments.

## Hard rules

- Do not set a target or promise that has no measurement source or proof.
- Keep one primary action; secondary actions must not compete with it.
- Do not claim results, integrations, customer stories, or availability that the product team has not approved.
- Distinguish an experiment from a commitment to customers.
- Name the audience context, not an assumed demographic stereotype.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| The brief is a list of deliverables | Start with the decision, audience situation, promise, proof, and action. |
| Every channel gets identical work | Give channels complementary jobs based on their format and audience context. |
| Measurement happens after launch | Specify the event, owner, and reporting cadence in the brief. |
| Claims outrun evidence | Narrow the promise, add a demonstration, or wait for approved proof. |

## Where it sits

Use social-listening, audience-personas, and positioning-audit to supply the evidence and message before this skill. Use cross-platform-distribution, paid-social-brief, influencer-partnerships, and content-calendar to execute it. Use launch-retrospective once the campaign has enough evidence to learn from.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "campaign-brief"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'campaign-brief'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Planning', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
