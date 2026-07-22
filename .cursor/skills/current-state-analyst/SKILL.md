---
name: current-state-analyst
description: Analyses the relevant feature area of the codebase to build a current-state understanding before requirements are discussed. Use this skill at the start of any feature discussion — before writing a single requirement. Scopes to the relevant services, traces data flows, and presents findings for user confirmation.
---

# Current State Analyst

Turns the agent into a codebase-aware SME before requirements are discussed. Scope first, explore deep, present findings.

---

## Step 1 — Present the service list

Present the TMS services to the user — no workspace file is required:

| Service | Path |
|---------|------|
| `backend` | `backend/` |
| `frontend` | `frontend/` |

Do not invent additional services. If the repo layout later adds more top-level app packages, discover them from the filesystem — but today the surface is these two.

---

## Step 2 — Scope the exploration

Ask the user two questions only:

1. "In one sentence — what do you want to build or change?"
2. "Which service(s) do you think this touches?" — show the list from Step 1

If the user is unsure about the service, do a lightweight keyword search across `backend/src/` and `frontend/` (or equivalent source roots) using the feature description as search terms. Narrow to 1–2 candidates, confirm with the user before proceeding.

Do not explore more than 2 services without explicit user confirmation. (`backend` + `frontend` is already the full TMS surface.)

**If the user provides a Confluence URL:**
Extract the page ID from the URL (the numeric segment, e.g. `https://mytestingai.atlassian.net/wiki/spaces/TAT/pages/557233/...` → page ID is `557233`) and immediately fetch the page via the configured Atlassian MCP (discover the Confluence get-page tool/schema at runtime). Do not use web fetch for Confluence URLs — it will be blocked. Use the page content as the primary source of truth for what the feature requires before asking the user any scoping questions.

---

## Step 3 — Deep read the scoped services

For each scoped service:
- Find the entry point for the relevant feature area (controller, route handler, job, consumer, cron)
- Trace the full data flow: entry → validation → service → repository → DB / external API
- Identify existing patterns: error handling style, service layering, validation conventions
- Find shared utilities, constants, or types relevant to the change
- Identify what already exists that could be reused vs what needs to be added

Use multi-file exploration where needed (parallel reads / search). Prefer actual source over READMEs.

---

## Step 4 — Map the regression surface

Identify what the proposed change could break:
- Other features that share the same code paths
- Downstream consumers (API clients, cron jobs, UI callers of backend endpoints)
- Shared types or contracts used by both `backend` and `frontend`
- Auth / role paths that gate the feature area
- Environment-specific considerations called out in root `README.md` or service config

---

## Step 5 — Present findings and confirm

Present a structured summary to the user:

```
**What we're working with**
[One sentence on the feature area and where it lives]

**Current state**
[How the system works today in this area — specific files and functions]

**Where the change fits**
[Exactly where in the flow the new feature slots in]

**Regression surface**
[What could break — be specific]

**Open questions**
[Only things the codebase cannot answer — ask the user]
```

Then ask: "Does this match your understanding? Anything to add, correct, or discuss before we move to requirements?"

Do not proceed until the user confirms.

---

## Step 6 — Write findings to session file

After the user confirms the findings, write a session file to `.cursor/sessions/<feature-name>-session.md`.
Follow the canonical structure defined in `.cursor/skills/session-template.md` — this is the single source of truth for the session file shape. At this stage, write only the sections that Phase 1 owns: `Current State Findings`, `Regression Surface`, `Open Questions` (if any), and `Status`. Leave all other sections absent — they are added by later phases.

This file is the handover context for the next session. Without it, the next session starts cold.

---

## Step 7 — Agent-only second-pass analysis

After the session file exists, perform a focused second pass over the scoped code. This is an independent re-read with a blast-radius checklist — not a repeat of Step 3 narration.

### 7a — Second-pass checklist

Re-read the scoped area and explicitly check each item:

| Check | Look for |
|-------|----------|
| API contracts (BE↔FE) | Request/response shapes, route paths, status codes shared across `backend` and `frontend` |
| Prisma | Models, relations, migrations, or query patterns the change would touch |
| Auth | Middleware, roles, guards, or permission checks on the affected paths |
| Shared types | Types/interfaces used by more than one module or by both services |
| Tests | Existing unit/integration coverage that encodes current behaviour; gaps that matter |

Compose the second pass from the session findings so it stays focused on the planned change.

### 7b — Gap analysis

Compare the second-pass results against your Step 3–4 findings across these dimensions:

| Dimension | Check |
|---|---|
| Data flow | Same entry points, services, and repositories? |
| API contracts | Same BE↔FE contracts named? Any additional callers or shape mismatches? |
| Shared dependencies | Any shared types, Prisma models, or auth helpers missed in the first pass? |
| Regression surface | Any downstream impacts not in the Step 4 map? |
| Patterns / conventions | Architectural constraints not obvious from a single entry-point read? |
| Tests | Behaviour locked by tests that the first pass did not mention? |

### 7c — Present the gap report

Present findings to the user:

```
**Second-pass summary**
[2–3 sentence distillation — business impact framing, not just "confirmed"]

**Gaps found (second pass caught, first pass missed)**
[List — be specific: file, function, contract, Prisma model, auth path, or test]

**Conflicts (first pass and second pass disagree)**
[List — note which reading you trust more and why]

**Confirmed (both agree)**
[Brief confirmation of what is consistent]
```

If the user declines the second pass:

1. Inform the user that second-pass analysis will be skipped.
2. Ask: "Do you want to proceed without the second pass, or stop here?"
3. If the user wants to stop — halt. Do not update status to second-pass complete or move forward.
4. If the user wants to proceed — note the skip in the session file and continue only if the user agrees.

### 7d — Update the session file

Append the `Second-Pass Analysis` section to the session file, following the structure in `.cursor/skills/session-template.md`. Then update the Status line in place:

```
current-state-analyst: complete (second-pass cross-referenced)
```

If second pass was skipped with user agreement, note that under Second-Pass Analysis and set status appropriately (e.g. `complete` with an explicit skip note) — do not claim second-pass cross-reference.

---

### 7e — Write Analysis Intelligence Report to `.cursor/gap-report/`

After the session file is updated, write `.cursor/gap-report/<feature-name>-analysis.md`.

This file is the shared record of how the first-pass and second-pass analyses combined to shape the requirements. Commit it so the team can see it on GitHub.

```markdown
# <Feature Name> — Analysis Intelligence Report

## Feature
**Jira:** [TAT-XXXX]
**One-liner:** [One sentence description of the change]
**Service(s):** [Impacted services — backend and/or frontend]
**Date:** [YYYY-MM-DD]
**Author:** [Developer name if known, otherwise "Cursor Agent"]

---

## Agent's Independent Analysis

### What was found
[Files, functions, data flow — what the first pass discovered from reading the code alone]

### Regression surface identified
[What the first pass flagged as at risk, before the second pass]

---

## Second-Pass Analysis

### Summary
[2–3 sentence distillation — capture substance: business impact framing, frequency/scale of affected endpoints, user-facing consequences of the bug or gap.]

### What the second pass added (gaps the first pass missed)

**Business impact framing:**
[Blast radius in business terms — user impact, request frequency, UI consequences? Capture this even if the first pass identified the same technical risk.]

**Risk table:**
[Risks with severity and mitigation. If none: "None identified."]

| Risk | Severity | Mitigation |
|------|----------|------------|
| ... | 🔴/🟡/🟢 | ... |

**Cross-team coordination flags:**
[Teams or roles (Frontend, Backend, QA) that need to act before or alongside the PR? List as action items. If none: "None raised."]

**Test case matrix:**
[Progression and regression cases — input/expected output pairs where identified. If none: "None identified."]

**Other gaps (files, functions, API contracts, Prisma models, auth paths, shared types, tests):**
[Specific items the second pass surfaced that the first pass missed. If none: "None — second pass confirmed the first-pass analysis."]

### Conflicts (first pass and second pass disagreed)
[Where they disagreed and which reading was trusted, and why]
- If none: "None."

### Confirmed (both agreed)
[What was consistent between passes]

---

## Impact on Requirements

### Did the second pass change anything?
[Yes / No — if Yes, be specific about what changed and why]

### What changed
[Requirements added, removed, or refined as a result of the second pass]
- If nothing changed: "Second pass confirmed the first-pass analysis. No requirement changes."

### Final regression surface (after second pass)
[Updated blast radius — what is actually at risk given both passes. Include any cross-team action items.]
```

After writing the file, update `.cursor/gap-report/README.md` — add a row to the Gap Reports table:

```markdown
| [<feature-name>-analysis.md](./<feature-name>-analysis.md) | [TAT-XXXX](https://mytestingai.atlassian.net/browse/TAT-XXXX) | 🔴/🟡/🟢 Score | One-line summary of what the second pass contributed |
```

Score using this guide:
- 🔴 **High** — Second pass changed requirements, surfaced risks the first pass missed, or identified cross-service impacts not visible from a single entry-point read
- 🟡 **Medium** — Second pass added useful context (risk framing, test cases, coordination flags) but did not change requirements
- 🟢 **Low** — Second pass confirmed the first-pass analysis — no gaps, no additions

Then tell the user:
"Analysis Intelligence Report written to `.cursor/gap-report/<feature-name>-analysis.md` and README updated — commit both to the workspace repo so the team can see them on GitHub."

---

## Guidelines
- Read actual source files — not READMEs, not docs
- Reference specific file names and function names in the summary
- If something is ambiguous in the code, read more before asking the user
- Only ask the user what the codebase genuinely cannot answer
- Keep the summary scannable — the user should be able to read it in under a minute
- Weight the second pass heavily for BE↔FE contracts, Prisma, auth, shared types, and test-encoded behaviour. Trust the local code for implementation detail; use the second pass for blast radius the first pass may have missed.
