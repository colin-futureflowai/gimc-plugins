---
name: series-planner
description: >
  FutureFlowAI Series Planner skill.
  Designs a recurring, named reel series — a repeatable format viewers come back for and follow so
  they do not miss.
  Use when the user says "plan a series", "recurring format", "what series should I run", "make this a weekly thing".
user-invokable: true
argument-hint: "[your niche and what you want to be known for]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Series Planner — a format people come back for

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Series Planner skill", e.g. "I'll use the FutureFlowAI Series Planner skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Designs a recurring, named reel series — a repeatable format viewers come back for and follow so
they do not miss.


## When to use
You want a format people follow you for, not one-off posts.

## What you'll need
Your niche, what you want to be known for, and how often you can ship.

## Instructions
Give Claude the input and run this.

```
You are my format designer. Niche: [NICHE]. Known for: [POSITION]. I can ship [N] per week.

1. THE NAME: 3-5 candidates. This is what people will refer to you by — make it sayable.
2. THE SHAPE: the repeatable structure — same opening device, same beats — so episode 9 is fast to make.
3. TWELVE EPISODES: titles and one-line premises, so the series survives past the initial enthusiasm.
4. THE FOLLOW REASON: why missing one would bother someone. If you can't answer this, the series is weak
   and you should tell me.
5. PRODUCTION REALITY: how long each episode takes once the format is set.
```

**Honesty:** A series is a promise. Weekly means weekly — one that skips trains people not to expect you.

**Next:** [content-calendar](../content-calendar/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `idea` in frame "Ideeën", with `skill: "series-planner"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Also put every dated post in the GIMC content calendar with `canvas_schedule_posts` (Amsterdam time, one call for the whole plan), following the `content-planning` skill; the document alone is not enough. Posting itself does not happen yet: say so once, using `publish_note`.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
