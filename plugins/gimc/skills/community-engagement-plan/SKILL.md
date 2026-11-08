---
name: community-engagement-plan
description: FutureFlowAI Community Engagement Plan skill. Use when a team needs a deliberate, human-led plan for participating in comments, communities, or audience conversations around an approved topic. Trigger phrases include "plan community engagement", "how should we join this conversation?", "what should we reply to?", "make an engagement playbook", and "how do we support this community?". Do not use this to automate unsolicited replies, manipulate conversations, impersonate people, or create comment copy at scale; use comment-responder for a specific approved reply and social-listening to analyse recurring themes.
---

# Community Engagement Plan

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Community Engagement Plan skill", e.g. "I'll use the FutureFlowAI Community Engagement Plan skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Set a useful participation standard: where the team can add value, what it can truthfully say, and when it should not speak.

## 1. Define the community and permission boundary

Ask which owned or external community is in scope, its rules, the team's legitimate role, the topic, and any moderator or brand constraints. Read supplied rules before proposing interaction. If the community does not welcome promotion or brand participation, do not design a workaround.

## 2. Identify contribution opportunities

Use real questions, recurring friction, useful resources, corrections, and support needs as evidence. Classify participation as answer, clarification, acknowledgement, escalation, or observation. Give priority to helping people complete a task, not inserting the brand into every thread.

## 3. Establish response boundaries and routing

Define approved facts, prohibited claims, tone, disclosure, escalation owners, response windows, and cases that require silence or human review. Route product bugs, safety concerns, account-specific issues, legal questions, and hostile interactions to the appropriate owner rather than improvising publicly.

## 4. Run a light learning loop

Set a small cadence to review unanswered questions, recurring themes, and useful contributions. Capture aggregate learning for social-listening. Measure quality through resolved questions, informed feedback, and community trust signals where available, not reply volume alone.

## Hard rules

- Never automate unsolicited replies, direct messages, follows, or engagement.
- Do not misrepresent an employee, customer, or independent community member.
- Follow each community's rules and moderator direction; leave when asked.
- Do not reveal private account, customer, or support information in public conversation.
- Avoid argumentative pile-ons, engagement bait, and opportunistic promotion during sensitive events.

## Failure modes

| Failure | Do this instead |
| --- | --- |
| The plan is "reply to everything" | Define situations where the team can add real value and where it should observe. |
| A public reply attempts to solve a private account issue | Acknowledge the issue and route through the approved support path. |
| Replies become repetitive promotion | Lead with the user's question, resource, or correction rather than the product. |
| Community rules are discovered after posting | Review rules and obtain required permission before engaging. |

## Where it sits

Use social-listening to identify recurring questions and comment-responder for a particular reply. Use campaign-brief only when a campaign has a legitimate community role. Feed patterns into audience-personas and positioning-audit; never treat a community plan as a mass-outreach mechanism.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `doc` in frame "Planning", with `skill: "community-engagement-plan"` and the `run_id` of this run.
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
  const run_id = 'RUN_ID', skill = 'community-engagement-plan'
  const r = await gimc.canvas_create_items({ board_id: board.id, items: [
    { ref: 'f', kind: 'frame', title: 'Planning', x: next_free.x, y: next_free.y, run_id, skill },
    { ref: 'c1', kind: 'doc', frame_id: 'f', title: 'CARD_TITLE', body: 'CARD_BODY', run_id, skill },
  ] })
  return { org_id: c.workspace?.org_id, board_id: board.id, frame_id: r.items.find(i => i.ref === 'f').id, item_ids: r.items.filter(i => i.ref !== 'f').map(i => i.id), app_url: r.app_url }
}
```

- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why, in plain words without status codes or tool names (for example: "Inplannen lukte niet: er is nog geen Instagram-account gekoppeld (Socials → Accounts)."). For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
