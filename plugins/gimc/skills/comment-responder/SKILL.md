---
name: comment-responder
description: >
  FutureFlowAI Comment Responder skill.
  Turn every comment into a lead on autopilot. Claude watches your new comments, posts a friendly
  public reply (never a link), and DMs the commenter your lead magnet / resource — then logs them as a
  lead. Use when the user says "auto reply to comments", "DM everyone who comments", "comment to DM",
  "lead magnet automation", "turn comments into leads", "auto-respond", or "capture leads from a reel".
user-invokable: true
argument-hint: "[the comment keyword + what to DM, e.g. SKILLS → the repo link]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Comment Responder — every comment becomes a lead

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Comment Responder skill", e.g. "I'll use the FutureFlowAI Comment Responder skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Post a reel with a "comment WORD and I'll send it" CTA, and this runs the back half for you: it detects
each new comment, replies publicly (warm, **link-free**), and slides the resource into the commenter's
DMs — so you wake up to a list of leads instead of a pile of "sent you a DM 🙌" you have to do by hand.

## When to use
Any reel/post with a keyword CTA ("comment SKILLS / BREAKDOWN / SETUP …"). Set the rule once; it handles
every commenter the same way, 24/7.

## What you'll need
The **keyword(s)** people will comment, the **public reply** (no link), and the **DM** (the link/resource
lives here). Optional: the specific post to scope it to.

## Instructions
Define one rule per CTA — it slots straight into a comment monitor's `auto_responses.json`:

```
You are my comment-to-lead responder. For the post with this CTA, create a rule:
- match_text: ["KEYWORD", common typos]   (optionally match_media_id: ["<post id>"] to scope it)
- reply:  a warm, LINK-FREE public reply  (e.g. "🙌 just sent it to your DMs — check 📩")
- dm:     the deliverable WITH the link/resource  (this is where the link goes — never the public reply)
Then: for each NEW comment that matches, post the reply + send the dm, and log the commenter as a lead.
Rules: ONE link, in the DM only. If a comment doesn't match any rule, defer it to me (don't guess).
```

**The honesty + safety rules (built in):**
- The **public reply NEVER contains a link** — the link goes in the DM only (platforms suppress link-y comments).
- Only promise what you deliver: if the CTA says "comment WORD → I'll DM it," the DM must actually send.
- No match → **defer to a human**, don't auto-reply with a guess.

**Runs unattended:** point it at a scheduled runner (e.g. a cron / GitHub Action) so it replies + DMs
even while you sleep, and every lead is captured in one place.

**Pairs with:** [reel-builder](../reel-builder/SKILL.md) ends the reel on a keyword CTA → this turns the
comments that CTA earns into DMs + leads.

## Take the input from GIMC

- Comments on the company's own posts: when GIMC is connected (a tool whose name ends in `gimc_execute`), read them with `gimc.social_list_comments` inside `gimc_execute` instead of asking the user to paste them: first the posts with comments, then the comments of the post the user means. Use commenters' names only to follow the conversation; never put them on a card.

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


## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Reacties", with `skill: "comment-responder"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- For real comments from GIMC: put each answer in GIMC as a draft with `gimc.social_draft_comment_reply` (one per comment), as the `social-engagement` skill describes, so a person can read and post it. Never post replies yourself.

  ```js
  async () => {
    const account_id = 'ACCOUNT_ID', post_id = 'POST_ID'
    const replies = [{ comment_id: 'COMMENT_ID', message: 'REPLY' }]
    const made = []
    for (const r of replies) made.push((await gimc.social_draft_comment_reply({ account_id, post_id, comment_id: r.comment_id, message: r.message })).draft_id)
    return { drafts: made.length, app_url: '/social/reacties' }
  }
  ```

- Comment keyword → reply or DM runs in GIMC, never in an outside tool (no ManyChat, no comment monitor, cron, GitHub Action or `auto_responses.json`): save the rule as a concept with `gimc.social_save_reply_campaign` (keywords, link-free public reply, DM). Before the post is published, pass `item_id` (the post card) and `platform`; GIMC hangs it on the post once it is live and tells a person, who sets it live. On a published post pass `account_id` and `platform_post_id`.

  ```js
  async () => {
    const r = await gimc.social_save_reply_campaign({
      item_id: 'POST_CARD_ID', platform: 'instagram', name: 'NAME', keywords: ['KEYWORD'], match_mode: 'word',
      public_reply: 'PUBLIC_REPLY_WITHOUT_LINK', dm_message: 'DM_WITH_LINK', daily_max: 25,
    })
    return { campaign_id: r.campaign_id, status: r.status, waiting_for_post: r.waiting_for_post ?? false, app_url: r.app_url }
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
  const run_id = 'RUN_ID', skill = 'comment-responder'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Reacties', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'note', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
