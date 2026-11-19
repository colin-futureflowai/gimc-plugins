---
name: reel-scripter
description: >
  Writes a short-video script from zero (idea → question chain → script table with delivery notes) or reviews and
  improves an existing one (scorecard per principle + concrete rewrites), in the user's voice, and checks it with
  script-check. Use when the user says "schrijf een script", "verbeter mijn script", "check mijn script",
  "script review", "storytelling", "verhaal opbouwen", "ritme van mijn script", "script from scratch",
  "reel script", "write a reel" or "turn this idea into a video".
user-invokable: true
argument-hint: "[an idea or topic to script, or a script / transcript to review]"
license: MIT
metadata:
  author: GIMC
  version: "2.0.0"
  category: content
---

# Reel Scripter

The script and story skill: every reel's words go through here. Two modes:

| The user brings | Mode | Result |
|---|---|---|
| An idea, a topic or a hook (default) | **A · Write from zero** | a script table, the full script and delivery notes |
| A script, or the transcript of a video or voice-over | **B · Review and improve** | a scorecard, the 3–5 rewrites that matter most, optionally the full rewrite |

Not sure? Ask one question: "Shall I write a new script, or improve one you have?"

**The principles** — curiosity through contrast, speed to value, value density, clarity, absorption, anticipation,
emotional resonance, rhythm, tone and energy — live in [references/storytelling.md](references/storytelling.md).
Read it before you write or review; this file only says how to work.

Two rules in both modes:
- **The user's voice and facts.** Write in their language and tone (ask [ai-brain](../ai-brain/SKILL.md) or the folder
  note for it). Never invent a result, number, client or claim: mark anything you assume as an assumption
  ("aanname") and ask for the real one.
- **Original words.** A reference reel gives the structure, never the sentences.

## Mode A — Write from zero

1. **Intake.** Topic · audience and their pain · the common belief about it · the user's opposite view and the proof
   for it · goal and CTA · platform · length (default 30–45 s) · language · voice. Ask for what is missing **once**,
   in one message, with a proposed default for each; anything still open becomes a marked assumption.
2. **Core** in four lines: pain → common belief → contrast (their view) → one proof.
3. **Question chain.** Plan the beats as questions before writing lines: per beat the question it answers and the
   one it opens (storytelling.md, "the question chain"). A value signal lands within 5 s; a tease comes before the
   payoff; the payoff is a step the viewer can take.
4. **Write the lines** for each beat. Hooks: take the user's chosen hook from
   [viral-hook-writer](../viral-hook-writer/SKILL.md) if there is one, else write the opening line yourself.
5. **Rewrite three times**, each pass with one aim: density (cut what nobody would miss), clarity (plain words,
   active voice, the core point twice), rhythm (mostly short, varied, read it out loud).
6. **Delivery notes:** the energy per beat, the stressed word, where a pause goes.
7. **Run script-check** (below) on the table and fix every error; look at each warning and fix it or say why not.

## Mode B — Review and improve

1. **Read the script** as given: text, a script table, or a transcript of the video or voice-over. With word timings
   (e.g. GIMC captions `{ text, startMs, endMs }`), pass them to script-check for the real pace.
2. **Run script-check** and judge each principle against the script.
3. **Scorecard**, one row per principle: `principle | ok / weak / missing | the line from the script that shows it |
   what to change`. Quote the actual line; don't score what you can't point at.
4. **The 3–5 improvements that matter most**, each as `old → new + why` (the principle it fixes), in the user's
   voice. Speed to value and contrast usually come first.
5. **The full rewrite** as a script table when the user wants it (offer it), checked with script-check again.

## The script table

Both modes deliver the script as this table, one row per beat:

`| # | Spoken line | Question answered | Question opened | Beat job | Emotion / energy | ~sec |`

- **Beat job:** `hook`, `contrast`, `proof`, `value`, `tease`, `payoff` or `cta`.
- Beat 1 answers no question; the last beat opens none. Tag the line with the first value signal `[value]`.
- Below the table: the full script as one paragraph, the core terms, and the delivery notes.

The table is the input for [reel-builder](../reel-builder/SKILL.md): its build table takes the spoken lines, the beat
jobs and the timing from here and adds what is on screen (the picture follows the story).

## script-check

`scripts/script-check.mjs` (Node 18+, no dependencies) counts what can be counted: length against the target,
seconds to the first value signal, rhythm, passive voice, filler words, jargon and long words, the core point said
twice, and in a table every beat's questions. Errors are plain mistakes; warnings are heuristics to look at again.
The thresholds are in `scripts/lib/analysis.mjs` (`THRESHOLDS`) and in the JSON output.

```sh
node scripts/script-check.mjs script.md --lang nl --target 45 --core "term"     # Markdown table or plain text
node scripts/script-check.mjs beats.json --target 30 --json out.json             # the table as JSON
node scripts/script-check.mjs script.md --words vo-words.json --target 40         # with voice-over timings
```

Table as JSON: `{ "lang": "nl", "target": 45, "core": ["term"], "beats": [{ "line": "…", "answered": "…",
"opened": "…", "job": "hook", "energy": "…", "sec": 3, "value": true }] }`. Exit code 1 means errors.
A clean run means nothing is plainly wrong; contrast, emotion and energy you judge yourself.

**Next:** [reel-builder](../reel-builder/SKILL.md) (build and render) ·
[caption-and-hashtags](../caption-and-hashtags/SKILL.md) (the post).

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `script` in frame "Script", with `skill: "reel-scripter"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- The script card holds the script table, the full script and the delivery notes. Review and improve (mode B): in the same frame one `analysis` card with the scorecard and the improvements (`old → new + why`), and the rewrite as a `script` card with a `variant` line from the original script card (when the original is on the board, else put it as a `script` card first).
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
  const run_id = 'RUN_ID', skill = 'reel-scripter'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Script', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'script', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
