# Carousels — rules for `type: "carousel"`

Each slide is its own small HTML page. GIMC adds the brand layer (and with `base: "designsysteem"` the shared GIMC
style), sanitises it like an HTML card, renders it in a browser without network access of its own and stores a PNG:
**1080×1350** for `size: "4:5"` (default) or **1080×1080** for `"1:1"`. The card on the board is a strip people can
swipe; the panel can reorder slides and download PNGs or a ZIP.

## Canvas of a slide

Design in **CSS pixels at half size**: 540×675 (4:5) or 540×540 (1:1). GIMC renders at 2×, so a 22 px font
becomes 44 px in the PNG. Fix the page to exactly that size:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<style>
  html, body { margin: 0; width: 540px; height: 675px; overflow: hidden; }
  body { box-sizing: border-box; padding: 44px 40px; display: flex; flex-direction: column; justify-content: space-between;
         background: var(--brand-color-bg); color: var(--brand-color-text); font-family: var(--brand-font-body, system-ui, sans-serif); }
  h1 { margin: 0; font-family: var(--brand-font-heading, Georgia, serif); font-size: 46px; line-height: 1.08; letter-spacing: -0.01em; }
  p { margin: 0; font-size: 22px; line-height: 1.4; color: var(--brand-color-muted); }
  .tag { font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--brand-color-accent); }
  .foot { display: flex; justify-content: space-between; align-items: center; font-size: 15px; color: var(--brand-color-muted); }
  .logo { height: 26px; }
</style>
</head>
<body>
  <div class="tag">Offertes</div>
  <h1>5 fouten waardoor je offerte blijft liggen</h1>
  <div class="foot"><img class="logo" src="https://…/logo.png" alt="TEST-Studio Noord"><span>1/6 →</span></div>
</body>
</html>
```

Flex and grid are fine here (it is a browser, not a mail tool).

## Content rules

- **One idea per slide**, at most ~25 words of body text. Slide 1 is the hook (a promise or a tension, large type),
  the last slide a single call to action (save, share, comment, link in bio). 5–8 slides is the sweet spot.
- **Readable on a phone:** body 20–24 px, headings 36–56 px (CSS px at 540 wide), contrast at least 4.5:1, 40 px
  margins, nothing important in the outer 30 px.
- **Consistent system:** the same grid, margins, type scale and footer on every slide; a page indicator ("2/6") or a
  swipe hint on slide 1. Alternate background tones only within the brand palette.
- **Brand assets:** logo and photos from `brand.assets` (https). A photo in a fixed box needs
  `position:absolute; inset:0; width:100%; height:100%; object-fit:cover` inside a sized, `position:relative` box,
  otherwise it pushes the layout out of the frame.
- **No interaction:** buttons, forms and scripts do nothing in a PNG. `<button>`, `<input>` and `<label>` are
  removed by the sanitiser; use `span`/`div`.
- `alt` per slide: one sentence about what the slide says (accessibility, and the panel shows it).
- `caption` (optional) is the post text that goes with the carousel; `platform` when you know where it goes.

## After the answer

`reports` per slide: `overflow` (`fixed_overflow`, `clipped_text`, `outside_frame`, `broken_image`,
`font_fallback`) and `blocked`. One finding on one slide is worth a variant with all slides fixed; `font_fallback`
means the brand font did not load (check the font name in the brand).
