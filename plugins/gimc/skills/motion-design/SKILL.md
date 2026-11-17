---
name: motion-design
description: >
  Universal design rules for short vertical video: layout, type size and reading time, contrast,
  captions, animation timing and easing, and the safe and danger zones per platform (Reels, Stories,
  Shorts, TikTok). Tool-independent; the brand comes from GIMC. Use when designing or reviewing how a
  reel looks, before rendering, or when the user says "make it look better", "text is unreadable",
  "safe zones", "danger zones", "covered by the buttons" or "animation feels off".
user-invokable: true
argument-hint: "[the reel or frames to design or review, and the target platform]"
license: MIT
metadata:
  author: GIMC
  version: "1.0.0"
  category: content
---

# Motion design for short vertical video

> **GIMC skill.** Call it "the GIMC Motion Design skill" in the user's language.

The rules a good motion designer applies to every reel, whatever tool renders it. They decide *how* a
reel looks and moves; [reel-builder](../reel-builder/SKILL.md) decides *what* it says, and
[video-components](../video-components/SKILL.md) holds the ready components that already follow
these rules. Design for a phone held at arm's length, watched for one second, often without sound.

## 1. The brand comes from GIMC, never from taste

Colours, fonts, logo and motion feel come from the brand of the folder in GIMC
(`gimc.canvas_get_brand`, or the `brand` in `gimc.canvas_get_context`). Never pick a colour or a font
yourself while a brand exists. No brand yet: say so in one sentence, offer [brandbook](../brandbook/SKILL.md),
and meanwhile use a neutral proposal marked "aanname" (assumption).

- **Roles, not hex codes:** background = `bg`, text = `text`, emphasis = `accent` with `accent_text` on top
  of it. A colour from `extra` only in the role its sentence describes.
- **Dark or light:** use the brand's `dark` palette for a dark reel if it has one; never invert colours by
  hand.
- **Fonts:** `display` for hooks and big words, `body` for everything else, at most two families per reel.
- **Motion feel:** the brand's `motion` (durations, easing) sets the character: a calm brand gets slower
  and softer motion, not the same snappy pops as everyone else.

## 2. Safe zones and danger zones

Each platform lays its own buttons, captions and bars over the video. Text, faces, logos and CTAs that
land there are covered. The pixel values per platform, with sources and the cover crop of the
Instagram grid: [references/safe-zones.md](references/safe-zones.md).

- Know the **target platform** before you lay out. Several platforms or unknown: use the **universal
  safe area** (x 120–780 × y 288–1248 on 1080×1920).
- **Danger zones are not empty:** background, b-roll and motion may run through them; only the things
  that must be read or recognised stay out.
- **Check with an overlay.** Render frames with the danger zones drawn on top (never in the export) and
  look: nothing that matters may touch a zone.

## 3. Layout and hierarchy

- **One idea per screen.** One focal point per beat; the eye must know in 0.3 s where to look.
- **Size is hierarchy.** The key word is at least 1.5× the size of the supporting text, not just bolder.
- **Upper-middle is prime space.** The upper half of the safe area is the only zone free on every
  platform; put the hook there.
- **Margins are content.** Never fill the safe area edge to edge; keep a calm margin around a text block.
- **Align to a grid.** One left edge or one centre axis per reel; do not mix them between beats.
- **Faces:** eyes in the upper third of the safe area, never under the top bar or behind the buttons.

## 4. Type and reading time

On 1080×1920 (scale everything by width for other sizes):

| Role | Minimum | Typical |
|---|---|---|
| Hook / key word | 84 px | 96–140 px |
| Supporting line | 44 px | 52–64 px |
| Captions (subtitles) | 52 px | 56–72 px |
| Small print (source, label) | 32 px | 36 px, only when it does not need to be read |

- **Line length:** 3–6 words per line, at most 3 lines per text block; break lines by meaning, not by
  width.
- **Reading time:** on screen at least 0.3 s per word plus 0.5 s, and never shorter than 1 s. A line that
  is too long for its beat gets shorter, the beat does not get faster.
- **Weight and case:** bold or semibold for display; long lines in sentence case, never all caps
  beyond 3 words.
- **Tight leading for big type** (line height 1.0–1.1 for display, 1.2–1.3 for body).
- **Numbers and claims** only when they are real (see reel-builder): no invented stats on screen.

## 5. Contrast and legibility

- **Contrast:** at least 4.5:1 between text and what is directly behind it; 7:1 for captions over video.
- **Text over video or photos:** add a backing (a solid or semi-transparent panel in `surface` or `bg`,
  a soft gradient, or a stroke/shadow on the letters). Never trust that the footage stays dark.
- **Emphasis:** one emphasised word per line, in `accent` or with an `accent` panel behind it, never three
  colours in one sentence.
- **Avoid thin strokes and light weights** under 56 px: video compression eats them.

## 6. Captions (subtitles)

Most people watch without sound, so the spoken words are on screen.

- **Synced to the voiceover's word timestamps,** never to a guess. A page of 1–4 words; a new page on a
  pause.
- **The active word** is highlighted (colour or panel), the rest stays readable.
- **Place them** in the lower part of the safe area, above every platform's bottom danger zone, and
  never on top of the beat's main text.
- **Same style for the whole reel;** never two caption styles at once.

## 7. Animation

Motion directs attention; it is not decoration.

- **Animate in, then hold.** Elements enter in 6–12 frames at 30 fps (0.2–0.4 s), then stay still long
  enough to be read. The read time in section 4 starts when the entrance ends.
- **Easing:** enter with a strong ease-out (GSAP `power3.out`; no overshoot or wobble for text; a card may
  pop a little with `back.out(1.4)`), leave with ease-in (`power2.in`), faster than the entrance. Linear
  motion (`none`) only for continuous movement (a slow zoom, a ticker). In a timeline:
  `tl.fromTo('#title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, 2.0)`.
- **Small distances:** text slides 20–60 px, not across the screen; scale from 0.9–0.95 to 1, never from 0.
- **Stagger:** words or lines 2–4 frames apart, at most 5 items; beyond that, animate the block.
- **One motion idea per beat.** The beat's main element moves; everything else is still.
- **Cuts on the voice:** a beat changes on the word that starts it, about 10 frames (0.33 s) early so the
  eye is there in time.
- **Transitions:** a hard cut is the default; a fade or slide (8–15 frames) only between chapters. No
  spinning, no 3D flips, no glitch effects unless they are the brand.
- **Loop-safe end:** the last frame should flow back into the first if the platform loops.
- **The hook moves on frame 0.** Nothing fades in from black at the start.

## 8. The CTA end card

- One action, in the words of the caption ("Comment GIDS"). Large, inside the safe area, on screen for at
  least 2 s.
- The keyword is exactly the one the reply campaign in GIMC listens for (see
  [social-engagement](../social-engagement/SKILL.md)).

## 9. Check before you call it done

Render stills or a frame strip (about 12 fps) of the whole reel, with the danger-zone overlay of the
target platform, and check (for a Hyperframes reel, [video-components](../video-components/SKILL.md) §4 checks
points 1–3 for you with `inspect.mjs` and makes the contact sheet to look at):

1. Nothing that must be read or recognised touches a danger zone.
2. Every text meets the minimum size and is on screen long enough to read.
3. Contrast holds on every frame, also where the footage changes behind the text.
4. Captions follow the voice word by word and never cover the main text.
5. Motion moves forward, there are no frozen beats while the voice talks, and the hook moves on frame 0.
6. Only brand colours and brand fonts appear.

Say what you checked and what you changed, in one or two sentences.
