# Notes, tasks and changing a person's card

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
4. **Place a new card** — unless the note asks to change the card itself (then update it as under "Changing a person's card"). Same frame as the noted card (`frame_id`), same `run_id` if it belongs to a run, `skill` of the skill you used, and a line from the noted card: relation `variant` for a revised version of it, `derived` for something new built from it, or the relation the skill's own section names.
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

## Changing a person's card

People and Claude work on the same board. You may update, move and archive any card, also one a person made or edited. Nothing is lost: every text change first saves the old version, and a person restores any version in the card panel (Versies → Terugzetten).

- **Before you change text**: `canvas_get_item` right before, then `canvas_update_item` with `expected_updated_at` = the `updated_at` you just read. Change only what the request is about; keep the person's wording, facts and choices unless the user asks you to replace them.
- **409 "De kaart is intussen gewijzigd"**: someone changed the card after you read it. The error ends with JSON `{"current": {item_id, title, body, data, updated_at, edited_by_human_at}}`. Apply your change to `current` (not to what you read earlier) and send again with `current.updated_at`. If the new text already does what you wanted, stop. After two 409s in a row, leave the card and tell the user.
- **`edited_by_human_at`** says a person wrote the text last. It does not block you; it is a reason to be careful with their wording.
- **Both versions useful?** When the user wants to compare, or your change rewrites most of the text, make a variant — one `canvas_create_items` call with the new card in the same frame and a `variant` link from that card — instead of replacing it.
- **Moving**: you may move or resize any card or frame, also one a person placed; moving a frame carries every card inside. Move a person's card only when it helps the task (tidying the board the user asked for, making room); don't rearrange their layout for your own taste.
- **Archiving**: you may archive any card or arrow; it goes to the Archive and a person can restore it. Archive a person's card only when the user asks or it is clearly part of your task. Lineage links (variant, remix, …) are never archived. Deleting for good is for people only.
- **A human comment on your card is feedback**, not an edit: treat it as a note (above).

## Tone of your comments

Short, in the language of the note, no greeting, no sign-off. One line is usually enough: "Opgepakt: drie kortere hooks met de vraag vooraan." / "Klaar: nieuwe kaart 'Hook D: …'".
