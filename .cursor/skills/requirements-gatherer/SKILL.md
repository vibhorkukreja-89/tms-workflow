---
name: requirements-gatherer
description: Gathers and analyses requirements for a feature or change. Use this skill after current-state-analyst has confirmed the current state. Understands the change deeply, performs fit and regression analysis, produces a reasoning trace, and gets user confirmation before requirements are finalised. Output is consumed by jira-story-creator and confluence-design-page.
---

# Requirements Gatherer

Bridges business intent and technical reality. Picks up from current-state-analyst output and produces requirements rich enough that downstream skills need no further clarification.

---

## Step 0 — Read session file

Check for `.cursor/sessions/*-session.md` in the workspace.
- If found — read it, use the current-state findings already captured
- If not found — ask the user: "Has current-state-analyst been run? If yes, summarise the findings. If not, run it first."

Also read `.cursor/rules/code-standards.mdc` — needed to assess feasibility, architecture fit, and TDD constraints when analysing requirements.

Do not re-read the codebase if current-state findings are already in the session file.

---

## Step 1 — Understand the change

Ask the user — keep it focused, no more questions than necessary:

1. New feature or bug fix?
2. What is the business problem being solved?
3. Any known constraints or dependencies?

Do not assume. Ask until the intent is unambiguous.
If feature requirements (Confluence page, brief, or ticket) are available, read them before asking — only ask what they don't answer.

---

## Step 2 — Fit analysis

Using the current-state findings as context:
- Where exactly does the change slot into the existing flow? (which controller, route, service, repo, cron job)
- What needs to be added vs modified vs reused?
- Is there an existing feature that follows the same pattern?

---

## Step 3 — Regression surface

The CSA session file already contains second-pass analysis and blast-radius findings — use that as the primary input here. Do not re-derive what is already captured. The goal of this step is to narrow the regression surface to what is *actually at risk* given the specific change being made.

Cross-reference the session file's Second-Pass Analysis against the proposed change:
- Which of the shared code paths identified in current-state are actually at risk?
- Are there API contract changes between `backend` and `frontend`? Backwards compatible?
- Is a feature toggle needed for safe rollout?
- Are there DB migration implications (Prisma)?
- Are there auth / role rule changes?
- Any environment-specific gotchas called out in root `README.md` or service config?

If the Second-Pass Analysis section in the session file flagged any integration gaps or blast radius concerns, explicitly call them out here — do not silently drop them.

**Data shape changes — explicit check (non-negotiable):**
- Are there new TypeScript types or interfaces needed?
- Are there changes to existing Prisma models or relations?
- Are there changes to API request/response types?
- Are there changes to shared FE/BE contracts (route paths, payloads, status codes)?
- Are there auth/role rule changes that affect who can call or see the feature?

If any data shape changes are identified or suspected, stop and ask the user:
"I've identified potential data shape changes — can you confirm the exact shape you expect? For example: new TypeScript interface, updated Prisma model, or changed API request/response payload."

Do not proceed past this step until data shapes are confirmed or explicitly ruled out.

Flag ambiguous or conflicting requirements immediately — resolve with the user before proceeding.

---

## Step 4 — Reasoning trace + summary checkpoint

Before writing the summary, reason through the following internally — do not skip this, do not present the summary until this is complete:

1. **Conflicting requirements** — Do any of the stated requirements contradict each other, or contradict existing system behaviour? If yes, surface the conflict explicitly — do not silently pick one side.
2. **Simplest solution** — Is there a cheaper option the user hasn't considered? Could this be achieved by extending an existing feature rather than building new? State the simplest viable approach and why it was chosen or rejected.
3. **Unstated assumptions** — What am I assuming that the user hasn't confirmed? List them — anything assumed rather than stated is a risk.

Only after completing this reasoning, present the structured summary:

```
**What we're building**
[One or two sentences in plain language]

**Key facts**
[Most important current-state findings relevant to this change]

**Where it fits**
[Exactly where in the flow — specific files and functions]

**Regression surface**
[What's actually at risk given this specific change]

**Conflicting requirements**
[Any contradictions found — or "None identified"]

**Simplest solution considered**
[What the minimum viable approach is and whether it was accepted or rejected]

**Risks and concerns**
[Anything ambiguous, risky, or needing a decision]

**Open questions**
[Only what cannot be determined from codebase or feature requirements]
```

---

## Step 5 — Confirm before writing

Ask: "Does this match your understanding? Anything to add, correct, or discuss before I write the requirements?"

Do not proceed until the user explicitly confirms. If the user raises a concern, update the analysis and re-present before asking again.

---

## Step 6 — Confirm feature name and impacted services

Derive the feature name from the requirements — kebab-case, specific, short enough to be a folder name.
Ask the user: "I'll use `<feature-name>` as the feature name and write to [service(s)]. Does that look right?"

Do not write anything until the user confirms.

---

## Step 7 — Write requirements.md to each impacted service

For each service impacted by this feature, write:
`.cursor/specs/<feature-name>/{backend|frontend}/requirements.md`

Only create `backend/` or `frontend/` subfolders for services actually impacted. Each service gets its own requirements file so downstream skills can pick them up without cross-service confusion.

```markdown
# Requirements: <Feature Name>

## What we're building
[Plain language summary]

## Functional Requirements
[List of agreed requirements — only those relevant to this service]

## Fit
[Where the change slots in — specific files and functions in this service]

## Regression Surface
[What's at risk in this service, including any cross-service contract changes]

## Constraints
[Feature toggles, Prisma migrations, auth rules, API contracts]

## Open Questions Resolved
[Questions asked + answers given]
```

If the change involves an HTTP/API contract between `backend` and `frontend`, note it explicitly in both services' requirements files — each from its own perspective (provider vs consumer).

---

## Step 8 — Write to session file

After requirements.md is written, append the `Requirements` section to `.cursor/sessions/<feature-name>-session.md`, following the structure in `.cursor/skills/session-template.md`. Update the Status block in place — do not create a second Status block.

Confirm with the user: "Requirements written to [service(s)] and session file updated — does everything look correct?"
