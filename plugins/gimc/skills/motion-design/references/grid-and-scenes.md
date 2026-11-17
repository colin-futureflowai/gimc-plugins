# Grid and scene types — GIMC's own layout system

GIMC's layout for 9:16 reels, used by the scene types of [video-components](../../video-components/SKILL.md). The
storyboard ([storyboard.md](storyboard.md)) fills the slots; safe areas: [safe-zones.md](safe-zones.md).

## The grid

One grid per reel, inside the target platform's safe area (several or unknown: the universal one).

- **6 columns, 24 px gutters; 8 rows** of 1/8 of the safe area's height; positions snap to an **8 px base**.
- **Anchor cells:** columns **A–F** × rows **1–8**, A1 top-left; a span is `B3–E5`. Speak in cells, never pixels.

Cell sizes on 1080×1920 (scale by width for other sizes):

| Safe area | Column width | Row height | 4 columns (`FIGURE.lg`) |
|---|---|---|---|
| Universal (x 120–780 × y 288–1248) | 90 px | 120 px | 432 px (40 % of the frame width) |
| Instagram / Facebook Reels (65–1015 × 269–1248) | 138 px | 122 px | 625 px |
| YouTube Shorts (48–888 × 288–1248) | 120 px | 120 px | 552 px |
| TikTok in-feed (120–780 × 240–1260) | 90 px | 128 px | 432 px |

- **The caption band is rows 7–8** when the reel has captions; nothing else enters it.
- **Rows 1–4 are prime space** for the hook, the hero word and a face.

## Tokens

From `src/theme.mjs` in the starter. A gap or size that is not a token needs a reason in the storyboard.

- **Spacing** `SPACE = [8, 16, 24, 40, 64, 104]`: 8–24 inside a group, 64 or 104 between groups, at most **3
  distinct gaps** per frame.
- **Figures in columns** `FIGURE = { sm: 2, md: 3, lg: 4, xl: 6 }`. One symbol keeps one size for the whole reel
  (the storyboard's `legend`).
- **Icons** inside a hero at least `ICON.md`, **96 px** on 1080 wide.
- **The hero is at least `FIGURE.lg`** (4 columns); a hero word spans all 6 columns.
- **Brand slot:** the logo appears only in the `end-card` brand slot, at its fixed size.

## Limits

- **One axis per reel:** column A's left line or the centre between C and D.
- **At most 5 free elements per frame;** a part and its children count as one (relations: [storyboard.md](storyboard.md)).
- **An information card** is complete within **2.5 s** of its beat start, then holds.

## Scene types on the grid

Starting layouts on the universal area; the type fixes the slots, the storyboard fills them.

| Type | Slots (cells) |
|---|---|
| `hook` | hero word or hero figure in rows 1–4, all 6 columns; one supporting line under it |
| `text` | one line on the reel's axis in rows 2–5; key word ≥ 1.5× the rest |
| `media` | footage or a photo full-bleed (may cross danger zones); any text in a slot inside rows 1–6 with a backing |
| `diagram` | the diagram in rows 1–6, at least `FIGURE.lg`; labels as children of their parts |
| `compare` | two sides stacked, equally tall, on one left edge (rows 1–3 and 4–6), each a figure with its label next to it; side by side does not fit 9:16 |
| `actor-object` | figure and object on one ground line, at a fixed scale ratio for the whole reel |
| `stack` | 2–4 items on one left edge, equal gaps from `SPACE`, revealed one per voice cue |
| `presenter` | the card above, the face just under it and above the caption band; without a presenter the card slot grows |
| `end-card` | keyword field in rows 2–4; the brand slot (logo 3 columns wide, on column A) at the bottom of the content; `cta` is an alias |

An element outside a scene type only with a reason in the storyboard, and then still on the grid.

## Pick the shape before the picture

Name the shape of each line first, then the scene type, so similar lines get different pictures.

| Shape of the line | Scene type | The picture |
|---|---|---|
| A number that lands | `text` or `hook` | the number as the hero, earned by the beat before it |
| A myth turned over | `compare` | the wrong idea struck through; the right one `replaces` it in the same place |
| Before and after | `compare` | two states stacked on one left edge; the winner gets the accent |
| Steps in order | `stack` (2–4), or `diagram` that grows | one step per voice cue, numbered only when the order is real |
| Parts of a whole | `diagram` | one structure, one part added per beat |
| Many things into a few groups | `diagram` | the items move into their groups; nothing is redrawn |
| One chosen out of many | `stack` or `diagram` | the others fade to the muted tint; the chosen one stays at full colour |
| Someone uses something | `actor-object` | figure and object on one ground line, fixed scale ratio |
| A real screen with the detail that matters | `media` | the screenshot, the detail circled, a `label-of` on the circle |
| A quote | `text` | the quote set as a poster, the name as small print |

## The `diagram` scene: one diagram that grows

- **Simplest true picture first**, then one part per beat, at the word that names it.
- **It stays put** in its cells and size; parts morph in place (0.2–0.4 s), a replaced part uses `replaces` (same
  cell, same size). What appears stays, or leaves with a cause.
- **Every part the voice names gets a label** of 1–3 words, on the part or the next cell; no legend in a corner.
- **Rows 1–6, at least `FIGURE.lg`.**
