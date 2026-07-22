---
name: sdlc-orchestrator
description: >-
  Orchestrates the full TMS feature delivery lifecycle from current-state
  analysis through definition of done and SIT defect fixes. Use when the user
  asks to run the SDLC Orchestrator, start feature delivery, or follow the
  9-phase delivery workflow.
---

# SDLC Orchestrator

Orchestrates the full feature delivery lifecycle for the TMS platform — from current-state analysis to deployed, tested, and closed. Load this skill when starting feature delivery.

> **SESSION START — REQUIRED**: When this skill is loaded, immediately acknowledge it with this exact message before doing anything else:
> "I'm running the **SDLC Orchestrator** workflow. I'll follow the delivery lifecycle using the skills in `.cursor/skills/` — starting with `current-state-analyst`. Let's go."

---

## Session Handover (NON-NEGOTIABLE)

### Start of every session
1. Check for `.cursor/sessions/*-session.md` files
2. If found — read it, resume from where the last session left off
3. Check if any tasks are marked in progress — confirm with user before proceeding
4. Do NOT re-read the codebase if current-state findings are already in the session file

### End of every session
Write findings to `.cursor/sessions/<feature-name>-session.md` — always, even in a single session.
The session file must follow the canonical structure defined in `.cursor/skills/session-template.md`.
The session file is the only context that survives a session boundary.

---

## Spec Cycle — Phase by Phase

> **SKILL LOADING — NON-NEGOTIABLE**: At the start of every phase, read the corresponding skill file in full before taking any action. Do not draft, create, or write anything until the skill file has been read. The skill file defines the exact format, field mapping, and step sequence for that phase — working from memory or prior context is not acceptable.

> **PHASE TRANSPARENCY — NON-NEGOTIABLE**: At the start of every phase, explicitly announce which skill file is being read and which step is being followed. Format: "Reading `<skill>/SKILL.md` — following Step N: [step name]." Repeat the step announcement each time a new step begins within the phase. This gives the user a visible audit trail and makes it easy to call out when the agent deviates from the defined process.

> **PHASE BOUNDARIES — NON-NEGOTIABLE**: A phase is not complete until the user explicitly confirms. User messages during a phase (clarifications, corrections, additional context) update the current phase's findings only — they do not trigger the next phase. Do not advance to the next phase, start writing artefacts, or begin implementation based on a clarification message. Wait for an explicit signal ("confirmed", "proceed", "looks good") before crossing a phase boundary. If it is unclear whether the user is confirming or just clarifying, ask explicitly: "Does this match your understanding? Ready to move on?"

> **OPEN QUESTIONS — NON-NEGOTIABLE**: If multiple open questions are asked within a phase, track each one explicitly. When the user answers, check which questions remain unanswered and list them. Do not proceed — not even to the next question's analysis — until all questions in the set are answered. If the user answers question 1 but not question 2, respond with the updated finding for question 1 and re-state question 2 clearly. Never assume an unanswered question is resolved.

### Phase 1 — Current State
Read `.cursor/skills/current-state-analyst/SKILL.md` in full, then follow its steps exactly.
Output: session file in `.cursor/sessions/`, gap report in `.cursor/gap-report/` — commit both to the workspace repo.

### Phase 2 — Requirements
Read `.cursor/skills/requirements-gatherer/SKILL.md` in full, then follow its steps exactly.
Output: `requirements.md` per service under `.cursor/specs/<feature>/{backend|frontend}/`, session file updated.

### Phase 3 — Jira Stories
Ask: "Ready to create Jira stories?"
Read `.cursor/skills/jira-story-creator/SKILL.md` in full, then follow its steps exactly.
Output: stories created in Jira, linked to epic, test cases as comments, session file updated.

### Phase 4 — Confluence Design Page
Ask: "Want me to create the Confluence design page?"
Read `.cursor/skills/confluence-design-page/SKILL.md` in full, then follow its steps exactly.
Output: design page published under the requirements page, linked to stories, `design.md` per service, session file updated.

### Phase 5 — Task Breakdown
Read `.cursor/skills/task-breakdown/SKILL.md` in full, then follow its steps exactly.
Output: `tasks.md` per service under `.cursor/specs/<feature>/{backend|frontend}/`, session file updated. Parked until artefact review approval.

### Phase 6 — Artefact Review Gate (human, async)
Artefacts (Jira stories + Confluence design page) go to independent reviewer.
Read `.cursor/skills/implementation/SKILL.md` in full, then follow its steps exactly.
Output: all tasks implemented and marked `[x]`, PR ready to raise.

### Phase 7 — SIT Testing and Evidence
Read `.cursor/skills/sit-and-evidence/SKILL.md` in full, then follow its steps exactly.
Output: SIT evidence posted to Jira, stories transitioned, BAT recorded, session file updated.

### Phase 8 — Definition of Done
Read `.cursor/skills/definition-of-done/SKILL.md` in full, then follow its steps exactly.
Output: DoD checklist passed, session file closed as complete.

### Phase 9 — Defect Fix (SIT)
Triggered when a SIT defect ticket is raised against a feature built through this workflow.
Ask: "What is the defect ticket key?" — then read `.cursor/skills/defect-fix/SKILL.md` in full before taking any action.
Input required: defect Jira ticket key. The ticket must be linked to the User Story it relates to — the agent uses that link to load the correct session file automatically.
Output: root cause slip report confirmed by user, failing test added, fix implemented, Jira ticket transitioned to "Fixed / Ready for retest", defect record appended to session file, PR ready to raise.

---

## Supporting rule

- `.cursor/rules/code-standards.mdc` — team coding standards (loaded during requirements, task breakdown, and implementation).

---

*Skills live in `.cursor/skills/<name>/SKILL.md` — named in execution order.*
