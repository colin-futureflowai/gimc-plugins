---
name: social-analytics-report
description: FutureFlowAI Social Analytics Report skill. Use when you need to turn supplied social performance data into a decision about what to keep, test, change, or stop. Trigger phrases include "report on this campaign", "what worked on social?", "analyse these post results", "make a weekly social report", and "what should we do next from these metrics?". Do not use this to invent data access, claim causation from a dashboard, or replace a campaign brief; use campaign-brief to define success before launch and launch-retrospective for the broader after-action review.
---

# Social Analytics Report

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Social Analytics Report skill", e.g. "I'll use the FutureFlowAI Social Analytics Report skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Make an honest operational report from the metrics the team actually has, with context, uncertainty, and a next decision.

## 1. Establish what the data can answer

Ask for the date range, channels, posts or campaigns, metric definitions, collection method, target or baseline, and any known changes in spend, audience, format, or distribution. If definitions differ across channels, do not silently compare the raw totals.

## 2. Check the data before interpreting it

Identify missing rows, partial reporting windows, duplicate posts, changed tracking, or metrics collected at different ages. Label the report's data boundary. Separate direct observations from hypotheses about why something happened.

## 3. Read outcomes against the intended job

Group results by the job each post or channel was assigned: awareness, education, discussion, qualified traffic, conversion assistance, or creator partnership learning. Compare like with like. Look for repeatable patterns in message, format, audience context, and distribution rather than choosing one winner by impressions.

## 4. Recommend the next smallest test

Return a decision table: observation, confidence, likely explanation, action, owner, and evidence needed next. State what not to conclude. Recommend a bounded test that preserves the campaign claim and measurement method so the next report can actually compare it.

## Hard rules

- Never claim causation from correlation or a single post.
- Do not compare unlike metrics, date windows, paid and organic activity, or posts at different maturity without saying so.
- Keep raw data, calculated rates, and interpretation distinguishable.
- Do not hide low-performing or incomplete data to make a narrative look cleaner.
- Never fabricate access to native analytics, ad accounts, or conversion systems.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| A high-impression post is declared successful | Judge it against the job and downstream evidence it was intended to influence. |
| A report lists metrics but makes no decision | End with one keep, one test, one change, and their owners. |
| Platform totals are compared as if identical | Normalize the question or report each channel separately. |
| The team changes five things at once | Choose the smallest observable test and hold other conditions steady where possible. |

## Where it sits

Use campaign-brief and utm-campaign-plan before publishing so the report has a decision and attribution plan. Use this skill during a campaign for operating reviews. Use launch-retrospective after the reporting window to combine results, qualitative evidence, and process lessons.

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

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "social-analytics-report"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'social-analytics-report'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
