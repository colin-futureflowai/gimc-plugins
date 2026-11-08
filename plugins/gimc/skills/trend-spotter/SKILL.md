---
name: trend-spotter
description: >
  FutureFlowAI Trend Spotter skill.
  Scans what is breaking in your niche right now — formats, sounds, angles — and tells you which
  trends actually fit your brand, and which to sit out.
  Use when the user says "what's trending in my niche", "what should I make this week", "is this trend worth doing", "find me a format that's working".
user-invokable: true
argument-hint: "[your niche, or a handful of accounts to watch]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Trend Spotter — what is breaking in your niche, and whether it suits you

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Trend Spotter skill", e.g. "I'll use the FutureFlowAI Trend Spotter skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Scans what is breaking in your niche right now — formats, sounds, angles — and tells you which
trends actually fit your brand, and which to sit out.


## When to use
You need this week's angle and you don't want to guess. Run it before you pick what to make.

## What you'll need
Your niche in one line, and ideally 3-8 peer handles. With [agent-reach](../agent-reach/SKILL.md)
or an Instagram connector connected, Claude can pull real reels and view counts instead of working from
memory.

## Instructions
Give Claude the input and run this.

```
You are my trend analyst for [NICHE]. Peers: [HANDLES / paste 10-20 recent reels with view counts].

1. FORMATS MOVING NOW: name each recurring format you can see, with 1-2 examples and what makes it spread.
2. THE ANGLE UNDERNEATH: for each, the emotional job it does (relief, status, fear of missing out, proof).
3. FIT FOR ME: mark each `TAKE IT`, `ADAPT IT`, or `SIT IT OUT` for my voice and offer — with the reason.
4. FIRST MOVE: for every TAKE IT, write the hook line and the opening shot that makes it mine.
5. FADING: anything that looks past peak, so I don't arrive late.

Rank by fit, not by view count. Tell me to skip things.
```

**Honesty:** Only call something a trend if you can point at real examples. If the data isn't there, say so
rather than inventing a wave.

**Next:** [viral-hook-writer](../viral-hook-writer/SKILL.md) → [reel-scripter](../reel-scripter/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Onderzoek", with `skill: "trend-spotter"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Music for an Instagram Reel comes from GIMC, never from an outside library: find tracks with `gimc.social_search_audio` (trending, or by mood with `q`), recommend 2–3 with a reason, and put the choice on the post as `options.instagram.audio` (`audioId`, `title`, `artist`, `audioVolume`, `videoVolume`) when scheduling with `content-planning`. Music works only on a Reel and needs an account connected via Facebook; never keep `preview_url`. A person confirms the scheduling.

  ```js
  async () => {
    const r = await gimc.social_search_audio({ q: 'MOOD', audio_type: 'music' })
    return { total: r.total, tracks: r.tracks.slice(0, 5).map(t => ({ audio_id: t.audio_id, title: t.title, artist: t.artist, duration: t.duration })) }
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
  const run_id = 'RUN_ID', skill = 'trend-spotter'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Onderzoek', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
