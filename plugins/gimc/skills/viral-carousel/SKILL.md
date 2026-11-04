---
name: viral-carousel
description: >
  FutureFlowAI Viral Carousel skill.
  Finds the carousels that actually went viral in your niche, fetches every slide, breaks down why each
  one worked, and builds your own carousel on that proven structure in your words and your design.
  Use when the user says "find viral carousels", "what carousels are working in my niche",
  "make a carousel like this one", "copy the structure of this carousel", or before posting any carousel.
user-invokable: true
argument-hint: "[your niche, a few @handles, or carousel links]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Viral Carousel - find the winners, then build yours on their structure

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Viral Carousel skill", e.g. "I'll use the FutureFlowAI Viral Carousel skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Making a carousel with Claude is the easy part.
Knowing which carousel to make is the hard part.
This skill does the hard part first: it finds what your niche is already saving, then builds yours on that shape.

## When to use
Before you post any carousel.
Also when a carousel in your niche blew up and you want yours built the same way.

## What you'll need
Your niche, 5-10 accounts you compete with (or carousel links), and your topic.
For live numbers: an Instagram connector (e.g. Composio) so Claude can read posts and counts.

## Instructions

1. **Find.** Pull the last 30-50 posts of each account (Instagram Graph API `business_discovery`, the Composio
   Instagram tools, or the links the user pastes). Keep only carousels.
2. **Rank.** For each account, compute its median likes + comments.
   Mark a carousel **viral** when it beats its own account median by 3x or more.
   A small account's 3x beats a big account's average, because it proves the post, not the follower count.
3. **Fetch.** For the top 3-5 viral carousels, download every slide and the caption.
4. **Break down.** Run this on each one:

```
You are my carousel analyst. Here are the slides and caption of a carousel that went viral: [SLIDES + CAPTION].

For every slide give me: its job (hook / payoff / proof / step / summary / ask), the words on it, and why it is there.
Then tell me:
- Slide 1: what makes it stop the scroll (claim, number, contrast, question).
- Where the proof sits, and what kind it is (a result, a screenshot, a number).
- The slide people save, and why they would.
- Where the ask is, and what it asks for.
- The slide count and the reading rhythm (one idea per slide or not).
Finish with the STRUCTURE as a numbered list of slide jobs, with no topic words in it.
```

5. **Build.** Hand the structure to [carousel-builder](../carousel-builder/SKILL.md):

```
Build my carousel on this proven structure: [STRUCTURE].
My topic: [TOPIC]. My audience: [WHO]. My ask: [save / follow / comment WORD].
Keep every slide's job. Write every word fresh in my voice. Use my colours, fonts and handle.
```

6. **Render and post.** Render the slides in your own design (HTML to PNG, or your design tool), then post.
   With an Instagram connector, Claude designs the slides and posts them to your Instagram for you.

## Output
- The viral carousels it found, each with its multiple over its account median.
- A slide-by-slide breakdown of each one.
- The reusable structure.
- Your carousel, written on that structure, ready to render.

**Honesty:** Copy the structure, never the slides.
Every word, image and design on your carousel must be yours, and Instagram's originality checks bury reposted slides.
Numbers come from the API or the user, never from a guess.

**Next:** [carousel-builder](../carousel-builder/SKILL.md) → [caption-and-hashtags](../caption-and-hashtags/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `carousel` in frame "Carrousel", with `skill: "viral-carousel"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `structure_clone` from that source card to the new card(s).
- Build the slides yourself with one `canvas_create_build` call (type `carousel`, 4:5 by default) as described in the `canvas-builds` skill: GIMC renders each slide as a PNG in the folder's brand and makes the carousel card. Only when the user brings finished slide images: slide 1 as the carousel card's poster (role poster), the other slides as separate image cards linked to it.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
