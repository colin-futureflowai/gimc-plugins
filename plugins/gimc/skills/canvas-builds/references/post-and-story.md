# Social posts and stories — rules for `type: "post"` and `type: "story"`

## Post

A post is what the content calendar schedules: always `platform` and `caption`, optionally one image (a slide that
GIMC renders to PNG, 4:5 = 1080×1350 by default or 1:1 = 1080×1080). The calendar reads `data.platform` and
`data.caption` from the card, and the image from its media. A text-only post (common on LinkedIn and X) has no
`slides`.

Caption per platform:

| platform | length | style |
|---|---|---|
| `linkedin` | 800–1,300 characters work best (max 3,000) | strong first two lines (they show before "…meer"), short paragraphs, one question or CTA, 0–3 hashtags at the end |
| `instagram` | up to 2,200; first 125 visible | hook first, line breaks, CTA, 3–8 relevant hashtags at the end |
| `facebook` | short, 40–80 characters land best | conversational, one link or CTA |
| `tiktok` | up to 2,200; first line visible | the caption supports the video idea; 3–5 hashtags |
| `x` | **max 280** | one sharp thought; no hashtag stuffing |

Write in the brand's voice, in the user's language, without invented numbers or quotes. The image of a post follows
the slide rules of [carousel.md](carousel.md) (540×675 or 540×540 CSS px); it should stand on its own without the
caption (one statement, quote card or visual).

## Story

One vertical slide, designed at **540×960 CSS px**, rendered as **1080×1920** PNG.

- Keep the top **120 px** and bottom **160 px** (CSS) free of text and logos: the profile bar and reply field cover
  them.
- One message, very large type (headings 48–72 px), a clear sticker-like call to action ("Swipe up", "Link in bio",
  "Stuur ons een DM") in the middle third.
- Same brand layer and rules as a carousel slide: fixed `html, body { width:540px; height:960px; overflow:hidden }`.
- `caption` optional (a note for whoever posts it); `platform` defaults to none — set `instagram` or `facebook` when
  known.

A series of stories is a series of `story` builds in one frame, each with `run_id` of the run, titled
"Story 1/4: …".
