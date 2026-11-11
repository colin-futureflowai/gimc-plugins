---
name: content-audit
description: >
  FutureFlowAI Content Audit skill.
  Reviews your last 30 posts to find what is worth doubling down on, what is dead weight, and the
  gaps to fill.
  Use when the user says "audit my content", "what is working on my account", "what should I stop posting", "review my last 30 posts".
user-invokable: true
argument-hint: "[paste your recent post list with their numbers]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Audit — what to double down on, and what to stop

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Content Audit skill", e.g. "I'll use the FutureFlowAI Content Audit skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Reviews your last 30 posts to find what is worth doubling down on, what is dead weight, and the
gaps to fill.


## When to use
Before making more, work out what to stop.

## What you'll need
Your last 30 posts with views, saves, comments and shares. An Instagram connector (e.g. Composio) or your
Instagram insights export.

## Instructions
Give Claude the input and run this.

```
You are my content analyst. Here are my last 30 posts with their numbers: [paste].

1. MEDIAN FIRST: state my median views/saves so everything is judged against ME, not someone else.
2. OUTLIERS: the posts that beat it, and the trait they share.
3. DEAD WEIGHT: formats or topics I keep making that consistently underperform. Name them plainly.
4. BY TRAIT: score hook style, length, format and topic, each with its real multiple vs median.
5. STOP / KEEP / TEST: three short lists.
6. NEXT FIVE: five posts to make, each justified by a number above.

If a pattern isn't in the data, say "not enough signal" rather than guessing.
```

**Honesty:** Every multiple must come from the numbers pasted in. No estimated figures, and no advice that
contradicts my own data.

**Next:** [content-pillar-builder](../content-pillar-builder/SKILL.md) → [content-calendar](../content-calendar/SKILL.md)

## Take the input from GIMC

- Numbers of the company's own social accounts and posts: when GIMC is connected (a tool whose name ends in `gimc_execute`), read them with `gimc.social_get_insights` inside `gimc_execute` instead of asking the user to paste them, as the `social-insights` skill describes, and say which accounts and period you used. Pasted numbers still work when GIMC has no connected account or the user brings other numbers. More blocks on request with `include` (`growth`, `engagement`, `formats`, `online`, `audience`, `stories`): each has a `status`; on `no_data` give its `reason` in plain words (for example "Instagram geeft dit pas vanaf 100 volgers."), never a 0. Live analyses (content decay, posting frequency, a competitor by handle) come from `gimc.social_get_analysis`, also with a status and reason. When the result is an HTML card on the canvas, its numbers, charts and post cards may be canvas code (`live-*` tags that GIMC fills with real data; see the `marketing-report` skill and `gimc.canvas_code`), so no number is typed by hand.

  ```js
  async () => {
    const i = await gimc.social_get_insights({ period_days: 30, sort: 'top', limit: 20, include: ['growth', 'engagement', 'formats'] })
    const top = i.posts.slice(0, 5).map(p => ({ platform: p.platform, views: p.views, er: p.engagement_rate, text: (p.excerpt ?? '').slice(0, 60) }))
    const accounts = i.accounts.map(a => ({ account: a.username ?? a.platform, followers: a.followers, growth: a.followers_growth }))
    const blocks = Object.fromEntries(['growth', 'engagement', 'formats'].map(b => [b, i[b]?.status]))
    return { org_id: i.workspace?.org_id, period: i.period_days, has_accounts: i.has_accounts, totals: i.totals, accounts, top, posts_total: i.posts_total, blocks, profile_views: i.engagement?.totals?.profile_views ?? null }
  }
  ```


## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "content-audit"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'content-audit'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
