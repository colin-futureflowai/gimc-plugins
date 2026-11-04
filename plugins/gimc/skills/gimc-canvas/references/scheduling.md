# Scheduling posts in the GIMC content calendar

A plan with dates belongs in the GIMC content calendar, not only in a document. The calendar shows every scheduled
card per month or week at `/marketing/kalender` and as a layer in the user's agenda (`/agenda`). The full steps are in
the `content-planning` skill; this is the short version.

**Posting does not happen yet.** GIMC has no connection to Instagram, LinkedIn, Facebook, TikTok, X or YouTube yet.
Scheduling puts the post in the calendar; nothing is sent. Every answer carries `publish_note`
("Posten volgt zodra Instagram gekoppeld is."). Say that once to the user; never promise that a post will go out.

## Tools

| Tool | What it does |
|---|---|
| `canvas_schedule_posts` | `posts: [{ item_id, scheduled_at, platforms?, caption?, account? }]`, up to 50, all or nothing. |
| `canvas_list_schedule` | Read the calendar: `from` + `to` (≤ 62 days), or `board_id`, or `item_ids`. |
| `canvas_reschedule_post` | Move or edit one post: `schedule_id` plus `scheduled_at`, `platforms`, `caption` or `account`. |
| `canvas_cancel_scheduled_post` | Cancel one post (status `cancelled`; nothing is deleted). |

## Rules

1. **Every post is a card.** Schedule the cards you put on the board in this run (or cards the user points to). Any card
   kind works; a social post card (`data.platform`, `data.caption`) fills platform and caption by itself.
2. **Times are Amsterdam time.** Give `scheduled_at` without offset (`2026-11-12T10:00`): GIMC reads it as
   Europe/Amsterdam. Only future times. "Next week" means Monday to Sunday of the coming week.
3. **One running schedule per card.** If a card is already scheduled, the error names its `schedule_id`: move that one
   with `canvas_reschedule_post` instead of scheduling again.
4. **Platforms**: `instagram`, `linkedin`, `facebook`, `tiktok`, `x`, `youtube`. Without `platforms` GIMC takes the
   card's platform; a card without one needs `platforms`.
5. **Check, then report.** After scheduling, call `canvas_list_schedule` for the same window and tell the user in one
   short list what is planned when, plus the one-sentence `publish_note`.
6. Pass `skill` and the run's `run_id` to `canvas_schedule_posts`, like on cards.
