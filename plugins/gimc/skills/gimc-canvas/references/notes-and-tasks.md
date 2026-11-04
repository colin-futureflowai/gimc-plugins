# Notes, tasks and human work

People steer you from the board: they leave **notes** (comments on a card) and **tasks** (an instruction on a card, assigned to Claude). Both show up in `canvas_inbox`. Your comments appear on the board labelled "Claude".

## When to look

- At the start of every turn in which you do canvas work.
- Between the steps of a long run (after each step you place).
- When the user says "pak mijn notities op", "pak mijn opdrachten op", "what's waiting for me", or similar.

Call `canvas_inbox` (pass `board_id` to limit it to the board you work on, `org_id` if the conversation uses one). It returns:

- `tasks`: open tasks — `id`, `item_id`, `item_title`, `instruction`, `board_id`, `board_name`.
- `notes`: human comments you have not answered yet — `comment_id`, `item_id`, `board_id`, `item_title`, `body`, `created_at`. Oldest first.

If `has_more_tasks` or `has_more_notes` is true, handle what you have first and call `canvas_inbox` again for the rest.

A note counts as answered as soon as you comment on the same card after it. One comment therefore answers **all** open notes on that card: read them together and reply once.

## Picking up a note

1. **Reply first** with `canvas_add_comment` on the noted card: "Opgepakt: <what you will do, one line>" (in the note's language; in English "Picked up: …"). This tells people and other sessions it is taken.
2. **Read the card** with `canvas_get_item` (text, lineage, other comments) so you understand what it refers to.
3. **Do the work** with the skill that fits the request (a new hook → viral-hook-writer, a shorter script → reel-scripter, …).
4. **Place a new card** — never overwrite the noted card. Same frame as the noted card (`frame_id`), same `run_id` if it belongs to a run, `skill` of the skill you used, and a line from the noted card: relation `variant` for a revised version of it, `derived` for something new built from it, or the relation the skill's own section names.
5. **Close with a short comment** on the noted card: "Klaar: nieuwe kaart '<title>'". First check `canvas_get_item` for comments that came in after your "Opgepakt": your closing comment marks those as answered too, so handle them before you close.
6. Mention it in the chat in one sentence.

A note during a run: finish the step you are on, then pick up the note, then continue the run.

### Not a request

"Mooi!", "top", "goed zo": reply with a short comment (e.g. "Dank je!") and do no work. That answers it.

### Unclear

If you can't tell what the note asks, or it asks something big or risky (rebuild a whole run, change many cards), ask in the **chat**, not on the board: quote the note and ask one question. Don't comment "Opgepakt" until you know what you'll do.

### Several notes

Work through them oldest first, one card at a time. Group notes on the same card into one reply and one piece of work.

## Tasks

1. `canvas_claim_task` with the task `id` before you start. "Opdracht is al opgepakt" → someone else has it; skip it.
2. Read the card (`canvas_get_item`) and the `instruction`.
3. Do the work with the fitting skill. Put the result as a new card next to the task's card (its frame, or the right frame for the skill), with a line from the task's card.
4. `canvas_complete_task` with `result_item_id` (the new card) and a one-line `result_note`.
5. Can't finish it (missing input, out of scope)? `canvas_release_task` with a `note` that says why. It goes back to open. Then tell the user in the chat.

`canvas_list_tasks` lists tasks with another status (`claimed`, `done`) if you need to look back.

## Human work

Cards people made or changed are theirs.

- **Edited text** (`canvas_update_item` fails with a message that a person edited it): make a variant — `canvas_create_item` with `parent_id` = that card, relation `variant`, same frame. Same when setting `skill` on such a card fails.
- **Placed or moved** (`canvas_move_item` errors, or `canvas_move_items` lists it in `skipped`): leave it where it is. Don't retry. If it is in your way, place your work around it (a new frame at `next_free`, or a continuation frame). Mention it only if it changes what the user sees.
- **Archiving**: only cards and arrows you placed yourself and nobody touched. Archiving human cards fails; never try to work around it. Nothing is ever deleted.
- **A human comment on your card is feedback**, not an edit: treat it as a note (above).

## Tone of your comments

Short, in the language of the note, no greeting, no sign-off. One line is usually enough: "Opgepakt: drie kortere hooks met de vraag vooraan." / "Klaar: nieuwe kaart 'Hook D: …'".
