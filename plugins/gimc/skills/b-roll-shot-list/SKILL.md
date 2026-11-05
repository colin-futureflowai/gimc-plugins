---
name: b-roll-shot-list
description: >
  FutureFlowAI B-Roll & Shot List skill.
  Turns a script into a shoot-ready shot list — every clip, angle and visual you need to film, in
  order.
  Use when the user says "what do I need to film", "shot list for this", "b-roll list", "how do I shoot this reel".
user-invokable: true
argument-hint: "[your script]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# B-Roll & Shot List — everything you need to film, in shooting order

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI B-Roll & Shot List skill", e.g. "I'll use the FutureFlowAI B-Roll & Shot List skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turns a script into a shoot-ready shot list — every clip, angle and visual you need to film, in
order.


## When to use
The script is done and you need to know exactly what to film.

## What you'll need
The final script.

## Instructions
Give Claude the input and run this.

```
You are my first AD. Script: [paste].

1. SHOT LIST in FILMING order (not script order) — group by location and setup so I shoot everything in
   one place before moving. Number them.
2. PER SHOT: what's in frame, the angle, the duration to film, and THE LINE IT COVERS.
3. NO ORPHANS: if a shot doesn't cover a line, cut it and say so.
4. COVERAGE: mark which shots are essential vs nice-to-have, so I know what to drop when time runs out.
5. STOCK FALLBACK: for anything I can't film, the exact search term to find it.
6. KIT: what I actually need, in one short list.
```

**Honesty:** Every shot needs a job. Pretty footage with no line to cover is what makes reels drag.

**Next:** [reel-builder](../reel-builder/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Shotlist", with `skill: "b-roll-shot-list"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
