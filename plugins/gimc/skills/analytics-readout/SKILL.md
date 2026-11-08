---
name: analytics-readout
description: >
  FutureFlowAI Analytics Readout skill.
  Reads your reel insights and explains in plain English what to make more of and what to stop —
  no jargon.
  Use when the user says "explain my analytics", "what do my numbers mean", "read my insights", "how did this reel do".
user-invokable: true
argument-hint: "[paste your insights, or connect the MCP]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Analytics Readout — your numbers, in plain English

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Analytics Readout skill", e.g. "I'll use the FutureFlowAI Analytics Readout skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Reads your reel insights and explains in plain English what to make more of and what to stop — no
jargon.


## When to use
You're looking at insights and can't tell what to do differently.

## What you'll need
Your reel or account insights. An Instagram connector (e.g. Composio) can pull them directly.

## Instructions
Give Claude the input and run this.

```
You are my analyst. Here are my insights: [paste]. My goal right now is: [reach/saves/leads/follows].

1. THE METRIC THAT MATTERS for that goal — and tell me which numbers to stop staring at.
2. VS MY MEDIAN: every figure judged against my own baseline, not anyone else's screenshot.
3. WHERE IT BROKE: if retention data exists — a drop at ~3s is a hook problem, at ~12s a middle problem,
   at the end a CTA problem. Name which.
4. TWO ACTIONS. Not twelve. The two that would move the metric in point 1.
5. WHAT I CAN'T TELL from this data, stated plainly.

Every number must come from what I pasted. If something isn't there, say so — do not estimate.
```

**Honesty:** No invented figures, no industry benchmarks presented as my data. 'Not enough signal' is a valid
answer.

**Next:** [content-audit](../content-audit/SKILL.md)

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

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "analytics-readout"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'analytics-readout'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
