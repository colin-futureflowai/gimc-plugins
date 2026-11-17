---
name: motion-design
description: >
  Design rules for short vertical video, GIMC's own motion library: storyboard before code, grid and scene types,
  hero size, banned defaults, type and reading time, contrast, captions, easing per role, rhythm, diagrams, the CTA
  card and the safe zones per platform. The brand comes from GIMC. Use when designing or reviewing a reel, before
  rendering, or when the user says "make it look better", "text is unreadable", "safe zones", "looks random",
  "looks generated" or "animation feels off".
user-invokable: true
argument-hint: "[the reel or frames to design or review, and the target platform]"
license: MIT
metadata:
  author: GIMC
  version: "3.0.0"
  category: content
---

# Motion design for short vertical video

> **GIMC skill.** Call it "the GIMC Motion Design skill" in the user's language.

The rules a good motion designer applies to every reel. They decide *how* a reel looks and moves;
[reel-builder](../reel-builder/SKILL.md) decides *what* it says, and [video-components](../video-components/SKILL.md)
holds the ready components that already follow these rules. Design for a phone held at arm's length, watched for
one second, often without sound.

## 0. The library

This skill and its references are GIMC's own motion library: HeyGen's Hyperframes skills 0.9.61 adopted
(Apache-2.0, see [NOTICE](NOTICE)), plus GIMC's own rules; GIMC maintains it from here. The rules below are the
short form; the depth is in the references.

| Read | When |
|---|---|
| [storyboard.md](references/storyboard.md) | always, before any code: message, scene type, hero, relations, legend (GIMC's own) |
| [grid-and-scenes.md](references/grid-and-scenes.md) | the grid, the tokens, the scene types and their slots (GIMC's own) |
| [skill-workflow.md](references/skill-workflow.md) | the whole workflow of a Hyperframes video, from brief to render |
| [spec.md](references/spec.md) | composition numbers, every adjective as a number, "BANNED by default" |
| [motion.md](references/motion.md) | eases by role, entrance recipes, holds, rhythm, transitions with a cause |
| [story.md](references/story.md), [storyboard-stills.md](references/storyboard-stills.md), [storyboard-format.md](references/storyboard-format.md) | the arc, posed stills before animating, the storyboard file |
| [captions.md](references/captions.md), [overlays.md](references/overlays.md) | captions; a talking head plus a card |
| [look.md](references/look.md), [film.md](references/film.md), [sound.md](references/sound.md) | backgrounds, texture and grade; filmic techniques; voiceover, music and effects |
| [review.md](references/review.md) | the review loop |
| `references/types/` | per kind of video: [vertical](references/types/vertical.md), [explainer](references/types/explainer.md), [data](references/types/data.md), [character](references/types/character.md), [music](references/types/music.md), [launch](references/types/launch.md), [3d](references/types/3d.md) |
| `assets/frame-presets/` | 13 deck looks (FRAME.md + caption skin), as [look.md](references/look.md) describes them; never instead of the brand from GIMC (§1) |
| [safe-zones.md](references/safe-zones.md) | the pixels per platform (GIMC's own) |
| [hyperframes-inventory.md](references/hyperframes-inventory.md) | every Hyperframes 0.9.61 file: adopted, learned from, not or later, and why |

The adopted files are the Hyperframes text, changed only where it must (pinned 0.9.61, GSAP and fonts local, render
through video-components, no HeyGen account steps). What GIMC decides wins over any source: the brand from GIMC (§1), the safe area per platform (§2), captions synced to
the voiceover (§6), the CTA card on the keyword of the reply campaign (§9), reading time in the reel's language (§5).
Rendering only as [video-components](../video-components/SKILL.md) says (pinned version, GSAP and fonts as local
files, no CDN).

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
- **Motion feel:** the brand's `motion` (durations, easing) picks where in the ranges of §7 a reel sits: a calm
  brand moves at the slow end, a snappy one at the fast end, never outside them.

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

- **One focal point per beat.** The eye knows in 0.3 s where to look; squint at the frame and you still see one
  primary element, then a secondary one.
- **The hero fills at least 40 % of the frame's height or width.** A small object in the middle of an empty frame
  is never a shot: push in, crop, or give it a world. A hero word fills 60–90 % of the frame width, as far as the
  safe area allows (on the universal area: its full width).
- **Size is hierarchy.** The key word is at least 1.5× the size of the supporting text, not just bolder.
- **One subject, stacked vertically.** A side-by-side layout or a wide chart is rebuilt as a vertical sequence,
  never squeezed.
- **Upper-middle is prime space.** The upper half of the safe area is the only zone free on every
  platform; put the hook there. The bottom of the safe area is the caption band (§6).
- **Storyboard before code** ([storyboard.md](references/storyboard.md)): per beat a message of at most 8 words,
  one scene type, one hero, and a relation (`inside`, `on`, `label-of`, `aligned-with`, `next-to`, `below`,
  `replaces`) for every other element. An element without a relation is dropped. One symbol, one meaning and one
  size for the whole reel (the legend).
- **Scene types, not coordinates.** Every beat is one scene type with slots on the grid: `hook`, `text`, `media`,
  `diagram`, `compare`, `actor-object`, `stack`, `presenter`, `end-card`. Labels and attached symbols are children
  of the part they belong to, so they move with it. An own element outside a scene type only with a reason in the
  storyboard, and then still on the grid.
- **The grid:** 6 columns inside the safe area, 24 px gutters, an 8 px base, gaps only from the spacing scale, and
  anchor cells A1–F8 to speak in ([grid-and-scenes.md](references/grid-and-scenes.md)). One left edge or one centre axis
  per reel; at most 2 vertical axes per frame besides the caption. Group by nearness: what belongs together sits
  close, separate groups clearly apart.
- **Faces:** eyes in the upper third of the safe area, never under the top bar or behind the buttons; with a card
  above the presenter, the face sits just under the card and above the caption band
  ([overlays.md](references/overlays.md)).

## 4. Banned defaults

Where generated video lands when nothing is decided ([spec.md](references/spec.md), "BANNED by default"). Each is banned
unless the brand's own material uses it, and then only as the brand does:

- a dark void with small elements floating in it; elements floating in empty space with no relation to an edge,
  a grid or a neighbour;
- glow, bloom, neon, particles as decoration; purple or blue gradients, mesh gradients, glass cards;
- everything centred; everything fading in at once; every element fading and sliding up; every beat entering the
  same way;
- text that moves while it is read; titles that drift, breathe or pulse after they land;
- three cards in a row, KPI grids, icons in circles, bullets, a whole diagram at once;
- corner labels, frames and HUD readouts as decoration; an ALL-CAPS eyebrow above every line; 01/02 numbering
  without a real order; the logo docked small in a corner.

**After every render, name each default the reel still uses, from this list or not, and fix it.** Say which ones
you found and what replaced them.

## 5. Type and reading time

On 1080×1920 (scale everything by width for other sizes):

| Role | Minimum | Typical |
|---|---|---|
| Hook / key word | 84 px | 96–140 px, a hero fitted to the width |
| Supporting line | 44 px | 52–64 px |
| Captions (subtitles) | 52 px | 56–72 px |
| Small print (source, label) | 32 px | 36 px, only when it does not need to be read |

- **Few words:** a claim is about 5 words; a text block at most 3 lines. Too many words: cut words, never shrink
  the type. Break lines by meaning, not by width.
- **Reading time:** on screen at least 0.5 s plus 0.3 s per word, the reel's last line at least 2 s; a label of one
  or two words may stand 0.4 s. Count the words of the reel's language as written; a Dutch or German compound of 13
  letters or more counts as two. A line too long for its beat gets shorter, the beat does not get faster.
- **Weight and case:** bold or semibold for display; long lines in sentence case, never all caps
  beyond 3 words.
- **Tight leading for big type** (line height 1.0–1.1 for display, 1.2–1.3 for body).
- **Numbers and claims** only when they are real (see reel-builder): no invented stats on screen.

## 6. Contrast, emphasis and captions

- **Contrast:** at least 4.5:1 between text and what is directly behind it; 7:1 for captions over video. No grey
  text on a coloured area: tint secondary text from that colour.
- **Text over video or photos:** add a backing (a solid or semi-transparent panel in `surface` or `bg`,
  a soft gradient, or a stroke/shadow on the letters). Never trust that the footage stays dark.
- **Emphasis is rationed:** at most one accent word per beat, and only the word that carries the meaning, never
  three colours in one sentence.
- **Avoid thin strokes and light weights** under 56 px: video compression eats them.
- **Captions** (most people watch without sound): synced to the voiceover's word timestamps, never to a guess.
  Pages follow the energy: 2–3 words for a fast reel, 3–4 conversational, 4–6 calm; a new page on a pause or a
  sentence end. The spoken word is highlighted; one caption style for the whole reel.
- **The caption band is theirs:** captions sit at the bottom of the safe area, and no main text, illustration or
  diagram enters that band. The caption is the voice; on-screen text is a keyword or label, never the same
  sentence as the caption.

## 7. Animation

Motion directs attention; it is not decoration. Recipes and the measured numbers behind them:
[motion.md](references/motion.md).

- **Duration by role.** A hero or a card moves in 0.3–0.6 s (at most about 0.8 s); a small element in 4–12
  frames; a word of a word-by-word entrance about 0.13 s. Too snappy reads as a glitch; a longer build comes from a
  stagger, never from one slow move. The read time of §5 starts when the entrance ends.
- **Ease by role,** never one curve for everything: an arrival lands on a long tail (`expo.out`, `power4.out`), a
  camera move or a colour flood eases both ways (`power2.inOut`), an exit accelerates (`power3.in`). Linear only
  for rotation, progress and constant speed.
- **Exits** take 40–75 % of their entrance, in one smooth move. **Overlap:** the next element starts when the
  previous one is 30–50 % done. **Stagger:** words 2–4 frames apart, list items 1–2, about 0.5 s in total.
- **Springs on position and size only.** A little overshoot (`back.out(1.4)`) may land a card; opacity and colour
  never bounce, and UI never bounces.
- **Vary the entrance between beats:** per word un-blurring, per word turning from muted to full colour, the
  whole line un-blurring, a word rising: never fade and slide-up on every beat.
- **One hero move per beat.** A secondary move travels 50–70 % as far and starts 3–6 frames later; everything else
  is still. Text slides 20–60 px at most; scale from 0.9–0.95, never from 0.
- **A landed title is dead still:** no breathing, floating or pulsing loops. The motion goes to the next element,
  the footage or the background.
- **Rhythm:** something new every 2–4 s; never more than 3 s without change, except the end card. Hold 0.3–0.75 s
  before the payoff, which then plays at normal speed.
- **Cuts on the voice:** a beat changes on the word that starts it, about 10 frames (0.33 s) early so the eye is
  there in time. Cut at the fastest frame of a move, with the same direction and speed on both sides.
- **No empty frame at a cut:** on the cut frame and 0.1 s after it, something of the new beat is already
  recognisable: its entrance starts from a faint, blurred or slightly offset state (not from nothing), or the old
  beat stays until the cut. A blank frame between beats reads as a flash.
- **Transitions:** a talking-head reel cuts hard on the voice. A motion-graphics reel gives every transition a
  cause on screen and never crossfades between scenes ([motion.md](references/motion.md), "Transitions with a cause"). No
  spinning, 3D flips or glitch effects unless they are the brand.
- **Frame 0 is the thumbnail and the hook:** a face, the result or one bold line already on screen and moving.
  Never black, never a logo. A loop back to the first frame is a choice, not a default.

## 8. Diagrams

- **One diagram that grows:** start from the simplest true picture (the outline) and add one part at the moment the
  voice names it. Never the finished diagram at once. It keeps its place and size across its beats.
- **Labels sit on the part they name** and appear with it; no legend box on screen. A diagram without labels is a
  shape, not an explanation.
- The diagram stays above the caption band, and no caption or text crosses it unless that is marked as meant
  (video-components §4).

## 9. The CTA end card

- One action, in the words of the caption ("Comment GIDS"). Large, inside the safe area, on screen for at
  least 2 s; the brand lands once here, with weight: the logo in the brand slot (3 columns, on column 1, at the
  bottom of the content), never docked small anywhere else.
- The keyword is exactly the one the reply campaign in GIMC listens for (see
  [social-engagement](../social-engagement/SKILL.md)).

## 10. Check before you call it done

For a Hyperframes reel, [video-components](../video-components/SKILL.md) §4 is the check: `inspect.mjs` measures
the safe area, overlaps, cut-offs, sizes, hero size, entrance durations, springs on opacity, loops and repeated
entrances, empty frames at a cut, and makes the three sheets; a fresh reviewer goes through
[its checklist](../video-components/references/visual-review.md). With another tool, render stills of the start
and middle of every beat with the danger-zone overlay and check:

1. Nothing that must be read or recognised touches a danger zone, and nothing crosses the caption band.
2. Every text meets the minimum size and is on screen long enough to read.
3. Contrast holds on every frame, also where the footage changes behind the text.
4. Every beat has one hero of at least 40 %, and no banned default (§4) is left.
5. Entrances vary, landed text is still, something changes every 2–4 s, and the hook is on frame 0.
6. Only brand colours and brand fonts appear.
7. Every element has its relation from the storyboard: labels sit on their parts, nothing floats loose, each
   symbol means one thing at one size, and the logo is only in the end card's brand slot.

Say what you checked, which defaults you found, and what you changed, in one or two sentences.
