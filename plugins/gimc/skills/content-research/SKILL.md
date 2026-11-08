---
name: content-research
description: >
  FutureFlowAI Content Research skill.
  Turn Claude into a content research machine for any niche. Point it at any creator or account and it
  pulls their posts, finds the exact ones that blew up (the outliers), then breaks down WHY — the hook,
  the format, and the retention patterns — and surfaces the repeatable playbook you can copy. Use when
  the user says "research this niche", "what's working for @account", "find what's going viral in
  [niche]", "what should I post about", "study this creator", or wants a content strategy grounded in
  real data instead of guessing.
user-invokable: true
argument-hint: "[creator @handle, account URL, or niche]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Research — stop guessing what to post

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Content Research skill", e.g. "I'll use the FutureFlowAI Content Research skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Most people spend hours scrolling to figure out what to post. This skill turns Claude into a research
machine: point it at any account or niche and it finds the exact moments that went viral and the
patterns behind them — so you copy what works instead of guessing.

## What it does

1. **Pull the posts.** For a creator/account, gather their recent reels + view counts (Instagram Graph
   API via Composio, or any list of reel URLs the user provides).
2. **Find the spikes.** Rank posts by views and flag the outliers — the exact posts where the account
   blew up vs their baseline. Those are the moments worth studying.
3. **Break down WHY.** For each outlier, study the reel frame-by-frame + transcript (hand off to the
   `reel-analyzer` skill / ootto-watch) and extract the hook (first 2s), the format/structure, the
   pacing, and the retention pattern.
4. **Surface the playbook.** Across the outliers, surface the repeatable patterns — the hook types,
   formats, and topics that consistently earn saves/shares — and turn them into a short, copyable plan
   for the user's own niche.

## How to run it

1. Ask for a creator @handle, an account URL, or a niche (+ a few example accounts).
2. Pull their reels + view counts. Options:
   - **sandcastles.ai** — a research engine that pulls top channels and auto-surfaces the viral outliers + the
     frameworks behind them (fastest path; connect it to Claude and let it do the heavy lifting).
   - **Composio Instagram** tools — free/DIY: list a creator's media + insights from the Graph API.
   - Or a plain list of reel URLs the user pastes.
3. Rank by views, compute each post's ratio vs the account median, and mark anything ~2-3x median as an
   **outlier** ("blew up here").
4. For the top 3-5 outliers, run `reel-analyzer` (or ootto-watch — github.com/Ootto-AI/ootto-watch) to
   break down hook / format / retention.
5. Synthesize: list the winning hook patterns, formats, and topics, then write 3 ready-to-shoot ideas for
   the user's own account modeled on what actually worked.

## Output

A short research report:
- **The spikes** — which posts blew up and by how much (vs baseline).
- **Why they worked** — hook / format / retention breakdown per outlier.
- **The playbook** — the repeatable patterns + 3 original ideas for your niche.

## Honesty

Model the *technique*, never copy another creator's exact script, visuals, or caption. Cite the source
reels you studied. View counts come from real data (Composio / what the user provides) — never fabricate.

*Pairs with `reel-analyzer`, `going-viral`, and `reel-scripter`.*

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Onderzoek", with `skill: "content-research"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Each social video you found (Instagram, TikTok, YouTube) is its own `link` card with its thumbnail as poster, account and numbers, next to the analysis; see `gimc-canvas` (media, "Social video from another account").
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
  const run_id = 'RUN_ID', skill = 'content-research'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Onderzoek', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
