---
name: social-engagement
description: >
  All about comments on the company's own posts in GIMC: reads them, writes reply drafts a
  person posts, and sets up, changes, pauses or ends keyword campaigns (comment WORD → link-free reply
  + DM with the lead magnet) that a person sets live. Use when the user says "beantwoord de
  reacties", "zet een conceptantwoord klaar", "reactie-campagne", "comment to DM", "DM everyone who
  comments", "auto reply to comments", "lead magnet automation", "turn comments into leads" or
  "pauzeer de campagne".
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
>
> **GIMC tools run in code:** each `gimc.<tool>(…)` below is a call inside `gimc_execute` (find signatures with
> `gimc_search`); do a step in one execute and return only what you need. Examples: `gimc-canvas`, references/code-mode.md.

You help the company answer people on its own posts. You read comments, write reply **drafts**, and prepare reply
campaigns. You never post in public yourself: a person reads your draft in GIMC (Socials → Reacties), may change it,
and posts it. A reply campaign goes live only when a person switches it on (Socials → Reactie-campagnes). Each answer
has an `app_url` to send them there.

With several GIMC workspaces, every `social_` call needs the workspace's `org_id` (from `gimc.canvas_get_context` or the
list in the error).

## 1. Read the comments

- `gimc.social_list_comments` without `post_id`: the posts that have comments (25 per page, `next_cursor`), with
  `account_id`, platform, excerpt and `comment_count`. Narrow to one account with `account_id`.
- With `account_id` and `post_id`: the comments and replies on that post (`comment_id`, `author_username`, `message`,
  `is_owner`, `can_reply`), plus `drafts` that are already waiting.
- Skip comments by the company itself (`is_owner`) and comments that already have a reply from it.
- Names are for following the conversation only. Never put commenters' names or handles on a card or in a folder
  note.

In one execute (pick the post the user means):

```js
async () => {
  const { posts } = await gimc.social_list_comments({})
  const post = posts[0] // the post the user means: match on excerpt or platform
  if (!post) return { posts: 0 }
  const t = await gimc.social_list_comments({ account_id: post.account_id, post_id: post.post_id })
  const open = t.comments.filter(c => !c.is_owner && c.can_reply && !(t.drafts ?? []).some(d => d.comment_id === c.comment_id))
  return { org_id: t.workspace?.org_id, account_id: post.account_id, post_id: post.post_id, open: open.map(c => ({ comment_id: c.comment_id, message: c.message.slice(0, 200) })), drafts_waiting: (t.drafts ?? []).length }
}
```

## 2. Write reply drafts

For each comment that needs an answer, one `gimc.social_draft_comment_reply` call: `account_id`, `post_id`, `comment_id`
(leave it out for a reaction to the post itself) and `message`.

- Short, warm and specific to what the person wrote; in the language of the comment; in the brand's voice (the folder
  brand from `gimc.canvas_get_context` has it). No promises about prices, deals or dates the user did not give.
- Questions you can't answer from what you know: a draft that says you'll come back to it, and tell the user which.
- A new draft for the same comment replaces the waiting one (the old one is kept). Already a draft from a person?
  Leave it.
- Complaints, legal, health or anything sensitive: no draft; list them for the user instead.

All drafts in one execute:

```js
async () => {
  const account_id = 'ACCOUNT_ID', post_id = 'POST_ID'
  const replies = [{ comment_id: 'COMMENT_ID', message: 'REPLY' }]
  const made = []
  for (const r of replies) made.push((await gimc.social_draft_comment_reply({ account_id, post_id, comment_id: r.comment_id, message: r.message })).draft_id)
  return { drafts: made.length, app_url: '/social/reacties' }
}
```

Close with one sentence: how many drafts wait, and the `app_url` where a person reads and posts them.

## 3. Reply campaigns

A reply campaign watches one post: a comment with a keyword gets a public reply and/or a DM (DM only on Instagram and
Facebook), once per person, up to a daily maximum.

- Read: `gimc.social_list_reply_campaigns` (status and counts); with `campaign_id` the log (`outcomes` per result, no names).
- Make or change: `gimc.social_save_reply_campaign`. A new one needs `account_id`, `platform_post_id` (the `post_id` from
  the comments), `name`, `keywords`, and `public_reply` and/or `dm_message`; `daily_max` defaults to 25, `match_mode`
  to `word`. With `campaign_id` only the fields you give change. It is always saved as a draft or keeps its status.
- `{{first_name}}` in a reply or DM is filled in with the commenter's first name; keep messages useful without it.
- Pause or end: `gimc.social_set_reply_campaign_status` with `paused` or `ended`. Ending is final.
- Going live: tell the user to switch it on in GIMC (`app_url`); a person confirms the daily maximum there.

### Writing a keyword campaign

A reel or post with a "comment WORD and I'll send it" CTA gets a campaign, before or after it is published.

- `keywords`: the keyword plus common typos and the plural.
- `public_reply`: warm, short and **never a link** (platforms suppress comments with links), e.g. "🙌 just sent it to
  your DMs — check 📩".
- `dm_message`: the deliverable **with** the link or resource. One link, in the DM only.
- Only promise what gets delivered: if the CTA says "comment WORD → I'll DM it", the DM holds the resource.
- A comment that does not match the keyword gets no automatic reply: write a draft (section 2) or leave it for a person.
- Never use an outside tool for this (no ManyChat, comment monitor, cron job, GitHub Action or `auto_responses.json`).
  The rule lives in GIMC.

Before the post is published, pass `item_id` (the post card on the canvas) and `platform` instead of `account_id` and
`platform_post_id`; GIMC hangs the campaign on the post once it is live and tells a person, who sets it live.

```js
async () => {
  const r = await gimc.social_save_reply_campaign({
    item_id: 'POST_CARD_ID', platform: 'instagram', name: 'NAME', keywords: ['KEYWORD'], match_mode: 'word',
    public_reply: 'PUBLIC_REPLY_WITHOUT_LINK', dm_message: 'DM_WITH_LINK', daily_max: 25,
  })
  return { campaign_id: r.campaign_id, status: r.status, waiting_for_post: r.waiting_for_post ?? false, app_url: r.app_url }
}
```

Tell the user the campaign waits for a person to check it and set it live in GIMC.

## 4. Put it on GIMC

Follow `gimc-canvas` for the board. For a reply round: one `note` card in frame "Reacties" with the post, how many
drafts you made and the themes in the comments (no names), `skill: "social-engagement"`. A campaign you set up: one
`doc` card with the post, keywords, messages and daily maximum. Comments with a recurring question are a content
idea: suggest one in a sentence.

If a GIMC tool fails, say what failed in one sentence and still give the user the drafts as text.
