---
name: comment-mining
description: >
  FutureFlowAI Comment Mining skill.
  Reads your comments and DMs to surface the questions, objections and exact phrases your audience
  uses — and turns them into content ideas.
  Use when the user says "what should I post about", "mine my comments", "what is my audience asking", "turn my DMs into ideas".
user-invokable: true
argument-hint: "[paste comments/DMs, or point at a post]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Comment Mining — your audience already told you what to make

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Comment Mining skill", e.g. "I'll use the FutureFlowAI Comment Mining skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Reads your comments and DMs to surface the questions, objections and exact phrases your audience
uses — and turns them into content ideas.


## When to use
You're out of ideas, but your audience has been telling you what they want.

## What you'll need
Your last 30-100 comments or DMs. An Instagram connector (e.g. Composio) can read them off your posts directly.

## Instructions
Give Claude the input and run this.

```
You are my audience researcher. Here are my comments/DMs: [paste].

1. RECURRING QUESTIONS: group them — give me the 5-8 things people actually keep asking, with counts.
2. OBJECTIONS: what stops them buying, trying, or believing me.
3. THEIR WORDS: the exact phrases they use. Quote them verbatim — I want these in my hooks and captions.
4. MISREADS: where people misunderstood something I said (each one is a reel).
5. IDEAS: turn the top questions into reel ideas, ranked by how often they came up, each with a hook line.

Use their vocabulary, not mine.
```

**Honesty:** Every idea must trace to a real comment. Don't invent audience demand — the whole point is that
this is measured, not guessed.

**Next:** [viral-hook-writer](../viral-hook-writer/SKILL.md) → [reel-scripter](../reel-scripter/SKILL.md)

## Take the input from GIMC

- Comments on the company's own posts: when GIMC is connected (a tool whose name ends in `social_list_comments`), read them there instead of asking the user to paste them: first the posts with comments, then the comments of the post the user means. Use commenters' names only to follow the conversation; never put them on a card.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "comment-mining"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
