# Storyboard before code

A reel looks "random" when code is the first place it is designed: every element gets its own coordinates, nothing
is tied to anything, and the next tween leaves a label behind. So the scene design is written down first, as data,
and the code only fills it in. This file is the method and the schema; the scene types and their slots are in
[grid-and-scenes.md](grid-and-scenes.md), the diagram rules in [types/explainer.md](types/explainer.md), the field names per scene type
in [video-components](../../video-components/SKILL.md) §3.

## 1. The order

1. **Script and timings.** The voiceover and its word timestamps (reel-builder). Cuts land on the word that starts a
   beat.
2. **Message per beat.** What a viewer gets from the frame alone, without sound, in at most **8 words**
   ("Laag 1: begin met het doel"). If you cannot write it, the beat has no picture yet.
3. **Shape, then scene type.** Name the shape of the line (a number, before/after, steps, parts of a whole, someone
   using something; [grid-and-scenes.md](grid-and-scenes.md)) and pick the one scene type that shows it: `hook`, `text`,
   `media`, `diagram`, `compare`, `actor-object`, `stack`, `presenter`, `end-card`.
4. **Hero.** The one focal point of the beat. Everything else supports it.
5. **Relations.** Every other element names how it hangs on the hero, a part or a slot (§3). An element without a
   relation is dropped, not placed "somewhere with room".
6. **Legend.** Every symbol of the reel, with its one meaning and its one size (§4).
7. **What stays.** Which elements carry over from the beat before (the diagram, the title): they stand still on the
   cut, only what is new moves.
8. Only then the props, the build and the inspect loop (video-components §4).

Show the storyboard (the beat table of reel-builder) before building when the user is in the loop; it is cheaper to
change a row than a render.

## 2. In props.json

| Where | Field | Rule |
|---|---|---|
| every beat | `message` | at most 8 words; the build stops without it |
| every beat | `type` | one scene type; an unknown type stops the build |
| every beat | `hero` (optional) | what the focal point is, when the scene type's default is not it |
| every beat | `title` (optional) | a keyword or label of a few words, never the caption sentence |
| `legend` | `{ name: { meaning, src, size } }` | one meaning per symbol, one file, one size for the whole reel |
| `diagrams` | `{ id: { kind, parts: [{ id, label }] } }` | `kind` is `pyramid` or `flow`; every part has a label |
| a beat that adds to a diagram | `show`, `focus`, `attach` | `attach: [{ symbol, to, relation, at }]`, `relation` from §3, `to` a part |

`build.mjs` checks all of this before it writes a line of HTML and lists every gap at once. It then writes the whole
storyboard into `index.html` (`<script type="application/json" id="storyboard">`) and onto the elements as data
attributes (`data-scene`, `data-message`, `data-slot`, `data-hero`, `data-part`, `data-label-of`, `data-anchor`,
`data-relation`, `data-symbol`, `data-brand`), so a check can compare the frame with the design.

## 3. Relations

| Relation | Means | Example |
|---|---|---|
| `inside` | sits in the part and moves with it | the target inside the layer "Doel" |
| `on` | lies on the edge or top of it | a speech bubble on a figure |
| `label-of` | names it, sits on it or right under it | "Lange prompt" under the sheet |
| `aligned-with` | shares its left edge, centre axis or baseline | the second item of a stack |
| `next-to` | beside it, in the same row | an icon after a label |
| `below` | under it, connected | the line from one flow step to the next |
| `replaces` | takes its place, same position and size | the right idea where the wrong one was |

The scene types build most relations themselves: a diagram label is `label-of` its part, a compare side's label is
`label-of` its side, the end card's logo sits in the brand slot. You write a relation only for what you add
(`attach`). An element that needs coordinates of its own is a missing scene type: add it to video-components rather
than placing it by hand. An own element outside a scene type only with a reason in the storyboard, and then still on
the grid (an anchor cell, [grid-and-scenes.md](grid-and-scenes.md)).

## 4. The legend

- **One symbol, one meaning.** The robot is "your AI agent" for the whole reel; when the line means "your team",
  that is another symbol. Two meanings for one picture make the viewer relearn it mid-reel.
- **One size per symbol** (`icon`, `sm`, `md`, `lg`, `xl`: an icon is 96 px, the others 2–6 columns). A symbol that
  sits inside a diagram part is an `icon`. A figure that is small in one beat and large in the next reads as a
  different thing.
- **Meaning carriers are big enough.** An icon inside a hero is at least `icon` size; on a 360 px phone it is still
  32 px. Three tiny props inside a big hero are noise.
- A symbol stands for something the voice says. A decoration without meaning has no row, so it is not drawn.

## 5. A beat table that is a storyboard

reel-builder writes the build table with these columns; this is what the reviewer sees next to the sheets.

| # | VO | Message (≤ 8 words) | Scene type | Hero | Other elements → relation | Stays from before | ~s |
|---|---|---|---|---|---|---|---|
| 5 | "Eén: begin met het doel…" | Laag 1: begin met het doel | `diagram` | the pyramid, layer Doel in accent | target `inside` Doel; label `label-of` Doel | the pyramid, the title | 4.8 |

## 6. Before you build: ask of every row

- Does the message fit in 8 words, and would a stranger get it from the frame with the sound off?
- Is there exactly one hero, and does every other element name its relation?
- Does every symbol mean the same thing in every beat, at the same size?
- Is the diagram the same picture as in the beat before, with one part more?
- Does the frame work in both states (with and without the presenter), and stay clear of the caption band?

Source: adapted from HeyGen Hyperframes skills v0.9.61 (hyperframes/references/storyboard.md,
hyperframes/references/storyboard-format.md, hyperframes/references/types/explainer.md), Apache-2.0; with GIMC's
research on coherent reels (failure types T1–T13, November 2026).
