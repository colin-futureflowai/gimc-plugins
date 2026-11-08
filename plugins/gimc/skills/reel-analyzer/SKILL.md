---
name: reel-analyzer
description: >
  FutureFlowAI Reel Analyzer skill.
  Feed Claude any viral reel (a link or a file) and it studies the whole thing — frame by frame
  plus the transcript — then breaks down exactly why it works: the hook, the beat structure, the
  pacing, and the on-screen visuals. Use when the user says "study this reel", "break down this
  video", "analyze this reel", "why did this go viral", "what's the structure of this", or pastes a
  reel/TikTok/Short link and wants to model it.
user-invokable: true
argument-hint: "[reel/TikTok/Short URL or video file]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Reel Analyzer — Claude watches the reel so you can model it

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Reel Analyzer skill", e.g. "I'll use the FutureFlowAI Reel Analyzer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Stop guessing why something went viral. Feed Claude the reel you want to take inspiration from and it
**watches the whole thing** — the visuals frame by frame and the spoken words — then hands you a
teardown you can build your own original from. This is step one of the content factory.

## When to use
You found a reel/Short/TikTok that's clearly working and you want to make your **own** version in your
voice. Start here — the breakdown feeds the hook writer, the scripter, and the builder.

## What you'll need
The reel **link** (or a downloaded video file). Don't have one yet, or only have a link?
[agent-reach](../agent-reach/SKILL.md) is the step before this — it **finds** a proven reel to model
(and mines Reddit for what to make it about) and **downloads** any URL to its transcript, which is what
this skill reads. Optional: your niche and the angle you want, so the breakdown is framed for *your* remake.

## Instructions
Give Claude the reel and run this. (In Claude Code, point it at the file/frames + transcript; on
claude.ai, upload the video or paste the transcript + a few screenshots.)

```
You are my reel analyst. Here is a reel I want to model (link/file/transcript + frames): [paste].
WATCH the whole thing, then give me a teardown I can build an original from:

1. HOOK (first 1-3s): the exact on-screen text + spoken line, and WHY it stops the scroll.
2. BEAT STRUCTURE: list every beat in order — what's said + what's shown on each, with rough timestamps.
3. PACING: how fast beats cut, where it speeds up/slows down, total length.
4. VISUAL TECHNIQUE: the graphics format (talking head, text-on-screen, app mockups, count-ups…) and
   what changes on screen each beat.
5. WHY IT WORKS: the 2-3 reusable moves (the format/technique to borrow — NOT the words to copy).
6. MY REMAKE: a one-line plan to redo this in my niche/voice — same structure, original content.

Rule: model the technique, never reproduce the creator's words/voice (copies get reach-suppressed).
```

**Honesty:** this gives you the *structure and technique* to model — your remake must be original
words and your own examples, not a re-upload.

**Next:** feed the teardown into [viral-hook-writer](../viral-hook-writer/SKILL.md) →
[reel-scripter](../reel-scripter/SKILL.md) → [reel-builder](../reel-builder/SKILL.md).

## Take the input from GIMC

- Numbers of the company's own social accounts and posts: when GIMC is connected (a tool whose name ends in `gimc_execute`), read them with `gimc.social_get_insights` inside `gimc_execute` instead of asking the user to paste them, as the `social-insights` skill describes, and say which accounts and period you used. Pasted numbers still work when GIMC has no connected account or the user brings other numbers.

  ```js
  async () => {
    const i = await gimc.social_get_insights({ period_days: 30, sort: 'top', limit: 20 })
    const top = i.posts.slice(0, 5).map(p => ({ platform: p.platform, views: p.views, er: p.engagement_rate, text: (p.excerpt ?? '').slice(0, 60) }))
    const accounts = i.accounts.map(a => ({ account: a.username ?? a.platform, followers: a.followers, growth: a.followers_growth }))
    return { org_id: i.workspace?.org_id, period: i.period_days, has_accounts: i.has_accounts, totals: i.totals, accounts, top, posts_total: i.posts_total }
  }
  ```


## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "reel-analyzer"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- The analysed reel is a `link` card (source URL, account, posted date, numbers, thumbnail as poster) unless it is already on the board; the analysis gets a `derived` line from it; see `gimc-canvas` (media, "Social video from another account").
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
  const run_id = 'RUN_ID', skill = 'reel-analyzer'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
