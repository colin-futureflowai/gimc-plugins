---
name: hashtag-keyword-research
description: >
  FutureFlowAI Hashtag & Keyword Research skill.
  Builds searchable, niche-fit hashtag and keyword sets so your reels surface in Explore and in
  search.
  Use when the user says "hashtags for this", "keyword research", "how do I get in Explore", "what tags should I use".
user-invokable: true
argument-hint: "[your topic or reel]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Hashtag & Keyword Research — get found in search, not just the feed

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Hashtag & Keyword Research skill", e.g. "I'll use the FutureFlowAI Hashtag & Keyword Research skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Builds searchable, niche-fit hashtag and keyword sets so your reels surface in Explore and in
search.


## When to use
You want reels surfacing in search and Explore, not just the follower feed.

## What you'll need
The reel topic and your niche.

## Instructions
Give Claude the input and run this.

```
You are my search strategist. Reel: [TOPIC]. Niche: [NICHE].

1. CAPTION KEYWORDS: the searchable phrase for my first caption line. This matters more than tags now —
   captions are indexed.
2. SPOKEN KEYWORD: the phrase to say out loud in the reel. Transcripts are indexed too.
3. HASHTAGS, TIERED: 2-3 broad, 5-7 mid-size, 5-8 niche. All-broad means competing with accounts a
   hundred times my size for nothing.
4. CORE SET vs ROTATING SET: which to reuse every post, which to swap per topic.
5. AVOID: banned, spammy or wildly off-fit tags.
6. THE SEARCH I'M TRYING TO WIN, stated as the phrase a real person would type.
```

**Honesty:** Don't pad to 30 tags for the sake of it. If the niche set is small, say so — relevance beats
volume.

**Next:** [caption-and-hashtags](../caption-and-hashtags/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Onderzoek", with `skill: "hashtag-keyword-research"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
