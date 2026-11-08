---
name: hook-mining
description: >
  FutureFlowAI Hook Mining skill.
  Mine a CSV of REAL top-performing hooks and generate alternatives that keep what made them work:
  hold the storytelling psychology and structure fixed, hot-swap only the power words.
  Use when the user has hook performance data (a Sandcastles / social-analytics export, scraped
  competitor hooks, their own analytics) and says "mine hooks", "remix hooks", "hook variations",
  "make hooks from this CSV", or "give me hook options from what's working".
  NOT for inventing hooks from nothing — that's viral-hook-writer.
user-invokable: true
argument-hint: "[path to your hooks CSV]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
---

# Hook mining

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Hook Mining skill", e.g. "I'll use the FutureFlowAI Hook Mining skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Most AI hook writing is slop for one of two reasons: it copy-pastes a hook that worked for someone
else, or it "rewrites" it until the English is flat and the psychology is gone.

This does neither. It keeps the **data for what worked** — the structure, the psychological
mechanism, the rhythm — and swaps only the **power words**. Proven skeleton stays, skin changes.

## 1. Get real hooks in

You cannot mine what you do not have. The input is a CSV of hooks that **actually performed**:

- a **Sandcastles** (sandcastles.ai) export — it analyses the top videos in your niche and ranks the
  best hooks; export that tab to CSV
- any social-analytics export with a hook/title/caption column and a views/likes/score column
- competitor hooks pulled with the **agent-reach** skill, or breakdowns from **reel-analyzer**

Column names are never predictable, so don't hand-parse.

## 2. Mine it

```bash
python skills/hook-mining/mine_hooks.py hooks.csv [--top 40]
```

Auto-detects the hook column and the performance column, ranks, buckets by pattern, and flags the
power words already present. Writes `hooks.mined.json`. Run `--selftest` to verify the parsing.

Patterns it sorts into: `result-proof` · `time-bound` · `contrarian` · `secret-gap` · `listicle` ·
`how-to` · `warning-fear` · `newsjack` · `comparison` · `question` · `curiosity-tease` ·
`plain-statement`.

## 3. Remix — the part that matters

For each hook worth reusing, produce 3–5 alternatives under one rule:

> **Keep the psychology. Swap the power words.**

Hold **fixed**: the pattern, the clause order, the specificity (a number stays a number), the rhythm
and syllable shape, the tension and where it resolves, the point of view.

Swap **only**: the charged words — the verb, the intensifier, the noun carrying the emotion.
`power_word_frequency` in the mined JSON tells you which ones are earning their keep in *your* niche.
Pull replacements from there, not from a thesaurus.

```
proven:   "You're using Claude wrong"                 [contrarian · you're + wrong]
  ✅      "You're prompting Claude backwards"          swapped the verb + the charge word
  ✅      "You're building agents the slow way"        same skeleton, same tension
  ❌      "Many people use Claude incorrectly"         psychology gone, flat English → slop
  ❌      "You're using Claude wrong"                  verbatim copy → plagiarism, the platform buries it
```

Then hand the winners to **viral-hook-writer** to rank, or straight into **reel-scripter**.

## Hard rules

- **Never ship a mined hook verbatim.** It is someone else's line. Instagram's originality systems
  bury copies, and it's plagiarism. Model the technique, write your own words.
- **Never remix the structure.** Change the clause order or drop the number and you have thrown away
  the only thing the data proved.
- **A number in the source stays a number in the remix — and it must be YOURS and real.** Swapping in
  a stat you cannot defend is the fastest way to lose an audience.
- **Rank before you mine.** Remixing a hook that did not perform just launders a bad idea.
- **Small buckets are signal.** A pattern with two entries that both went viral beats one with forty
  mediocre ones. Weight by performance, not by count.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Variants read flat / corporate | rewrote the sentence instead of swapping words | restore the original skeleton, change only the charged words |
| All variants sound identical | swapped one word in one slot | vary the slot — verb, intensifier, or emotional noun |
| Variants lost the tension | resolved the curiosity gap inside the hook | the gap stays open; the payoff belongs after the hook |
| Nothing outperforms | mining unranked or off-niche data | re-export ranked, filter to the actual niche |

## Where it sits

`agent-reach` / `reel-analyzer` find what's working → **hook-mining** turns that data into your own
hooks → `viral-hook-writer` ranks → `reel-scripter` writes the script → `reel-builder` builds it.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `hook` in frame "Hooks", with `skill: "hook-mining"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `variant` from that source card to the new card(s).
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
  const run_id = 'RUN_ID', skill = 'hook-mining'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Hooks', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'hook', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
