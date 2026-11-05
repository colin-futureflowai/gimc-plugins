---
name: ugc-creator-brief
description: >
  FutureFlowAI UGC Creator Brief skill.
  Writes a clear brief for a creator or freelancer to film a reel for you — hook, beats, dos and
  don'ts.
  Use when the user says "brief a creator", "UGC brief", "write a brief for my videographer", "creator brief for this reel".
user-invokable: true
argument-hint: "[the reel concept and who is filming it]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# UGC Creator Brief — a brief a creator can actually shoot

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI UGC Creator Brief skill", e.g. "I'll use the FutureFlowAI UGC Creator Brief skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Writes a clear brief for a creator or freelancer to film a reel for you — hook, beats, dos and
don'ts.


## When to use
Someone else is filming — a creator, a customer, a freelancer.

## What you'll need
The concept, who's filming, and your brand's hard rules.

## Instructions
Give Claude the input and run this.

```
You are writing a creator brief. Concept: [IDEA]. Filmed by: [WHO]. Deadline: [WHEN].

1. THE HOOK, WRITTEN OUT: the exact words to say and show. Not described — written.
2. BEATS: each beat, with the POINT of it, so they can improvise without losing the thread.
3. DO: the specifics that make it work (framing, energy, pacing, what to hold up).
4. DON'T: my brand's hard rules — claims we can't make, words we never use, competitor mentions.
5. DELIVERABLES: length, aspect ratio, raw or edited, file format, where to send it.
6. REFERENCE: one link and one line on what to take from it.

Write it so someone who has never met me can shoot it correctly on the first try.
```

**Honesty:** Every vague line in a brief comes back as unusable footage. If something matters, write the
words.

**Next:** [b-roll-shot-list](../b-roll-shot-list/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Briefing", with `skill: "ugc-creator-brief"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
