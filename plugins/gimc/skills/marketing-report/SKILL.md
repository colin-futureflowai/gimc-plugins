---
name: marketing-report
description: >
  GIMC Marketing Report skill. Makes a report on the canvas as one HTML card with canvas code: you write the
  findings, GIMC fills in every number, chart and post (video included) from its own data. Setups live in the folder
  note; without one it asks first. Use when the user says "maak een rapport", "weekrapport", "maandrapport",
  "rapportage", "beste tijden", "wij tegenover concurrent", "marketing report", "report on my socials".
user-invokable: true
argument-hint: "[setup name, period, account or competitor]"
license: MIT
metadata:
  author: GIMC
  version: "1.2.0"
  category: analytics
---

# Marketing report in GIMC

> **GIMC skill.** Call it "the GIMC Marketing Report skill" in the user's language.
>
> **GIMC tools run in code:** each `gimc.<tool>(…)` below is a call inside `gimc_execute` (find signatures with
> `gimc_search`); do a step in one execute and return only what you need. Examples: `gimc-canvas`, references/code-mode.md.

You write the report yourself: layout, headline, findings in plain language, order. **Every number, chart and post in
it is a canvas-code tag** (`<live-value>`, `<live-chart>`, `<live-post>`, `<live-posts>`, `<live-table>`) that GIMC
fills in with real data when the card is shown. You never type a number into the report. Colin: "Claude makes the
report, but for numbers and data it uses our building blocks."

This skill only reads and writes the canvas. It never publishes, schedules or boosts anything; next steps are cards for
a person (or another skill) to pick up.

## 1. Context (one execute)

Several workspaces: take the `org_id` from the first answer and pass it on every next `gimc_execute`.

```js
async () => {
  const c = await gimc.canvas_get_context({ folder: 'FOLDER', include_inbox: true })
  if (c.choose_workspace) return c
  const note = c.notes.at(-1)
  const setups = [...(note?.body ?? '').matchAll(/### Rapport: (.+?) \(marketing-report\)\n((?:- .*\n?)*)/g)]
    .map(m => ({ name: m[1], block: m[0].trim() }))
  const board = c.boards.find(b => b.name === 'Analyses')
  const overview = board ? await gimc.canvas_board_overview({ board_id: board.id }) : null
  return { org_id: c.workspace?.org_id, folder_id: c.folder?.id, folder_not_found: c.folder_not_found, note_version: note?.version,
    setups, inbox: c.inbox, board_id: board?.id, next_free: overview?.next_free ?? { x: 0, y: 0 } }
}
```

Pick up open notes and tasks first (`gimc-canvas` §4). `folder_not_found`: ask once which folder.

## 2. Which setup

A setup is a block `### Rapport: <name> (marketing-report)` under "What the user wants" in the folder note. Exact shape
and the four presets: [references/setups.md](references/setups.md).

- **The question names a setup, or only one fits**: use it, **without questions**. If the user changes something
  ("dit keer per maand", "zonder doelgroep"), update the block (below) and say so in one sentence.
- **A one-off question with no setup** ("hoe deden mijn reels vorige week?"): make the report straight away from the
  closest preset, and after it ask once whether to save it as a setup.
- **Nothing is there yet: first ask properly.** Do not guess. Send **one message** with the four presets as a start
  (Weekrapport, Maandrapport, Beste tijden, Wij vs. concurrent, one line each) and these questions, each with a default
  so "ok" is a valid answer:
  1. Which report (default: Weekrapport).
  2. Period: last week, last month, last 90 days, or fixed dates (default: from the preset).
  3. Account: all, or one handle (default: all).
  4. Compare with the period before (default: yes).
  5. Competitor handle, only for "Wij vs. concurrent" (needs an Instagram account connected via Facebook Login).
  6. Parts to add or drop (default: the preset's list).
  7. Wishes: tone, length, what to show big (default: short sentences, videos big).

**Save the answer** right after it comes in: `gimc.canvas_update_folder_note` with the whole note text and the
`expected_version` you read. Keep every other line exactly; add or update only this block under "What the user wants"
(conflict: read again, merge, retry once; never overwrite — `gimc-canvas` folders reference). Several setups per folder
are fine.

## 3. The period of this run

Turn the setup's period into fixed dates for **this** run, in Amsterdam time:

- "laatste week" = the last 7 full days, Monday to Sunday of last week when the user says "vorige week";
- "vorige maand" = the first to the last day of last month;
- "laatste 30/90 dagen" = 30/90 days up to and including yesterday.

**Older periods are fine** ("oktober", "Q3", "de zomer"): a report can go back as far as the data does (see §4,
`coverage`). Posts usually go back 90 days from the connection; account figures 90 days; growth per day only from the
day GIMC started measuring. Need posts from before `coverage.posts_from`? Read once with
`gimc.social_get_insights({ period_days: 0, refresh: true })` (only reads from the platforms, at most once every 15
minutes) and read `coverage` again.

**A report always uses `from` and `to`, never `range`.** A report is fixed per run: a setup "always the last week" means
every run makes a new report with the dates of that week, and GIMC freezes those numbers once the data is complete
(until then the card shows "voorlopig"). `range` is only for a live numbers card without written conclusions.

## 4. Read before you write (one execute)

Read what you need for the findings with `gimc.social_get_insights` and only return summaries: `period_days` is 7, 30
or 90 (pick the one that covers the period), `include` the blocks the parts need (only `growth`, `engagement`,
`formats`, `online`, `audience`, `stories`), `sort: 'top'`; best times are `best_times: 'instagram'`, not an `include`. For a competitor:
`gimc.social_get_analysis` with `kind: 'competitor'` and `username`. Each block has a `status`; a `no_data` block has a
`reason` — the report then shows that reason (the tag does it for you), and your finding says it in plain words, never
"0".

**Instagram and Facebook do not add up.** They count views and reach differently. With accounts on both, read each
with `platform: 'instagram'` / `platform: 'facebook'` and give findings per platform; on the card use
`account="<handle>"` per tag, never one total over both.

**Only parts with data for the whole period.** With any `include`, the answer has `coverage`: per kind of data the
first day it exists (`null` = never measured). A part whose day is `null` or later than the run's `from` is **left out of
the report entirely**: no tag, no heading, no sentence about it. Do not show a part before there is data for it.

| Part | Needs |
|---|---|
| groei, `followers.gained`/`lost` | `follower_changes_from` ≤ F (GIMC measures this from the connection; there is no history) |
| `followers.growth`, kerncijfer volgers | `followers_from` ≤ F (otherwise leave out growth; `followers.count` alone is fine) |
| resultaten (`profile_views`, `website_clicks`) | `account_metrics_from` ≤ F |
| formaten | `formats_from` ≤ F |
| volgers online | `online_from` set (it averages what is there) |
| posts, views, reach, interactions, tijdlijn | `posts_from` ≤ F |

`compare="previous"` only when the same day is also ≤ the start of the period before (F minus the period's length);
otherwise drop `compare` on that tag. Left parts out? Add one small grey line at the bottom ("Groei per dag volgt zodra
GIMC die heeft gemeten."), no numbers, no reasons per part.

```js
async () => {
  const i = await gimc.social_get_insights({ period_days: 30, sort: 'top', limit: 20, include: ['growth', 'engagement', 'formats', 'online'] })
  const top = i.posts.slice(0, 6).map(p => ({ id: p.id, type: p.media_type, at: p.published_at, views: p.views, reach: p.reach, er: p.engagement_rate, card: p.canvas_item_id, media: !!p.media_url, text: (p.excerpt ?? '').slice(0, 60) }))
  const status = Object.fromEntries(['growth', 'engagement', 'formats', 'online'].map(b => [b, i[b]?.status]))
  return { org_id: i.workspace?.org_id, coverage: i.coverage, totals: i.totals, accounts: i.accounts.map(a => ({ u: a.username, f: a.followers, g: a.followers_growth })), top, status }
}
```

Use these numbers to decide **what** to say (which post won, which format carries reach, whether growth sped up). The
card itself shows the numbers through tags; post ids for `<live-post post="…">` come from `posts[].id`.

## 5. Write the HTML

One self-contained page (format `page`), short and visual, in the user's language. Structure:

1. Headline with the report name and the period in words ("Weekrapport · 2–8 november").
2. **Three to five findings** in plain sentences. **Every number is a `<live-value>`** with the same `from`/`to`, for
   example: `Je posts werden <live-value data="views" from="2026-11-02" to="2026-11-08" compare="previous"></live-value> keer bekeken.`
   No typed digits in the findings (dates in the headline are fine). A part without data: the tag shows the reason;
   don't repeat it in your own sentence.
3. The parts of the setup, in order, each as its tags (the mapping per part: [references/setups.md](references/setups.md)).
4. Posts as `<live-post>` (one featured post, video big) or `<live-posts>` (a ranking). GIMC shows the post's own video
   or image from GIMC storage, or "Beeld niet bewaard".
5. **Charts are yours to design.** The short form `<live-chart data="…" view="line|bars|heatmap">` is a quick default.
   For a chart that tells the story, put a **Vega-Lite spec** (JSON) inside `<live-chart from="…" to="…">…</live-chart>`:
   layers, a second axis, posts as dots on the follower line, `@previous` for last period as a faint line, a trend
   line (`regression` or `loess`), annotations, brand colours as `var(--brand-primary, #hex)`. Every `data` is only `{"name": "<data-name>"}`; GIMC
   fills in the rows and draws it, so you still type no numbers. Fields, data names and a full example:
   `chart_spec` in `gimc.canvas_code({ mode: 'reference' })`.
6. A short "Wat nu" list that matches the next-step cards (section 6).

A full example: [references/report-example.html](references/report-example.html). The tag reference (elements,
attributes, every data name, which views): `gimc.canvas_code({ mode: 'reference' })`.

**Check before you save.** Run `gimc.canvas_code({ mode: 'check', html })`. Fix every error (each lists the valid
options) and check again until `ok` is true. A tag error that slips through shows on the card as a visible notice.

The folder's brand applies by itself (`--brand-*` variables); use them for colours, never hard-coded brand colours.

## 6. Put it on GIMC (one execute)

Follow `gimc-canvas` for the board. One run, one `run_id` (`rapport-<name>-<to>`):

- Board "Analyses" in the folder (create it if missing), or the board the user names; frame
  "Rapport · <name> · <period>" at `next_free`.
- `gimc.canvas_create_html_card` with `format: 'page'`, `frame_id`, `skill: 'marketing-report'`, `run_id`.
- Posts in the report that have a canvas card (`canvas_item_id`): a `derived` line from that card to the report.
- One to three next-step cards (`idea` or `note`) in the same frame, each naming the skill that picks it up, linked
  from the report through `links: [{ from: REPORT_ID, to: 'ref', relation: 'derived' }]` in the same
  `gimc.canvas_create_items` call (items take no `parent_id`), for example "Remix van de winnaar" → `content-repurposer`, "Post dinsdag 19:00" →
  `content-planning`, "Meer reels in dit formaat" → `series-planner`. Never schedule, publish or boost.

Then **verify**: `gimc.canvas_code({ mode: 'resolve', item_id })` gives the filled-in value per tag (status, value,
`provisional`, `frozen`). Check each finding against its value: a sentence that says "groeide" while the value went down,
or calls a `no_data` tag a result, gets rewritten. Fix the text with `gimc.canvas_update_html_card` (always pass `expected_version` = the `version` from the create or
resolve answer; a 409 means someone else edited: read the source with `gimc.canvas_get_item` + `include_html`, merge,
retry once). Editing makes a new version of the same card; frozen numbers stay.

```js
async () => {
  const card = await gimc.canvas_create_html_card({ board_id: BOARD, frame_id: FRAME, title: 'Weekrapport · 2–8 nov', html: HTML, format: 'page', skill: 'marketing-report', run_id: RUN })
  const r = await gimc.canvas_code({ mode: 'resolve', item_id: card.id })
  return { id: card.id, version: card.version, app_url: card.app_url, values: r.resolved.map(t => [t.data, t.status.status, t.value?.length ?? t.value, t.provisional]) }
}
```

## 7. In the chat

**At most three sentences, one paragraph, no lists or headings**: which report is ready, where
(`folder › board › frame`) with the link (`app_url`), and what the user can do now (open the card, or **Code** to
adjust it). Everything else is on the card: no numbers, findings, missing parts or their reasons, next steps, tables,
remarks about your own retries, or unrelated inbox items. Only a real block (a GIMC tool that keeps failing) gets one
more short sentence.

After a one-off report without a setup, the question whether to save it as a setup is the third sentence.
