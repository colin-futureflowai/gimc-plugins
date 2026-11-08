---
name: utm-campaign-plan
description: FutureFlowAI UTM Campaign Plan skill. Use when a campaign needs a consistent, approved way to label links so the team can distinguish sources and make later reporting possible. Trigger phrases include "plan our UTMs", "name campaign links", "make tracking links", "how should we tag creator links?", and "set up attribution for this launch". Do not use this to claim analytics access, create tracking without consent or policy review, or decide campaign strategy; use campaign-brief for the campaign source, paid-social-brief for media requirements, and social-analytics-report to interpret available data.
---

# UTM Campaign Plan

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI UTM Campaign Plan skill", e.g. "I'll use the FutureFlowAI UTM Campaign Plan skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Create a small, consistent link taxonomy that answers real reporting questions without turning every URL into ungoverned tracking noise.

## 1. Start with the reporting question

Ask what decision the data should support, which destinations are approved, which channels and partners are involved, what analytics system consumes the links, and what naming convention already exists. If no reporting owner or system is known, document that limitation before issuing links.

## 2. Define the controlled vocabulary

Set clear allowed values for source, medium, campaign, content, and term only when each has a decision use. Use human-readable, stable naming. Separate owned social, paid social, creators, partners, and experiments so later reporting does not blend unlike traffic.

## 3. Issue a link register

For every link, provide the destination, intended placement, UTM values, owner, start and end context, and approval status. Include examples and invalid examples. Reserve a process for changes so a creator or operator does not silently alter the taxonomy.

## 4. Validate before use and review after

Check that URLs resolve to the approved destination, parameters are encoded correctly, and the same source is not represented by several names. After the campaign, compare link usage against the register and record any taxonomy correction for the next brief.

## Hard rules

- Do not create tracking links for unapproved destinations or campaigns.
- Never put personal data, sensitive information, customer names, or private identifiers in UTM values.
- Do not treat UTM tags as proof of conversion or causation.
- Preserve existing analytics conventions unless an authorised owner approves a change.
- Keep affiliate, paid, organic, creator, and partner traffic distinguishable.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| Every team member invents names | Publish one controlled vocabulary and a shared register. |
| Parameters contain personal or sensitive data | Use a non-identifying campaign label and keep sensitive data out of URLs. |
| A short link hides an unverified destination | Validate the final redirect and approved landing page before sharing. |
| Reports blend creator and paid traffic | Assign separate medium/source values and preserve them in the register. |

## Where it sits

Use campaign-brief to establish the campaign and paid-social-brief or influencer-partnerships to identify placements. Use this skill before cross-platform-distribution goes live. Use social-analytics-report and launch-retrospective to interpret the resulting labelled traffic honestly.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "utm-campaign-plan"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'utm-campaign-plan'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Planning', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
