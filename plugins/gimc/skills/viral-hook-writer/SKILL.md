---
name: viral-hook-writer
description: >
  Writes scroll-stopping hooks for a short-form video (the first 1-3 seconds) in three modes: new
  hooks from a topic, an A/B pair with a test plan, or remixes of proven hooks from a CSV of real
  performance data. Use when the user says "hook", "reel hook", "opening line", "scroll stopper",
  "first three seconds", "how do I start this video", "A/B this hook", "two hooks to test", "hook
  variants", "mine hooks", "remix hooks" or "make hooks from this CSV".
user-invokable: true
argument-hint: "[reel topic, a script to A/B, or a hooks CSV]"
license: MIT
metadata:
  author: Ootto
  version: "2.0.0"
  category: content
---

# Viral Hook Writer

Hooks for a reel — the make-or-break first 1-3 seconds. One skill, three modes; pick the mode from what
the user brings. Only the opening: the rest of the script, and how the hook opens its question chain, is
[reel-scripter](../reel-scripter/SKILL.md).

| The user brings | Mode | Result |
|---|---|---|
| A topic or idea (default) | **1 · New hooks** | 10 hooks from the hook library, top 3 to test |
| A script or idea + "which opening?" / "A/B this" | **2 · A/B test** | 2 hooks with different mechanisms + a test plan |
| A CSV or list of hooks with numbers (views, likes, score) | **3 · From data** | ranked patterns + 3-5 remixes per proven hook |

Not sure? Ask one question: "Do you have a topic, two openings to test, or a list of hooks that already performed?"

## The hook library

[references/hook-library.md](references/hook-library.md) holds 100 proven hook formulas in 10 psychology
categories (01 Curiosity Gap, 02 Contrarian, 03 Authority & Proof, 04 Emotional Trigger, 05 Listicle,
06 Question, 07 Story, 08 Negation / Myth Buster, 09 Specificity & Data, 10 Personal Confession), each with
an ID, an example and the best platform. Read it before you write hooks in mode 1 or 2.

- **Mix categories.** The best pair is usually one **stop-scroll** hook (08 negation, 09 specificity,
  06 question) and one **retention** hook (07 story, 10 confession, 04 emotional).
- **Fill the brackets** with the user's own topic, numbers and audience. A number must be theirs and true;
  if you don't have one, ask or pick a formula without a number. Never leave a bracket or a library example in.
- **Write in the user's language** (the formulas are English; translate the structure, not word for word)
  and native to the platform: TikTok / Instagram casual, LinkedIn punchy and declarative, YouTube
  title-style, X short and contrarian.
- **Tag every hook** with its formula ID and category, e.g. `#087 · 09 Specificity`, so you can see later
  which formulas win.

Source: [rediumvex/viral-hooks-skill](https://github.com/rediumvex/viral-hooks-skill), MIT, see
[references/hook-library-LICENSE.md](references/hook-library-LICENSE.md).

## Mode 1 — new hooks

You have a reel topic but the opening is weak. The hook is ~80% of whether anyone watches — this gives you options to test.

### What you'll need
The topic, who it's for (your audience/niche), and the one thing you want them to feel or do. Optional: your brand voice and a few hooks that have worked for you before.

### Instructions
Collect the topic, audience and platform, read the hook library, then run this prompt:

```
You are my short-form video hook writer. Topic: [topic]. Audience: [who it's for]. Platform: [platform]. Desired reaction: [stop scrolling / save it / comment / DM me].

Write 10 hooks for the first 1-3 seconds, each built on a formula from the hook library, from at least
5 different categories, with stop-scroll and retention categories both represented.

Rules: under 12 words each, spoken-language, no fluff, no hashtags. For each hook give its formula ID and
category, and a 3-5 word on-screen text version. Mark the 3 you'd test first and say why in one line.
```

**Frame zero.** For the 3 hooks you'd test first, also describe what is on screen from 0 to 3 seconds and check
them against the eight points in [references/frame-zero.md](references/frame-zero.md). A hook that reads well on
a blank card still flops.

**Obsidian memory tip:** If you've connected your Obsidian vault (Filesystem MCP), point Claude at your notes of past reels — "use the hooks that performed best in my vault as the pattern." Hooks grounded in *your* winners beat generic ones.

**Tip:** Always generate 10 and test 2-3. The hook you love is rarely the one that wins.

## Mode 2 — A/B test

Two genuinely distinct hooks for the same reel, each with a different mechanism (not one hook reworded;
take them from two different library categories, ideally one stop-scroll and one retention),
plus the hypothesis, what stays constant, which metric decides and how many views you need. One variable:
if the cover or caption changes too, it isn't a test. Full prompt and rules:
[references/ab-test.md](references/ab-test.md).

On the canvas: the two hooks are `hook` cards; the second links to the first with relation `ab_variant`.

## Mode 3 — from data (hook mining)

Keep the psychology, swap only the power words. Mine a CSV of hooks that actually performed with
`python skills/viral-hook-writer/scripts/mine_hooks.py hooks.csv [--top 40]` (auto-detects the hook and
performance columns, buckets by pattern, writes `hooks.mined.json`), then write 3-5 remixes per proven
hook that keep its structure. Never ship a mined hook verbatim. Steps, hard rules and failure modes:
[references/mining.md](references/mining.md).

On the canvas: each remix is a `hook` card linked to its source hook with relation `variant`.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `hook` in frame "Hooks", with `skill: "viral-hook-writer"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- A reference video a hook is modelled on is a `link` card with its thumbnail as poster, with a line to the hooks; see `gimc-canvas` (media, "Social video from another account").
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
  const run_id = 'RUN_ID', skill = 'viral-hook-writer'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Hooks', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'hook', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
