---
name: bio-profile-optimizer
description: >
  FutureFlowAI Bio & Profile Optimizer skill.
  Rewrites your bio, name field and pinned-reel order to convert profile visits into follows and
  clicks.
  Use when the user says "rewrite my bio", "optimize my profile", "what should my bio say", "which reels should I pin".
user-invokable: true
argument-hint: "[your current bio and what you want visitors to do]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Bio & Profile Optimizer — the profile is the conversion page

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Bio & Profile Optimizer skill", e.g. "I'll use the FutureFlowAI Bio & Profile Optimizer skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Rewrites your bio, name field and pinned-reel order to convert profile visits into follows and
clicks.


## When to use
Reels are getting views but visits aren't turning into follows.

## What you'll need
Your current bio, name field, link and pinned posts.

## Instructions
Give Claude the input and run this.

```
You are my profile strategist. Current bio: [paste]. Name field: [paste]. Link: [paste].
Pinned: [list]. I want visitors to: [follow / click / DM].

1. NAME FIELD: this is INDEXED by search — my actual name usually shouldn't be there. Give me 3 options
   built on what people search for.
2. BIO: line 1 = who it's for + what they get. Line 2 = proof. Line 3 = the ask. Above the fold.
3. LINK: one destination matched to the traffic I actually have.
4. PINNED THREE, in order: proof first, then the offer, then the best teach. Say which of my posts fits each.
5. THE 3-SECOND TEST: what a visitor concludes in three seconds. If that isn't what I want, fix the bio again.
```

**Honesty:** Reels earn the visit; the profile decides the follow. Don't write a clever bio that doesn't say
who it's for.

**Next:** [cta-writer](../cta-writer/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Profiel", with `skill: "bio-profile-optimizer"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
