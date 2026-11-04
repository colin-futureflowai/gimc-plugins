---
name: content-planning
description: >
  GIMC Content Planning skill. Puts a posting plan into the GIMC content calendar: schedules canvas cards (reels,
  posts, carousels, any card) on dates and platforms, moves or cancels scheduled posts, and reads what is planned.
  Use when the user says "plan these posts", "schedule this", "zet het in de contentkalender", "plan in voor volgende
  week", "inplannen", "verzet de post", "annuleer de planning", "wat staat er gepland", "posting schedule in GIMC",
  or when content-calendar, best-time-scheduler or series-planner produced dated posts.
user-invokable: true
argument-hint: "[which cards or board, and when]"
---

# Content planning in GIMC

You put dated posts into the GIMC content calendar. The user sees them at `/marketing/kalender` (month, week, filter per
platform, drag to move) and as a layer in their agenda. Follow `gimc-canvas` for everything on the board itself; the
short rules for the calendar are in its reference `references/scheduling.md`.

**Be honest about posting.** GIMC is not connected to the social platforms yet. Scheduling puts a post in the
calendar; nothing is published or sent. Every answer has `publish_note` ("Posten volgt zodra Instagram gekoppeld
is."). Tell the user once, in one sentence. Never say a post "will go live" or "is published".

## 1. Find the cards

- The user names a board ("het bord TEST-Lancering"): `canvas_get_context`, then `canvas_list_boards` and
  `canvas_list_items` on that board. Pick the cards the user means (for "de 3 posts": the post-like cards — social
  posts, reels, carousels, images — not frames, notes or analyses), in board order (top to bottom, left to right).
- The posts do not exist yet: make them first as cards (follow `gimc-canvas`; a social post card has
  `data.platform` and `data.caption`), then schedule those cards.
- Never schedule a card from another workspace or a card you cannot find; ask instead.

## 2. Pick the times

- Amsterdam time, written without offset: `2026-11-12T10:00`. Only future times.
- "Volgende week" = Monday to Sunday of the coming week. Spread posts over different days unless the user says
  otherwise; default posting time 10:00, or the times `best-time-scheduler` gave.
- Check what is already planned first: `canvas_list_schedule` with `from`/`to` for that week, and avoid two posts on
  the same platform at the same hour.

## 3. Schedule

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
- `caption` defaults to the card's caption or text; give one only when the user wrote a different caption.
- An error names the post (`posts.1: …`) and the cause. A card that is already scheduled: use
  `canvas_reschedule_post` with the `schedule_id` from the error instead.

## 4. Move or cancel

- Move: `canvas_reschedule_post` with `schedule_id` and the new `scheduled_at` (the old time stays in the history).
- Cancel: `canvas_cancel_scheduled_post`. Nothing is deleted; the card can be scheduled again later.
- Find a `schedule_id` with `canvas_list_schedule` (by `board_id`, `item_ids` or a date window).

## 5. Report

Call `canvas_list_schedule` for the window you planned and tell the user in a short list: day, time, platform, card
title. Add the one sentence from `publish_note` and that they can see and drag everything in the content calendar.

If a GIMC tool fails, say what failed in one sentence and still give the user the plan as a list.
