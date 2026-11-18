---
name: reel-builder
description: >
  Builds a finished reel from a teardown or a beat structure: the beat-by-beat script in your voice,
  on-screen text, the scene and pacing per beat, the caption, and the render (in GIMC with Hyperframes, or Seedance).
  The build step of content-factory. Use when the user hands over a reel-analyzer teardown or a beat
  outline and says "build the reel", "turn this teardown into a reel", "write the full reel" or
  "script and storyboard this". For a whole reel from only a topic, use content-factory.
user-invokable: true
argument-hint: "[a reel-analyzer teardown, or a topic + the structure to follow]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Reel Builder — Claude assembles the whole reel for you

The last step of the factory. Hand Claude a teardown (from [reel-analyzer](../reel-analyzer/SKILL.md))
or just an idea + the structure to follow, and it **builds the finished reel** — every beat scripted in
your voice, with the on-screen text and the visual for each beat — so you can shoot/render it as-is.

## When to use
You have the structure you want to model (or a hook + topic) and you want the entire reel assembled, not
just notes. Run this after the analyzer + hook writer, or standalone with your own outline.

## What you'll need
The **teardown or structure** to follow, your **topic/offer**, your **voice**, and the **CTA** (what you
want them to do). Optional: your past winners (via [ai-brain](../ai-brain/SKILL.md)) so it sounds like you.

## Instructions
```
You are my reel builder. Build a complete, ready-to-make reel.
STRUCTURE TO FOLLOW: [paste the reel-analyzer teardown, or describe the beat structure].
TOPIC: [what it's about] · VOICE: [yours] · GOAL/CTA: [save / follow / comment / DM].

Output a beat-by-beat build table (the storyboard) — one row per beat:
| # | Spoken line (VO, my voice) | Message (≤ 8 words, without sound) | Scene type | Hero | Other elements → relation | Stays from before | On-screen text | ~secs |
Then the legend: every symbol, its one meaning and its one size.
Rules:
- Front-load the hook: beat 1's biggest element is moving on frame 0; the payoff lands in the first ~1.5s.
- Something changes every beat and shows what's said (never plain text for a demo line) — one world that grows
  (a diagram gains a part, a side wins), not new loose props each beat.
- Scene types: hook, text, media, diagram, compare, actor-object, stack, presenter, end-card. Every other element
  names its relation (inside, on, label-of, aligned-with, next-to, below, replaces) to the hero, a part or a slot;
  an element without one is dropped. One symbol keeps one meaning and one size.
- Original words on the modeled structure; total length matches the reference (±2s).
- End on ONE clear CTA that matches the deliverable.
Then give me: the final hook (3 options), the full VO script as one paragraph, and a caption + hashtags.
```

**Pairs with:** [reel-analyzer](../reel-analyzer/SKILL.md) (what to model) →
[viral-hook-writer](../viral-hook-writer/SKILL.md) (the opener) → this (the full build) →
[caption-and-hashtags](../caption-and-hashtags/SKILL.md) (the post).

## Rendering the reel — the video engine (make it, not just script it)

Scripting is half the job; this is how you turn the build table into a real, cinematic reel that
actually gets watched. Use a **hybrid engine**, matched to the beat:

- **Character-acting / cinematic beats → Seedance (image-to-video).** Seedance runs on **Runway** via
  the RunwayML SDK with `model: "seedance2"` (portrait `720:1280` for a 9:16 reel, ~5s per clip).
  Generate a conditioning still of the character/scene, then i2v it so the subject genuinely MOVES and
  performs. Cost ≈ $6–12 per reel in Runway credits — use it only where real acting matters, and confirm with the user first.
- **Hook, chapter, text, payoff, CTA beats → Hyperframes code-render** (HTML + a GSAP timeline) with
  [video-components](../video-components/SKILL.md): ready components in the brand from GIMC, inside the
  platform's safe area. Fast, on-theme and without a licence fee per render. In GIMC the render runs in GIMC
  itself (next section); the pinned CLI (`npx hyperframes@0.9.61 render`, see that skill) is the local route.
  This can carry a whole reel on its own, and is the text scaffolding of a reel with Seedance beats.
- **How it looks and moves** (storyboard, scene types, type sizes, reading time, contrast, captions, easing, safe
  zones per platform) follows [motion-design](../motion-design/SKILL.md); the storyboard columns above are its
  [storyboard.md](../motion-design/references/storyboard.md), and the build table becomes `props.json` of
  video-components one to one.

### Render in GIMC (the default when GIMC is connected)

When the build table is done, GIMC renders the reel: `gimc.canvas_render_reel` turns a **composition** into an mp4 and
a poster in a VM and puts them on a **new video card** on the board. Nothing to install, nothing to upload but media.

1. **Make the composition.** A composition is a folder with `index.html`: a Hyperframes composition (a root with
   `data-composition-id` and `data-duration` ≤ 60 s, a GSAP timeline in `window.__timelines.main`) and its own files.
   How it looks and moves is yours. The quickest way is the starter of video-components: write `props.json`, run
   `node build.mjs`, and send `index.html` plus the symbol files it uses. Hand-written HTML works just as well; the
   starter's components are building blocks, not a must. Details and the exact shape:
   video-components `assets/starter/examples/README.md`.
   - **Brand:** link `brand/brand.css` (GIMC writes it next to the composition: the brand's letters as `@font-face`
     and `--brand-color-*`, `--brand-font-*`). With the starter set `theme.css` to `brand/brand.css` and name the
     brand fonts with `files: []`. A brand without letters fails the render: set them first with `brandbook`.
     GSAP is at `vendor/gsap.min.js` (and `gimc/gsap.min.js`); `brand/`, `vendor/` and `gimc/` are GIMC's.
   - **Media:** images and video are not sent as bytes: upload them as `gimc-canvas` (media) says and list them in
     `assets` as `{ "path": "assets/clip.mp4", "ref": { "item_id": "<card id>" } }`. **No URLs** anywhere.
   - **Size:** one `gimc_execute` takes at most 20,000 characters of code, so keep the composition compact (the
     starter's HTML for 4–5 beats fits; a long reel goes as several shorter reels until GIMC takes bigger ones).
2. **GIMC checks before it renders.** An external URL, a missing `index.html` or a bad path comes back at once as a
   refusal with the file and line: nothing is rendered or charged. Then GIMC runs the starter's `inspect.mjs` on the
   result: text outside the safe area or the frame, text over other elements, a font that is not the brand's, a
   missing file, no timeline or over 60 s makes the render `failed` with one line per moment ("beat 2 (text)
   0:02.5: …"). Fix that and render again; the VM time of the check is charged.
3. **Look first, for free (optional):** `gimc.canvas_draft_reel({ org_id, board_id, composition, source_item_id })`
   puts the composition on a new video card as a concept: it plays as a live preview on the card (play, scrub, safe
   zones), with no render and no credits. Render it with `gimc.canvas_render_reel({ org_id, board_id, draft_id })`
   (or the user presses Renderen); the video lands on the same card.
4. **Start the render** (one `gimc_execute`; `source_item_id` = the script or build-table card it comes from, so
   the video gets its line; `idempotency_key` = run id + reel number, so a retry never renders twice):

```js
async () => {
  const r = await gimc.canvas_render_reel({ org_id: 'ORG_ID', board_id: 'BOARD_ID', source_item_id: 'SOURCE_CARD_ID',
    composition: { files: [{ path: 'index.html', content: HTML }], assets: ASSETS, platform: 'instagram-reels' },
    idempotency_key: 'RUN_ID-reel-1' })
  return { render_id: r.render_id, item_id: r.item_id, status: r.status, app_url: r.app_url }
}
```

5. **Follow it to done.** Check about every 15 s with one `gimc_execute` per check:
   `gimc.canvas_render_status({ org_id: 'ORG_ID', render_id: 'RENDER_ID' })`. A reel of 7–30 s is usually done in
   20–60 s. `done`: the video card has the mp4 and poster; close with its `app_url`. `failed`: give the `error` in
   plain words, fix the composition and render again, or stop. Still not done after 5 minutes: say so with the link.
6. **Refusals are messages for the user.** "Credits op: …" (402), a limit (429) or "not set up" (503): pass the
   message on word for word and stop. Never fall back to a local render without saying so.
7. **Changes = a new render.** `gimc.canvas_render_reel({ rerender_of: RENDER_ID })` renders the same composition
   again; with changes, send the new `composition` with `source_item_id` = the previous video card. Both make a new
   video card with a `remake` line; the old video stays.

**Local render** (video-components §5, then upload as `gimc-canvas` media says) only when the user asks for it,
or when `gimc.canvas_render_reel` is not there. Say which route you took.

**Non-negotiables (each of these was a real failure once — do not repeat them):**
1. **The hook needs a gripping VISUAL, not just text.** Open on something that grabs (e.g. a creator
   hacking a glowing terminal, a lock cracking, sparks) — the payoff word lands in the first ~1.5s.
2. **The character ACTS through a progressive action — never ping-pong/loop a few poses.** Looping a small
   pose set back-and-forth (A→B→A→B) reads as "replaying" and plays actions in reverse. Each beat is ONE
   forward action, start to finish. Seedance i2v does this natively; posed frames animated in code do NOT (they
   loop and read choppy — avoid them for real acting).
3. **Sync the visual to the VOICEOVER, not a wall-clock.** Transcribe the VO (word timestamps) and cut/act
   ON the word — the action must match what's being said. Lead the cut ~10 frames.
4. **Emphasis text must be high-contrast and readable** on every background: the brand's `accent`, on a
   backing panel or with a dark stroke over footage (motion-design §6). Text that must be read stays out of
   the platform's danger zones.
5. **Close on an on-screen CTA card, tied to the comment system.** End with a themed "Comment [KEYWORD] and
   I'll DM you [the thing]" card (an IG-composer graphic that types the keyword) — use the SAME keyword the
   caption uses and that the reply campaign in GIMC listens for, so comment → DM → lead actually fires. Save
   the campaign as a concept BEFORE the post goes out (see "Put it on GIMC" and
   [social-engagement](../social-engagement/SKILL.md)); a person sets it live. Honest only: never promise a DM
   that no live campaign will send.
6. **No fabricated numbers.** If a metric can't be verified, don't put it on screen.

**Verify before you ship — WATCH and MEASURE the playback, never trust a still.** First run the edit loop
of video-components §4 ("See what you made": `inspect.mjs` to 0 errors, look at the contact sheet yourself,
a second agent reviews it, `--video` sheet after the render). Then extract frames at ~12fps
and confirm: motion is progressive (no repeating/ping-pong autocorrelation period), no frozen beats while
the VO talks, and each action's cut aligns to its narration cue. Then eyeball the whole thing end to end.
A reel that was never watched ships broken.

**Credentials:** use an API key you were explicitly given, from your OWN project's env only. Never search
the filesystem for a key or read another product's `.env` — if you don't have the key, stop and ask.

**Honesty:** only promise a CTA you can deliver (if "comment WORD → I'll DM it", actually send it).

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `video` in frame "Eindvideo", with `skill: "reel-builder"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `structure_clone` from that source card to the new card(s).
- The result has media (video): upload it as described in `gimc-canvas` (media) and attach it to the card.
- Music for an Instagram Reel comes from GIMC, never from an outside library: find tracks with `gimc.social_search_audio` (trending, or by mood with `q`), recommend 2–3 with a reason, and put the choice on the post as `options.instagram.audio` (`audioId`, `title`, `artist`, `audioVolume`, `videoVolume`) when scheduling with `content-planning`. Music works only on a Reel and needs an account connected via Facebook; never keep `preview_url`. A person confirms the scheduling.

  ```js
  async () => {
    const r = await gimc.social_search_audio({ q: 'MOOD', audio_type: 'music' })
    return { total: r.total, tracks: r.tracks.slice(0, 5).map(t => ({ audio_id: t.audio_id, title: t.title, artist: t.artist, duration: t.duration })) }
  }
  ```

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

- Render the video in GIMC with `gimc.canvas_render_reel` and follow `gimc.canvas_render_status` to done (reel-builder, "Render in GIMC"): that makes the video card with mp4 and poster itself, so there is nothing to upload. Render locally with Hyperframes (video-components, pinned at hyperframes@0.9.61) only when the user asks for it or the tool is not there, and say so. Use paid video services (for example Seedance or Runway) only when the user explicitly asks for it.
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
  const run_id = 'RUN_ID', skill = 'reel-builder'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Eindvideo', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'video', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
