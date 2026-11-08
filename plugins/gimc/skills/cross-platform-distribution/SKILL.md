---
name: cross-platform-distribution
description: FutureFlowAI Cross-Platform Distribution skill. Use when an approved campaign, launch, research finding, or asset needs a deliberate plan across several social channels. Trigger phrases include "adapt this for LinkedIn and X", "where should this campaign go?", "make a distribution plan", "repurpose this without duplicating it", and "what is each platform's role?". Do not use this to invent a campaign strategy, bulk-post identical copy, or schedule a calendar; use campaign-brief for the strategic source, content-repurposer for asset transformations, and content-calendar for dates.
---

# Cross-Platform Distribution

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Cross-Platform Distribution skill", e.g. "I'll use the FutureFlowAI Cross-Platform Distribution skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Give one approved message different jobs across channels so distribution increases useful reach without turning into noisy duplication.

## 1. Start with a locked source

Ask for the approved campaign brief or source asset, its audience, claim boundary, action, timing, and available formats. If the message is not approved, stop and route to campaign-brief or positioning-audit. Do not turn an untested idea into a distribution plan.

## 2. Assign channel roles

For every proposed channel, state the audience context, what that channel should contribute, the format it can support, and the action it should earn. A channel may educate, create discussion, provide proof, reach partners, or send qualified traffic. Exclude channels with no clear role rather than filling a grid.

## 3. Adapt the mechanism, not the truth

Translate the same approved point into channel-native openings, structure, visual requirements, and conversation prompts. Keep the claim, proof, and action consistent. Note what cannot move across: private examples, unsupported performance claims, or assets with rights limited to another platform.

## 4. Sequence and measure

Order releases so early posts can inform later ones without waiting for a false certainty. Specify cadence, owner, links or UTMs where applicable, and the measurement that each channel is meant to influence. End with the decision that determines whether to extend, revise, or stop distribution.

## Hard rules

- Never paste the same post across platforms without adapting the format and context.
- Do not add channels merely because they are popular or have a large theoretical audience.
- Preserve every approved claim boundary and disclosure requirement.
- Do not use UTM links where the destination or tracking convention has not been approved; use utm-campaign-plan first.
- Keep paid, owned, creator, and community activity labelled separately.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| One asset becomes five duplicate posts | Give each channel a distinct audience job and angle. |
| Format is chosen before audience context | Start with the role, then choose the smallest suitable format. |
| A weak post is endlessly republished | Set a review point and change the message or stop based on evidence. |
| Links cannot be attributed | Create an approved UTM plan before publishing trackable links. |

## Where it sits

Use campaign-brief before this skill. Use linkedin-thought-leadership and x-thread-strategy for channel-specific execution, content-repurposer for asset changes, and content-calendar for the publishing schedule. Use social-analytics-report and launch-retrospective to assess the plan afterwards.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Publicatie", with `skill: "cross-platform-distribution"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Also put every dated post in the GIMC content calendar with `gimc.canvas_schedule_posts` (Amsterdam time, one call for the whole plan), following the `content-planning` skill; the document alone is not enough. Whether a post really goes live is in the answer (`at_platform`, `publish_note`): tell the user once, in one sentence.

  ```js
  async () => {
    const posts = [{ item_id: 'ITEM_ID', scheduled_at: 'YYYY-MM-DDTHH:MM', platforms: ['instagram'] }]
    await gimc.canvas_request_review({ item_ids: posts.map(p => p.item_id), comment: 'COMMENT' })
    const planned = await gimc.canvas_schedule_posts({ skill: 'SKILL', run_id: 'RUN_ID', posts })
    return { schedule_ids: planned.schedule.map(p => p.id), at_platform: planned.schedule.filter(p => p.at_platform).length, note: planned.schedule[0]?.publish_note, app_url: planned.app_url }
  }
  ```

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
  const run_id = 'RUN_ID', skill = 'cross-platform-distribution'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Publicatie', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
