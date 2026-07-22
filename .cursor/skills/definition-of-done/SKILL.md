---
name: definition-of-done
description: Runs the Definition of Done checklist at the end of a spec cycle. Use this skill after BAT is passed and stories are ready to close. Verifies all artefacts, code quality, and process gates are complete before the feature is considered done.
---

# Definition of Done

Explicit checklist run at the end of every spec cycle. Nothing is done until this passes.

---

## Step 0 — Read session file

Read `.cursor/sessions/<feature-name>-session.md` to get the full picture of what was built and what stories were created. Confirm related artefacts under `.cursor/specs/<feature-name>/`, `.cursor/gap-report/`, and Jira/Confluence links recorded in the session.

---

## Step 1 — Run the checklist

Go through each item explicitly. Report pass/fail for each:

**Jira:**
- [ ] All stories created and linked to the epic
- [ ] Story points confirmed on all stories
- [ ] ACs present on all stories
- [ ] Test cases added as comments on all stories
- [ ] SIT evidence attached to all stories
- [ ] All stories transitioned to Done/Closed

**Confluence:**
- [ ] Design page published in Confluence under the requirements page
- [ ] Design page linked to all related Jira stories
- [ ] Jira epic key added as label on the page

**Code:**
- [ ] All tasks marked `[x]` in `.cursor/specs/<feature-name>/{backend|frontend}/tasks.md`
- [ ] All new functions have JSDoc one-liners
- [ ] No dead code, no TODO comments, no commented-out code
- [ ] PR raised by SME, reviewed, and merged

**Process:**
- [ ] BAT completed and passed
- [ ] DB migration exists and verified (if required)
- [ ] Feature toggle in place and documented (if required)
- [ ] Session file updated with final status under `.cursor/sessions/`

---

## Step 2 — Handle failures

For any item that fails:
- Flag it clearly to the SME
- Do not mark the feature as done until resolved
- Route back to the appropriate skill if needed

---

## Step 3 — Close out

When all items pass:
- Update session file:
```
## Status
current-state-analyst: complete
requirements-gatherer: complete
jira-story-creator: complete
confluence-design-page: complete
task-breakdown: complete
implementation: complete
sit-and-evidence: complete
definition-of-done: complete ✅
Feature: DONE
```
- Confirm with SME: "All done checks passed — this feature is complete."
