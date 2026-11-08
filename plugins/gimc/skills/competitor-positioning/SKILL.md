---
name: competitor-positioning
description: FutureFlowAI Competitor Positioning skill. Use when you need to compare supplied competitor messaging with your approved product facts and find a credible point of difference. Trigger phrases include "how are competitors positioned?", "compare our message to theirs", "where are we different?", "audit these competitor pages", and "what should we not say?". Do not use this to make unverified claims about competitors, copy their language, or write the final brand message in isolation; use agent-reach to collect public sources, positioning-audit to decide your message, and campaign-brief to apply it.
---

# Competitor Positioning

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Competitor Positioning skill", e.g. "I'll use the FutureFlowAI Competitor Positioning skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Compare observable market messages without turning a competitor scan into a claim sheet or imitation exercise.

## 1. Define the comparison question

Ask which customer decision, category, and alternatives matter. Gather dated public pages, posts, pricing, documentation, or approved internal notes. Record source URLs or excerpts and dates. If a source cannot be verified, label it as an unverified lead rather than a fact.

## 2. Separate message from capability

For each alternative, map the audience it addresses, problem framing, promise, proof style, price or access signal if public, and visible limitations. Do not assume a marketing claim proves a feature, or that a missing page proves absence of a capability.

## 3. Compare against our real evidence

Map our approved product facts, customer language, proof, constraints, and category choice beside the alternatives. Look for a difference that is relevant to the audience and supported by something we can demonstrate. A useful difference may be a workflow, point of view, fit, or trade-off, not a superiority claim.

## 4. Produce positioning choices and guardrails

Return possible message territories with supporting evidence, risk, and the phrases or claims to avoid. Include the uncertainty that needs verification. Recommend one position to test through positioning-audit or campaign-brief, not a sweeping declaration that the market is settled.

## Hard rules

- Do not state or imply false facts about a competitor's features, pricing, customers, policies, or results.
- Attribute public observations to their source and date; products and pages change.
- Never copy distinctive competitor language, structure, or creative expression.
- Treat absence of evidence as unknown, not as proof a competitor cannot do something.
- Do not use comparative claims in public copy without legal and product approval.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| The scan becomes a feature checklist | Compare the customer decision, promise, proof, and trade-offs. |
| Competitor claims are repeated as facts | Quote or summarize the source as their stated message, with date. |
| The outcome is "we are better" | Name one relevant, demonstrable difference and its boundary. |
| The team copies a rival's framing | Return to our evidence and customer language before choosing a position. |

## Where it sits

Use agent-reach before this skill when public evidence must be gathered. Use audience-personas and social-listening to ensure the comparison matters to real people. Use positioning-audit to choose our message, then campaign-brief and cross-platform-distribution to apply it.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "competitor-positioning"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'competitor-positioning'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
