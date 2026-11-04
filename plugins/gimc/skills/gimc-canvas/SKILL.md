---
name: gimc-canvas
description: How to put work on the GIMC content canvas neatly — boards, frames per step, cards in a grid, arrows with short labels, run_id and skill on every card, media uploads with a poster, and picking up notes and tasks people left on cards. Use whenever a skill says "Put it on GIMC" or "follow gimc-canvas", and when the user says "put it on GIMC", "put this on the canvas", "zet het op het canvas", "op het bord", "show it on the board", "pak mijn notities op", "pak mijn opdrachten op", "what's waiting for me on the canvas", or asks why the canvas or an upload did not work.
---

# GIMC canvas

This is plugin version 0.5.0. If `plugin_info` is available, compare its `version` with this one once per conversation and, if it is newer, tell the user in one sentence that an update is ready in GIMC.

The GIMC canvas is the user's content board at `/marketing/canvas`. People watch it while you work: every finished step appears as cards in a frame, linked with arrows. Make the board read like a clear story of the run, and never let the canvas stop the actual work.

Hard rules — they apply to every section below:

1. **The canvas never blocks the work.** If a canvas call fails, finish the content work anyway and tell the user in one sentence what was skipped and why. Never retry the same failing call more than once.
2. **Never overwrite human work.** A card a person edited gets a variant, not an update. A card or frame a person placed or moved stays where it is.
3. **Never lose anything.** Archive only cards you placed yourself in this run and that are truly wrong; never archive or move human cards.
4. **Every card you make carries `skill` and `run_id`** (one id per run, see "Lay it out"). `skill` is the exact name of the skill or tool that produced the card; for your own glue cards (a brief, a choice note, a frame not tied to one skill) use `gimc-canvas`.
5. **Read errors.** GIMC errors are short Dutch sentences that name the cause (an unknown field, a full frame, a human-placed card, multiple workspaces). Fix what they name; don't guess around them.

Details live in four references; open the one you need:

- [references/layout.md](references/layout.md) — grid sizes, frame placement, arrows, the full reel run, reusing frames, full frames.
- [references/media.md](references/media.md) — upload flow, poster, landscape video, audio, carousels, Cowork network and Remotion workarounds.
- [references/folders.md](references/folders.md) — choosing and matching folders, creating one, how to write the folder note.
- [references/notes-and-tasks.md](references/notes-and-tasks.md) — `canvas_inbox`, notes, tasks, replies, human work.

## 1. Check the connection

Look for the GIMC canvas tools: a tool whose name ends in `canvas_list_boards` (the prefix differs per app). If it is there, go on.

If no `canvas_` tools are available, the user has not connected GIMC yet. Do the content work anyway, then tell them in one short step how to connect, matching where they are:

- **Cowork or claude.ai** (plugins' `.mcp.json` is ignored there): "To see this on your GIMC canvas, add GIMC once as a connector: claude.ai → Settings → Connectors → Add custom connector, URL `https://gimc-app.vercel.app/api/mcp`, then sign in ("Log nu in"). Then ask me again to put it on GIMC."
- **Claude Code**: "Run `/mcp`, pick `gimc` and choose Authenticate; then ask me again."

Use that URL exactly as written (it already ends in `/api/mcp`); it is the GIMC this plugin was built for. Say this once per conversation, not after every skill.

If a call says the user has no rights or the token expired, say so in one sentence ("GIMC asks you to sign in again") and continue without the canvas.

## 2. Orient with one call — before any other canvas call

The **first** canvas call of a conversation is `canvas_get_context` (with `folder_id` or `board_id` when you know one, otherwise `workspace` and `folder` by name when the user named them, and `include_inbox: true`). One answer gives the workspace, the folder path, every folder note up the chain, the folder's brand, its boards and subfolders, and with `board_id` the board overview (`next_free`, frames) and that board's inbox. Don't repeat that with separate list, note or inbox calls.

- `choose_workspace: true` with a list `workspaces`: that is the answer, not a failure. If the user already named one of them (a company or client name in the request), use it and say which; otherwise ask **once per conversation** ("Which GIMC workspace should I use: A, B or C?"). Then pass that `org_id` in **every** `canvas_` call, including uploads, plans and links.
- "Geen bedrijf gekoppeld": the account has no workspace. Tell the user in one sentence and skip the canvas.
- An older GIMC without `canvas_get_context`: start with `canvas_list_boards` without `org_id` (same workspace rules), then the folders, the folder note and `canvas_inbox`.

## 3. Pick the folder and board — once per run

Boards live in folders (per client or campaign); every folder has a markdown note as its memory. **All steps of a run stay on one board.** A board is not a step: each step is its own frame (a section) on the run's board. Choose folder and board once, at the first card of a new run — never a board per step.

The context answer has the folder, its boards and subfolders; `canvas_list_folders` lists all folders (`folder_id`, `path` "A › B"). Board names are not unique, so match a name inside a folder. Choose in this order:

1. **The folder or board the user names** ("in de map Klant X", "op het bord Lancering"). Match the name case-insensitively against the `path` values, then against `canvas_list_boards` with that `folder_id`. A name in several folders: ask once. A wanted board that does not exist: `canvas_create_board` with `folder_id`; a wanted folder: see "New folder".
2. **The folder and board of the current run**, or of the source card you are working from (items carry `board_id`; `canvas_list_boards` gives that board's `folder_id` and `folder_path`).
3. **The folder of the previous run in this conversation.** Exactly one folder: use it. Several folders and no hint: ask once, then remember the answer for the conversation.
4. **Inside the folder, the default board for this kind of run**, decided by the frame of the run's first step (or of a skill used on its own):

| Kind of run (frame of its first step) | Board for the whole run |
|---|---|
| Ideeën, Planning, Strategie, Notities | Ideeën |
| Onderzoek | Onderzoek & concurrentie |
| Analyse | Analyses |
| Hooks, Script, Tekst in beeld, Shotlist, Cover, Eindvideo, Clips, Carrousel, Stories, Publicatie, CTA, Profiel, Outreach, Opvolging, Reacties, Briefing | In productie |
| Brandbook | Brandbook |

The table only picks the board for the first card of a new run; later steps stay on that board. Tracking a published post with numbers (`canvas_record_stats`) is its own run, on "Mijn content".

A folder without boards: create only the board this run needs (`canvas_create_board` with `folder_id`); seed the default boards (`canvas_seed_default_boards`) only when the user asks or in a brand-new workspace. Boards exist but the fitting default is missing: ask **once** which board to use and remember it. Always pass `folder_id` to board tools; without it GIMC uses the default folder.

**New folder.** Only when the user names it or the work clearly needs its own place (a new client or campaign) — never for a single card. Without `parent_id` it goes under the default folder. Ask once "standaardborden of vanaf nul?" (in the user's language) unless they already said, and set `seed_defaults`. Details: [references/folders.md](references/folders.md).

**Folder notes are memory** — like a CLAUDE.md per directory, for your next session.

- **Read** at the start of work in a folder: they are in the context answer (or `canvas_get_folder_note` with `with_parents: true`), top-down: the nearest note wins.
- **Write** once, at the end of the run, never after every card: see "When you are done".

## 4. Check the inbox

Before you place anything, and at the start of every turn in which you do canvas work, check the inbox: `include_inbox: true` in the context call, or `canvas_inbox` (with `board_id` when you work on one board). In a long run, check again between steps.

- Nothing there: go on silently.
- Notes or tasks: handle them as described in [notes-and-tasks.md](references/notes-and-tasks.md). Short version: a task → `canvas_claim_task`, do it, `canvas_complete_task` with the new card. A note → first reply with `canvas_add_comment` ("Opgepakt: …"), then do the work and put a new card with a line to the noted card. A note that is not a request ("mooi!") gets a short reply and no work. In doubt, ask in the chat, not on the board.
- A note that arrives during a run: finish the current step, then pick it up, and mention it in the chat in one sentence.

When the user says "pak mijn notities op" / "pak mijn opdrachten op", work through the whole inbox, oldest first, one by one.

## 5. Lay it out

The board should read left to right like the run itself: one frame per step, the step's cards in a grid inside it, an arrow with a short label from each step to the next. Exact sizes and the worked example: [layout.md](references/layout.md).

**run_id.** One run = one `run_id`, shared by every frame and card of that run. Format: `<topic>-<yyyymmdd>`, lowercase with hyphens, e.g. `reel-ochtendroutine-20261030`. Continuing earlier work, find it with `canvas_list_items` (`run_id`) and reuse that id. A skill used on its own (one hook set, one caption) is its own small run.

**First card within the first minute.** Before you start the actual work, create the board's first frame ("1 · Brief") with a brief or plan card (what you are about to make, for whom, the steps you will take) in one `canvas_create_items` call. Do this first, in a short or "test" run too: "it's just a test" is no reason to wait. From then on, each step's frame and cards go on the board as soon as that step is done. Never save all cards for the end; a board that stays empty until the final video defeats the point of watching it.

**Look before you build.** The board overview (in the context answer with `board_id`, or `canvas_board_overview`) gives `next_free` (a spot below everything where a new run always fits) and every frame with its title, size, member ids and a `free_spot`.

**Frames.** Each step gets a frame (kind `frame`) titled with the frame name from the skill's "Put it on GIMC" section (Dutch, e.g. "Hooks", "Script", "Tekst in beeld"). In a run with several steps, number them: "1 · Brief", "2 · Hooks", "3 · Script"; the step names of the run win over a skill's own frame name. Give frames the same `run_id` and the step's `skill`.

- The run already has a frame with that title (same `run_id`): put the new cards in it with `frame_id`.
- Otherwise create a new frame: the first frame of a new run at `next_free`, every next frame to the right of the previous one (same `y`, 260 px gap). Default frame size 900×760; wider or taller when the step has many cards (see layout.md).

**Cards.** Create them with `frame_id` and no x/y: GIMC finds a free spot in the frame and nothing overlaps. Only give your own x/y when you need a precise order, and then keep to the grid in layout.md.

- Kind, frame and relation come from the skill's "Put it on GIMC" section. Kinds are exactly: `video`, `image`, `carousel`, `note`, `hook`, `script`, `analysis`, `idea`, `link`, `doc`, `frame`, `html` (a self-contained page, made only with `canvas_create_html_card` or a plan step; the board shows it without scripts, so scripts only enrich).
- **Title**: short and specific, the thing itself ("Hook A: Niemand vertelt je dit over ochtendroutines"), max ~80 characters — the board shows titles first.
- **Body**: the full result in Markdown, in the user's language. Not a summary of it: someone should be able to use the card without the chat.
- Several alternatives (hooks, variants, clips) → one card each, not one card with a list. A choice the user makes → a small `note` "Keuze: Hook B" in the same frame.

**One call per step.** Use `canvas_create_items` to create a step's frame, cards and links in one call (refs for new items, ids for existing ones; frames first in `items`). Use `canvas_create_item` only for a single card. Never fire several create calls in parallel: they can land on the same free spot.

**Many cards at once: `canvas_apply_plan`.** A whole board in one go (a brandbook, frames with HTML cards) is one plan on `board_id` or `board: { folder_id, name }`: steps with `ref`s, played live with the agent cursor. Over ±40 KB, send it in parts: each next part with `append: true` and the `run_id` of the previous answer. With `render: true` the answer brings a check per HTML card and a contact sheet: fix findings before saying done. A long plan answers `running`: follow it with `canvas_plan_status` and that `run_id`. Check cards only through GIMC's render (that answer or `canvas_render_html_card`), never with a local browser or screenshots. Roep GIMC nooit aan buiten de GIMC-tools (geen curl, scripts of tokens).

**Lines.** Two kinds, both via `links` in `canvas_create_items` or via `canvas_link_items`:

- **Lineage** (card → card): the relation from the skill section (`derived`, `variant`, `ab_variant`, `remix`, `repurpose`, `reformat`, `remake`, `structure_clone`) from the card the work came from to the new card. In a run: the chosen hook → the script, the script → the on-screen text, and so on. No lineage back and forth (no cycles).
- **Arrows** (frame → frame): relation `arrow` with a short `label` in the user's language, at most four words in the form "from → to" ("brief → hooks", "gekozen hook → script"). Only between neighbouring frames, so the label does not hide under cards.

**Finding your own work later.** `canvas_list_items` with `run_id` (or `skill`) on the board; `canvas_get_item` for one card in full.

## 6. Update or vary

- Changing your own card: `canvas_get_item` first, then `canvas_update_item` (title, body, data, color, skill, …). `data` replaces the whole object: send it complete.
- `canvas_update_item` fails because a person edited the card: don't retry. Make a variant with `canvas_create_item` (`parent_id` = that card, relation `variant`, same frame via `frame_id`). Setting `skill` on a human-edited card fails for the same reason; then make a variant as well.
- Moving or resizing: `canvas_move_item` / `canvas_move_items`, only for things you placed. An error or `skipped` entry ("een mens heeft …"): a person placed it; leave it and work around it.
- Changing an arrow label: `canvas_update_link` returns a new link id; use that one afterwards.

## 7. Media

Video and images go on the board as real files, uploaded through a signed URL. Full steps, commands and workarounds: [media.md](references/media.md). The short flow: make the card first (in the step's `canvas_create_items` call), then `canvas_media_upload_url` with its `item_id`, `file_name`, `mime` and exact `bytes`, PUT the file to `signed_url` with `Content-Type` = the mime, and `canvas_media_complete` with `item_id` and `path`. A video also gets a poster (first frame via ffmpeg, uploaded with `role: poster`).

Allowed: mp4, mov, webm, png, jpeg, webp, up to 200 MB. Audio is not accepted (see media.md). A `carousel` card does not take images as its media: slide 1 goes on as its poster, other slides as separate `image` cards (see media.md).

**When the upload is refused** (`CONNECT tunnel failed, response 403`): keep the card with the local file path in its body, finish the run, and tell the user once to allow the exact host of the `signed_url` under claude.ai → Settings → Capabilities (network egress); details in media.md.

## 8. Example: a reel run

"Maak een reel over ochtendroutines" → `run_id` `reel-ochtendroutine-20261030`, board "In productie", ten frames in one row, an arrow between each pair:

| # | Frame | Skill | Cards |
|---|---|---|---|
| 1 | Brief | gimc-canvas | `doc` brief, `note` sources |
| 2 | Hooks | viral-hook-writer | 3–5 `hook` cards, `note` "Keuze: …" |
| 3 | Script | reel-scripter | `script` |
| 4 | Tekst in beeld | on-screen-text-writer | `note` |
| 5 | Shotlist | b-roll-shot-list | `doc` |
| 6 | Voice-over | the voice tool used | `doc` lines, `video` waveform |
| 7 | Opnames | the tool that made them | one `video` per shot |
| 8 | Cover | cover-thumbnail-brief | `doc` brief, `image` cover |
| 9 | Eindvideo | reel-builder | `video` 9:16 with poster |
| 10 | Publicatie | caption-and-hashtags | `note` caption |

Arrow labels in the form "from → to" ("brief → hooks", "gekozen hook → script", …); lineage runs card to card along the same path. Coordinates and frame sizes: [layout.md](references/layout.md).

Place each step as soon as it is done: one `canvas_create_items` call per step, so the user can follow the run. Check the inbox between steps.

## 9. When you are done

1. **Update the folder note** once, if a next session needs something new: where things are, decisions made, open work, what the user wants. Add to the text you read (keep what people wrote) and call `canvas_update_folder_note` with the whole text and the `expected_version` you read. Keep it short: no conversation transcripts, no personal or sensitive data (phone numbers, emails, private details of contacts). On a version conflict, read again, merge your lines into the newer text, retry once — never overwrite. Layout and a sample: [references/folders.md](references/folders.md).
2. **Close with one or two sentences** in the chat: what is on which `folder › board › frame`, and anything that was skipped (an upload, a human card you left alone, a note you could not save). Don't paste the card contents again.
