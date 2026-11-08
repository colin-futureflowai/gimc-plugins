---
name: carousel-builder
description: >
  FutureFlowAI Carousel Builder skill.
  Turns one idea into a swipeable carousel — slide-by-slide copy, a slide 1 that stops the scroll,
  and a last slide worth saving.
  Use when the user says "make this a carousel", "turn this into slides", "build a carousel about X".
user-invokable: true
argument-hint: "[your idea or topic]"
license: MIT
metadata:
  author: Ootto
  version: "1.0.0"
  category: content
---

# Carousel Builder — one idea, ten slides, a save at the end

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Carousel Builder skill", e.g. "I'll use the FutureFlowAI Carousel Builder skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turns one idea into a swipeable carousel — slide-by-slide copy, a slide 1 that stops the scroll,
and a last slide worth saving.


## When to use
An idea that's better swiped than watched — a list, a framework, a teardown.

## What you'll need
The idea, your audience, and the one action you want at the end.

## Instructions
Give Claude the input and run this.

```
You are my carousel writer. Idea: [IDEA]. Audience: [WHO]. Goal: [save/follow/DM].

Build a 8-10 slide carousel:
- SLIDE 1: the scroll-stopper. Big claim or sharp question, under 8 words. This carries the whole post.
- SLIDES 2-N: ONE idea per slide — a bolded line plus at most two supporting lines. No slide holds two thoughts.
- SECOND-TO-LAST: the summary or checklist people screenshot.
- LAST: the single ask.

Then give me:
1. The caption, with the hook line repeated differently in the first sentence.
2. The visual note per slide (what's shown, not just said).
3. Where the CTA goes and why.
```

**Honesty:** If a slide needs three lines to make sense, it's two slides. Cramming is the most common
carousel failure.

**Next:** [cover-thumbnail-brief](../cover-thumbnail-brief/SKILL.md) → [caption-and-hashtags](../caption-and-hashtags/SKILL.md)

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `carousel` in frame "Carrousel", with `skill: "carousel-builder"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Build the slides yourself with one `gimc.canvas_create_build` call (type `carousel`, 4:5 by default) as described in the `canvas-builds` skill: GIMC renders each slide as a PNG in the folder's brand and makes the carousel card. Only when the user brings finished slide images: slide 1 as the carousel card's poster (role poster), the other slides as separate image cards linked to it.

  ```js
  async () => {
    const r = await gimc.canvas_create_build({
      type: 'carousel', board_id: 'BOARD_ID', frame_id: 'FRAME_ID', title: 'TITLE', size: '4:5', use_brand: true,
      slides: [{ html: '<!doctype html>…', alt: 'SLIDE 1' }, { html: '<!doctype html>…', alt: 'SLIDE 2' }],
      caption: 'CAPTION', skill: 'SKILL', run_id: 'RUN_ID',
    })
    return { item_id: r.id, slides: r.slides, ok: r.ok, problems: r.reports.filter(x => !x.ok).length }
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
  const run_id = 'RUN_ID', skill = 'carousel-builder'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Carrousel', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'carousel', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
