---
name: canvas-builds
description: >
  GIMC Builds skill. Builds ready-to-use pieces on the GIMC canvas in the folder's brand: an email template (email-
  safe HTML and plain text), a carousel (slides as PNG), a social post or a story (1080×1920). Use when the user says
  "email template", "newsletter", "nieuwsbrief", "maak een carousel", "carrousel van 6 slides", "social post",
  "LinkedIn-post", "Instagram-post", "maak een story", or when another skill hands over finished copy for a carousel,
  post, story or email.
user-invokable: true
argument-hint: "[what to build, topic, folder or company]"
license: MIT
metadata:
  author: GIMC
  version: "1.0.0"
  category: content
---

# Builds — email, carousel, post and story in one GIMC call

> **GIMC skill.** Call it "the GIMC Builds skill" in the user's language.
>
> **GIMC tools run in code:** each `gimc.<tool>(…)` below is a call inside `gimc_execute` (find signatures with
> `gimc_search`); do a step in one execute and return only what you need. Examples: `gimc-canvas`, references/code-mode.md.

You design the piece yourself, in the brand of the folder, and GIMC turns it into a card that people can use right
away: an email they can copy into their mail tool, slides they can download as PNG or ZIP, a post the content
calendar can schedule. One tool does all four: `gimc.canvas_create_build` with a `type`.

Read the reference for the type before you build:

- `email` → [references/email.md](references/email.md)
- `carousel` → [references/carousel.md](references/carousel.md)
- `post` and `story` → [references/post-and-story.md](references/post-and-story.md)

## Hard rules

1. **Three GIMC calls, sometimes four:** `gimc.canvas_get_context` (with `workspace` and `folder` from the request) →
   `gimc.canvas_create_build` → look at the answer → at most one corrected build as a variant (`parent_id` = the first
   card, `relation: "variant"`). Pass `workspace.org_id` from the first answer on every later call.
2. **The brand comes from the folder.** Read `brand` in the context answer (colours, fonts, logos, photos, voice).
   Slides get the brand layer automatically: use `var(--brand-color-accent)`, `var(--brand-font-heading)` and so on.
   In an email the same `var(--brand-…)` names work inline: GIMC replaces them with the real values (mail tools do
   not know CSS variables). No brand in the folder: pick a calm neutral palette and say so in one sentence.
3. **Write in the brand's voice and the user's language.** Use `voice` (tone, do, dont) from the brand. Use only
   facts the user gave or the brand holds; placeholders look like `{{first_name}}`, never invented numbers or quotes.
4. **Look before you say done.** The answer brings a contact sheet image and `reports` per slide (overflow, blocked
   addresses) or `warnings` for an email. Fix real findings (text cut off, too wide, a broken image) with one variant.
   Never check with a local browser, screenshots or curl: only GIMC's answer counts. Never call GIMC outside the GIMC
   tools.
5. **Where it lands.** The board from the request; otherwise "In productie" in the folder (create it with
   `gimc.canvas_create_board` if it is missing). Give the card a short title ("Carrousel: 5 fouten bij je offerte"),
   `skill: "canvas-builds"` (or the content skill that asked for it) and a `run_id`. A frame is optional; with
   `frame_id` GIMC finds a free spot.
6. **Never send anything.** GIMC does not send email or publish posts; people copy, download or schedule.

## The call

```js
async () => {
  const r = await gimc.canvas_create_build({
    type: 'carousel', board_id: 'BOARD_ID', title: 'Carrousel: …', size: '4:5', use_brand: true,
    slides: [{ html: '<!DOCTYPE html>…', alt: 'Slide 1: the hook' }, { html: '<!DOCTYPE html>…', alt: 'Slide 2' }],
    platform: 'instagram', caption: 'CAPTION', skill: 'canvas-builds', run_id: 'RUN_ID',
  })
  return { item_id: r.id, slides: r.slides, ok: r.ok, problems: r.reports.filter(x => !x.ok).map(x => x.title) }
}
```

| type | required | slides | size |
|---|---|---|---|
| `email` | `html`, `subject` (+ `preheader`, `text`) | none | 600 px wide email |
| `carousel` | `slides` (2–20) | each 540×675 CSS px (4:5) or 540×540 (1:1) | PNG 1080×1350 / 1080×1080 |
| `post` | `platform`, `caption` | 0 or 1 | 4:5 or 1:1 |
| `story` | `slides` (1) | 540×960 CSS px | PNG 1080×1920 |

`platform` is one of `instagram`, `linkedin`, `facebook`, `tiktok`, `x`. A refused build creates no card: read the
message, fix and call again (a slide that did not render, a slide over 1 MB, more than 20 slides).

## Afterwards

Say in two or three short lines what is on the board, the link (`app_url`) and how to use it ("Open de kaart: HTML kopiëren of
downloaden", "Download ZIP in het paneel"); don't repeat the content in the chat. If the canvas fails, give the content in the chat and say once why the
canvas was skipped.
