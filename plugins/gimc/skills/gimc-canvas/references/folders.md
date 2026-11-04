# Folders and folder notes

Boards live in folders, usually one per client or campaign, and folders can hold folders. Every folder has one markdown note: its memory, read by you at the start of work and updated at the end of a run, like a CLAUDE.md per directory. People can read and edit the note in GIMC too.

## What you get from the tools

- `canvas_list_folders` (optional `parent_id`: only the subfolders of that folder, `null` only the top level): each folder has `folder_id`, `path` ("Content › Client X › Launch", separated by ` › `), `board_count`, `folder_count` and `note_version`.
- Boards carry `folder_id` and `folder_path`. Pass `folder_id` to `canvas_list_boards`, `canvas_create_board`, `canvas_update_board` (moves the board) and `canvas_seed_default_boards`.
- `canvas_create_folder`: `name` (1–60 characters), optional `parent_id`, `seed_defaults`. Without `parent_id` the folder goes under the default folder, which is named after the company.
- `canvas_update_folder` renames or moves a folder. Archiving a folder is for people only.

## Matching names

Match on the end of the `path` first, case-insensitive: "client x" matches "Content › Client X". Then look at the boards of that folder.

- "Op het bord Launch" and two folders have a board "Launch": ask once ("In Client X or in Client Y?") and remember the answer for the conversation.
- "In de map Client X, bord Launch": the folder narrows the board, so no question is needed.
- The user names nothing and the conversation has not used a folder yet: one folder in the workspace means that one; several means ask once, listing the `path` values.
- A name that nearly matches ("Clientx"): confirm in one short question rather than creating a second folder.

## Creating a folder

Create one only when the user names it ("maak een map voor Client Y") or the work clearly needs its own place (a new client or campaign that has no folder). Never create a folder for a single card or a one-off run: use the default folder or the folder the user is working in.

1. Check `canvas_list_folders` first; the folder may already exist under another parent.
2. Ask once "standaardborden of vanaf nul?" (in the user's language), unless the user already said. Standaardborden = `seed_defaults: true`.
3. The very first folder of a workspace is the default folder and always gets the five default boards; do not ask there.
4. A subfolder: pass `parent_id`. A top-level folder next to the default folder: `parent_id: null`, but only when the user asks for that.

A folder without boards (made "vanaf nul") stays that way on purpose: give it only the boards a run needs, with `canvas_create_board` and its `folder_id`. Seed the default boards there only when the user asks. Without asking, seed them only in a brand-new workspace that has no folders or boards yet.

## The folder note

Read it with `canvas_get_folder_note` (`with_parents: true` gives the parents' notes too, top-down). The answer has the text and the `version`; an empty text means there is no note yet. With `version` you read an older version.

Write it with `canvas_update_folder_note`: the **whole** text as `body`, plus the `expected_version` you read (`0` when there was no note). Old versions stay, so nothing is lost, but a stale `expected_version` is refused.

Keep it short, a screen or less. Headings that work:

```markdown
# Client X

## Where things are
- Board "In productie": reels for the launch, run ids reel-launch-*.
- Board "Onderzoek & concurrentie": competitor notes.

## Decisions
- Tone: direct, no jargon. Hook B won the first test.
- Reels are 9:16, 30–45 seconds, captions in Dutch.

## Open work
- Cover for reel 3 still missing.
- Waiting for the user's choice between two scripts.

## What the user wants
- Two reels a week, published on Tuesday and Friday.
```

Rules:

- **Add, don't replace.** Keep every line a person wrote and place new lines under the right heading. Remove only lines you wrote yourself that are now outdated (for example finished open work).
- **Short and useful for the next session**: where things are, decisions, open work, what the user wants. No conversation transcripts, no card bodies.
- **Nothing personal or sensitive**: no phone numbers, email addresses, passwords or private details of contacts or people.
- **Write once per run**, at the end, and only when there is something new.

## Conflicts

`canvas_update_folder_note` fails when the note changed since you read it (a person or another session saved a newer version). Never overwrite. Read the note again, merge your new lines into the newer text, and write once more with the new `version` as `expected_version`. If it fails a second time, skip the update and tell the user in one sentence that the note was not saved.
