# Session File Template

This file defines the canonical structure of a feature session file.
**It is a reference document — not a skill to execute.**

Every session file lives at `.cursor/sessions/<feature-name>-session.md`.
Each phase appends its section to the file. The Status block is updated in place — never duplicated.

---

## How to use this template

- When **writing** a session file (Phase 1): create the file with the Current State Findings, Regression Surface, and Status sections only. Leave all other sections absent until their phase runs.
- When **appending** to a session file (Phases 2–8): add the new section above the Status block. Update the Status block in place — do not create a second Status block.
- When **reading** a session file (any phase Step 0): use the presence/absence of sections to determine how far the feature has progressed. A missing section means that phase has not run yet.

---

```markdown
# <Feature Name> — Session Notes

## Current State Findings

### What we're working with
[One sentence on the feature area and where it lives — specific service, file, function]

### How the system works today
[Data flow, patterns, what exists — specific files and functions]

### Where the change fits
[Exactly where in the flow the new feature slots in]

## Regression Surface
[What could break — specific files, flows, shared code paths, downstream consumers]

## Open Questions
[Only things the codebase cannot answer — ask the user. Remove this section once all questions are resolved.]

## Second-Pass Analysis

### Summary
[Substance of what second-pass analysis returned — business impact framing, not just "confirmed"]

### Key gaps
[Numbered list — risks, test cases, coordination flags, anything the agent missed]

### Conflicts
[Where first pass and second pass disagreed — or "None"]

### Confirmed
[What both agreed on]

---

## Requirements

### What we're building
[Plain language summary]

### Functional Requirements
[Numbered list of agreed requirements]

### Risks and Concerns
[Anything flagged during requirements gathering]

---

## Jira Stories Created
- [TAG] Story title → TAT-XXXX
- Epic: TAT-XXXX

## Confluence Design Page
URL: https://mytestingai.atlassian.net/wiki/spaces/{space}/pages/{page_id}

## Tasks
backend: .cursor/specs/<feature-name>/backend/tasks.md
frontend: .cursor/specs/<feature-name>/frontend/tasks.md

## Implementation Progress
- [x] Task 1 — description — complete
- [ ] Task 2 — description — pending

## Status
current-state-analyst: pending
requirements-gatherer: pending
jira-story-creator: pending
confluence-design-page: pending
task-breakdown: pending
implementation: pending
sit-and-evidence: pending
definition-of-done: pending
```

---

## Status value conventions

| Value | Meaning |
|-------|---------|
| `pending` | Phase has not started |
| `complete` | Phase finished and user confirmed |
| `complete (second-pass cross-referenced)` | Phase 1 only — second-pass analysis was completed |
| `complete — awaiting artefact review approval` | Phase 5 only — tasks written, parked for review |
| `in progress` | Phase started but not yet confirmed complete |
