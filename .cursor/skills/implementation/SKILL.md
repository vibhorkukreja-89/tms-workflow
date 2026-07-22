---
name: implementation
description: Handles the implementation phase of a feature. Use this skill when artefact review is complete. First processes reviewer feedback (routing back to the correct phase if needed), then executes tasks one at a time in supervised TDD mode — SME watches and confirms each task before moving on. Loads code-standards automatically.
---

# Implementation

Supervised TDD execution. SME watches, confirms each task; the agent does not move on without explicit confirmation.

---

## Step 0 — Read session file and tasks

1. Read `.cursor/sessions/<feature-name>-session.md`
2. Read `.cursor/specs/<feature-name>/{backend|frontend}/tasks.md` for each impacted service
3. Read `.cursor/rules/code-standards.mdc` in full
4. Identify the next incomplete task (`- [ ]`)

---

## Step 0b — Establish service working environment (do this once per service, before the first task)

Before running any command for a service, resolve two things:

**Node version:**
- If `<service-folder>/.nvmrc` exists, use that version for all commands in this service via `source ~/.nvm/nvm.sh && nvm use <version> &&` prefix.
- If no `.nvmrc`, follow root `README.md` (Node 20+ recommended). Never assume the active Node version is correct — check explicitly.

**Working directory:**
All commands (lint, tests, build) must run from inside the service directory using the `working_directory` / `cwd` parameter on the shell tool. The workspace root is not the service root. Set `cwd` to the absolute path of `backend/` or `frontend/`.

Record both as: `[backend|frontend] → Node <x.x.x or 20+ per README>, cwd: <absolute-path>` and carry them through every command for that service. When switching services, re-resolve Node and update both values.

**Git hygiene + running the service locally:**
Before writing code, confirm git hygiene: work on a fresh branch off the default branch (`main` or `master`), named `TAT-<ticket>-short-description`. If a task needs the service actually running (manual verification beyond unit tests), follow root `README.md` for how to start backend/frontend and dependencies (PostgreSQL, env, Prisma). TDD unit tests (Step 3b) usually do not need the full stack running.

---

## Step 1 — Process reviewer feedback

Ask the user: "What was the outcome of the artefact review?"

**If approved:** proceed to Step 2.

**If feedback received:** read the feedback carefully and route to the correct phase:

| Feedback type | Action |
|---|---|
| Requirements unclear or wrong | Return to `requirements-gatherer` — update `requirements.md` + Jira stories, then re-run `task-breakdown` |
| Design issue | Return to `confluence-design-page` — update `design.md` + Confluence page, revise tasks if needed |
| Task breakdown issue | Return to `task-breakdown` — update `tasks.md` only |
| Minor wording / AC tweak | Update Jira story directly, no phase change needed |

After resolving feedback, confirm with user before proceeding to implementation.

---

## Step 2 — Implementation loop (per task)

> **ONE TASK AT A TIME — NON-NEGOTIABLE**: Execute exactly one task per loop iteration. Never combine two tasks into a single implementation step, even if they touch the same file, are trivially small, or seem logically related. Each task has its own definition of done and its own SME confirmation gate. Combining tasks bypasses the review step and makes it impossible to isolate failures. If a task feels too small to stand alone, that is a task breakdown problem — fix `tasks.md`, do not silently merge tasks during implementation.

Repeat for each incomplete task in `tasks.md`:

### 2a — Present the task
State clearly:
- What this task does
- Which files will be touched
- What the expected outcome is
- What tests will be written first (or lint/build checks if the service has no test script yet)

### 2b — Write failing tests first (TDD)
- Write the test cases defined in the task's `TDD:` field
- **Backend:** has `npm test` (Jest). Write failing tests first.
- **Frontend:** has `npm run lint` (oxlint) and `npm run build` — **no test script yet**. For frontend tasks, still follow TDD intent where tests can be added; otherwise verify via lint + build. Do not invent a mocha/Jest recipe that is not in `frontend/package.json`.
- Before running verification, ask the user: "I'd like to run [tests / lint / build] to confirm the starting state — is that okay?"
- Run only after confirmation — for backend, confirm tests fail for the right reason
- Do not write implementation code until the red/green gate is established

### 2c — Implement
- Read surrounding files first — match existing patterns exactly
- Follow `.cursor/rules/code-standards.mdc` throughout
- Keep functions small, JSDoc on every new function, no dead code

### 2d — Run available package scripts (lint / tests / build)
- Ask the user: "I'd like to run verification for [backend|frontend] — is that okay?"
- Run only after confirmation
- Use the Node version and `cwd` established in Step 0b — do not run from the workspace root
- **Use only scripts that exist in that package's `package.json`:**

| Service | Available scripts | Notes |
|---------|-------------------|-------|
| `backend/` | `npm test` (Jest), `npm run build` | **No lint script** — do not invent one |
| `frontend/` | `npm run lint` (oxlint), `npm run build` | **No test script yet** — do not invent mocha/Jest |

- Prefer order: lint (if present) → targeted tests (if present) → build when needed for typecheck
- Then run the targeted test file(s) as per Step 3b when tests exist
- Show results to the SME — passing count, lint/build status
- If verification fails unexpectedly, stop and surface the issue before proceeding

### 2e — SME review
Present what changed:
- Files modified
- Tests written and passing (or lint/build verification for frontend)
- Any observations or concerns

Ask: "Task complete — does this look correct? Ready to move to the next one?"

**Do not proceed until the SME confirms.**
If the SME raises an issue, fix it before moving on. Never carry a known issue into the next task.

### 2f — Mark task complete
Only after SME confirmation:
- Mark `- [x]` in `tasks.md`
- Update session file status

### 2g — Unexpected discoveries
If anything unexpected is found during a task — hidden dependency, failing test, type error in adjacent code:
- Stop immediately
- Surface it to the SME
- Wait for direction before continuing

---

## Step 3 — Story complete

When all tasks for a Jira story are marked `[x]`:
- Confirm with SME: "All tasks for [TAT-XXXX] are complete. Running code review before raising PR..."
- Perform an **in-session** code review against `.cursor/rules/code-standards.mdc` (do not invoke an external review agent). Use this checklist — replace `<service-directory>` with `backend/` or `frontend/`:

```
Review the changes in `<service-directory>/`.
Check each change against `.cursor/rules/code-standards.mdc`.

Produce a structured report with:
- A pass/fail verdict per code standard
- File and line references for every finding
- Findings categorised as: ⚠️ Blocker (must fix before PR) or 💡 Observation (non-blocking)
- A one-line summary at the top: "X blockers, Y observations"

Do not approve or reject the PR — surface findings only.
```

- Present the review report to the SME
- If there are ⚠️ blockers: fix them, re-run affected tasks, re-review in-session
- If there are no blockers: tell the SME "Code review passed — you're good to raise a PR. The branch name or commit referencing TAT-XXXX will update Jira automatically."
- Update the Status block in the session file to `implementation: complete` once the SME confirms they're raising the PR, following `.cursor/skills/session-template.md`.

---

## Step 3b — Running tests and lint for TMS services

### Environment setup (non-negotiable)
Before running any command:
1. Resolve Node: use `<service-folder>/.nvmrc` if present; otherwise README Node 20+
2. If using nvm: prefix with `source ~/.nvm/nvm.sh && nvm use <version> &&`
3. Set `cwd` to the absolute path of `backend/` or `frontend/` — never run from the workspace root

### Backend (`backend/`)

**Single file / pattern (preferred — fast feedback):**
```bash
# cwd: <repo>/backend
npm test -- <path-or-pattern>
```

**Full suite:**
```bash
# cwd: <repo>/backend
npm test
```

**Build / typecheck:**
```bash
# cwd: <repo>/backend
npm run build
```

There is no `npm run lint` in backend — skip lint for this package.

### Frontend (`frontend/`)

**Lint:**
```bash
# cwd: <repo>/frontend
npm run lint
```

**Build / typecheck:**
```bash
# cwd: <repo>/frontend
npm run build
```

There is no `npm test` in frontend yet — do not invent a mocha/Jest/Vitest command. When a test script is added later, use that package script.

### Fixing broken existing tests after a response shape change

**Never use `sed`, `awk`, or any bulk find-replace tool to add fields to test expectations.** Bulk tools cannot distinguish context — they will blindly change the wrong tests.

**The correct approach — one test at a time:**
1. Run a single failing test or bail early so you stop at the first failure
2. Note the failing line number from the output
3. Read the test — understand what it asserts and what data it uses
4. Make a targeted, precise fix to that test's expected output
5. Re-run — move to the next failure
6. Repeat until all pass, then do a final full-file or suite run to confirm

---

## Step 4 — Update session file

After each task completion, update the `Implementation Progress` section and Status block in the session file, following `.cursor/skills/session-template.md`. Update the Status block in place — do not create a second Status block.
