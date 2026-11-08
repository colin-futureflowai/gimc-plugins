---
name: creator-outreach
description: FutureFlowAI Creator Outreach skill. Use when a specific creator has been selected and you need a concise, personal, permission-respecting first contact about a relevant collaboration. Trigger phrases include "write outreach to this creator", "contact these partners", "make a creator pitch", "how should I ask this creator?", and "follow up on this collaboration". Do not use this for mass cold outreach, automated DMs, undisclosed affiliate offers, or creator selection; use influencer-partnerships to assess fit and campaign-brief to establish the offer first.
---

# Creator Outreach

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Creator Outreach skill", e.g. "I'll use the FutureFlowAI Creator Outreach skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Write outreach that proves the operator has done the work: it is relevant to the creator, clear about the ask, and easy to decline.

## 1. Confirm permission and fit

Record the creator's supplied or public business contact route, the reason the collaboration is relevant, the approved offer, and the required disclosure or compensation terms. Do not contact a creator merely because they are in a large list. If the relationship is not mutually useful, stop before drafting.

## 2. Find one honest personalisation point

Use a specific, recent piece of work or audience need that the operator can accurately name. Explain the connection in one sentence without flattery theatre or invented familiarity. Never imply that the creator uses the product, knows the team, or endorsed anything.

## 3. Make the ask inspectable

State what the collaboration could involve, the creative latitude, compensation or consideration where approved, timeline, disclosure expectation, and the smallest next step. Link only to material the creator needs to evaluate the proposal. Make a no-pressure decline simple.

## 4. Follow up with restraint

Record the outreach date and one reasonable follow-up point. If there is no response, do not escalate through other personal channels, pressure the creator, or treat silence as consent. Update the partnership record with a factual outcome so future outreach does not repeat unwanted contact.

## Hard rules

- Never automate unsolicited replies, DMs, or follow-ups.
- Do not misrepresent the sender, relationship, compensation, product access, or urgency.
- Use only appropriate contact details supplied for business contact or already approved by the operator.
- Do not promise results, creative approval, or payment terms that are not authorised.
- Include required sponsorship, gifted, affiliate, or material-connection disclosures in the later brief, not as a hidden condition.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| The message could be sent to anyone | Add one verifiable relevance point or do not send it. |
| The ask hides the commercial terms | State the available terms clearly or say they are still being scoped. |
| Follow-up becomes harassment | Set one follow-up and close the record after no response. |
| Outreach starts before partnership fit | Return to influencer-partnerships and evaluate the collaboration first. |

## Where it sits

Use influencer-partnerships to decide whether and how to approach a creator. Use campaign-brief for the approved campaign facts and utm-campaign-plan for any attributable link. Use launch-retrospective to learn from completed collaborations, never from private creator data outside the agreed purpose.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Outreach", with `skill: "creator-outreach"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'creator-outreach'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Outreach', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'note', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
