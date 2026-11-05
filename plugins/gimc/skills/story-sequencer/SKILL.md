---
name: story-sequencer
description: >
  FutureFlowAI Story Sequencer skill.
  Plans a multi-frame Instagram Story arc with polls, questions and a clear tap-through to your
  reel or link.
  Use when the user says "plan my stories", "story sequence for X", "how do I use stories to drive to this reel".
user-invokable: true
argument-hint: "[what you want the story to achieve]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Story Sequencer — an arc that earns the tap-through

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Story Sequencer skill", e.g. "I'll use the FutureFlowAI Story Sequencer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Plans a multi-frame Instagram Story arc with polls, questions and a clear tap-through to your reel
or link.


## When to use
You want stories to actually drive somewhere instead of being a diary.

## What you'll need
What the sequence is for — a reel, a link, a launch — and roughly how many frames you'll shoot.

## Instructions
Give Claude the input and run this.

```
You are my story planner. Goal: [drive to X]. I can shoot [N] frames.

Plan the arc:
1. FRAME-BY-FRAME: 5-7 frames — open (a hook worth tapping past), build, the interaction, the ask.
2. TEXT PER FRAME: short enough to read at story speed. Write the actual words.
3. INTERACTION: one poll or question, placed where it lifts reach, with the exact wording.
4. THE TAP: where the link/sticker goes — after value, not before.
5. WHAT TO SHOOT: a one-line shot note per frame.

One ask for the whole sequence. If I've asked for two things, tell me to cut one.
```

**Honesty:** Stories expire. Don't plan a sequence that needs three days of setup to pay off.

**Next:** [cta-writer](../cta-writer/SKILL.md) → [dm-script-writer](../dm-script-writer/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Stories", with `skill: "story-sequencer"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Each story becomes one `canvas_create_build` call (type `story`, 540×960 CSS px, rendered 1080×1920) in the "Stories" frame, titled "Story 1/4: …", as described in the `canvas-builds` skill; the sequence overview stays a `doc` card.
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
