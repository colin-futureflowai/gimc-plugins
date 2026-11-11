---
name: social-insights
description: >
  GIMC Social Insights skill. Reads the company's own social numbers from GIMC (connected accounts, followers,
  reach, views and engagement per post), what people comment, and the state of boosts and reply campaigns, and
  turns that into a short readout on the canvas. Use when the user says "hoe doen mijn posts", "inzichten",
  "cijfers van Instagram", "welke post deed het best", "groeien we", "how did my posts do",
  or when an analysis skill needs real numbers instead of pasted ones.
user-invokable: true
argument-hint: "[account or platform, period, question]"
license: MIT
metadata:
  author: GIMC
  version: "1.0.0"
  category: analytics
---

# Social insights in GIMC

> **GIMC skill.** Call it "the GIMC Social Insights skill" in the user's language.
>
> **GIMC tools run in code:** each `gimc.<tool>(…)` below is a call inside `gimc_execute` (find signatures with
> `gimc_search`); do a step in one execute and return only what you need. Examples: `gimc-canvas`, references/code-mode.md.

GIMC keeps the numbers of every connected social account and post (synced from the platforms once a day, and on
request). You read them, explain what they mean, and put a short readout on the canvas. You never invent a number: if
GIMC does not have it, say so.

Everything here is **reading**. Connecting an account, posting, replying in public, boosting and putting a reply
campaign live happen in GIMC by a person (or follow a person's approval); each answer has an `app_url` to send them
to the right screen.

## 1. Which accounts

`gimc.social_list_accounts` lists the connected accounts (`account_id`, platform, username, status). With several GIMC
workspaces every `social_` call needs the workspace's `org_id`: take it from `gimc.canvas_get_context` or from the list in
the error, and pass it on every next call.

- No accounts: tell the user in one sentence that a person connects them in GIMC under Socials → Accounts
  (`app_url`), and stop the GIMC part. Pasted numbers still work for the analysis itself.
- An account with status other than `active` (for example it needs to be reconnected): mention it once.
- With `refresh: true` GIMC asks the platforms again first. Do that only when the user wants the latest state.

## 2. The numbers

`gimc.social_get_insights` gives, for a period of 7, 30 or 90 days (or `0` for everything):

- `totals` for the whole company, and per account `followers` and `followers_growth` in the period;
- `posts`: per post platform, date, excerpt, link, media type, and impressions, reach, views, likes, comments, shares,
  saves and engagement rate. `sort: "top"` orders them by views; `limit` sets how many (10 by default, at most 50);
  `posts_total` says how many there are in the period.

In one execute, returning a summary and never every post (adjust `period_days`, `sort` and `limit`):

```js
async () => {
  const i = await gimc.social_get_insights({ period_days: 30, sort: 'top', limit: 20 })
  const top = i.posts.slice(0, 5).map(p => ({ platform: p.platform, at: p.published_at, views: p.views, er: p.engagement_rate, text: (p.excerpt ?? '').slice(0, 60) }))
  const accounts = i.accounts.map(a => ({ account: a.username ?? a.platform, followers: a.followers, growth: a.followers_growth }))
  return { org_id: i.workspace?.org_id, period: i.period_days, has_accounts: i.has_accounts, totals: i.totals, accounts, top, posts_total: i.posts_total }
}
```

Rules:

1. **Pick the period from the question** ("deze week" → 7, "deze maand" → 30, "dit kwartaal" → 90). Say which one you
   used.
2. **Fresh enough?** `last_synced_at` says when GIMC last fetched. Older than a day and the user asks about "now":
   call again with `refresh: true`. A `refresh_note` means it was refreshed shortly before or the platform did not
   answer: use the numbers you got and mention the note once.
3. **Empty but there are posts**: platforms deliver numbers with a delay (up to a day after posting). Say that, don't
   guess.
4. **Compare like with like**: a post against the company's own median, a reel against reels. Followers come once a
   day, so growth over 7 days is a small number; don't overstate it.
5. Posts with `is_external: true` were posted outside GIMC; they count just the same.

## 3. Boosts and comments

- Boost results and budget: `gimc.social_list_boosts` (proposing or pausing a boost: the `social-ads` skill).
- Comments, reply drafts and reply campaigns: the `social-engagement` skill.

## 4. Put it on GIMC

Follow `gimc-canvas` for the board itself. A readout is its own small run:

- Board "Analyses" (a question about the whole account) or "Mijn content" (the numbers of specific posts), in the
  folder the user works in. Frame "Analyse", `skill: "social-insights"`, one `run_id`.
- One `analysis` card with the readout: the question, the period and accounts, three to five findings with the numbers
  behind them, and one or two concrete next steps. Use a table only for a handful of posts, never the full list.
- Posts that were planned through GIMC get their numbers on their own card automatically (once a day); don't add them
  again with `gimc.canvas_record_stats`. Use that tool only for a post that has no card numbers from GIMC (posted elsewhere,
  or numbers the user gives you), on the card of that post.
- If the readout came from a card (a reel, a campaign), draw a `derived` line from that card to the readout.

## 5. Hand-offs

- The user wants a full report, an audit or a retrospective: run that analysis skill (for example
  `social-analytics-report`, `content-audit`, `launch-retrospective`) with the numbers from here as its input.
- The user wants a report on the canvas with charts, the posts themselves and numbers that GIMC fills in (week,
  month, best times, versus a competitor): the `marketing-report` skill.
- The numbers point to a posting time or a series: `best-time-scheduler` or `content-calendar`, then the
  `content-planning` skill to put it in the calendar.

If a GIMC tool fails, say what failed in one sentence and still answer with what you have.
