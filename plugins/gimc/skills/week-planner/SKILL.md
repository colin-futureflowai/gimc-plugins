---
name: week-planner
description: >
  GIMC Week Planner skill. Makes and schedules a whole week of reels from one sentence: one intake (or "same as last
  time?"), one approval of the week plan, then every reel is made, put in the content calendar and waits for approval
  in the agenda. It directs the other skills and does none of their work. Use when the user says "maak de content voor
  volgende week", "plan mijn week", "vul volgende week", "content voor de week", "make next week's content".
user-invokable: true
argument-hint: "[optional: how many reels, platforms, or 'same as last week']"
---

# Week planner in GIMC

> **GIMC skill.** Call it "the GIMC Week Planner skill" in the user's language.

The user says one sentence; after that they only approve in the agenda. You talk to the user at **two moments at
most**: the intake (section 2) and the week plan (section 4). After the plan is approved you make exactly the agreed number
of reels without further questions. Only a real block (a GIMC tool that keeps failing, no connection) gets one short
message.

You direct; other skills do the work. Never write a hook, script, caption or schedule rule here that a skill below
already has.

**Few GIMC rounds.** Every `gimc.<tool>(…)` below runs inside `gimc_execute` (see `gimc-canvas`, references/code-mode.md).
Do each phase in as few executes as you can: context, accounts, schedule and media check together (sections 1–2); the
frames of a phase in one; review and scheduling together (section 6). Return only what you need (ids, counts, short
lines), never whole lists. Subagents still work one per reel.


| Step | Skill |
|---|---|
| Board, frames, cards, media, folder note | `gimc-canvas` |
| Last week's numbers | `social-analytics-report` (reads GIMC insights) |
| Competitors | `competitor-teardown` |
| Trends and sounds | `trend-spotter` |
| Posting days and times | `best-time-scheduler` (reads GIMC insights) |
| The week plan (day, theme, hook, format) | `content-calendar` |
| One reel | `reel-builder`, or `content-factory` steps 3–6 (never its posting steps) |
| Caption | `caption-and-hashtags` |
| Music, post settings, scheduling, approval | `content-planning` |

## 1. Context (one execute, together with the media check of section 2)

Several workspaces: take the `org_id` from the first answer (or the error that lists them) and pass it as `org_id` on
**every** `gimc_execute` after that, so no inner call fails on the workspace choice.

1. `gimc.canvas_get_context` with `include_inbox: true` (folder the user names, otherwise as `gimc-canvas` §3). Pick up open
   notes and tasks first, as `gimc-canvas` §4 says.
2. Read the folder note (in the context answer). Look for the block `### Week content (week-planner)` under
   "What the user wants".
3. `gimc.social_list_accounts`: connected platforms and `publish_policy`. A wanted platform without an account: say once
   that those posts wait in the calendar until a person connects it (Socials → Accounts).
4. The week: "volgende week" = Monday to Sunday of the coming week; "deze week" = the remaining days. Amsterdam time.
5. What is already planned or waiting: `gimc.canvas_list_schedule` for that week is the source. The folder note can be out
   of date (a planning may have been cancelled); never decide "already done" from the note alone.

**Board.** The whole week is one run on the folder's board "In productie" (create it if missing), `run_id`
`week-<yyyymmdd of Monday>`. The first frame "1 · Weekplan" with a brief card goes on the board right away (first card
within the first minute, `gimc-canvas` §5), **at `next_free`** from the first execute — never at x 0 / y 0 on a board
that already has work. Every later frame of this run is placed relative to "1 · Weekplan" (sections 3 and 5).

**The first execute** (sections 1 and 2 together; fill in the folder and the Monday/Sunday of the week):

```js
async () => {
  const c = await gimc.canvas_get_context({ folder: 'FOLDER', include_inbox: true })
  if (c.choose_workspace) return c
  const board = c.boards.find(b => b.name === 'In productie')
  const [acc, sch, media] = await Promise.all([
    gimc.social_list_accounts({}),
    gimc.canvas_list_schedule({ from: 'MONDAY', to: 'SUNDAY' }),
    Promise.all(c.boards.map(b => gimc.canvas_list_items({ board_id: b.id, kinds: ['video', 'image'], fields: ['title', 'kind', 'skill', 'run_id', 'review'] }))),
  ])
  const note = c.notes.at(-1)
  const overview = board ? await gimc.canvas_board_overview({ board_id: board.id }) : null
  return {
    folder_id: c.folder?.id, folder_not_found: c.folder_not_found, folder_matches: c.folder_matches, board_id: board?.id, note_version: note?.version, next_free: overview?.next_free ?? { x: 0, y: 0 },
    preference: note?.body.match(/### Week content \(week-planner\)[\s\S]*?(?=\n#|$)/)?.[0] ?? null,
    inbox: c.inbox, accounts: acc, waiting: sch.schedule.filter(s => s.status !== 'cancelled').map(s => [s.item_id, s.scheduled_at]),
    media: media.flatMap(m => m.items).filter(i => !['reel-builder', 'content-factory', 'week-planner'].includes(i.skill)).length,
  }
}
```
A choice list of workspaces (`choose_workspace`): run it again with `org_id` on `gimc_execute`. `folder_not_found` or
`folder_matches`: the folder name did not match one folder; ask once which folder, never continue in another one.

## 2. Intake: one moment

**Media first** (so the intake can include it). Per board of the folder, `gimc.canvas_list_items` with
`kinds: ["video", "image"]` and `fields: ["title", "kind", "skill", "run_id", "review"]`. Usable = the user's own raw
clips and photos; finished reels of earlier runs (skill `reel-builder` or `content-factory`) count only for a
remix. Rough need per reel:

| Reel type | Needs |
|---|---|
| Talking head, demo, testimonial | 1 own clip of 15–45 s, or 3–6 shots |
| B-roll with voice-over or text | 4–6 clips or photos |
| Remix of an earlier reel | that reel (`content-repurposer`, `cross-platform-reformatter`) |
| Faceless / animation (Remotion text, motion, product stills) | nothing |

**With a saved preference** (the block exists): one short message: the preference in one line, the media check in one
line, and "Zelfde als vorige keer, of iets anders?" (in the user's language). Not enough media for the saved number:
add the proposal (below) to that same message. "Zelfde als vorige keer" answers the intake only: it is never the
approval of the week plan. Always go on to section 4 and wait for "ok" before you make any reel.

**Without one**: one message with every question, each with a proposed default so "ok" is a valid answer:

1. How many reels this week (default 3), and fixed days if any.
2. Platforms (default: the connected ones).
3. Tone and goal (growth, leads, authority; the CTA keyword if a comment → DM is wanted).
4. Extra steps before planning: last week's numbers, competitors (which handles), trends, or something the user names.
5. Media: what you found, and "upload more on the board in GIMC or give me the files". Not enough for the number:
   a concrete proposal to choose from — fewer reels, reuse or remix earlier reels, or faceless/animation reels — with
   your recommendation.
6. Music: a mood, or "you pick".

**Save the answer** right after it comes in: `gimc.canvas_update_folder_note` with the whole text and the
`expected_version` you read. Keep every other line exactly; add or update only this block under "What the user wants"
(conflict: read again, merge, retry once — `gimc-canvas` folders reference):

```markdown
### Week content (week-planner)
- Reels per week: 3 · fixed days: Tue, Thu, Sat
- Platforms: instagram, facebook
- Tone and goal: direct, no jargon · leads · CTA keyword GIDS
- Extra steps: last week's numbers, trends
- Media: own clips on board "Mijn content"; fill gaps with faceless reels
- Music: calm, instrumental
```

## 3. Research and times, in parallel

Before you start: one `gimc.canvas_create_items` call with a frame per step of this phase, on the row of
"1 · Weekplan", 260 px apart ("2 · Analyse vorige week", "3 · Concurrenten", "4 · Trends" — only the chosen ones — and
"5 · Tijden"), each with the `run_id`. Then run the chosen extra steps and `best-time-scheduler` as subagents at the
same time (section 8), each with its own frame id. Each puts its card(s) in its frame and returns a summary of at most
ten lines.

`best-time-scheduler` gets: the platforms, the number of reels, the fixed days and the week. Then check what is
already planned that week (`gimc.canvas_list_schedule` with `from`/`to`) and avoid two posts on one platform in the same
hour.

## 4. The week plan: one approval

Run `content-calendar` for this one week with the agreed number as cadence, the research summaries as input and the
slots from step 3. Per reel: day, time, platform(s), theme, hook idea, format, and media (the card titles it uses, or
"faceless"). Put it as one `doc` card "Weekplan <week>" in "1 · Weekplan" (`skill: "content-calendar"`).

In the chat: one short message with the link (`app_url`) and the question to approve it; a table in the chat only when
the canvas failed. **Stop here and wait for the answer**, also when the intake was "zelfde als vorige keer". A change:
adjust the card and ask once more. **After "ok" there are no more content questions.**

## 5. Make the reels

1. One `gimc.canvas_create_items` call with a frame per reel, 1760×1250, titled "Reel 1 · ma 10 nov", with the `run_id`:
   each on its own row, the first 260 px below the research row, the next ones 1510 px lower, all at the `x` of
   "1 · Weekplan". You make every frame; a subagent never does, so parallel work never lands on the same spot.
2. One subagent per reel (section 8), **at most three at a time** (rendering is heavy). Each makes its reel only in its
   own frame and returns the brief's answer. A user who wants the reels made "one after another" (slow laptop) still
   gets one subagent per reel, started one at a time; you only make reels yourself when there is no subagent tool.
   Making reels yourself (no subagent tool): render all reels in one shell command and upload all files in one node
   script, so the whole batch costs one round each, not one per reel.
3. Exactly the agreed number. A reel that fails: one retry (new subagent or yourself). Still failing: say in one
   sentence which day is missing; never make an extra reel to make up for it.
4. Every reel's result card is a **new card made in this run** (its `run_id`, in its frame). Never schedule an existing
   card id, also not one approved before: that approval was for other content. Reusing material = a new card with
   `parent_id` and a relation (`derived`, `variant`, `remix`).

## 6. Schedule, ask for approval and close (one execute)

Do sections 6 and 7 in **one** `gimc_execute`: finish any pending media (`gimc.canvas_media_complete`), request review,
schedule, and update the folder note, and return only the schedule ids and `app_url`. No separate "check" execute:
the answers of these calls are the check.

```js
async () => {
  const ids = ['REEL1', 'REEL2', 'REEL3']
  // Media that a subagent uploaded but did not finish: complete it first, so the review covers the final card.
  // await gimc.canvas_media_complete({ item_id: 'REEL1', path: 'PATH' })
  await gimc.canvas_request_review({ item_ids: ids, comment: 'Week 46: 3 reels' })
  const planned = await gimc.canvas_schedule_posts({ skill: 'week-planner', run_id: 'RUN', posts: [
    { item_id: 'REEL1', scheduled_at: '2026-11-10T18:00', platforms: ['instagram'], options: {} },
  ] })
  let note_saved = true
  try {
    const note = (await gimc.canvas_get_context({ folder_id: 'FOLDER_ID' })).notes.at(-1)
    await gimc.canvas_update_folder_note({ folder_id: 'FOLDER_ID', expected_version: note.version, body: note.body + '\n- Week 46: 3 reels wachten op goedkeuring' })
  } catch (e) { note_saved = e.message }
  return { schedule: planned.schedule.map(p => p.id), app_url: planned.app_url, note_saved }
}
```

1. Collect the answers. In that `gimc_execute`, first one `gimc.canvas_request_review` with every reel's `item_id` and a one-line comment ("Week 46:
   reel 2 of 3, Tue 10:00, Instagram"), so a reel is never scheduled without a pending review. Always, whatever the
   `publish_policy`: the person approves in the agenda.
2. Then one `gimc.canvas_schedule_posts` call for all reels (`skill: "week-planner"`, the `run_id`): per reel `item_id` of
   the final video card, `scheduled_at`, `platforms`, and `options` with what the subagent returned, in this shape:
   `options.instagram.audio = { audioId, title, artist, audioVolume, videoVolume }` (volumes whole numbers 0–100) and
   `options.instagram.cover = { kind: "frame", offsetMs }`. No `caption`: GIMC takes `data.caption`.
3. Never put a reel at the platform yourself and never call it "ready" or "live" before it is approved. GIMC puts an
   approved post at the platform; that is not your step.

## 7. Close

The folder note update (`gimc-canvas` §9: where the week is, open work) is the last call of the execute in section 6.
Then 1–3 sentences: how many reels are
waiting for approval, the link to the content calendar (`app_url` of `gimc.canvas_schedule_posts`), and that they approve
or ask for a change per reel in the agenda. Don't repeat the canvas in the chat.

**A change asked in the agenda** is an open task in the inbox (`tasks`, instruction "Wijziging gevraagd: …"). The
loop, every time: read the inbox → `gimc.canvas_claim_task` (taken by someone else: skip it) → change the card as asked
(caption, text, time or post settings via `content-planning`; a new video via the reel skill) → `gimc.canvas_complete_task`
→ `gimc.canvas_request_review` for that card again. Approving cancels open change tasks. A post already at the platform
goes back to waiting when a change is asked; if its `publish_note` says "Staat al bij het platform…", the user must
cancel or move it first. Not picked up within 10
minutes: the company's content agent, if it has one, does the same loop in the background; it never approves or posts.

## 8. Subagents

Use the subagent tool you have (Agent or Task in Claude Code, subagents in Cowork). Each brief stands alone; the
subagent does not see this chat. Fill in every `<…>`:

```
You make <reel 2 of 3 | the step "Trends"> for the GIMC week <week> of <company>, with the GIMC tools
(gimc_search to find a tool, gimc_execute to run gimc.<tool>(…) in code; few executes, return only what you need).
Workspace org_id <id> (pass it on every GIMC call) · board_id <id> · your frame_id <id> · run_id <run_id>.
Follow the skill <reel-builder | trend-spotter | …> and gimc-canvas. Cards only in your frame, with skill and
run_id; never a new frame or board, never the folder note, never another frame.
Draw a derived line from <source card id: the week plan card, or the media card you use> to your result card.
Input: <the week-plan line: day, time, platform, theme, hook idea, format, tone, CTA keyword, media card ids or
"faceless", music mood>.
Reel only: render 9:16 with Remotion (paid services only if the user asked), upload to a video card in your frame,
write the caption (caption-and-hashtags) as data.caption of that card, find music with gimc.social_search_audio
and choose one track yourself.
Do not ask the user anything, do not schedule, do not request review, do not post.
Return at most 10 lines: item_id of the result card (a new card you made in this run, never an existing one), its title, caption set yes/no, music {audioId, title, artist,
audioVolume, videoVolume as whole numbers 0–100} or none, cover offsetMs (a frame of the video), and anything that failed.
```

No subagent tool, or it cannot reach GIMC: do the same briefs yourself, one after another, in the same order. The
result is the same; it only takes longer.

If a GIMC tool fails, say what failed in one sentence and go on with what works (`gimc-canvas` hard rule 1). Never
skip step 6 for a reel that is on the board.
