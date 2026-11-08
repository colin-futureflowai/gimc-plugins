# Design system pages — layout, labels, recipes

How a brandbook card looks and how to build it so GIMC accepts it unchanged and the render finds nothing. The
worked example is [plan-example.json](plan-example.json) + [plan-example-part2.json](plan-example-part2.json)
(TEST-Studio Noord); every snippet below comes from it.

**The shared stylesheet comes from GIMC.** Every card step has `base: "designsysteem"`: GIMC puts
[base.css](base.css) into the card right after the brand layer (and freezes it there, like the brand layer). Never
copy base.css, or rules from it, into a card. A card's own `<style>` holds only what the base lacks; most cards
need none.
TEST-Studio Noord is made up, so its logo is an inline `data:` SVG stand-in; for a real client the `src` is the
logo's https URL from the brand.

## The look

- **Calm and specimen-like.** Off-white page (`--brand-color-bg`), lots of whitespace, one idea per section.
  No decoration for its own sake, no gradients unless the brand has them, no emoji, no drop shadows on pages.
- **Strict grid.** Page 1280 px wide, 64 px side margins, 12 columns with 24 px gutters (`.grid` + `.c3`…`.c12`).
- **Metadata in small mono capitals** (`.label`): `COLOR / ACCENT · #0F766E · AA 4,98:1`. Names and numbers you
  would look up go in labels; sentences you would read go in body text.
- **Hairlines, not boxes.** A dark rule under the masthead, light rules (`--brand-color-border`) under section
  heads and between table rows. Tiles (`.tile`) only for swatches, specimens and examples.
- **Numbered sections.** Each card: masthead (brand — Designsysteem · `02 — Kleur` · version), intro (number left,
  big display title and a one-sentence lede right), sections with `.sect-head`, footer with `02 / 08`.
- **Everything from tokens.** Sizes, colours, fonts, radius, shadow and motion via `var(--brand-…)`. Literal brand
  values only as *text* (a hex in a label) and for the dark palette swatches (the dark values are not variables in
  light mode). Fallbacks inside `var()` are neutral (`#1a1a1a`, `Georgia, serif`).

## Variables GIMC provides (`use_brand: true`) and classes from the base

`--brand-color-<role>` (bg, surface, text, muted, accent, accent-text, border, success, warning, danger, and each
`extra` name), `--brand-font-<role>`, `--brand-text-<role>-size|line|weight|tracking`, `--brand-space-1…n`,
`--brand-radius-<name>`, `--brand-shadow-<name>`, `--brand-dur-<name>`, `--brand-ease-<name>`. Underscores become
hyphens (`accent_text` → `--brand-color-accent-text`). With a dark palette the colour variables switch under
`prefers-color-scheme: dark`, so a card can show light or dark depending on the viewer.

Classes per role, so a card never repeats `style="…var(--brand-…)"`: `bg-<role>` (background) and `fg-<role>`
(text colour) for bg, surface, text, muted, accent, accent-text, border, success, warning, danger; `t-<role>` (the
whole text style: family, size, line, weight, tracking) for display, h1, h2, h3, body, small, label, mono;
`s-<role>` (size only) and `f-display`/`f-body`/`f-mono` (family only). An `extra` brand colour has no class:
`style="background:var(--brand-color-noord)"`.

**Pair roles, never mix a role with a fixed colour.** Text on `bg` uses `text`; on `accent` uses `accent-text`.
Then both schemes stay readable. Text over a photo gets its own `bg` panel. The logo: `.only-light` (primary) and
`.only-dark` (white) images side by side; the base shows the right one. No dark palette: only the primary logo,
without those classes.

## Page shell

```html
<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><title>Brand — Kleur</title></head><body><main class="page">
<header class="masthead"><span class="label"><b>Brand</b> — Designsysteem</span><span class="label">02 — Kleur</span><span class="label">v1.0 · nov 2026</span></header>
<section class="intro"><p class="num">02</p><div class="what"><h1 class="title">Kleur</h1><p class="lede">One sentence on what colour means for this brand.</p></div></section>
<section class="sect"><div class="sect-head"><span class="label">Kernpalet</span><span class="label">Rollen · licht</span></div>…</section>
<footer class="foot"><span class="label">Brand · Designsysteem v1.0</span><span class="label">02 / 08</span></footer>
</main></body></html>
```

## Section recipes

**Swatch** (Kleur; four per row, `c3`): the chip shows the variable, the text shows the measured values.

```html
<div class="c3 tile"><span class="chip bg-accent"><span class="aa-chip fg-accent-text">Aa</span></span>
<div class="tile-body"><p class="label">Color / accent</p><p class="h3 sw-name">Accent</p>
<dl class="kv"><dt>Hex</dt><dd>#0F766E</dd><dt>RGB</dt><dd>15 118 110</dd><dt>Op achtergrond</dt><dd>4,98:1 · AA</dd></dl></div></div>
```

Contrast (WCAG 2.x): per channel `c = v/255`, `c ≤ 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`;
`L = 0.2126 R + 0.7152 G + 0.0722 B`; ratio `(L1+0.05)/(L2+0.05)` with L1 the lighter. Grade: ≥ 7 AAA, ≥ 4,5 AA,
≥ 3 "AA groot", lower "onvoldoende". The border colour is for lines only: write "alleen lijnen", not a grade.
Contrast table rows: the pairs the components really use (text on bg and surface, muted on bg, accent-text on
accent, accent on bg, each extra colour on bg), with a small "Aa" sample in the pair
(`<span class="pair-sample fg-text bg-bg">Aa</span>`), in `<table class="contrast">`. The dark palette:
`<div class="dark-pal">` with `<span class="dchip" style="background:#141412">` per role; its colours (not
variables in light mode) go in the card's own `<style>`: `.dark-pal{background:…}.dark-pal .label{color:…}`.

**Type specimen row** (Typografie): meta left (role, family, size / line, weight, tracking), the sample right in
that role's variables. Use real sentences of the brand; a waterfall shows one pangram in the display family at
each size (`<div class="fall"><span class="label">48</span><p class="s-h1">…</p></div>`; shorten it at the biggest
sizes so it stays on one or two lines).

```html
<div class="spec"><div><p class="label"><b>h2</b></p><p class="label">Fraunces · 32 / 1,15</p><p class="label">Gewicht 500 · spatie −1%</p></div>
<p class="t-h2">Van strategie tot website, in één team</p></div>
```

**Logo**: three tiles (on `bg`, on `text`, on `accent`) with the real logo file as `<img src="https://…">`; clear
space as a dashed box with the padding equal to the measure you name (X); minimum size shown at real size; misuse
drawn from the same file with CSS: `transform:scaleX(1.35)`, `transform:rotate(-12deg)`,
`filter:sepia(1) saturate(5) hue-rotate(-25deg)`, and the logo over a busy photo. No logo file: every logo spot is
`<div class="slot">Logo</div>` and the misuse row is left out.

**Photo** (Beeldtaal, cards, applications): the box has a size, the image fills it.

```html
<figure class="m-third"><div class="photo"><img src="https://images.unsplash.com/photo-…?w=1400&q=80&auto=format&fit=crop" alt="What is really in the photo"></div>
<figcaption class="cap label"><b>04</b> — Daglicht, ruimte, hout</figcaption></figure>
```

Mosaic: one big photo (`c8`, 4:3) with two stacked beside it (`c4`), then a row of three. Then 3–4 principles and
a do/don't pair (the "don't" may be a generic stock cliché, labelled as such).

**Buttons** (Componenten): a table, rows primary/secondary/ghost, columns default/hover/focus/disabled. The states
are classes (`is-hover`, `is-focus`, `is-disabled`), so the board shows them without scripts; real `:hover` and
`:focus-visible` work in the side panel.

```html
<span class="btn btn-primary is-focus" role="button" tabindex="0">Plan een kennismaking</span>
```

**Field**: `<div class="field"><span class="small">E-mailadres</span><div class="input is-error" role="textbox" tabindex="0">sanne@voorbeeld</div><span class="hint is-error">Vul een volledig e-mailadres in.</span></div>`
in four states (default with placeholder, focus, error, disabled).

**Stem**: mission / positioning / audience in three columns; tone as "Trait, but not …" in three columns; a
do/don't table per real situation (homepage heading, quote email, social post); example sentences as big quotes;
words to use and to avoid.

**Cover** (Overzicht): label line, the brand name very large in the display font, one-line positioning, the logo in
a tile, a palette strip with names, three "Aa" tiles for the families, an index of the eight sections, and a
colophon: date, **Vastgesteld** (what came from the client, with source) and **Voorstel** (what you derived).

## Fixed formats (4:5, 1:1, 9:16, 16:9)

The card is rendered at a fixed size (4:5 → 540×675, 1:1 → 540×540, 9:16 → 405×720, 16:9 → 1200×675) and
everything must fit inside it.

- Root `<div class="fx …">` (exactly the viewport; the base sets the page height). The base has the example's
  applications as classes: `fx ad` (4:5), `fx post` (1:1), `fx story` (9:16), `fx site` (16:9) and `mail` (email);
  a new layout splits the root with `display:grid;grid-template-rows:56% 44%` (photo above, `bg` panel below) or
  flex with `justify-content:space-between` in the card's own `<style>`.
- Inside a grid row that must not grow: `grid-template-rows:auto minmax(0,1fr)` and `min-height:0`.
- Text sizes from the width with a ceiling: `font-size:clamp(28px,8.4vw,var(--brand-text-h1-size))`; paddings in
  `vw`. Keep headlines to 3–6 words.
- Every application has the logo, one headline, one line of copy at most and one button. The website section has
  a nav (logo, 3–4 links, button) and a hero; the email header has a logo bar, photo, headline, intro, button and
  a small footer.

## What GIMC accepts (sanitizer and frame)

- Allowed: normal text and layout tags, `img` (`https:` or `data:image/…`), inline `svg`, tables, `<style>`,
  inline `<script>` and scripts from cdnjs.cloudflare.com, cdn.jsdelivr.net or unpkg.com with an exact version,
  Google Fonts stylesheets, `on…` attributes, `aria-*`, `data-*`, `role`, `tabindex`.
- Not allowed (removed and listed in `removed`): `button`, `input`, `textarea`, `select`, `label`, `form`,
  `iframe`, links to other pages (`<a href>` only `#anchor`), `srcset`, CSS imports, `<style>` or `<script>` inside
  `<svg>`. So buttons and fields are `<span>`/`<div>` with `role` and `tabindex`. CSS comments are stripped.
- Scripts: no network (`connect-src 'none'`), never navigate, only enrich what is already in the HTML. Never write
  the text `data-gimc-brand` anywhere in your card (GIMC then thinks the brand layer is already there and leaves it
  out); find the brand variables via `document.styleSheets` instead, as the example's light/dark switch does.
- Each card ≤ 1 MB (aim for ±2–9 KB without the base); each plan part at most ±40 KB; images are URLs, never base64
  photos.
- Checking happens only through GIMC's render (the plan answer, `gimc.canvas_plan_status` or `gimc.canvas_render_html_card`):
  never a local browser or your own screenshots, and never GIMC outside the GIMC tools (no curl, scripts or tokens).
