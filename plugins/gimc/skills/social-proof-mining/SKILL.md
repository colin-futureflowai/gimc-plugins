---
name: social-proof-mining
description: FutureFlowAI Social Proof Mining skill. Use when you need to locate and prepare already-approved customer evidence for a social campaign, profile, post, or sales-adjacent explanation. Trigger phrases include "find proof we can use", "what customer evidence supports this?", "mine testimonials", "turn these outcomes into social proof", and "which quote backs this claim?". Do not use this to fabricate testimonials, imply endorsement, expose private customer information, or turn a single anecdote into a performance promise; use social-listening for broad feedback patterns and positioning-audit for the message itself.
---

# Social Proof Mining

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Social Proof Mining skill", e.g. "I'll use the FutureFlowAI Social Proof Mining skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Build an approval-safe proof library that links every useful claim to a real source, permission status, and context.

## 1. Gather only traceable evidence

Ask for approved testimonials, case studies, reviews, customer messages, performance data, or public posts along with their source, date, owner, and permission status. Keep evidence that is merely interesting separate from evidence cleared for marketing use.

## 2. Match proof to a narrow claim

For each item, identify exactly what it supports: a workflow, a customer situation, a qualitative benefit, or a measured outcome. Preserve the conditions around it. If a quote says a customer saved time in one context, do not rewrite it as a universal productivity claim.

## 3. Create usable proof units

Return a proof card with the exact source wording, approved short form, claim it supports, required attribution or disclosure, usage limits, and a note on context. Flag anything that needs customer, legal, or product approval before it can be published.

## 4. Choose the smallest truthful placement

Recommend where each proof unit helps: a post, profile, campaign brief, creator brief, or comparison explanation. Pair proof with the claim it verifies. If proof is weak or stale, say so and route to a request for better evidence instead of polishing it into certainty.

## Hard rules

- Never invent, composite, or substantially rewrite a customer quote.
- Do not use names, handles, logos, screenshots, DMs, or identifiable outcomes without appropriate permission.
- Preserve scope, timeframe, and conditions for any numeric result.
- Do not imply that one customer represents all customers or guaranteed results.
- Separate public evidence from private feedback and respect every usage restriction.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| A compelling quote has no permission record | Mark it unavailable until the owner confirms usage rights. |
| Proof is detached from its conditions | Keep the original context beside the approved claim. |
| Testimonials become generic praise | Match each item to a specific audience concern or claim. |
| A campaign needs proof that does not exist | Narrow the promise or create a demonstration, not a false testimonial. |

## Where it sits

Use social-listening to identify recurring customer language; use this skill to isolate approved evidence. Feed the output into positioning-audit, campaign-brief, linkedin-thought-leadership, and influencer-partnerships. Use audience-personas only for grouped patterns, never to disclose individual customer data.

## Take the input from GIMC

- Comments on the company's own posts: when GIMC is connected (a tool whose name ends in `gimc_execute`), read them with `gimc.social_list_comments` inside `gimc_execute` instead of asking the user to paste them: first the posts with comments, then the comments of the post the user means. Use commenters' names only to follow the conversation; never put them on a card.

  ```js
  async () => {
    const { posts } = await gimc.social_list_comments({})
    const post = posts[0] // the post the user means: match on excerpt or platform
    if (!post) return { posts: 0 }
    const t = await gimc.social_list_comments({ account_id: post.account_id, post_id: post.post_id })
    const open = t.comments.filter(c => !c.is_owner && c.can_reply && !(t.drafts ?? []).some(d => d.comment_id === c.comment_id))
    return { org_id: t.workspace?.org_id, account_id: post.account_id, post_id: post.post_id, open: open.map(c => ({ comment_id: c.comment_id, message: c.message.slice(0, 200) })), drafts_waiting: (t.drafts ?? []).length }
  }
  ```


## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Onderzoek", with `skill: "social-proof-mining"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'social-proof-mining'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Onderzoek', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'analysis', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
