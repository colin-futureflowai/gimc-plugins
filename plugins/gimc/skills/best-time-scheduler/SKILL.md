---
name: best-time-scheduler
description: >
  FutureFlowAI Best-Time Scheduler skill.
  Recommends the posting times and weekly cadence that fit your audience's actual activity
  windows.
  Use when the user says "when should I post", "best time to post", "posting schedule", "how often should I post".
user-invokable: true
argument-hint: "[your audience and timezone, or your insights]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Best-Time Scheduler — a cadence you will actually keep

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Best-Time Scheduler skill", e.g. "I'll use the FutureFlowAI Best-Time Scheduler skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Recommends the posting times and weekly cadence that fit your audience's actual activity windows.


## When to use
You're posting whenever and wondering if timing is the problem.

## What you'll need
Your audience's timezones and, ideally, your insights showing when they're active.

## Instructions
Give Claude the input and run this.

```
You are my scheduler. Audience: [WHO/WHERE]. My insights: [paste activity data if you have it].
I can realistically post [N] times a day.

1. TIMES: the specific slots, from MY data if provided. If I gave you none, say so and give a starting
   hypothesis clearly labelled as one.
2. CADENCE: a weekly pattern I can actually sustain at [N]/day.
3. SLOT ROLES: which slot gets my strongest piece, which is for testing.
4. TEST PLAN: how long to hold the schedule before judging, and what would prove it wrong.
5. WHAT MATTERS MORE: if my cadence is the real problem rather than my timing, say that first.
```

**Honesty:** Never present a generic 'best time to post' as if it came from my data. Label a hypothesis as a
hypothesis.

**Next:** [content-calendar](../content-calendar/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "best-time-scheduler"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Also put every dated post in the GIMC content calendar with `canvas_schedule_posts` (Amsterdam time, one call for the whole plan), following the `content-planning` skill; the document alone is not enough. Posting itself does not happen yet: say so once, using `publish_note`.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
