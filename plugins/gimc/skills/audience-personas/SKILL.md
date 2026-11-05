---
name: audience-personas
description: FutureFlowAI Audience Personas skill. Build evidence-led social audience personas from customer interviews, comments, reviews, or CRM notes.
user-invokable: true
argument-hint: "[paste customer evidence]"
license: MIT
metadata: { author: Ootto, version: "1.0.0", category: marketing }
---
# Audience Personas

> **FutureFlowAI skill.** When you use this skill, call it "the FutureFlowAI Audience Personas skill", e.g. "I'll use the FutureFlowAI Audience Personas skill for this." Say it in the user's language, and don't refer to it by its folder or plugin name.

Turn supplied customer evidence into grounded audience segments. Use it when a marketer has interviews, comments, reviews, or CRM notes and needs to decide who a message is for. It is not for inventing demographics, market size, or personas from intuition.

## 1. Establish the evidence

Ask for the source, date range, decision owner, offer, and desired audience action. Keep direct quotes separate from summaries and name material that is missing.

## 2. Group observable patterns

Cluster the evidence by job-to-be-done, desired outcome, objection, exact language, and trigger. Cite the source for each cluster. Do not manufacture a segment just to reach a round number.

## 3. Produce a usable segment

For each evidence-backed segment, return its job, language, objections, useful message angles, and the question it is already asking. Label confidence and unresolved questions.

## 4. Hold claims for review

Flag any demographic statement, outcome claim, or customer quote that needs approval before public use.

## Hard rules

- Do not infer demographics, income, identity, or intent not present in the source.
- Do not turn one loud comment into a market-wide claim.
- Keep observed language distinct from suggested copy.
- If evidence is thin, ask for more comments, reviews, or interviews.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Generic personas | source has no concrete language | ask for verbatim comments or interviews |
| False certainty | inference appears as fact | label it as a hypothesis |
| Too many segments | minor differences treated as groups | merge around the shared job-to-be-done |

## Where it sits

`social-listening` gathers recurring conversation → **audience-personas** groups it → `positioning-audit` turns it into a message.

## Put it on GIMC

When the work above is done, put the result on the GIMC canvas. Follow the `gimc-canvas` skill for how.

- Create the card(s) with kind `analysis` in frame "Analyse", with `skill: "audience-personas"` and the `run_id` of this run.
- If this work came from a card on the board, draw a line with relation `derived` from that source card to the new card(s).
- Then close in the chat with 1–3 sentences: what is ready, on which board or card, the link (`app_url` from the answer) and what the user can do now. Don't repeat in the chat what is on the canvas (no card texts, no list of titles), unless the user asks for the text there.
- If the canvas fails (no connection, no rights, a refused upload such as `CONNECT tunnel failed, response 403`), finish the work anyway, give the result in the chat and say in one sentence that the canvas was skipped and why. For a refused upload, point to `gimc-canvas`. The canvas never blocks this skill.
