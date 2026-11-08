---
name: best-time-scheduler
description: >
  FutureFlowAI Best-Time Scheduler skill.
  Recommends the posting times and weekly cadence that fit your audience's actual activity
  windows.
  Use when the user says "when should I post", "best time to post", "posting schedule", "how often should I post".
user-invokable: true
argument-hint: "[your audience and timezone, or your insights]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Best-Time Scheduler — a cadence you will actually keep

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Best-Time Scheduler skill", e.g. "I'll use the FutureFlowAI Best-Time Scheduler skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Recommends the posting times and weekly cadence that fit your audience's actual activity windows.


## When to use
You're posting whenever and wondering if timing is the problem.

## What you'll need
Your audience's timezones and, ideally, your insights showing when they're active.

## Instructions
Give Claude the input and run this.

```
You are my scheduler. Audience: [WHO/WHERE]. My insights: [paste activity data if you have it].
I can realistically post [N] times a day.

1. TIMES: the specific slots, from MY data if provided. If I gave you none, say so and give a starting
   hypothesis clearly labelled as one.
2. CADENCE: a weekly pattern I can actually sustain at [N]/day.
3. SLOT ROLES: which slot gets my strongest piece, which is for testing.
4. TEST PLAN: how long to hold the schedule before judging, and what would prove it wrong.
5. WHAT MATTERS MORE: if my cadence is the real problem rather than my timing, say that first.
```

**Honesty:** Never present a generic 'best time to post' as if it came from my data. Label a hypothesis as a
hypothesis.

**Next:** [content-calendar](../content-calendar/SKILL.md)

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

- Posting times, in this order. 1) Zernio's best times: call `gimc.social_get_insights` with `period_days: 90`, `limit: 50` and `best_times` set to the platform (once per platform you plan). It returns `best_times.slots` (Amsterdam weekday and time, average interactions, post count), best first; use slots with at least 3 posts and say "volgens Zernio, op basis van <posts_counted> posts". It gives `unavailable` (no account, no Analytics add-on) or too few posts: go to 2. 2) The company's own posts from that same answer (once more with `sort: "top"` when `posts_total` is above 50): per platform, convert each post's `published_at` to Amsterdam time and group by weekday and time block (06–11, 11–15, 15–18, 18–23); compare the median views (else reach) per group, leaving out posts younger than two days. Use your own data only with at least 12 posts on that platform and 3 per group you recommend; say how many posts and which period. 3) Too little data: start from this standard and write the slots as "op basis van algemene standaard, nog te weinig eigen data" (in the user's language): Instagram and Facebook Reels Tue–Fri 11:00–13:00 or 19:00–21:00; TikTok 18:00–21:00; LinkedIn Tue–Thu 08:00–10:00; YouTube Shorts 15:00–18:00; X 09:00–12:00. GIMC and Zernio have no data on when followers are online, only on how posts did; never present it as such. Give the result as concrete slots (`2026-11-10T10:00`, platform) for the week asked, ready for `content-planning`.

  ```js
  async () => {
    const platforms = ['instagram']
    const answers = await Promise.all(platforms.map(p => gimc.social_get_insights({ period_days: 90, limit: 50, best_times: p })))
    return { org_id: answers[0]?.workspace?.org_id, times: answers.map((a, n) => ({
      platform: platforms[n],
      unavailable: a.best_times?.unavailable ?? null,
      posts_counted: a.best_times?.posts_counted ?? 0,
      slots: (a.best_times?.slots ?? []).filter(s => s.post_count >= 3).map(s => `${s.weekday} ${s.time}`),
      own_posts: a.posts_total,
    })) }
  }
  ```


## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "best-time-scheduler"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'best-time-scheduler'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Planning', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
