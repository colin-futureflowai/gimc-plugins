---
name: paid-social-brief
description: FutureFlowAI Paid Social Brief skill. Use when an approved social campaign needs a media-ready brief for paid distribution, creative testing, and measurement. Trigger phrases include "brief paid social", "plan this ad test", "turn this campaign into paid", "what should we test in ads?", and "make a Meta or LinkedIn ad brief". Do not use this to claim ad-account access, launch spend, bypass platform policy, or invent targeting capabilities; use campaign-brief for the source strategy, utm-campaign-plan for tracking conventions, and social-analytics-report for results interpretation.
---

# Paid Social Brief

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Paid Social Brief skill", e.g. "I'll use the FutureFlowAI Paid Social Brief skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Translate an approved campaign into testable paid-social decisions without pretending media execution or platform access exists.

## 1. Confirm the approved foundation

Ask for the campaign objective, offer, claim boundary, landing destination, proof, audience evidence, budget range if supplied, policy constraints, and the owner who can actually configure the platform. If the offer or landing page is unapproved, do not write ads around it.

## 2. Define the test, not a prediction

State the hypothesis, audience context, creative angle, desired action, measurement event, and what would count as useful learning. Separate audience hypotheses from targeting settings because platform availability and policy can change. Keep the number of simultaneous variables small enough to interpret.

## 3. Specify creative and destination requirements

List the approved message variants, proof assets, disclosures, format needs, destination expectation, exclusions, and prohibited claims. Tie each creative to a hypothesis. Note where a native platform review or legal approval is required rather than claiming it is complete.

## 4. Set guardrails for operation and review

Provide the budget and pacing decisions only when supplied by an authorised owner; otherwise mark them open. Define launch checks, reporting window, stop or revise conditions, and the exact data needed for a review. Ensure tracked links follow the agreed UTM plan.

## Hard rules

- Do not claim access to ad accounts, audiences, pixels, spend, or platform features you do not have.
- Never target or exclude sensitive groups in a way that violates law, policy, or the approved brief.
- Do not use unsubstantiated performance, health, financial, or customer-result claims.
- Do not optimize solely for cheap clicks when the campaign's intended action is elsewhere.
- Keep organic and paid results labelled separately in every report.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| A media brief is only ad copy | Define the hypothesis, audience context, measurement, and decision threshold. |
| Too many variables change at once | Limit the first test to the few variables needed to answer one question. |
| Creative promises more than the destination delivers | Align every claim with the approved landing experience and proof. |
| Results cannot be attributed | Create the UTM and measurement plan before launch. |

## Where it sits

Use campaign-brief and positioning-audit before this skill. Use utm-campaign-plan to make link naming consistent and cross-platform-distribution to distinguish paid from owned work. Use social-analytics-report for operating decisions and launch-retrospective for the full review.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "paid-social-brief"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- If the brief recommends boosting a post that went out through GIMC: propose it in GIMC with `gimc.social_propose_boost`, as the `social-ads` skill describes. A proposal spends nothing; a person confirms the amount and starts it.

  ```js
  async () => {
    const today = new Date(), from = new Date(today.getTime() - 60 * 86400000)
    const [b, s, a] = await Promise.all([
      gimc.social_list_boosts({}),
      gimc.canvas_list_schedule({ from: from.toISOString().slice(0, 10), to: today.toISOString().slice(0, 10) }), // max 62 days
      gimc.social_list_accounts({}),
    ])
    if (!b.budget.monthly_cap) return { cap: 0, app_url: b.app_url }
    const post = s.schedule.filter(p => p.status === 'published' && p.platforms.includes('instagram')).at(-1)
    if (!post) return { no_published_post: true }
    if (b.proposals.some(p => p.schedule_id === post.id)) return { already_proposed: post.id }
    const account = a.accounts.find(x => x.platform === 'instagram' && x.status === 'active')
    const r = await gimc.social_propose_boost({ account_id: account.account_id, schedule_id: post.id, goal: 'engagement', budget_amount: 5, budget_type: 'daily', days: 3, note: 'NOTE' })
    return { proposal_id: r.proposal_id, committed: r.committed_amount, remaining: r.remaining_this_month, app_url: r.app_url }
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
  const run_id = 'RUN_ID', skill = 'paid-social-brief'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Planning', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
