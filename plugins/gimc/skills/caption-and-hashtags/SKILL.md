---
name: caption-and-hashtags
description: >
  FutureFlowAI Caption & Hashtags skill.
  Write the caption, hashtag set, and first comment for a reel or post. Use when
  the user says "caption", "hashtags", "write the description", "what do I write
  under this", "first comment", or "post copy".
user-invokable: true
argument-hint: "[what the reel/post is about]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Caption & Hashtags

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Caption & Hashtags skill", e.g. "I'll use the FutureFlowAI Caption & Hashtags skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Write the caption, a tiered hashtag set, and a first comment that drives saves, follows, and reach.

## When to use
The video's done — now you need the copy that gets it shared and the hashtags that get it found, without looking spammy.

## What you'll need
What the reel is about, the platform, your niche, and the goal (saves / follows / comments / link). Optional: your handle and brand voice.

## Instructions
Run this prompt:

```
You are my social copywriter. Write the post copy for this reel.

Reel: [what it's about]   Platform: [Reels/TikTok/Shorts]   Niche: [niche]
Goal: [saves / follows / comments / DMs]

Give me:
1. CAPTION — a strong first line (it's the only line shown before "more"), then 2-4 short lines of value, then one clear CTA. No hashtag soup in the caption.
2. HASHTAGS — 12-15, tiered: a few broad (1M+), several mid (100k-1M), several niche (<100k). Put them in the first comment, not the caption.
3. FIRST COMMENT — the hashtags + a question that sparks replies (comments boost reach).
4. ALT TEXT — one accessible description of the video.

Match the niche's language. No emojis-as-bullets unless on-brand.
```

**Obsidian memory tip:** With your vault connected (Filesystem MCP), ask Claude to "reuse the hashtag sets and CTA style from my best-saved posts." Your proven tags beat a generic list.

**Tip:** The first line of the caption is a second hook. Make it earn the "…more" tap.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Publicatie", with `skill: "caption-and-hashtags"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
