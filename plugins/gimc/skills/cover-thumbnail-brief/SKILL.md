---
name: cover-thumbnail-brief
description: >
  FutureFlowAI Cover & Thumbnail Brief skill.
  Writes the cover-frame text and visual brief that makes your reel stop the scroll on the grid
  and in Explore.
  Use when the user says "write my cover text", "thumbnail brief", "what should the cover say", "grid cover for this reel".
user-invokable: true
argument-hint: "[the reel topic or script]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Cover & Thumbnail Brief — the frame that stops the scroll on the grid

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Cover & Thumbnail Brief skill", e.g. "I'll use the FutureFlowAI Cover & Thumbnail Brief skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Writes the cover-frame text and visual brief that makes your reel stop the scroll on the grid and
in Explore.


## When to use
The reel is made and the grid cover decides whether anyone opens it.

## What you'll need
The reel topic or script, and a look at your current grid.

## Instructions
Give Claude the input and run this.

```
You are my cover designer. Reel: [TOPIC/SCRIPT]. My grid currently looks like: [describe or paste].

1. COVER TEXT: 3-5 words max. Give me three options, ranked, each legible at thumbnail size.
2. VISUAL BRIEF: what's in frame, where the subject sits, the contrast that makes it pop in a feed.
3. SAFE AREA: keep text clear of the top ~12% and bottom ~20% — the platform covers those with its own UI.
4. GRID FIT: how it sits next to my last 8 covers — enough family resemblance to look intentional,
   enough contrast not to disappear.
5. TEST: describe it at 150px wide. If it's unreadable there, give me a simpler option.
```

**Honesty:** Legibility beats cleverness. A clever cover nobody can read at thumbnail size does not exist.

**Next:** [caption-and-hashtags](../caption-and-hashtags/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `image` in frame "Cover", with `skill: "cover-thumbnail-brief"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- The result has media (image): upload it as described in `gimc-canvas` (media) and attach it to the card.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
