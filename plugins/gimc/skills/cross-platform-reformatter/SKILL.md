---
name: cross-platform-reformatter
description: >
  FutureFlowAI Cross-Platform Reformatter skill.
  Reshapes one Instagram reel into a TikTok and a YouTube Short — adjusting hook, length and
  captions per platform.
  Use when the user says "repost this to TikTok", "make this a Short", "cross-post this reel", "reformat for YouTube".
user-invokable: true
argument-hint: "[the reel and its script]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Cross-Platform Reformatter — one reel, fitted to three platforms

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Cross-Platform Reformatter skill", e.g. "I'll use the FutureFlowAI Cross-Platform Reformatter skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Reshapes one Instagram reel into a TikTok and a YouTube Short — adjusting hook, length and
captions per platform.


## When to use
One reel, and you want it working on TikTok and Shorts too.

## What you'll need
The reel script and its CTA.

## Instructions
Give Claude the input and run this.

```
You are my distribution editor. Reel: [paste script + CTA].

For EACH of TikTok and YouTube Shorts:
1. HOOK: rewrite the first line for that platform. Shorts viewers arrive from search and want the answer
   stated; TikTok wants the tension first.
2. LENGTH: what to cut or extend, and where.
3. CAPTIONS: on-screen text changes (safe areas and UI differ).
4. CTA SWAP: there is no comment-to-DM funnel on YouTube — move the resource to the description.
5. METADATA: for Shorts, a searchable title, description and tags. This is a search platform.
6. WATERMARK: confirm the export has no other platform's watermark.
```

**Honesty:** Don't just re-upload. A reel with a foreign watermark and an unfitted hook underperforms on both
platforms.

**Next:** [caption-and-hashtags](../caption-and-hashtags/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `video` in frame "Publicatie", with `skill: "cross-platform-reformatter"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `reformat` from that source card to the new card(s).
- The result has media (video): upload it as described in `gimc-canvas` (media) and attach it to the card.
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
