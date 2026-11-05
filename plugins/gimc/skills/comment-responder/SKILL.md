---
name: comment-responder
description: >
  FutureFlowAI Comment Responder skill.
  Turn every comment into a lead on autopilot. Claude watches your new comments, posts a friendly
  public reply (never a link), and DMs the commenter your lead magnet / resource — then logs them as a
  lead. Use when the user says "auto reply to comments", "DM everyone who comments", "comment to DM",
  "lead magnet automation", "turn comments into leads", "auto-respond", or "capture leads from a reel".
user-invokable: true
argument-hint: "[the comment keyword + what to DM, e.g. SKILLS → the repo link]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Comment Responder — every comment becomes a lead

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Comment Responder skill", e.g. "I'll use the FutureFlowAI Comment Responder skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Post a reel with a "comment WORD and I'll send it" CTA, and this runs the back half for you: it detects
each new comment, replies publicly (warm, **link-free**), and slides the resource into the commenter's
DMs — so you wake up to a list of leads instead of a pile of "sent you a DM 🙌" you have to do by hand.

## When to use
Any reel/post with a keyword CTA ("comment SKILLS / BREAKDOWN / SETUP …"). Set the rule once; it handles
every commenter the same way, 24/7.

## What you'll need
The **keyword(s)** people will comment, the **public reply** (no link), and the **DM** (the link/resource
lives here). Optional: the specific post to scope it to.

## Instructions
Define one rule per CTA — it slots straight into a comment monitor's `auto_responses.json`:

```
You are my comment-to-lead responder. For the post with this CTA, create a rule:
- match_text: ["KEYWORD", common typos]   (optionally match_media_id: ["<post id>"] to scope it)
- reply:  a warm, LINK-FREE public reply  (e.g. "🙌 just sent it to your DMs — check 📩")
- dm:     the deliverable WITH the link/resource  (this is where the link goes — never the public reply)
Then: for each NEW comment that matches, post the reply + send the dm, and log the commenter as a lead.
Rules: ONE link, in the DM only. If a comment doesn't match any rule, defer it to me (don't guess).
```

**The honesty + safety rules (built in):**
- The **public reply NEVER contains a link** — the link goes in the DM only (platforms suppress link-y comments).
- Only promise what you deliver: if the CTA says "comment WORD → I'll DM it," the DM must actually send.
- No match → **defer to a human**, don't auto-reply with a guess.

**Runs unattended:** point it at a scheduled runner (e.g. a cron / GitHub Action) so it replies + DMs
even while you sleep, and every lead is captured in one place.

**Pairs with:** [reel-builder](../reel-builder/SKILL.md) ends the reel on a keyword CTA → this turns the
comments that CTA earns into DMs + leads.

## Take the input from GIMC

- Comments on the company's own posts: when GIMC is connected (a tool whose name ends in `social_list_comments`), read them there instead of asking the user to paste them: first the posts with comments, then the comments of the post the user means. Use commenters' names only to follow the conversation; never put them on a card.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `note` in frame "Reacties", with `skill: "comment-responder"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- For real comments from GIMC: put each answer in GIMC as a draft with `social_draft_comment_reply` (one per comment), as the `social-engagement` skill describes, so a person can read and post it. Never post replies yourself.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
