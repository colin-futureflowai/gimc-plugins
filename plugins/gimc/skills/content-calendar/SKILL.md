---
name: content-calendar
description: >
  FutureFlowAI Content Calendar skill.
  Turn a batch of ideas (or your content pillars) into a 2-week reel posting
  calendar with hooks, formats, and a daily plan. Use when the user says
  "content calendar", "posting schedule", "plan my content", "what should I post
  this week", "content plan", or "batch my reels".
user-invokable: true
argument-hint: "[your niche + ideas or content pillars]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Calendar

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Content Calendar skill", e.g. "I'll use the FutureFlowAI Content Calendar skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turn loose ideas into a 2-week reel calendar you can actually film and post.

## When to use
You have ideas (or pillars) but no plan. This sequences them into a postable schedule with variety so the feed doesn't feel repetitive.

## What you'll need
Your niche, your 3-5 content pillars (or a list of ideas), how many reels per week, and your goal (growth / leads / authority). Optional: best posting days.

## Instructions
Run this prompt:

```
You are my content strategist. Build a 2-week Instagram Reels calendar.

Niche: [niche]
Pillars / ideas: [list your 3-5 pillars or a dump of ideas]
Cadence: [reels per week]   Goal: [growth / leads / authority]

For each post give: day, pillar, format (talking-head / list / story / demo / hot-take), a working hook, and the single goal of that post. Rotate formats and pillars so it doesn't feel samey. Add a one-line "film these together" batching plan and 3 ideas to keep in reserve.

Return it as a clean table: Day | Pillar | Format | Hook | Goal.
```

**Obsidian memory tip:** Connect your Obsidian vault (Filesystem MCP) and ask Claude to "weight the calendar toward the pillars and formats that performed best in my vault." The plan compounds on what already works for you.

**Tip:** Batch-film a week in one session. The calendar's real job is to make filming fast.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "content-calendar"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Also put every dated post in the GIMC content calendar with `canvas_schedule_posts` (Amsterdam time, one call for the whole plan), following the `content-planning` skill; the document alone is not enough. Whether a post really goes live is in the answer (`at_platform`, `publish_note`): tell the user once, in one sentence.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
