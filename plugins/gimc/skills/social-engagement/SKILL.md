---
name: social-engagement
description: >
  GIMC Social Engagement skill. Reads the comments on the company's own posts in GIMC, writes reply drafts that a
  person posts, and sets up, changes, pauses or ends reply campaigns (a keyword in a comment gets a public reply
  and/or a DM). Use when the user says "beantwoord de reacties", "welke reacties staan open", "schrijf antwoorden op
  de comments", "reactie-campagne", "comment to DM", "zet een trefwoord-campagne op", "pauzeer de campagne", or when
  comment-responder or comment-mining worked on real comments.
user-invokable: true
argument-hint: "[post, account or campaign, what to do]"
license: MIT
metadata:
  author: GIMC
  version: "1.0.0"
  category: engagement
---

# Social engagement in GIMC

> **GIMC skill.** Call it "the GIMC Social Engagement skill" in the user's language.

You help the company answer people on its own posts. You read comments, write reply **drafts**, and prepare reply
campaigns. You never post in public yourself: a person reads your draft in GIMC (Socials → Reacties), may change it,
and posts it. A reply campaign goes live only when a person switches it on (Socials → Reactie-campagnes). Each answer
has an `app_url` to send them there.

With several GIMC workspaces, every `social_` call needs the workspace's `org_id` (from `canvas_get_context` or the
list in the error).

## 1. Read the comments

- `social_list_comments` without `post_id`: the posts that have comments (25 per page, `next_cursor`), with
  `account_id`, platform, excerpt and `comment_count`. Narrow to one account with `account_id`.
- With `account_id` and `post_id`: the comments and replies on that post (`comment_id`, `author_username`, `message`,
  `is_owner`, `can_reply`), plus `drafts` that are already waiting.
- Skip comments by the company itself (`is_owner`) and comments that already have a reply from it.
- Names are for following the conversation only. Never put commenters' names or handles on a card or in a folder
  note.

## 2. Write reply drafts

For each comment that needs an answer, one `social_draft_comment_reply` call: `account_id`, `post_id`, `comment_id`
(leave it out for a reaction to the post itself) and `message`.

- Short, warm and specific to what the person wrote; in the language of the comment; in the brand's voice (the folder
  brand from `canvas_get_context` has it). No promises about prices, deals or dates the user did not give.
- Questions you can't answer from what you know: a draft that says you'll come back to it, and tell the user which.
- A new draft for the same comment replaces the waiting one (the old one is kept). Already a draft from a person?
  Leave it.
- Complaints, legal, health or anything sensitive: no draft; list them for the user instead.

Close with one sentence: how many drafts wait, and the `app_url` where a person reads and posts them.

## 3. Reply campaigns

A reply campaign watches one post: a comment with a keyword gets a public reply and/or a DM (DM only on Instagram and
Facebook), once per person, up to a daily maximum.

- Read: `social_list_reply_campaigns` (status and counts); with `campaign_id` the log (`outcomes` per result, no names).
- Make or change: `social_save_reply_campaign`. A new one needs `account_id`, `platform_post_id` (the `post_id` from
  the comments), `name`, `keywords`, and `public_reply` and/or `dm_message`; `daily_max` defaults to 25, `match_mode`
  to `word`. With `campaign_id` only the fields you give change. It is always saved as a draft or keeps its status.
- `{{first_name}}` in a reply or DM is filled in with the commenter's first name; keep messages useful without it.
- Pause or end: `social_set_reply_campaign_status` with `paused` or `ended`. Ending is final.
- Going live: tell the user to switch it on in GIMC (`app_url`); a person confirms the daily maximum there.

## 4. Put it on GIMC

Follow `gimc-canvas` for the board. For a reply round: one `note` card in frame "Reacties" with the post, how many
drafts you made and the themes in the comments (no names), `skill: "social-engagement"`. A campaign you set up: one
`doc` card with the post, keywords, messages and daily maximum. Comments with a recurring question are a content
idea: suggest one in a sentence.

If a GIMC tool fails, say what failed in one sentence and still give the user the drafts as text.
