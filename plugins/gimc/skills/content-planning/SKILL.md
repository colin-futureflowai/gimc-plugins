---
name: content-planning
description: >
  GIMC Content Planning skill. Puts posts into the GIMC content calendar and follows them to the platform: schedules
  canvas cards on dates and platforms, moves or cancels them, and reads what is planned and what went live. Use when
  the user says "plan these posts", "schedule this", "zet het in de contentkalender", "inplannen", "verzet de post",
  "annuleer de planning", "wat staat er gepland", or when content-calendar, best-time-scheduler or series-planner
  produced dated posts.
user-invokable: true
argument-hint: "[which cards or board, and when]"
---

# Content planning in GIMC

You put dated posts into the GIMC content calendar and follow them to the platform. The user sees them at
`/marketing/kalender` (month, week, filter per platform, drag to move) and as a layer in their agenda. Follow
`gimc-canvas` for the board itself; the short calendar rules are in its reference `references/scheduling.md`.

**Be honest about posting.** A post goes to the platform only when the company connected an account for every chosen
platform **and** the company's rule lets it through (see 2). Then the answer has `at_platform: true` and an empty
`publish_note`, and the platform posts it at the chosen time. Otherwise it stays in the calendar and `publish_note` says
why. Tell the user once, in one sentence. Say a post "will go live" only when `at_platform` is true; never say "is
published" before it is.

## 1. Find the cards

- The user names a board ("het bord TEST-Lancering"): `canvas_get_context`, then `canvas_list_boards` and
  `canvas_list_items` on that board. Pick the cards the user means (for "de 3 posts": the post-like cards — social
  posts, reels, carousels, images — not frames, notes or analyses), in board order (top to bottom, left to right).
- The posts do not exist yet: make them first as cards (follow `gimc-canvas`; a social post card has
  `data.platform` and `data.caption`), then schedule those cards.
- Never schedule a card from another workspace or a card you cannot find; ask instead.

## 2. Approval: who may put a post at the platform

Each company has one rule, `publish_policy` (in the answer of `social_list_accounts`, set by an admin under Socials →
Publiceren):

| `publish_policy` | Who puts a post at the platform |
|---|---|
| `approved` (default) | a person, or you for a card a person approved |
| `human` | only a person; your posts wait in the calendar |
| `approval_required` | anyone, but only for an approved card |

A card's approval is in `review` on `canvas_get_item` and `canvas_list_items` (`status` `approved`, `requested` or
`changes_requested`; `stale: true` means the card changed after the decision and needs a new approval). You can ask
for approval, never give it.

- The cards are not approved (or stale) and the rule is `approved` or `approval_required`: call
  `canvas_request_review` with their `item_ids` and a one-line `comment` (what, where, when), then schedule them
  anyway. They wait in the calendar; tell the user they go to the platform once someone approves the card.
- Under `human` you schedule and a person takes it from there; no need to ask for approval unless the user wants it.

## 3. Pick the times

- Amsterdam time, written without offset: `2026-11-12T10:00`. Only future times.
- "Volgende week" = Monday to Sunday of the coming week. Spread posts over different days unless the user says
  otherwise; default posting time 10:00, or the times `best-time-scheduler` gave.
- Check what is already planned first: `canvas_list_schedule` with `from`/`to` for that week, and avoid two posts on
  the same platform at the same hour.

## 4. Schedule

One `canvas_schedule_posts` call for all posts of the run (max 50, all or nothing):

```json
{ "posts": [
    { "item_id": "<card>", "scheduled_at": "2026-11-10T10:00", "platforms": ["instagram"] },
    { "item_id": "<card>", "scheduled_at": "2026-11-12T10:00" }
  ],
  "skill": "content-planning", "run_id": "<this run>" }
```

- `platforms` may be left out when the card has a platform; otherwise give it (`instagram`, `linkedin`, `facebook`,
  `tiktok`, `x`, `youtube`).
- `caption` defaults to the card's caption or text; give one only when the user wrote a different caption. An
  approval covers the card's own text: a different caption waits for a person. Change the card instead and ask again.
- An error names the post (`posts.1: …`) and the cause. A card that is already scheduled: use
  `canvas_reschedule_post` with the `schedule_id` from the error instead.

## 5. Approved later: put it at the platform

When the inbox (`canvas_inbox`, or `include_inbox` in the context call) lists a card under `reviews` as approved, or the
user says a card is approved, and its planning is not at the platform yet (`publication.schedule.at_platform` is
false on `canvas_get_item`): call `canvas_reschedule_post` with only its `schedule_id`. Without changes GIMC tries the
platform again; check `at_platform` in the answer and tell the user. "Changes requested" is work: change the card as
the comment asks, then `canvas_request_review` again.

## 6. Move, cancel, follow

- Move: `canvas_reschedule_post` with `schedule_id` and the new `scheduled_at` (the old time stays in the history).
  Text or platforms of a post that is already at the platform only a person changes.
- Cancel: `canvas_cancel_scheduled_post`. Nothing is deleted; the card can be scheduled again later.
- Find a `schedule_id` with `canvas_list_schedule` (by `board_id`, `item_ids` or a date window).
- Where a card stands after scheduling: `publication` on `canvas_get_item` (status, at the platform, links per
  platform, boosts, reply campaigns). Numbers after posting: the `social-insights` skill.

## 7. Report

Call `canvas_list_schedule` for the window you planned and tell the user in a short list: day, time, platform, card
title, and per post whether it is at the platform or waiting (and for what: approval, a person, a connection). Add that
they can see and drag everything in the content calendar.

If a GIMC tool fails, say what failed in one sentence and still give the user the plan as a list.
