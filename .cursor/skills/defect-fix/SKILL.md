---
name: defect-fix
description: Forensic root cause analysis and surgical fix for SIT defects raised against features built through this SDLC workflow. Traces the defect back through the session file, requirements, design, and tasks to identify where it slipped through, then fixes the code and the test that should have caught it. Use this skill when a SIT defect Jira ticket is provided.
---

# Defect Fix

Forensic first, surgical second. The session file is the primary source — the Jira ticket is the symptom.

---

## Step 0 — Load the defect ticket

Fetch the Jira defect ticket using the key provided by the user.

Read:
- Summary and description
- Steps to reproduce
- Expected vs actual behaviour
- Environment (SIT/UAT/etc.)
- Any attachments (logs, screenshots, API captures) — fetch via Atlassian MCP if present
- **Issue links** — find the linked User Story (e.g. "is caused by TAT-XXXX" or "relates to TAT-XXXX")

If no User Story link is found on the ticket, ask the user:
> "I can't find a linked User Story on this ticket. Can you tell me which story this defect relates to (e.g. TAT-1472)?"

Do not proceed without a User Story key.

---

## Step 1 — Load the feature session file

Using the User Story key from Step 0:

1. Scan `.cursor/sessions/` for a session file that references that story key
2. Read the session file in full — this is the primary context for the forensic analysis
3. From the session file, identify:
   - Which services are involved (`backend` and/or `frontend`)
   - The `requirements.md`, `design.md`, and `tasks.md` paths per service under `.cursor/specs/<feature>/{backend|frontend}/`
4. Read all of those files

Do not re-read the codebase from scratch if the session file already captures the current state findings. Use the session file as the starting point.

---

## Step 2 — Forensic analysis (root cause + slip report)

Cross-reference the defect against every layer of the feature artefacts:

| Layer | File | Question |
|-------|------|----------|
| Requirements | `requirements.md` | Was this scenario described? Was the expected behaviour specified? |
| Design | `design.md` | Did the design account for this case? Was the edge case visible in the flow diagram? |
| Tasks | `tasks.md` | Was there a test task for this scenario? Was it marked complete? |
| Tests | Actual test files | Does a test exist that should have caught this? Why didn't it? |
| Implementation | Source files | Does the code match the design? Is there a logic error? |

Produce a **slip report** — present it to the user before touching any code:

```
**Defect:** [one-line description of the bug]

**Root cause:** [what is actually wrong in the code — specific file and function]

**Where it slipped:**
- Requirements: [covered / not covered / ambiguous]
- Design: [accounted for / not accounted for]
- Tasks: [test task existed / missing]
- Tests: [test existed but wrong assertion / test missing entirely / test covered wrong path]

**Why existing tests didn't catch it:**
[Specific reason — wrong mock data, missing edge case, assertion too broad, etc.]

**Proposed fix:**
[One sentence on what code changes and what test needs to be added or corrected]
```

Ask: "Does this root cause analysis match what you're seeing? Ready to proceed with the fix?"

Do not write any code until the user confirms.

---

## Step 3 — Establish service working environment

Before running any command, follow the same rules as the `implementation` skill:

- Resolve Node: use `<service-folder>/.nvmrc` if present; otherwise root `README.md` (Node 20+)
- All commands use `cwd: <absolute-path-to-backend-or-frontend>` — never run from the workspace root
- If using nvm: prefix every command with `source ~/.nvm/nvm.sh && nvm use <version> &&`

Record: `[backend|frontend] → Node <x.x.x or 20+ per README>, cwd: <absolute-path>`

To reproduce the defect against a **running** service (not just unit tests), follow root `README.md` for starting backend/frontend and dependencies locally. Fix on a fresh branch off the default branch named `TAT-<ticket>-short-description`.

---

## Step 4 — Write a failing test that reproduces the defect (TDD)

Write the test first — it must:
- Reproduce the exact scenario described in the defect ticket
- Fail for the reason identified in the slip report
- Be placed in the existing test file for the affected function (not a new file unless genuinely warranted)

**Backend:** use `npm test` (Jest) from `backend/`.
**Frontend:** if no test script exists yet, add the smallest verification the package supports (`npm run lint` / `npm run build`) and note the gap; prefer adding a real failing test when a test runner is introduced. Do not invent mocha or other runners not in `package.json`.

Before running: "I'd like to run the test to confirm it fails for the right reason — is that okay?"

Run the targeted verification. Confirm it fails. Do not write the fix until the red gate is established.

---

## Step 5 — Implement the fix

- Minimal change — fix the root cause identified in Step 2, nothing else
- Do not refactor surrounding code unless it is directly causing the defect
- Follow `.cursor/rules/code-standards.mdc` throughout
- JSDoc on any new or modified function explaining the business rule it now correctly encodes

---

## Step 6 — Run available package scripts (lint / tests / build)

- Use only scripts that exist for the service:
  - **backend:** `npm test`, then `npm run build` if types may be affected — **no lint script**
  - **frontend:** `npm run lint` first, then `npm run build` — **no test script yet**
- Fix any lint errors before running tests/build where lint exists
- Run the targeted test file when tests exist — confirm the new test passes and no existing tests regress
- If regressions appear, stop and surface them before continuing

---

## Step 7 — Code review

Perform an **in-session** code review against `.cursor/rules/code-standards.mdc` (do not invoke an external review agent):

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

Fix any blockers. Re-review in-session if blockers were fixed.

---

## Step 8 — Update Jira and session file

**Jira ticket:**
Add a comment to the defect ticket:

```
**Root cause:** [one sentence]

**Fix:** [what changed — file and function]

**Test added:** [test name and what it covers]

**Slip analysis:** [where in the SDLC this was missed — requirements / design / task / test]
```

Transition the ticket to "Fixed" / "Ready for retest" (discover transitions via Atlassian MCP, then transition).

**Session file:**
Append a `Defect Record` section to `.cursor/sessions/<feature-name>-session.md` above the Status block:

```markdown
## Defect Record

### [TICKET-KEY] — [one-line defect summary]
- **Root cause:** [file, function, what was wrong]
- **Slipped at:** [requirements / design / task / test]
- **Why tests missed it:** [specific reason]
- **Fix:** [what changed]
- **Test added:** [test name]
- **Date:** [YYYY-MM-DD]
```

Update the Status block in place:
```
sit-and-evidence: complete (defect TICKET-KEY fixed)
```

---

## Step 9 — PR ready

Tell the user:
> "Fix complete — you're good to raise a PR referencing [TICKET-KEY]. The branch referencing the ticket key will update Jira automatically."

---

## Guidelines

- The slip report is the most important output of this skill — it tells the team where the process failed, not just what the code bug was
- Never fix more than the root cause — scope creep in a defect fix introduces new risk
- The test added in Step 4 must be the test that *should have existed* from the `implementation` phase — it closes the gap in the original test suite
- If the slip analysis reveals a requirements or design gap (not just a missing test), flag it explicitly — the team may need to update `requirements.md` or `design.md` as well
