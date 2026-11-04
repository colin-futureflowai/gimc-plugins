---
name: brandbook
description: >
  GIMC Brandbook skill. Builds a brand design system on the GIMC canvas — overview, colour (roles, contrast, light
  and dark), typography (real brand fonts), logo, imagery (real photos), components with states, voice, and applied
  examples (ad 4:5, post 1:1, story 9:16, website section, email header) — from what the company already has, and
  saves the brand as data so every other skill and HTML card uses it.
  Use when the user says "brandbook", "brand book", "brand guide", "brand guidelines", "design system",
  "designsysteem", "style guide for my brand", "huisstijl", "huisstijlgids", "merkboek", "merkgids",
  "maak een brandbook", "zet onze huisstijl op een rij", or asks to update or extend an existing brandbook.
user-invokable: true
argument-hint: "[company or folder, optional website]"
license: MIT
metadata:
  author: GIMC
  version: "2.0.0"
  category: brand
---

# Brandbook — a design system in five GIMC calls

> **GIMC skill.** Call it "the GIMC Brandbook skill" in the user's language.

You build the brand's **design system** on the GIMC canvas: calm, specimen-like pages in the brand's own fonts,
colours and photos, plus real applications. It should feel like the design system Claude Design makes, not like a
filled-in template. You save the brand as data first (`canvas_set_brand`), so every card — now and later, from any
skill — reads the same `--brand-*` variables.

Read before you build: [references/design-system.md](references/design-system.md) (grid, labels, section recipes,
fixed formats, sanitizer limits), [references/base.css](references/base.css) (the shared stylesheet: GIMC puts it in
every card made with `base: "designsysteem"`; read it for the class names, never copy it into a card), and the worked
example for the made-up brand "TEST-Studio Noord": [references/brand-example.json](references/brand-example.json),
[references/plan-example.json](references/plan-example.json) (part 1) and
[references/plan-example-part2.json](references/plan-example-part2.json) (part 2). Copy their shape, not their content.

## Hard rules

1. **Four or five GIMC calls:** `canvas_get_context` → `canvas_set_brand` → the plan in two parts (part 1 finds
   or creates the board; part 2 with `append: true` and `render: true`) → look at the result → at most one
   correction plan. Honest extras: +1 `canvas_create_folder` only when the client has no folder yet, +1
   `canvas_plan_status` only when a plan answer says `running`. Never place cards one by one, never use
   `canvas_create_items` or `canvas_create_html_card` for the brandbook.
2. **Gather with your own tools, not with GIMC calls.** Website, Canva brand kit, files in the chat, the folder
   notes from step 1. Gathering happens before call 1 or between call 1 and call 2.
3. **Everything real or visibly a proposal.** Every value has a source (client, website, Canva, the user) or is a
   proposal: `provenance` says `proposed`, the card shows a small "voorstel" tag (`<span class="tag">voorstel</span>`)
   and the cover's colophon lists it. Tell the user how many proposals there are.
4. **No fakes.** Never draw a logo yourself and present it as theirs; never use coloured blocks as "photo" or write
   "logo volgt". Missing logo or photo: a neat empty slot (`<div class="slot">Logo</div>`: thin outline, only the role
   name), tell the user and ask for the file (upload in the GIMC Merk panel or in the chat).
5. **Real fonts.** Google Fonts by exact family name (source `google`), uploaded font files (source `upload`), or a
   system stack only when the brand really uses one. Never a "looks like" substitute without saying so.
6. **Measured, not guessed.** Contrast ratios computed with the WCAG formula (design-system.md); never write a
   ratio you did not compute.
7. **Not done until the render is clean.** The render reports overflow, clipped text, broken images and font
   fallback per card. Never say "klaar" while a card has a finding or looks off in the contact sheet.
8. **Only through the GIMC tools.** Roep GIMC nooit aan buiten de GIMC-tools (geen curl, scripts of tokens). Check
   cards only through GIMC's render (the plan answer with its contact sheet and findings, `canvas_plan_status`, or
   `canvas_render_html_card`); never open them in a local browser and never make your own screenshots.
9. **The canvas never blocks the work** (see `gimc-canvas`). If GIMC fails, still give the user the HTML pages as
   files and say in one sentence what was skipped.

## 1. Context — call 1

`canvas_get_context` with `include_inbox: true`, plus `workspace` and `folder` **by name** when the user named them
("brandbook for Studio Noord in workspace X": `workspace: "X"`, `folder: "Studio Noord"`), so one call lands in the
client folder. Ids win when you have them: `org_id`, the client's `folder_id` (or the `board_id` of their Brandbook
board). No workspace match (or several workspaces and none named): `choose_workspace: true` with a list: pick the
one the user named, otherwise ask once and call again. `folder_not_found` or `folder_matches` in the answer: the
context is the default folder; pick the client folder from `folders`/`folder_matches` as below. The answer
gives `folders` (every active folder: `id`, `name`, `parent_id`), the folder path, every folder note up the chain
(nearest wins), the existing brand (`brand`, with `inherited_from` when it comes from a parent folder), the
folder's boards and the inbox.

- **`org_id` on every later call.** The answer names the workspace (`workspace.org_id`). Pass that `org_id` on
  every GIMC call after call 1 (`canvas_set_brand`, uploads, the plan, a render): without it a call can fail or land
  in another workspace.
- **Pick the client folder from `folders`** (match the company name). Not there: `canvas_create_folder`, once.
- **Board:** the plan targets `board: { folder_id, name: "Brandbook" }`; GIMC reuses that board or creates it. Is
  there already a "Brandbook" board in `boards` (an earlier brandbook), name the new one "Brandbook v2" (v3, …):
  the old board stays as it was, and the new board is empty, so the coordinates below fit.
- An existing brand: start from it and change only what is new. Its `version` is your `expected_version` — but only
  when `inherited_from` is null; an inherited brand means this folder has none yet (`expected_version: 0`).

## 2. Gather (your own tools)

Keep a list `what → source`; it becomes `provenance` and the colophon.

1. **Folder notes and existing brand** (from call 1).
2. **Website** (the user gave one, or a note names it): home page plus at most two pages. Take colours from the
   CSS (background, text, button, links), font families (the `fonts.googleapis.com` link or `@font-face`), the
   logo, photos and two or three real sentences as tone evidence.
   - **Logo URLs**, best first: the header `<img>`/`<svg>` file, `<link rel="icon">` (svg), `apple-touch-icon`,
     `og:image` (only if it is the logo). Absolute `https` URLs only.
   - **Photos**: real photos from the site (`<img>` in content, `og:image`), absolute `https` URLs. Not enough real
     ones: fitting stock photos with exact photo URLs from `images.unsplash.com` or `images.pexels.com` (open the
     URL once to be sure it loads and shows what you claim). Stock photos are always a proposal.
   - **Photo choice:** every photo shows the business's world (people at work, the material, the place, the
     product). No generic landscapes or sunsets unless the brand is about that.
3. **Canva brand kit**, only if a Canva connector is available and the kit has this company's name.
4. **Files in the chat**: logo (svg preferred), fonts, an older style guide. Upload a logo or font file with
   `canvas_brand_asset_upload_url` → PUT → `canvas_brand_asset_complete` and use its `id` as `asset_id`.

**Ask at most three questions**, once, only about gaps that matter and that you cannot derive, each with a default
("…or shall I propose one from your website?"). No answer or "just make it": continue with proposals.

## 3. The brand — call 2

`canvas_set_brand` with `folder_id`, `expected_version` and the whole `brand` (shape:
[references/brand-example.json](references/brand-example.json)):

- **tokens.colors.light**: `bg`, `surface`, `text`, `muted`, `accent`, `accent_text`, `border` (+ `success`,
  `warning`, `danger`); **dark** with the same roles (propose one when the brand has none); **extra** for named brand
  colours with a role sentence. Hex as `#rrggbb`.
- **tokens.type.families**: one per role (`display`, `body`, `mono`) with `family`, `source`, `weights` and a
  `fallback`. **scale**: `display`, `h1`, `h2`, `h3`, `body`, `small`, `label`, `mono` with `size_px`,
  `line_height`, `weight`, `tracking_em`.
- **space** (a list), **radius** (`sm`, `md`, `lg`, `pill`), **shadow** (`sm`, `md`), **motion** (`duration_ms`,
  `easing`).
- **assets.logos** (`primary`, `light`, `dark`, `mark`) with the https URLs: GIMC fetches and stores them itself.
  The answer's `assets.logos` has the stored GIMC URLs: use **those** in the cards. A logo that could not be fetched
  is in `warnings` and missing from `assets`: treat it as missing (rule 4). **assets.photos** with `url`, a
  true `alt` and `credit`.
- **voice**: mission, positioning, audience, tone, do, dont, examples. **provenance**: `fixed` or `proposed` per
  field path.

The answer gives `version`, the CSS layer, `warnings` and `assets`. A 409 means someone saved a newer version: read it again
via `canvas_get_brand`, merge, retry once.

## 4. The pages — calls 3 and 4

The plan (±27 steps) goes in **two parts of at most ±40 KB each**, as in the example:

- **Part 1:** `canvas_apply_plan` with `board: { folder_id, name: "Brandbook" }`, `render: false`, all eight frames
  and the first cards (Overzicht to Logo). Shape: [references/plan-example.json](references/plan-example.json).
- **Part 2:** `canvas_apply_plan` with `run_id` = the `run_id` from the part 1 answer, `append: true`,
  `render: true`, no `board`: the other cards and the arrows. Refs from part 1 (the frames) still work. Shape:
  [references/plan-example-part2.json](references/plan-example-part2.json). Part 1 still `running`: one
  `canvas_plan_status`, then part 2.

The board is new and empty, so place
everything with your own x/y from 0,0 as in the example. (Frames without x/y also get a free spot, but cards of
mixed sizes with `frame_id` can fill a frame badly or not fit at all; own coordinates are tidier and certain.)

1. **Frames** (`create_frame`), one per section, in one row, 260 px apart, all as tall as the tallest: "01 ·
   Overzicht", "02 · Kleur", "03 · Typografie", "04 · Logo", "05 · Beeldtaal", "06 · Componenten", "07 · Stem",
   "08 · Toepassingen". Cards sit 40 px from the frame's left edge and 56 px below its top.
2. **HTML cards** (`create_html_card` with `base: "designsysteem"`, `use_brand` left at its default `true`), each
   with x/y inside its frame, `skill: "brandbook"`, the same card label `run_id` on every step
   (`designsysteem-<company>-<yyyymmdd>`), a `title` and a short `body` (what is on it, which parts are proposals):

| Card | format | card w × h on the board |
|---|---|---|
| Overzicht: name, one-line positioning, logo, mini palette, type sample, index, colophon | `page` | 480 × page height × 0,375 |
| Kleur: swatch per role (role, hex, rgb, contrast), status and extra colours, contrast table, dark palette | `page` | same |
| Typografie: family specimens, scale per role with size/line/weight, waterfall | `page` | same |
| Logo: on background / text colour / accent, clear space, minimum size, four misuses | `page` | same |
| Beeldtaal: real photos in a calm grid with captions, principles, do/don't | `page` | same |
| Componenten: buttons (primary, secondary, ghost × default, hover, focus, disabled), field states, cards, headings, quote | `page` | same |
| Stem: mission, positioning, audience, tone traits, do/don't pairs, example sentences, words | `page` | same |
| Advertentie | `4:5` | 320 × 400 |
| Post | `1:1` | 320 × 320 |
| Story | `9:16` | 270 × 480 |
| Websitesectie | `16:9` | 640 × 360 |
| E-mailheader | `email` | 420 × content height × 0,6 |

E-mailheader `h`: the real height of the email at 700 px wide (last element plus its bottom padding) × 0,6, not
the default 520 and not rounded up: an empty band under the footer means `h` is too big.

3. **Arrows** (`link`, relation `arrow`) between neighbouring frames, labels like "kleur → typografie".

Each page is a full HTML document built from the classes of [references/base.css](references/base.css) and the
recipes in design-system.md. **Never put base.css (or any part of it) in a card:** GIMC adds it with
`base: "designsysteem"`. A card has its own `<style>` only for rules the base lacks (the example's only one: the
dark palette's colours). Colours and type through classes (`bg-accent`, `fg-text`, `t-h2`, `f-display`), not
repeated inline styles. Content always in HTML: the board shows cards without scripts; a small inline script may add
interaction for the side panel (the example's light/dark switch). Images: the logo URLs and photo URLs from step 3.
Aim for ±2–9 KB per card and at most ±40 KB per plan part.

The part 2 answer arrives within ±90 seconds with `run_id`, `board_id`, `status`, `refs` (card id per ref, both
parts), `render.reports` (per card of both parts `overflow`, `blocked`, `ok`, `scripts`) and the contact sheet as an
image. `scripts: false`
means the render shows the card as the board does, without its scripts. Mind the two `run_id`s:
the card label you put on the steps, and the plan's own `run_id` (a uuid) in this answer. Still `running`:
`canvas_plan_status` with the plan's uuid `run_id`; it brings the render once the plan is done.

## 5. Look — and correct once (call 5 at most)

Look at the contact sheet **and** read every report. Check:

- every card `ok`; no `fixed_overflow`, `clipped_text`, `outside_frame`, `broken_image`, `font_fallback`, `blocked`;
- fixed formats complete: headline, copy and button inside the frame, nothing cut off;
- real fonts visible (serif vs sans differences you expect), photos showing, logo showing;
- calm: aligned to the grid, equal gaps, no empty half-pages, no orphaned words in big headings, no clutter.

Anything wrong: **one** correction plan (`board_id` from the answer, `render: true`) with only the cards that
change: first a `move` step that makes the frame taller (`item` = the frame's id from `refs`, same x/y, new `h`),
then each new `create_html_card` 40 px below the old card, with `parent_id` = the old card's id (from `refs`) and
`relation: "variant"`. Never a second round of tinkering: if the correction still has findings, tell the
user exactly which card and what.

## 6. Close

In at most four sentences: where it is (`folder › Brandbook`), how many proposals wait for confirmation (the most
important first), what is missing (a logo, photos, a font file) and that every content skill now uses this brand
automatically. Later changes: a new brand version with `canvas_set_brand`, then new cards as `variant` of the old
ones; old cards stay as they were.
