---
name: comment-mining
description: >
  FutureFlowAI Comment Mining skill.
  Reads your comments and DMs to surface the questions, objections and exact phrases your audience
  uses — and turns them into content ideas.
  Use when the user says "what should I post about", "mine my comments", "what is my audience asking", "turn my DMs into ideas".
user-invokable: true
argument-hint: "[paste comments/DMs, or point at a post]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Comment Mining — your audience already told you what to make

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Comment Mining skill", e.g. "I'll use the FutureFlowAI Comment Mining skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Reads your comments and DMs to surface the questions, objections and exact phrases your audience
uses — and turns them into content ideas.


## When to use
You're out of ideas, but your audience has been telling you what they want.

## What you'll need
Your last 30-100 comments or DMs. An Instagram connector (e.g. Composio) can read them off your posts directly.

## Instructions
Give Claude the input and run this.

```
You are my audience researcher. Here are my comments/DMs: [paste].

1. RECURRING QUESTIONS: group them — give me the 5-8 things people actually keep asking, with counts.
2. OBJECTIONS: what stops them buying, trying, or believing me.
3. THEIR WORDS: the exact phrases they use. Quote them verbatim — I want these in my hooks and captions.
4. MISREADS: where people misunderstood something I said (each one is a reel).
5. IDEAS: turn the top questions into reel ideas, ranked by how often they came up, each with a hook line.

Use their vocabulary, not mine.
```

**Honesty:** Every idea must trace to a real comment. Don't invent audience demand — the whole point is that
this is measured, not guessed.

**Next:** [viral-hook-writer](../viral-hook-writer/SKILL.md) → [reel-scripter](../reel-scripter/SKILL.md)

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

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "comment-mining"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
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
  const run_id = 'RUN_ID', skill = 'comment-mining'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
