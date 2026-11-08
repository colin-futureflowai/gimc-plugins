---
name: positioning-audit
description: >
  FutureFlowAI Positioning Audit skill.
  Audit a brand's social positioning from its profile, offer, customer proof, and competitor material.
  Use when the user says "audit our positioning", "review our profile", "why do we sound like everyone else",
  or "what should our social message be". NOT for inventing a new identity from intuition or writing a post;
  use audience-personas and social-proof-mining first, then hand approved positioning to the content skills.
user-invokable: true
argument-hint: "[profile, offer, proof, and competitor material]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: marketing
---

# Positioning Audit

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Positioning Audit skill", e.g. "I'll use the FutureFlowAI Positioning Audit skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

A profile can sound polished and still give a stranger no reason to care. This skill finds the actual promise, proof, audience, and category language already present, then identifies the smallest credible change. It does not manufacture differentiation.

## 1. Assemble the evidence

Ask for the current bio/profile, offer or landing-page copy, three to five customer quotes or outcomes approved for use, and two to five competitor profiles or posts. Ask what action the profile should earn: follow, DM, email signup, or purchase.

If customer proof is absent, stop at a diagnosis. A new promise without proof is copywriting, not positioning.

## 2. Map the current message

For the brand and each competitor, record:

- the audience named or implied
- the promised outcome
- the mechanism or category label
- proof shown, if any
- the next action requested
- repeated phrases and empty category language

Quote the source next to each finding. Mark an item "unclear" rather than filling it in from industry assumptions.

## 3. Find the credible difference

Compare the maps. Look for one of three things: a proof point competitors do not show, a specific audience they ignore, or a mechanism the brand can honestly explain. Do not treat silence in a small sample as market-wide white space.

Write one positioning sentence in this shape: **For [specific audience] who need [job], [brand] helps them get [outcome] through [mechanism], with [proof].** Flag any missing proof in brackets.

## 4. Stress-test it on the profile

Test the sentence against four questions:

1. Could a competitor say this unchanged?
2. Is every noun understandable to the target audience?
3. Is the outcome backed by a supplied fact or approved quote?
4. Does the requested next action make sense after reading it once?

Return the smallest profile changes: name field, bio promise, proof, pinned-content role, and link CTA. Keep the current message when evidence does not justify a rewrite.

## Hard rules

- Do not invent customer outcomes, category leadership, demographics, or proof.
- Do not copy competitor wording; map the technique, then use the brand's own language.
- Do not call an unobserved gap "white space".
- Separate facts about the current profile from proposed language.
- A public customer quote needs approval before use.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| The position sounds generic | it names a broad category, not a job and proof | narrow the audience or bring in real proof |
| The claim is stronger than the evidence | the desired outcome replaced the observed one | bracket the claim and collect validation |
| Every competitor sounds the same | only bios were compared | add posts, customer proof, and actual offers |
| The bio improves but conversion does not | the next action is unclear | audit the link destination and pinned content |

## Where it sits

`social-listening` finds demand language → `audience-personas` groups it → **positioning-audit** chooses the credible message → `profile-conversion-audit` tests the profile → `campaign-brief` carries the position into a campaign.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "positioning-audit"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
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
  const run_id = 'RUN_ID', skill = 'positioning-audit'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Analyse', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
