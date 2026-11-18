# Examples

`all-scenes.json` is a reel with one beat of every scene type in `SCENES` (`src/storyboard.mjs`). Build it with
`node build.mjs examples/all-scenes.json`; GIMC builds it the same way in its tests and in the snapshot smoke test, so
**a new scene type gets an example beat here**. The two images it names in `assets/` (`example-broll.png`,
`example-presenter.png`) are made by those tests; put two images with those names in `assets/` to build it yourself.

## Rendering in GIMC: a free composition

GIMC renders a **composition**: a folder with `index.html` (a Hyperframes composition: a root with
`data-composition-id`, `data-duration` ≤ 60 s and a GSAP timeline in `window.__timelines.main`) and its files. This
starter is one way to make one (`node build.mjs` → `index.html`); any hand-written HTML works too.

```json
{
  "files": [{ "path": "index.html", "content": "<!doctype html>…" }, { "path": "assets/symbols/check.svg", "content": "<svg …>" }],
  "assets": [{ "path": "assets/example-broll.png", "ref": { "item_id": "<canvas card id>" } }],
  "platform": "instagram-reels"
}
```

- `files`: text only (html, css, js, mjs, json, svg), relative paths, at most 1 MB together. No external URL anywhere
  (`http(s):`, `//host`, `file:`, a script from `data:`): the render has no network.
- `assets`: images, video and fonts are not sent as bytes but as a canvas card (`{ "item_id" }`) or a brand file
  (`{ "brand_asset_id" }`); GIMC puts the file at `path`. The extension must match the real type.
- GIMC adds, next to the composition: `brand/brand.css` (the brand's `@font-face` and `--brand-color-*`,
  `--brand-font-*` variables; link it, or set `theme.css` to `brand/brand.css` and name the brand fonts with
  `files: []`), `vendor/gsap.min.js` and `gimc/` (`gimc/gsap.min.js`, `gimc/src/…` from this starter,
  `gimc/symbols/…`). These folders are reserved: a composition cannot write into them.
- Before the render GIMC runs `inspect.mjs --dir <composition> --fonts "<brand families>"`: text outside the safe area
  or the frame, text over other elements, text in a font that is not the brand's, a missing file, no timeline or a
  reel over 60 s is an error and stops the render, with one line per moment.
