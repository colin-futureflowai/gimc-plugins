---
name: profile-conversion-audit
description: FutureFlowAI Profile Conversion Audit skill. Use when an owned social profile needs an evidence-based audit of whether the right visitor can understand the account, trust it, and take the next approved step. Trigger phrases include "audit our Instagram profile", "fix our LinkedIn page", "why does this profile not convert?", "review this social bio", and "what should be clearer on our profile?". Do not use this to promise conversion lifts, change a platform account directly, or write a campaign message from scratch; use positioning-audit for the core message, social-proof-mining for approved proof, and campaign-brief for a launch-specific promise.
---

# Profile Conversion Audit

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Profile Conversion Audit skill", e.g. "I'll use the FutureFlowAI Profile Conversion Audit skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Review the profile as a visitor journey: immediate understanding, credible evidence, useful navigation, and one truthful next step.

## 1. Capture the profile as a visitor sees it

Ask for the profile URL or supplied screenshots, platform, audience context, current objective, linked destination, and constraints. Review the visible name, category, bio, links, pinned material, highlights or featured items, recent posts, and contact route only as they actually appear.

## 2. Test the first-ten-seconds questions

Can the right visitor tell who the account helps, what it helps with, why it is credible, and what to do next? Record missing information, competing actions, jargon, unsupported claims, inaccessible media, and mismatches between the profile and linked destination.

## 3. Recommend evidence-backed changes

Prioritise changes by clarity and risk: identity, audience situation, approved promise, proof, navigation, and action. Supply proposed copy only from approved facts and proof. Explain why each change addresses a visitor question and what must remain unchanged for disclosure, brand, or platform policy.

## 4. Define a reversible validation plan

State what can be changed by the profile owner, what needs approval, and how to observe the result using the data actually available. Change one meaningful element at a time where possible. Treat outcomes as evidence for the next iteration, not a promised uplift.

## Hard rules

- Do not invent follower counts, customer logos, results, features, availability, or verification status.
- Never promise a conversion-rate improvement from a profile edit.
- Keep all claims aligned with the approved landing destination and product reality.
- Do not recommend deceptive urgency, misleading links, or hidden disclosures.
- Respect platform constraints and accessibility for text, captions, images, and contact routes.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| The audit optimises the bio alone | Review the full visitor path: profile, proof, featured material, and destination. |
| A profile says everything to everyone | Choose the approved primary audience situation and one clear action. |
| Proof is added without permission | Use social-proof-mining and publish only cleared evidence. |
| Multiple changes hide what improved | Prioritise and validate one meaningful change at a time. |

## Where it sits

Use positioning-audit to settle the central message and social-proof-mining to source permitted proof. Use campaign-brief when a temporary campaign changes the profile's purpose. Use social-analytics-report to review available profile and link outcomes, then return here for the next iteration.

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

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "profile-conversion-audit"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'profile-conversion-audit'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
