# Calling GIMC in code (gimc_search and gimc_execute)

GIMC has two tools for all of its work, plus `plugin_info`:

- **`gimc_search`** — find tools. Your code gets `ctx.catalog`: one entry per tool you may use, with `name`,
  `namespace` (`canvas`, `social`, `ads`, `messaging`, `calendar`, `sequences`), `description`, `readOnly`,
  `destructive`, `proposesOnly` and `declaration` (the TypeScript signature of its input). Return only what you need.
- **`gimc_execute`** — run tools. Your code is an async function; inside it `gimc.<tool_name>(args)` calls a tool and
  returns its answer as JSON. Only what your function returns comes back to the chat (plus `console.log` lines in
  `logs`), so do a whole step in one execute and return ids, counts and short lines, never whole lists.

**One step = one execute.** Every execute is a full round, and rounds are the cost. So read and write in the same
script (find the card by title, then update it), run independent reads together with `Promise.all`, and return only
ids, counts or a short summary. The shapes of the most used tools are in the server instructions; for the rest, or when
an input error comes back, the error itself holds the tool's full declaration: fix the call in one retry.

```js
async () => {
  const org_id = 'ORG_ID'
  const [items, schedule] = await Promise.all([
    gimc.canvas_list_items({ org_id, board_id: 'BOARD_ID', fields: ['title'] }),
    gimc.canvas_list_schedule({ org_id, from: '2026-11-09T00:00', to: '2026-11-15T23:59' }),
  ])
  const card = items.items.find(i => i.title === 'Post: Najaarsactie')
  if (!card) return { error: 'kaart niet gevonden' }
  // Titels zijn niet uniek: een bestaande planning hoort bij deze kaart als item_id gelijk is.
  if (schedule.schedule.some(s => s.item_id === card.id && s.status === 'scheduled')) return { already: card.id }
  const planned = await gimc.canvas_schedule_posts({ org_id, posts: [{ item_id: card.id, scheduled_at: '2026-11-10T10:00', platforms: ['instagram'] }] })
  return { schedule_id: planned.schedule[0].id }
}
```

Rules of the sandbox:

- No network, files or timers. Uploads and downloads happen outside it (example 1b).
- Limits per execute: 30 s, 64 MB, 60 tool calls, an answer of 24 000 characters (longer is cut off with
  "…ingekort, geef minder terug").
- A refusal (no rights, a 409 because a card changed, a person must decide) is an exception with `message` (the short
  Dutch sentence) and `status`. Catch it with `try/catch` when you can continue; otherwise let it go and read it.
- Several workspaces: give `org_id` once on `gimc_execute` (next to `code`); it applies to every `gimc.` call without
  its own `org_id`. Inside one execute, the workspace a first call found (e.g. `gimc.canvas_get_context({ workspace })`)
  holds for the next calls, and the answer carries it as `org_id`: pass that on your next `gimc_execute`. Without it the answer is a choice list (`choose_workspace`) or an error naming the workspaces.
- Forgiving inputs: `gimc.canvas_list_items` drops unknown `fields` (`ignored_fields`, `allowed_fields`) and also knows
  `updated_at` and `caption`; `gimc.canvas_list_schedule` takes `from`/`to` as a date `YYYY-MM-DD` (Amsterdam day, `to`
  through 23:59:59); `gimc.canvas_get_context` with `include_overview` but no `board_id` answers `overview_skipped`.
- Not sure about a field? Search first: `async (ctx) => ctx.catalog.find(t => t.name === 'canvas_apply_plan').declaration`.

## 1. Context and inbox at the start

```js
async () => {
  const org_id = 'ORG_ID'
  const c = await gimc.canvas_get_context({ org_id, folder: 'Klant A', include_inbox: true })
  if (c.choose_workspace) return c
  const inbox = c.inbox ?? await gimc.canvas_inbox({ org_id })
  return {
    folder: c.folder?.path, note: c.notes?.at(-1)?.body?.slice(0, 600),
    boards: c.boards.map(b => `${b.name} (${b.id})`),
    tasks: inbox.tasks.map(t => ({ task_id: t.id, item_id: t.item_id, instruction: t.instruction })),
    notes: inbox.notes.map(n => ({ comment_id: n.comment_id, item_id: n.item_id, body: n.body.slice(0, 200) })),
    reviews: inbox.reviews.length,
  }
}
```

**1b. A media upload** takes three steps, because the PUT happens outside the sandbox: an execute that returns
`gimc.canvas_media_upload_url({ org_id, item_id, file_name, mime, bytes })` (`signed_url`, `path`); then you PUT the
file to `signed_url` with `Content-Type` = `mime` (with node or the HTTP tool you have); then an execute with
`gimc.canvas_media_complete({ org_id, item_id, path })`. See [media.md](media.md).

## 2. A whole board via `gimc.canvas_apply_plan`

```js
async () => {
  const org_id = 'ORG_ID', run_id = 'brandbook-acme-20261106'
  const steps = [
    { op: 'create_frame', ref: 'f1', title: '1 · Kleur', run_id, skill: 'brandbook' },
    { op: 'create_html_card', ref: 'kleur', frame_id: 'f1', title: 'Kleurrollen', format: 'page', html: '<!doctype html>…', run_id, skill: 'brandbook' },
    { op: 'create_frame', ref: 'f2', title: '2 · Typografie', run_id, skill: 'brandbook' },
    { op: 'create_item', ref: 'type', frame_id: 'f2', kind: 'doc', title: 'Lettertypes', body: '…', run_id, skill: 'brandbook' },
    { op: 'link', from: 'f1', to: 'f2', relation: 'arrow', label: 'kleur → type' },
  ]
  let plan = await gimc.canvas_apply_plan({ org_id, board: { folder_id: 'FOLDER_ID', name: 'Brandbook' }, steps })
  for (let i = 0; i < 4 && plan.status === 'running'; i++) plan = await gimc.canvas_plan_status({ org_id, run_id: plan.run_id })
  return { status: plan.status, done: plan.done, total: plan.total, failed: plan.failed, app_url: plan.app_url }
}
```

Each `gimc.canvas_plan_status` call waits up to 20 s, so check the status in a next execute when the plan is long. Exact
step fields: search for the declaration of `gimc.canvas_apply_plan`; layout rules: [layout.md](layout.md).

## 3. Plan a week: review first, then schedule

```js
async () => {
  const org_id = 'ORG_ID', run_id = 'week-20261110'
  const reels = [
    { item_id: 'ITEM_1', at: '2026-11-11T10:00', platforms: ['instagram'], line: 'Week 46: reel 1 van 3, di 10:00, Instagram' },
    { item_id: 'ITEM_2', at: '2026-11-13T18:00', platforms: ['instagram', 'facebook'], line: 'Week 46: reel 2 van 3, do 18:00' },
  ]
  const review = await gimc.canvas_request_review({ org_id, item_ids: reels.map(r => r.item_id), comment: reels.map(r => r.line).join('\n') })
  const planned = await gimc.canvas_schedule_posts({
    org_id, run_id, skill: 'week-planner',
    posts: reels.map(r => ({ item_id: r.item_id, scheduled_at: r.at, platforms: r.platforms })),
  })
  return { review, posts: planned.schedule.map(p => ({ item_id: p.item_id, at_platform: p.at_platform, note: p.publish_note })), app_url: planned.app_url }
}
```

Review first, so no post is ever planned without a pending approval. A person approves in the agenda; you never call a
post "live". Post settings (`options`) and captions: [scheduling.md](scheduling.md) and `content-planning`.

## 4. Numbers summarised in code

```js
async () => {
  const org_id = 'ORG_ID'
  const i = await gimc.social_get_insights({ org_id, period_days: 30, sort: 'top', limit: 20, best_times: 'instagram' })
  const top = i.posts.slice(0, 3).map(p => ({ platform: p.platform, views: p.views, er: p.engagement_rate, text: (p.excerpt ?? '').slice(0, 60) }))
  const growth = i.accounts.map(a => ({ account: a.username ?? a.platform, followers: a.followers, growth: a.followers_growth }))
  return { period: i.period_days, totals: i.totals, growth, top, best_times: i.best_times }
}
```

The model sees three posts and a few totals, not twenty posts with every field. Explaining what the numbers mean is
the job of the `social-insights` skill.
