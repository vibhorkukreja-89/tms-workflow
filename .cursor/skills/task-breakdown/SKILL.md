---
name: task-breakdown
description: Breaks a feature into ordered implementation tasks following TDD principles. Use this skill after the design is agreed and confirmed. Reads design.md and requirements.md from each impacted service, produces a tasks.md per service, and saves to the session file. Tasks are created in the same session as design — do not wait for artefact review approval before creating tasks.
---

# Task Breakdown

Produces ordered, TDD-first implementation tasks per service. Created in the same session as design to preserve context — parked until artefact review approval, then resumed.

---

## Step 0 — Read session file and spec files

1. Read `.cursor/sessions/<feature-name>-session.md`
2. Read `.cursor/specs/<feature-name>/{backend|frontend}/requirements.md` for each impacted service
3. Read `.cursor/specs/<feature-name>/{backend|frontend}/design.md` for each impacted service — this is the source of truth for what tasks need to be created. Derive tasks directly from the **Proposed Changes**, **Data Shape Changes**, **Integration Contracts**, and **Test Approach** sections.
4. Read `.cursor/rules/code-standards.mdc` — needed to apply TDD rules, coverage targets, and task size guidelines when breaking down tasks.
5. Note the Jira story keys from the session file — each task must reference its parent story

Do not ask the user to re-explain anything already captured in these files.

---

## Step 1 — Derive feature name and impacted services

Use the feature name and service list already established in the session file (`backend` and/or `frontend`).
Confirm with the user if anything is ambiguous.

---

## Step 2 — Break down tasks per service

For each impacted service, produce an ordered task list. Follow these rules:

**Ordering rules (non-negotiable):**
- Shared type/model changes first — nothing that depends on them can come before
- DB migrations (Prisma) before any code that uses the new schema
- Test tasks come before or alongside implementation tasks (TDD)
- Integration point tasks are explicit — never buried inside a feature task
- Each task builds on a stable, verified foundation

**Task size rules:**
- Small enough to complete and verify independently
- Clear, unambiguous definition of done
- If a task touches more than 2-3 files, consider splitting

**TDD rules:**
Follow TDD rules from `.cursor/rules/code-standards.mdc`. Coverage targets for this project:
- Line ≥85%, branch ≥80%, function ≥90%

**Task format:**
```markdown
- [ ] 1. Task title
  - Jira: TAT-XXXX (parent story this task implements)
  - What: [what this task does]
  - Files: [specific files touched]
  - Done when: [unambiguous definition of done]
  - TDD: [what tests to write first]
```

---

## Step 3 — Handle multi-service tasks explicitly

If a task spans two services (e.g. an HTTP API contract change between backend and frontend), create it in both services' task files with a cross-reference:

```markdown
- [ ] 3. Update ticket create response shape [depends on backend task 2]
```

Never bury cross-service dependencies — make them visible. Prefer naming the dependency as `backend` ↔ `frontend` rather than burying it in a single-service task.

---

## Step 4 — Confirm with user

Present the full task list before writing any files:
- Ask: "Does this task breakdown look right? Any tasks to add, split, or reorder?"
- Do not write files until the user confirms.

---

## Step 5 — Write tasks.md to each impacted service

For each impacted service, write:
`.cursor/specs/<feature-name>/{backend|frontend}/tasks.md`

```markdown
# Tasks: <Feature Name>

## Overview
[One sentence on what this service needs to implement]

## Tasks

- [ ] 1. ...
- [ ] 2. ...
- [ ] 3. ...

## Notes
- Awaiting artefact review approval before implementation starts
- Cross-service dependencies noted inline
```

---

## Step 6 — Update session file

Update the session file — append the `Tasks` section and update the Status block in place, following `.cursor/skills/session-template.md`.

```
## Tasks
backend: .cursor/specs/<feature-name>/backend/tasks.md
frontend: .cursor/specs/<feature-name>/frontend/tasks.md
```

Only include paths for services that were actually impacted.

Set `task-breakdown` status to `complete — awaiting artefact review approval`.

Confirm with the user: "Tasks written. Artefacts are ready for review. Once approved, resume from the session file to start implementation."
