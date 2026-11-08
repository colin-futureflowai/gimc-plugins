---
name: social-ads
description: >
  GIMC Social Ads skill. Reads the company's boosts and monthly ad budget in GIMC, proposes a boost of a published
  post (no money is committed: a person confirms the amount and starts it) and pauses a running boost. Use when the
  user says "boost deze post", "zet er budget op", "welke boosts lopen er", "hoeveel budget is er nog", "pauzeer de
  boost", "stop de advertentie", "promote this post", "stel een boost voor", "maak een boostvoorstel", or when paid-social-brief proposes boosting a post.
user-invokable: true
argument-hint: "[post, budget, goal or boost]"
license: MIT
metadata:
  author: GIMC
  version: "1.0.0"
  category: ads
---

# Social ads in GIMC

> **GIMC skill.** Call it "the GIMC Social Ads skill" in the user's language.
>
> **GIMC tools run in code:** each `gimc.<tool>(…)` below is a call inside `gimc_execute` (find signatures with
> `gimc_search`); do a step in one execute and return only what you need. Examples: `gimc-canvas`, references/code-mode.md.

A boost turns a post that went out through GIMC into an ad. It costs the company real money, so the rules are strict:
you **propose**, a person **decides**. A proposal commits nothing and calls no platform; in GIMC (Socials →
Advertenties) a person picks the ad account, confirms the amount and creates the boost (paused), and starts it in a
separate step. You may **pause** a running boost: that only stops spending.

With several GIMC workspaces, every `social_` call needs the workspace's `org_id` (from `gimc.canvas_get_context` or the
list in the error).

## 1. Look first

`gimc.social_list_boosts` gives:

- `budget`: the monthly cap (`monthly_cap`, 0 = boosting is off), what is committed this month and
  `remaining_this_month`. Cap 0: tell the user an admin sets a monthly cap first (Socials → Advertenties) and stop.
- `boosts`: status (`paused`, `active`, `completed`, …), budget, days and results (`metrics`: spend, impressions,
  clicks, …).
- `proposals`: proposals that still wait for a person. Don't propose the same post twice.

## 2. Propose a boost

Only a post that went out through GIMC can be boosted: a planning with `status` `published` (find its `schedule_id`
with `gimc.canvas_list_schedule`, or in `publication` on `gimc.canvas_get_item`) on an account from `gimc.social_list_accounts` with
the same platform.

One `gimc.social_propose_boost` call: `account_id`, `schedule_id`, `goal` (`engagement`, `traffic`, `awareness`,
`video_views`, `lead_generation`, `conversions`), `budget_amount` with `budget_type` (`daily` or `lifetime`), `days`
(1–90) and a one-line `note` on why (the numbers that make this post worth it).

- Stay inside `remaining_this_month`; the committed amount is per day × days, or the total. Without a budget from the
  user, propose small (for example 5 per day for 3 days) and say so.
- Pick the goal from what the user wants: more reach → `awareness`, more profile visits or clicks → `traffic`, more
  views of a video → `video_views`.
- Tell the user once: the proposal waits under Socials → Advertenties (`app_url`), nothing is spent until a person
  creates and starts it.

In one execute (fill in platform, goal, budget, days and note; it stops on a cap of 0, no published post or an open
proposal for that post):

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

## 3. Pause

`gimc.social_pause_boost` with the `boost_id` of an `active` boost, when the user asks or when the numbers clearly go wrong
(spend without results). Say what you paused and why. Starting or resuming is always a person's work.

## 4. Put it on GIMC

Follow `gimc-canvas`. A proposal you make for a post that has a card: one short `note` on that card's board, frame
"Publicatie", with the goal, budget and reason, `skill: "social-ads"` and a `derived` line from the post card.
Results of a boost belong with the numbers of the post (the `social-insights` skill).

If a GIMC tool fails, say what failed in one sentence; never try to boost another way.
