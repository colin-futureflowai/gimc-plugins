---
name: content-factory
description: >
  Runs the whole reel factory end to end: takes a proven viral format, studies it frame by frame,
  writes an original hook + script in your voice, builds the finished reel (on-screen text, scene per
  beat, voiceover, music, captions) and writes the caption + hashtags. The orchestrator that runs the
  other reel skills in order. Use when the user says "run the content factory", "make me a reel", "set
  up my whole content system", "do the whole thing" or "build my content machine".
user-invokable: true
argument-hint: "[your niche/topic + (optional) a viral reel URL to model + your @handle + a CTA keyword]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Content Factory — the whole setup, one command

**This is exactly how the whole page gets made.** One reel, idea → leads, then 3× a day. The Content
Factory is the *orchestrator*: it runs the other skills in order so you get a finished, on-brand reel
plus the lead loop, ready for a person to approve — not just notes. Point it at a topic (and optionally a viral reel to model) and it
drives the entire pipeline.

> The individual skills each do one job. This one runs **all of them, in sequence**, and hands the
> output of each step to the next.

## The pipeline (what runs, in order)

```
0. CONNECT     onboarding .......... one-time: GIMC (canvas, posting, reply campaigns), the Apify MCP
                                      (teardown), and make sure Hyperframes can render. Ask if missing.
1. MEMORY      ai-brain ............. recall your voice + past winners (so it sounds like YOU)
2. FIND+STUDY  Apify ............... tear a proven reel down frame-by-frame + transcript
3. HOOK        viral-hook-writer .... 10 scroll-stopping hooks for the first 1–3s, ranked
4. SCRIPT      reel-scripter ........ tight 30–45s ORIGINAL script — your words, the proven structure
5. BUILD+RENDER reel-builder + Hyperframes (+ Seedance via Runway) . the REAL rendered mp4
6. CAPTION     caption-and-hashtags . caption + tiered hashtags + a first comment built for saves
7. SCHEDULE    content-planning ..... puts the reel in the GIMC content calendar; a person approves it
8. LEADS       social-engagement .... keyword → reply + DM as a concept campaign; a person sets it live
9. COMPOUND    ai-brain ............. save what worked back to memory → the next reel starts smarter
```

**This runs for REAL by calling the tools directly — it is a harness, not a description.** The creative
steps (3–6 script/hook/caption) are Claude; the execution steps use the underlying tools, no wrapper:
- **Step 0 CONNECT (once, at onboarding):** check that **GIMC** is connected (see `gimc-canvas`), connect
  the **Apify MCP** (reel teardown/scraping), and confirm **Hyperframes** can render (Node 22+, ffmpeg, Chrome). If one is
  NOT connected, STOP and ASK the user to connect it — never search for or reuse a key.
- **Step 2** uses **Apify** to actually tear down the model reel.
- **Step 5** renders the real mp4 with **Hyperframes** through [video-components](../video-components/SKILL.md)
  (+ **Seedance via Runway** for acting beats), designed by [motion-design](../motion-design/SKILL.md) — see
  [reel-builder](../reel-builder/SKILL.md) for the render harness. Hyperframes needs no licence per render.
- **Step 7** uses **content-planning** to put the reel in the GIMC content calendar. You never publish
  without a person's approval: the company's publish rule in GIMC decides who puts the post at the platform
  (see content-planning, "Approval").
- **Step 8** saves the comment→DM rule as a **concept reply campaign** in GIMC (see "Put it on GIMC" and
  **social-engagement**). A person checks it and sets it live; from then on GIMC answers every matching comment.

If a tool isn't connected, do the creative pipeline (script + plan) and tell the user exactly what to
connect — GIMC, Apify, Hyperframes — to make it run end to end. Never fake a render, a post or a live campaign.

## When to use
You want the *whole* reel + lead loop, not one piece. Run this as your daily driver. For a single step,
call that skill directly (e.g. just `/viral-hook-writer`).

## What you'll need
- Your **niche/topic** and **audience**.
- Optional but better: a **viral reel URL** in your niche to model the format (Claude studies it in step 2).
- Your **@handle**, your **voice** (a line or two, or via [ai-brain](../ai-brain/SKILL.md)), and a
  **CTA keyword** (e.g. `GUIDE`) for the comment→DM loop.

## Instructions

Run this prompt (or invoke `/content-factory`). Claude will move through the pipeline, pausing for your
go-ahead at the steps that matter (the format pick, and before posting).

```
You are my content factory. Run the whole pipeline end to end and produce a finished, on-brand reel
plus the lead loop. Work in this order, showing me each step's output before moving on:

CONTEXT
- Niche/topic: [what it's about]
- Audience: [who it's for]
- Model this viral reel (optional): [URL]   ← if none, suggest 3 proven formats in my niche, I'll pick
- My @handle: [@you]   ·   My voice: [a line, or "use ai-brain"]   ·   CTA keyword: [e.g. GUIDE]

PIPELINE
0) CONNECT (once, onboarding): check GIMC, connect the Apify MCP (teardown) and confirm Hyperframes can render
   (render). IF ONE IS NOT CONNECTED, STOP AND ASK ME TO CONNECT IT and wait; never search for or reuse a key.
0.5) ai-brain: recall my voice + past winners (if connected).
1) FIND+STUDY: use Apify to tear down the model URL (or your suggested pick) → hook, beats, pacing, visuals.
2) viral-hook-writer: 10 hooks, ranked; I'll pick one (or you pick the strongest).
3) reel-scripter: a 30–45s ORIGINAL script in MY voice on that structure (never a copy).
4) reel-builder + Hyperframes (+ Seedance via Runway): actually RENDER the reel → a real mp4 with the on-screen
   comment-CTA card. Show me the beat table + the rendered reel.
5) caption-and-hashtags: caption + tiered hashtags + first comment, with my CTA keyword.
6) SCHEDULE: content-planning puts the reel in the GIMC content calendar on the date I pick. A person
   approves it in GIMC; you never publish yourself.
7) LEADS: save my CTA keyword as a concept reply campaign in GIMC (link-free public reply + DM with the
   resource). Tell me it waits for a person to set it live.
8) ai-brain: save the winning hook/format back to memory.

If a tool isn't connected, do steps 1–5 as the creative pipeline and tell me exactly what to connect
(GIMC, Apify, Hyperframes) to make it run end to end — never fake the render, the post or a live campaign.

RULES
- Model the FORMAT, never the words — original script in my voice (copies get buried by IG Originality).
- The hook carries 80%: front-load it, payoff in the first ~1.5s, works on mute.
- Every line gets a visual; no static "text on a card" for a demo line.
- The public comment reply NEVER contains a link — the link goes in the DM only.
- Be honest: the CTA must deliver exactly what it promises.
```

## The daily loop (3× a day)
Run the factory three times a day, rotating the angle so the feed stays varied:
- **Result/proof** ("Claude made this — N views"), **how-to** (the steps), **contrarian** ("you're doing X wrong").
- Stagger morning / midday / evening. Feed every winner back into [ai-brain](../ai-brain/SKILL.md) so the
  next batch starts from what already worked for *you*.

## Memory makes it yours
Generic in → generic out. Connect [ai-brain](../ai-brain/SKILL.md) (Obsidian vault) first so every step pulls
from **your** proven hooks, voice, and swipe file — that's the difference between "AI content" and content
that sounds like you.

## Honesty (non-negotiable)
- **Original only.** Model the technique; write your own words. Re-uploads/copies get reach-suppressed.
- **The CTA must be real.** If the reel says "comment GUIDE and I'll send it," the DM must actually send it
  (the reply campaign in GIMC sends it; see [social-engagement](../social-engagement/SKILL.md)).
- **No links in public replies** — resource goes in the DM.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `video` in frame "Eindvideo", with `skill: "content-factory"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- The result has media (video): upload it as described in `gimc-canvas` (media) and attach it to the card.
- Comment keyword → reply or DM runs in GIMC, never in an outside tool (no ManyChat, no comment monitor, cron, GitHub Action or `auto_responses.json`): save the rule as a concept with `gimc.social_save_reply_campaign` (keywords, link-free public reply, DM). Before the post is published, pass `item_id` (the post card) and `platform`; GIMC hangs it on the post once it is live and tells a person, who sets it live. On a published post pass `account_id` and `platform_post_id`.

  ```js
  async () => {
    const r = await gimc.social_save_reply_campaign({
      item_id: 'POST_CARD_ID', platform: 'instagram', name: 'NAME', keywords: ['KEYWORD'], match_mode: 'word',
      public_reply: 'PUBLIC_REPLY_WITHOUT_LINK', dm_message: 'DM_WITH_LINK', daily_max: 25,
    })
    return { campaign_id: r.campaign_id, status: r.status, waiting_for_post: r.waiting_for_post ?? false, app_url: r.app_url }
  }
  ```

- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- Facts in a card (numbers, prices, names, dates, claims) come only from the brand, the folder note, GIMC data or a source you name; anything else is marked "aanname" on the card.
- In code mode this is one `gimc_execute` (fill in the CAPITALS; folder and board as `gimc-canvas` §3 says). The next step of the same run reuses `frame_id`, or makes the next frame in the same `gimc.canvas_create_items` call. Pass the returned `org_id` on every later `gimc_execute`. `board_not_found`: create that board only when the user asked for it or `gimc-canvas` §3 names it as the default, then run again. `inbox`: pick those up first (`gimc-canvas` §4).

```js
async () => {
  const c = await gimc.canvas_get_context({ workspace: 'WORKSPACE', folder: 'FOLDER' })
  if (c.choose_workspace || c.folder_not_found || c.folder_matches) return c
  const board = c.boards.find(b => b.name.toLowerCase() === 'BOARD'.toLowerCase())
  // A new board only when the user asked for one: gimc.canvas_create_board({ folder_id: c.folder.id, name }).
  if (!board) return { board_not_found: 'BOARD', boards: c.boards.map(b => b.name) }
  const inbox = await gimc.canvas_inbox({ board_id: board.id })
  if (inbox.tasks.length || inbox.notes.length) return { board_id: board.id, inbox: {
    tasks: inbox.tasks.map(t => ({ task_id: t.id, item_id: t.item_id, instruction: t.instruction })),
    notes: inbox.notes.map(n => ({ comment_id: n.comment_id, item_id: n.item_id, body: n.body.slice(0, 200) })),
  } } // pick these up first (gimc-canvas §4), then run this again
  const { next_free } = await gimc.canvas_board_overview({ board_id: board.id })
  const run_id = 'RUN_ID', skill = 'content-factory'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Eindvideo', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'video', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
