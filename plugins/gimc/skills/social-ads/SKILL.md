---
name: social-ads
description: >
  GIMC Social Ads skill. Reads the company's boosts and monthly ad budget in GIMC, proposes a boost of a published
  post (no money is committed: a person confirms the amount and starts it) and pauses a running boost. Use when the
  user says "boost deze post", "zet er budget op", "welke boosts lopen er", "hoeveel budget is er nog", "pauzeer de
  boost", "stop de advertentie", "promote this post", or when paid-social-brief proposes boosting a post.
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

A boost turns a post that went out through GIMC into an ad. It costs the company real money, so the rules are strict:
you **propose**, a person **decides**. A proposal commits nothing and calls no platform; in GIMC (Socials →
Advertenties) a person picks the ad account, confirms the amount and creates the boost (paused), and starts it in a
separate step. You may **pause** a running boost: that only stops spending.

With several GIMC workspaces, every `social_` call needs the workspace's `org_id` (from `canvas_get_context` or the
list in the error).

## 1. Look first

`social_list_boosts` gives:

- `budget`: the monthly cap (`monthly_cap`, 0 = boosting is off), what is committed this month and
  `remaining_this_month`. Cap 0: tell the user an admin sets a monthly cap first (Socials → Advertenties) and stop.
- `boosts`: status (`paused`, `active`, `completed`, …), budget, days and results (`metrics`: spend, impressions,
  clicks, …).
- `proposals`: proposals that still wait for a person. Don't propose the same post twice.

## 2. Propose a boost

Only a post that went out through GIMC can be boosted: a planning with `status` `published` (find its `schedule_id`
with `canvas_list_schedule`, or in `publication` on `canvas_get_item`) on an account from `social_list_accounts` with
the same platform.

One `social_propose_boost` call: `account_id`, `schedule_id`, `goal` (`engagement`, `traffic`, `awareness`,
`video_views`, `lead_generation`, `conversions`), `budget_amount` with `budget_type` (`daily` or `lifetime`), `days`
(1–90) and a one-line `note` on why (the numbers that make this post worth it).

- Stay inside `remaining_this_month`; the committed amount is per day × days, or the total. Without a budget from the
  user, propose small (for example 5 per day for 3 days) and say so.
- Pick the goal from what the user wants: more reach → `awareness`, more profile visits or clicks → `traffic`, more
  views of a video → `video_views`.
- Tell the user once: the proposal waits under Socials → Advertenties (`app_url`), nothing is spent until a person
  creates and starts it.

## 3. Pause

`social_pause_boost` with the `boost_id` of an `active` boost, when the user asks or when the numbers clearly go wrong
(spend without results). Say what you paused and why. Starting or resuming is always a person's work.

## 4. Put it on GIMC

Follow `gimc-canvas`. A proposal you make for a post that has a card: one short `note` on that card's board, frame
"Publicatie", with the goal, budget and reason, `skill: "social-ads"` and a `derived` line from the post card.
Results of a boost belong with the numbers of the post (the `social-insights` skill).

If a GIMC tool fails, say what failed in one sentence; never try to boost another way.
