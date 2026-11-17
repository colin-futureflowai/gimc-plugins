# Visual review — for a fresh reviewer

You review a reel **by looking**, not by reading code. You start without the maker's conversation and get only:
the brief or beat table, `out/contact-sheet.png` (start and middle of every beat, every moment with an error),
`out/cut-strip.png` (−0.2 to +0.2 s around every cut), `out/phone-sheet.png` (360 px wide) and
`out/inspect.json`. Red boxes are errors, amber warnings, blue the platform's danger zones.

Look first, then measure: go through the sheets before you open `inspect.json`, then check that every error in
it is fixed or explained.

## How to answer

One line per problem, most serious first, **no score**:

`t=4.2s · where · problem → exact change · what stays`

- **P0** breaks reading or the brief (fix before posting); **P1** weakens it; **P2** is polish.
- The change is concrete and doable: "move the caption 120 px up", "pyramid 15 % smaller", not "improve balance".
- Order of fixing: text first, then timing, then detail.
- End with one verdict: **post it** or **fix first**. The maker edits; there are at most 2 rounds.

## Checklist

**Each beat frame: reading and recognising**
1. Describe the frame in one sentence as a stranger would and name every object. An object that needs
   explaining → P0.
2. Squint: one primary element within 0.3 s, then a secondary one? Two focal points → P1.
3. Does the hero fill ≥ 40 % of the frame's height or width? A small element in an empty half → P1 (in the
   hook P0).
4. Does text overlap a drawing, icon, diagram or face without that being on purpose (and marked)? → P0.
5. Elements floating loose, with no relation to grid, edge or neighbour? Do items that belong together sit
   together, and separate groups apart? → P1.
6. One left edge or one centre axis per reel, no mix between beats?
7. Main text and diagram above the caption band? The caption does not repeat the on-screen title?
8. Accent rationed: at most one meaningful accent word per screen?
9. No grey text on a coloured area; contrast holds where the picture behind changes?

**Tells** (each one P0 in the hook, P1 elsewhere)
10. A dark void with small floating things; glow, particles or neon; purple-blue or mesh gradient; glass cards.
11. Three cards in a row, a KPI grid, icons in circles, bullets, the whole diagram at once.
12. Everything centred; every beat the same entrance (fade + slide up); a small logo in a corner; an ALL-CAPS
    eyebrow; 01/02 numbering without a real order; corner labels or HUD as decoration.
13. A default font (Inter, Space Grotesk, Geist, Instrument Serif, JetBrains Mono) where the brand says otherwise.

**Story**
14. Cover the words: do the beat frames, in order, still tell the story, each frame causing the next?
15. Is frame 0 a real hook (a face, a result or a bold line), not black, a logo or an empty prompt box?
16. Does an explainer diagram grow one named part at a time, with labels on the part itself, no legend?

**Phone sheet (360 px)**
17. Is every line that must be read readable? Nothing under the platform UI or the right rail?

**Cut strip**
18. Does anything jump at a cut (a position or colour that does not connect)? Same direction and speed on both
    sides, no ping-pong?
19. Does an element enter from rest right after a cut, or appear out of nowhere?

**Timing** (from `inspect.json` and the check's `line_unread`, not by eye)
20. Every line on screen at least 0.5 s + 0.3 s a word (labels of 1–2 words 0.4 s; the last line ≥ 2 s)?
21. No stretch of more than 2–3 s without change (except the end card)? Landed titles do not drift, no
    breathing loops?
22. 0.3–0.75 s of silence before the payoff? Eases chosen per role, not one curve for everything?
