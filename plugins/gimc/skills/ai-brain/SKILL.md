---
name: ai-brain
description: >
  FutureFlowAI AI Brain skill.
  Give Claude a permanent, searchable long-term memory using an Obsidian vault as the store. At the
  end of a session, summarize what mattered and save it as a Markdown note in your "AI Brain" vault;
  at the start of a session (or on demand), read back only the relevant past notes. Local markdown you
  own — connected via the Filesystem MCP. Trigger with "wrap up", "save this session", or "remember this".
user-invokable: true
argument-hint: "[wrap up | remember this | recall <topic>]"
license: MIT
metadata:
  author: Ootto
  version: "1.1.0"
  category: memory
---

# AI Brain — persistent memory for Claude via Obsidian

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI AI Brain skill", e.g. "I'll use the FutureFlowAI AI Brain skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

You maintain a long-term memory for the user in an **Obsidian vault** — a folder of Markdown notes the
user owns on disk. The vault is the durable store; this skill is how you write to it and read from it.
You reach the vault through the connected **Filesystem MCP** (read/write files in the vault folder).
Notes live under an `AI Brain/` folder; use Obsidian `[[wikilinks]]` and `#tags` so memories connect.

> One-time setup: in Claude Desktop add the Filesystem connector pointed at your Obsidian vault
> (Settings → Developer → Edit Config). No browser automation, no login — it's just your local notes.

## When the user says "wrap up" / "save this session" / "remember this" — SAVE

1. **Review the whole conversation.** Pull out only what's worth remembering long-term:
   - Decisions made (and the reasoning / alternatives rejected)
   - Facts & context about the user, their project, their preferences
   - What was built / changed, and where it lives
   - Open questions and next steps (TODOs)
   - Anything they explicitly said "remember this"
   Ignore small talk, dead ends, and anything already saved.

2. **Write a structured Markdown note** in this exact shape (Obsidian-friendly tags + links):
   ```
   # Session — <YYYY-MM-DD> — <3–6 word title>
   #ai-brain #<topic> #<topic>
   Related:: [[<other note>]], [[<project>]]
   ## Decisions
   - <decision> — <why>
   ## Context / facts to remember
   - <fact>
   ## Built / changed
   - <what> (<where>)
   ## Open / next
   - [ ] <todo>
   ```
   Keep it tight and skimmable — this is for future retrieval, not prose.

3. **Save it to the vault** via the Filesystem MCP: write the note to
   `AI Brain/<YYYY-MM-DD>-<slug>.md`. If the `AI Brain/` folder doesn't exist yet, create it first.
   Append-only — never overwrite a past session's note.

4. **Link it in.** Add a one-line pointer to a `AI Brain/MOC.md` index (a map-of-content):
   `- [[<YYYY-MM-DD>-<slug>]] — <one-line hook>` so the brain stays browsable in Obsidian's graph.

5. Confirm in one line: `🧠 Saved to your Obsidian vault — <title> (<n> decisions, <m> todos).`

## At session start, or when the user references the past — RECALL

1. Before answering anything that depends on history ("what did we decide about X", "continue the
   project", "pick up where we left off"), **search the vault**: read `AI Brain/MOC.md` and grep the
   `AI Brain/` notes for the topic + entities from the user's request (filename, `#tags`, body text).
2. Open **only the relevant** notes — never load the whole vault. This is the point: pull a few hundred
   tokens of relevant context instead of re-pasting everything. Follow `[[wikilinks]]` to related notes.
3. Briefly state what you recalled (`📓 From your vault: …`) before continuing, so the user sees the
   grounding. If nothing relevant is found, say so and proceed fresh.

## Rules
- One vault folder (`AI Brain/`), append-only — never overwrite past sessions.
- Tag every note (`#tags`) and link it (`[[…]]` + the MOC) so search + the Obsidian graph have anchors.
- Recall is **retrieval, not reload**: fetch the minimum relevant notes. That's what keeps token cost
  low on long-running projects.
- Never invent memories. If the vault has no answer, say "not in memory yet."
- It's the user's private vault on their disk — read/write only the `AI Brain/` folder; don't expose it.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Notities", with `skill: "ai-brain"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Only put a card on GIMC when the user asks to show or share the saved memory or note on the canvas; otherwise skip the canvas silently and do not mention it.
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
  const run_id = 'RUN_ID', skill = 'ai-brain'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Notities', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'note', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
