---
name: gimc-canvas
description: The GIMC hub. How to put work on the GIMC canvas (boards, a frame per step, cards, arrows, run_id and skill, media, notes and tasks on cards) and which GIMC skill takes the next step (brand, builds, planning and publishing). Use when a skill says "Put it on GIMC" or "follow gimc-canvas", or the user says "put it on GIMC", "zet het op het canvas", "op het bord", "pak mijn notities op", "pak mijn opdrachten op", "what's waiting for me on the canvas", or asks why the canvas or an upload failed.
---

# GIMC canvas

This is plugin version 0.11.0. If `plugin_info` is available, compare its `version` with this one once per conversation and, if it is newer, tell the user in one sentence that an update is ready (`/plugin marketplace update gimc`, or the GIMC download).

The GIMC canvas is the user's content board at `/marketing/canvas`. People watch it while you work: make the board read like the story of the run.

Hard rules — they apply to every section below:

1. **The canvas never blocks the work.** If a canvas call fails, finish the content work anyway and tell the user in one sentence what was skipped and why. Never retry the same failing call more than once.
2. **Work together, never overwrite blindly.** You may change, move or archive any card, also a person's. Read it right before, send `expected_updated_at`, and keep what the person wrote.
3. **Never lose anything.** Text changes keep the old version; archive only what is truly wrong or what the user asks for.
4. **Every card you make carries `skill` and `run_id`.** `skill` is the exact name of the skill or tool that made the card; your own glue cards (a brief, a choice note) use `gimc-canvas`.
5. **Read errors.** GIMC errors are short Dutch sentences that name the cause. Fix what they name; don't guess around them.

References — open the one you need:

- [references/layout.md](references/layout.md) — sizes, placing frames, lines, plans, the full reel run, full frames.
- [references/media.md](references/media.md) — uploads, posters, carousels, Cowork network and Remotion workarounds.
- [references/folders.md](references/folders.md) — matching folder names, creating a folder, writing the folder note.
- [references/notes-and-tasks.md](references/notes-and-tasks.md) — the inbox, notes, tasks, replies, changing a person's card.
- [references/scheduling.md](references/scheduling.md) — the GIMC content calendar.

## 1. Check the connection

Look for a tool whose name ends in `canvas_list_boards`; the prefix differs per app. None: GIMC is not connected: do the content work anyway, then say once per conversation how to connect:

- **Cowork or claude.ai**: "To see this on your GIMC canvas, add GIMC once as a connector: claude.ai → Settings → Connectors → Add custom connector, URL `https://gimc-app.vercel.app/api/mcp`, then sign in ("Log nu in"). Then ask me again to put it on GIMC."
- **Claude Code**: "Run `/mcp`, pick `gimc` and choose Authenticate; then ask me again."

Use that URL exactly. No rights or an expired token: say so in one sentence and continue without the canvas.

## 2. Orient with one call — before any other canvas call

The **first** canvas call of a conversation is `canvas_get_context` (with `folder_id` or `board_id` when you know one, otherwise `workspace` and `folder` by name when the user named them, and `include_inbox: true`). One answer gives the workspace, the folder path, every folder note up the chain, the folder's brand, its boards and subfolders, and with `board_id` the board overview (`next_free`, frames) and that board's inbox. Don't repeat that with separate calls.

- `choose_workspace: true` with a list `workspaces`: that is the answer, not a failure. Use the one the user named and say which; otherwise ask **once per conversation**. Then pass that `org_id` in **every** GIMC call, including uploads, plans and links.
- "Geen bedrijf gekoppeld": the account has no workspace. Say so in one sentence and skip the canvas.
- An older GIMC without `canvas_get_context`: start with `canvas_list_boards` without `org_id`, then the folders, the folder note and `canvas_inbox`.

## 3. Pick the folder and board — once per run

Boards live in folders (per client or campaign). **All steps of a run stay on one board.** A board is not a step: each step is a frame on the run's board. Choose folder and board once, at the first card of a new run — never a board per step. In this order (name matching: [references/folders.md](references/folders.md)):

1. **The folder or board the user names**, matched case-insensitively on the folder `path`, then on that folder's boards. A name in several folders: ask once. A wanted board that does not exist: `canvas_create_board` with `folder_id`.
2. **The folder and board of the current run** or of the source card (items carry `board_id`; boards carry `folder_id`).
3. **The folder of the previous run in this conversation.** Several and no hint: ask once and remember.
4. **Inside the folder, the default board** for the frame of the run's first step:

| Kind of run (frame of its first step) | Board for the whole run |
|---|---|
| Ideeën, Planning, Strategie, Notities | Ideeën |
| Onderzoek | Onderzoek & concurrentie |
| Analyse | Analyses |
| Hooks, Script, Tekst in beeld, Shotlist, Cover, Eindvideo, Clips, Carrousel, Stories, Publicatie, CTA, Profiel, Outreach, Opvolging, Reacties, Briefing, Bouwwerken | In productie |
| Brandbook | Brandbook |

Numbers of a published post: their own run, on "Mijn content". Fitting board missing: create only that one. Seed the default boards (`canvas_seed_default_boards`) only when asked or in a brand-new workspace. Always pass `folder_id` to board tools. A new folder only for a new client or campaign, never for one card; leave out `parent_id` so it goes under the default folder.

**Folder notes are memory**, like a CLAUDE.md per directory: read them at the start (in the context answer, or `canvas_get_folder_note` with `with_parents: true`; the nearest note wins) and write once at the end (section 9).

## 4. Check the inbox

Before you place anything, at the start of every turn with canvas work, and between steps of a long run: `include_inbox: true` in the context call, or `canvas_inbox` (with `board_id` on one board). Empty: go on silently. Otherwise ([notes-and-tasks.md](references/notes-and-tasks.md)):

- A task → `canvas_claim_task`, do it, `canvas_complete_task` with the new card.
- A note → reply first with `canvas_add_comment` ("Opgepakt: …"), do the work, put a new card with a line to the noted card. A note that is no request ("mooi!") gets a short reply. In doubt, ask in the chat.
- Review decisions (when the inbox has `reviews`): "changes requested" is work like a note — change the card, then ask for review again; "approved" means ready to plan (`content-planning`).
- Something new during a run: finish the step, then pick it up and say so in one sentence.

"Pak mijn notities op" / "pak mijn opdrachten op": work through the whole inbox, oldest first.

## 5. Lay it out

The board reads left to right like the run: one frame per step, its cards in a grid inside, an arrow with a short label to the next step. Sizes, lines and the full reel run: [layout.md](references/layout.md).

**run_id.** One run = one `run_id` for every frame and card: `<topic>-<yyyymmdd>`, lowercase with hyphens (`reel-ochtendroutine-20261030`). Continuing earlier work: find it with `canvas_list_items` (`run_id`) and reuse it. A skill used on its own is its own small run.

**First card within the first minute.** Before you start the actual work, create the board's first frame ("1 · Brief") with a brief or plan card (what you will make, for whom, the steps) in one `canvas_create_items` call. Do this first, in a short or "test" run too. From then on each step goes on the board as soon as it is done. Never save all cards for the end; an empty board defeats the point of watching it.

**Frames.** The board overview gives `next_free` and every frame with a `free_spot`. Each step gets a frame (kind `frame`) titled with the frame name from the skill's "Put it on GIMC" section, numbered in a run ("1 · Brief", "2 · Hooks"), with the run's `run_id` and the step's `skill`. Reuse a frame with that title in the run (`frame_id`); otherwise the first frame at `next_free` and every next one 260 px to the right, 900×760 by default.

**Cards.** Create them with `frame_id` and no x/y: GIMC finds a free spot and nothing overlaps.

- Kind, frame and relation come from the skill's "Put it on GIMC" section. Kinds are exactly: `video`, `image`, `carousel`, `note`, `hook`, `script`, `analysis`, `idea`, `link`, `doc`, `frame`, `html` (a self-contained page, made only with `canvas_create_html_card` or a plan step; the board shows it without scripts, so scripts only enrich). **Building** an email, carousel, post or story: one `canvas_create_build` call, see `canvas-builds`.
- **Title** short and specific, the thing itself (max ~80 characters). **Body** the full result in Markdown, in the user's language, usable without the chat.
- Alternatives: one card each. A choice: a `note` "Keuze: Hook B".

**One call per step.** Make one `canvas_create_items` call per step: frame, cards and links together (frames first; refs only for items in this call, ids for existing ones). Never in parallel.

**Many cards at once: `canvas_apply_plan`.** A whole board in one go (a brandbook, frames with HTML cards) is one plan, played live; big plans in parts; check HTML cards only through GIMC's render (`render: true`), never with a local browser or screenshots ([layout.md](references/layout.md), "Plans"). Roep GIMC nooit aan buiten de GIMC-tools (geen curl, scripts of tokens).

**Lines.** Lineage (card → card): the skill's relation, from the source card to the new card, no cycles. Arrows (frame → frame): relation `arrow`, a label of at most four words ("brief → hooks"), only between neighbouring frames. Both via `links` in `canvas_create_items` or `canvas_link_items`.

## 6. Update or vary

- Changing a card: `canvas_get_item`, then `canvas_update_item` with `expected_updated_at` = its `updated_at`. `data` replaces the whole object.
- 409 "De kaart is intussen gewijzigd": apply your change to `current` from the error and send again. Both versions useful? Make a `variant`.
- Moving or resizing: `canvas_move_items`. An arrow label: `canvas_update_link` returns a new link id.

## 7. Media

Make the card first, then `canvas_media_upload_url` (`item_id`, `file_name`, `mime`, exact `bytes`), PUT the file to `signed_url`, and `canvas_media_complete`; a video also gets a poster. mp4, mov, webm, png, jpeg, webp, up to 200 MB. Details: [media.md](references/media.md).

**Upload refused** (`CONNECT tunnel failed, response 403`): keep the card with the local file path in its body, finish the run, and tell the user once to allow the exact host of the `signed_url` under claude.ai → Settings → Capabilities (network egress).

## 8. From card to post: the chain and which skill

A card is the anchor of a piece of content:

| Step | Skill |
|---|---|
| Make it (research, hooks, script, reel, caption, …) | the content skill itself |
| Brand and design system of a folder | `brandbook` |
| A ready-to-use email, carousel, post, story | `canvas-builds` |
| Ask for approval, plan it, put it at the platform, follow its status | `content-planning` |
| Numbers of accounts and posts, boosts | `social-insights` |
| Comments, reply drafts, reply campaigns | `social-engagement` |

Approval is a person's decision on the card, with a comment. You can ask for it, never give it. Whether a planned post goes to the platform is GIMC's call: the answer says `at_platform`; otherwise it waits in the calendar for a person.

## 9. When you are done

1. **Update the folder note** once, if a next session needs something new: where things are, decisions, open work, what the user wants. Keep what people wrote, add your lines, and call `canvas_update_folder_note` with the whole text and the `expected_version` you read. Short; no transcripts, no personal data. On a conflict, read again, merge, retry once — never overwrite ([references/folders.md](references/folders.md)).
2. **Close with one or two sentences**: what is on which `folder › board › frame`, and anything skipped. Don't paste the card contents again.
