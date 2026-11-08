---
name: launch-retrospective
description: FutureFlowAI Launch Retrospective skill. Use after a social launch, campaign, creator collaboration, or distribution test has enough evidence to decide what should be repeated, changed, or stopped. Trigger phrases include "run a launch retro", "what did we learn from this campaign?", "postmortem this launch", "should we repeat this?", and "turn these results into next steps". Do not use this to assign blame, invent missing data, or write a live performance dashboard; use social-analytics-report for the in-flight metric read and campaign-brief to plan the next campaign.
---

# Launch Retrospective

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Launch Retrospective skill", e.g. "I'll use the FutureFlowAI Launch Retrospective skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turn a completed campaign into durable operational learning: what happened, why it may have happened, and the next smallest decision.

## 1. Reconstruct the intended plan

Bring together the original objective, audience, approved message, channel roles, budget or partner scope where supplied, timing, measurement plan, and decisions made during execution. Compare what actually shipped with what was planned. Separate a deliberate change from an accidental deviation.

## 2. Gather the evidence with limits attached

Use available performance data, qualitative feedback, partner notes, approvals, and execution records. State dates, metric definitions, missing data, and material confounders. Keep a timeline so the team does not attribute an outcome to a change that happened after it.

## 3. Distinguish facts from explanations

List observations first: what was published, what audiences did, and what tracking shows. Then list hypotheses about message, format, distribution, timing, destination, or process. Give each hypothesis a confidence level and the evidence that would strengthen or weaken it.

## 4. Commit to operational changes

Return a short set of keep, change, test, and stop decisions with owners and due dates. Update reusable inputs such as the campaign brief template, proof library, UTM vocabulary, or creator brief. Leave a clear record of unresolved questions so they are not rewritten as facts next time.

## Hard rules

- Do not use a retrospective to blame individuals, creators, or customers for an outcome.
- Never claim causation where the evidence only shows correlation.
- Include negative and inconclusive results; they are part of the learning.
- Do not compare campaigns with different objectives or measurement conditions as if they were identical.
- Separate process failure from message failure before prescribing a fix.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| The retro is a victory lap or blame document | Use a factual timeline, uncertainty, and future-oriented decisions. |
| A single metric explains the whole launch | Combine the original job, data boundary, qualitative evidence, and process record. |
| Lessons stay as vague observations | Turn each learning into a named change, test, or stop decision. |
| The same tracking issue returns next launch | Update the UTM or measurement workflow with a clear owner. |

## Where it sits

Use social-analytics-report for structured performance evidence during the launch. Use campaign-brief, paid-social-brief, influencer-partnerships, and utm-campaign-plan as source records. Feed confirmed lessons into the next campaign-brief rather than treating the retro as a standalone document.

## Take the input from GIMC

- Numbers of the company's own social accounts and posts: when GIMC is connected (a tool whose name ends in `gimc_execute`), read them with `gimc.social_get_insights` inside `gimc_execute` instead of asking the user to paste them, as the `social-insights` skill describes, and say which accounts and period you used. Pasted numbers still work when GIMC has no connected account or the user brings other numbers.

  ```js
  async () => {
    const i = await gimc.social_get_insights({ period_days: 30, sort: 'top', limit: 20 })
    const top = i.posts.slice(0, 5).map(p => ({ platform: p.platform, views: p.views, er: p.engagement_rate, text: (p.excerpt ?? '').slice(0, 60) }))
    const accounts = i.accounts.map(a => ({ account: a.username ?? a.platform, followers: a.followers, growth: a.followers_growth }))
    return { org_id: i.workspace?.org_id, period: i.period_days, has_accounts: i.has_accounts, totals: i.totals, accounts, top, posts_total: i.posts_total }
  }
  ```


## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "launch-retrospective"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'launch-retrospective'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
