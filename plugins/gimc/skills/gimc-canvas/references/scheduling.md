# Scheduling posts in the GIMC content calendar

A plan with dates belongs in the GIMC content calendar, not only in a document. The calendar shows every scheduled
card per month or week at `/marketing/kalender` and as a layer in the user's agenda (`/agenda`). The full steps are in
the `content-planning` skill; this is the short version.

**Posting goes through the connected accounts and the company's rule.** With an account for every chosen platform
(Socials → Accounts) and the company's `publish_policy` letting it through (by default: you only for a card a person
approved), the post is scheduled at the platform (`at_platform: true`, empty `publish_note`) and goes out at the chosen
time. Otherwise it stays in the calendar and `publish_note` says why (for example "Wacht op goedkeuring"). Say that
once; promise a post goes out only when `at_platform` is true. Approval and the rest: the `content-planning` skill.

## Tools

| Tool | What it does |
|---|---|
| `canvas_schedule_posts` | `posts: [{ item_id, scheduled_at, platforms?, account?, options? }]`, up to 50, all or nothing. `options` = post settings per platform (trial reel, cover, music, first comment); see `content-planning`. |
| `canvas_list_schedule` | Read the calendar: `from` + `to` (≤ 62 days), or `board_id`, or `item_ids`. |
| `canvas_reschedule_post` | Move or edit one post: `schedule_id` plus `scheduled_at`, `platforms`, `caption`, `account` or `options` (only `options` + `expected_updated_at` changes only the settings). |
| `canvas_cancel_scheduled_post` | Cancel one post (status `cancelled`; nothing is deleted). |

## Rules

1. **Every post is a card.** Schedule the cards you put on the board in this run (or cards the user points to). Any card
   kind works. The caption under the post is always `data.caption` of the card (never its script or `body`): write it
   on the card before you ask for approval; GIMC posts exactly that text.
2. **Times are Amsterdam time.** Give `scheduled_at` without offset (`2026-11-12T10:00`): GIMC reads it as
   Europe/Amsterdam. Only future times. "Next week" means Monday to Sunday of the coming week.
3. **One running schedule per card.** If a card is already scheduled, the error names its `schedule_id`: move that one
   with `canvas_reschedule_post` instead of scheduling again.
4. **Platforms**: `instagram`, `linkedin`, `facebook`, `tiktok`, `x`, `youtube`. Without `platforms` GIMC takes the
   card's platform; a card without one needs `platforms`.
5. **Check, then report.** After scheduling, call `canvas_list_schedule` for the same window and tell the user in one
   short list what is planned when, plus the one-sentence `publish_note`.
6. Pass `skill` and the run's `run_id` to `canvas_schedule_posts`, like on cards.
