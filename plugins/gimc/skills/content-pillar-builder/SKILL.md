---
name: content-pillar-builder
description: >
  FutureFlowAI Content Pillar Builder skill.
  Defines the 3-5 themes your account posts against, so every reel ladders up to a clear position.
  Use when the user says "what are my content pillars", "define my themes", "what should my account be about".
user-invokable: true
argument-hint: "[your business and audience]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Pillar Builder — the 3-5 themes everything ladders up to

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Content Pillar Builder skill", e.g. "I'll use the FutureFlowAI Content Pillar Builder skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Defines the 3-5 themes your account posts against, so every reel ladders up to a clear position.


## When to use
Your feed feels random and you can't say what the account is about.

## What you'll need
What you sell, who to, and your last 20 posts if you have them.

## Instructions
Give Claude the input and run this.

```
You are my brand strategist. Business: [WHAT]. Audience: [WHO]. Recent posts: [paste if available].

1. PILLARS: 3-5, no more. Each a THEME with a point of view, not a topic bucket.
2. WHY EACH EARNS ITS PLACE: the audience need it serves and the business job it does.
3. ROTATION: how often each appears in a week.
4. THE POSITION: in one sentence, what someone would say I'm about after scrolling ten posts.
5. OUT OF SCOPE: what does NOT fit. This is the part that keeps an account coherent.
6. AUDIT: if I gave you recent posts, sort them into pillars and show me what's over- and under-served.

If more than five pillars fit, the framework is too loose — force it down.
```

**Honesty:** Six pillars is no pillars. If everything fits, the framework isn't doing any work.

**Next:** [content-calendar](../content-calendar/SKILL.md) → [series-planner](../series-planner/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "content-pillar-builder"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
