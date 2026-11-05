# Layout on the GIMC canvas

The board is read left to right, step by step. All steps of a run stay on one board (chosen once, see SKILL.md §3); each step is a frame — a section — on that board, never a board of its own. Measure everything from the numbers below so frames and cards never overlap and the board looks the same every run.

## Sizes

| Thing | Size (w×h) | Notes |
|---|---|---|
| Text card (`note`, `hook`, `script`, `analysis`, `idea`, `doc`) | 280×180 | default; don't pass w/h |
| Media card (`video`, `image`, `carousel`, `link`) | 240×480 | 9:16 phone frame; the frame follows the real aspect of the file |
| Landscape video or image (16:9) | 480×300 | pass w/h when creating the card, or `canvas_move_item` with same x/y and new w/h |
| Square image (1:1) | 320×360 | idem |
| Frame | 900×760 | default; grow it for many cards (see below) |

Inside a frame: 40 px padding left, 56 px from the top (room for the title).

- Text cards: column step 320 (280 + 40 gap), row step 220 (180 + 40). Two columns fit in a 900-wide frame, three rows in 760.
- Media cards: column step 280 (240 + 40), row step 540 (480 + 60).
- Frame size for n columns and r rows: `w = 40 + n × step_x`, `h = 56 + r × step_y + 40`. Six phone cards in two rows of six → 1760×1250 ("7 · Opnames" on the reference board).

Between frames: 260 px horizontally, so the next frame's `x = previous.x + previous.w + 260`, same `y`. Frames of one run share one row. A second run goes below everything: start at `next_free` from `canvas_board_overview`.

## Placing a step

On a new run, the very first call comes before any content work: the frame "1 · Brief" with a brief or plan card, within the first minute. Short or test runs included. After that, one call per finished step; never all cards at the end.

1. `canvas_board_overview` → `next_free`, and the existing frames (title, x/y/w/h, `member_ids`, `free_spot`).
2. Is there already a frame for this step in this run? `canvas_list_items` with `run_id` and `kinds: ["frame"]`, match the title. Yes → use its id as `frame_id`. No → create one.
3. One `canvas_create_items` call for the step:

```json
{
  "board_id": "<board>",
  "items": [
    { "ref": "f3", "kind": "frame", "title": "3 · Script", "x": 2320, "y": 0, "w": 900, "h": 760,
      "skill": "reel-scripter", "run_id": "reel-ochtendroutine-20261030" },
    { "ref": "script", "kind": "script", "frame_id": "f3", "title": "Script: 5 dingen die ik elke ochtend doe (35 s)",
      "body": "…full script in Markdown…", "skill": "reel-scripter", "run_id": "reel-ochtendroutine-20261030" }
  ],
  "links": [
    { "from": "<frame id of 2 · Hooks>", "to": "f3", "relation": "arrow", "label": "gekozen hook → script" },
    { "from": "<id of the chosen hook card>", "to": "script", "relation": "derived" }
  ]
}
```

Frames go first in `items`; cards refer to a new frame by its `ref`, to an existing frame by its id. `from`/`to` take refs or existing ids. The whole call succeeds or nothing is created.

Leave x/y off cards that have a `frame_id`: GIMC places them on a free spot inside the frame. Pass `frame_id` or x/y, never both.

## "Het kader is vol"

The error names what is in the way. Then:

- The frame is yours (you created it this run): grow it with `canvas_move_item` (same x/y, larger w/h; the cards stay put) and place again. Check first in the overview that the larger frame does not run into the next frame; if it would, grow it downward (h) instead of sideways.
- The frame was placed or moved by a person: don't touch it. Create a continuation frame directly below it ("2 · Hooks (vervolg)", same width, 60 px gap) if the board overview shows free space there, otherwise at `next_free`, with an `arrow` from the full frame, and place the cards there.

## Arrows and lineage

- **Arrow** = flow of the run, frame → frame, relation `arrow`, `label` ≤ 4 words: "brief → hooks". Only between neighbours; a long arrow crosses other cards and its label hides under them.
- **Lineage** = where a card came from, card → card, relation from the skill section. Each new card gets lineage to the card it was built from (chosen hook → script; every shot → final video). A user choice is a `note` "Keuze: Hook B" in the same frame; the chosen card is the parent of the next step.
- The same link twice returns the existing one, so retrying a link is safe. Lineage can't form a cycle.

## Plans

A whole board in one go (a brandbook, frames with HTML cards) is one `canvas_apply_plan` on `board_id` or `board: { folder_id, name }`: steps with `ref`s, played live with the agent cursor.

- Over ±40 KB, send it in parts: each next part with `append: true` and the `run_id` of the previous answer.
- With `render: true` the answer brings a check per HTML card and a contact sheet: fix findings before saying done.
- A long plan answers `running`: follow it with `canvas_plan_status` and that `run_id`.
- Check cards only through GIMC's render (that answer or `canvas_render_html_card`), never with a local browser or screenshots.

## The reference run: "TEST Eindvideo · zo is hij gemaakt"

A finished reel run on the dev board of that name. The x positions below follow the rules above (the real board drifted a little); frames all at y = 0, 900×760 unless noted:

| Frame | x | Contents | Arrow to next |
|---|---|---|---|
| 1 · Brief | 0 | `doc` brief, `note` sources | brief → hooks |
| 2 · Hooks | 1160 | 3 `hook` cards (A, B, C), `note` "Keuze: Hook A" | gekozen hook → script |
| 3 · Script | 2320 | `script`, `note` with a remark | script → tekst in beeld |
| 4 · Tekst in beeld | 3480 | `doc` on-screen lines, `note` mute-pass | tekst → shotlist |
| 5 · Shotlist | 4640 | `doc` shotlist | shotlist + script → stem |
| 6 · Voice-over | 5800 | `doc` lines, `video` waveforms | shotlist → opnames |
| 7 · Opnames | 6960 (1760×1250) | one `video` per shot, 6 per row | opnames → cover |
| 8 · Cover | 8980 | `doc` cover brief, `image` cover | alles → montage |
| 9 · Eindvideo | 10140 | `doc` build table, `video` final 9:16 | eindvideo → publicatie |
| 10 · Publicatie | 11300 | `doc`/`note` caption | — |

Card titles say what the card is ("Hook A: …", "Script: … (25 beats, ~3,5 min)", "Eindvideo: … (9:16, 3:14)"). All cards carry the same `run_id`.

## A single skill on its own

One skill, no larger run (e.g. "write five hooks about X"): one frame with the frame name from the skill section (no number), at `next_free`, cards in it, own `run_id`. If the user worked from a card ("make hooks for this script"), place the new frame to the right of that card's frame when there is room (check the overview), else at `next_free`, and draw lineage from the source card.

## Things to avoid

- Cards outside a frame, unless the user asks.
- Parallel create calls (they can land on the same spot): one `canvas_create_items` per step.
- One card holding a list of alternatives: one card per alternative.
- Moving or resizing what a person placed.
- Re-creating a step that is already on the board: look it up by `run_id` and add a variant if it changed.
