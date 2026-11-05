---
name: content-audit
description: >
  FutureFlowAI Content Audit skill.
  Reviews your last 30 posts to find what is worth doubling down on, what is dead weight, and the
  gaps to fill.
  Use when the user says "audit my content", "what is working on my account", "what should I stop posting", "review my last 30 posts".
user-invokable: true
argument-hint: "[paste your recent post list with their numbers]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Audit — what to double down on, and what to stop

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Content Audit skill", e.g. "I'll use the FutureFlowAI Content Audit skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Reviews your last 30 posts to find what is worth doubling down on, what is dead weight, and the
gaps to fill.


## When to use
Before making more, work out what to stop.

## What you'll need
Your last 30 posts with views, saves, comments and shares. An Instagram connector (e.g. Composio) or your
Instagram insights export.

## Instructions
Give Claude the input and run this.

```
You are my content analyst. Here are my last 30 posts with their numbers: [paste].

1. MEDIAN FIRST: state my median views/saves so everything is judged against ME, not someone else.
2. OUTLIERS: the posts that beat it, and the trait they share.
3. DEAD WEIGHT: formats or topics I keep making that consistently underperform. Name them plainly.
4. BY TRAIT: score hook style, length, format and topic, each with its real multiple vs median.
5. STOP / KEEP / TEST: three short lists.
6. NEXT FIVE: five posts to make, each justified by a number above.

If a pattern isn't in the data, say "not enough signal" rather than guessing.
```

**Honesty:** Every multiple must come from the numbers pasted in. No estimated figures, and no advice that
contradicts my own data.

**Next:** [content-pillar-builder](../content-pillar-builder/SKILL.md) → [content-calendar](../content-calendar/SKILL.md)

## Take the input from GIMC

- Numbers of the company's own social accounts and posts: when GIMC is connected (a tool whose name ends in `social_get_insights`), read them there instead of asking the user to paste them, as the `social-insights` skill describes, and say which accounts and period you used. Pasted numbers still work when GIMC has no connected account or the user brings other numbers.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "content-audit"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
