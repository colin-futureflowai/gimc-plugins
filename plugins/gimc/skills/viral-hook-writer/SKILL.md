---
name: viral-hook-writer
description: >
  FutureFlowAI Viral Hook Writer skill.
  Write scroll-stopping hooks for a short-form video (the first 1-3 seconds).
  Use when the user says "hook", "reel hook", "opening line", "scroll stopper",
  "first three seconds", "TikTok hook", or "how do I start this video".
user-invokable: true
argument-hint: "[reel topic / what the video is about]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Viral Hook Writer

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Viral Hook Writer skill", e.g. "I'll use the FutureFlowAI Viral Hook Writer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Generate a batch of scroll-stopping hooks for a reel — the make-or-break first 1-3 seconds.

## When to use
You have a reel topic but the opening is weak. The hook is ~80% of whether anyone watches — this gives you options to test.

## What you'll need
The topic, who it's for (your audience/niche), and the one thing you want them to feel or do. Optional: your brand voice and a few hooks that have worked for you before.

## Instructions
Collect the topic and audience, then run this prompt:

```
You are my short-form video hook writer. Topic: [topic]. Audience: [who it's for]. Desired reaction: [stop scrolling / save it / comment / DM me].

Write 10 hooks for the first 1-3 seconds. Use a spread of proven angles:
- Bold claim / contrarian take
- "If you [situation], do this"
- Mistake / "stop doing X"
- Number + payoff ("3 ways to…")
- Curiosity gap / open loop
- Result-first ("I went from X to Y")
- Question that names the pain

Rules: under 12 words each, spoken-language, no fluff, no hashtags. For each hook add a 3-5 word on-screen text version. Mark the 3 you'd test first and say why in one line.
```

**Obsidian memory tip:** If you've connected your Obsidian vault (Filesystem MCP), point Claude at your notes of past reels — "use the hooks that performed best in my vault as the pattern." Hooks grounded in *your* winners beat generic ones.

**Tip:** Always generate 10 and test 2-3. The hook you love is rarely the one that wins.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `hook` in frame "Hooks", with `skill: "viral-hook-writer"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- A reference video a hook is modelled on is a `link` card with its thumbnail as poster, with a line to the hooks; see `gimc-canvas` (media, "Social video from another account").
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
