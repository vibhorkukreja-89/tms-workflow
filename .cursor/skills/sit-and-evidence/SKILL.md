---
name: sit-and-evidence
description: Handles the SIT testing and evidence collection phase. Use this skill after a PR is merged and deployed to SIT. Receives SIT test evidence and BAT results from the SME — formats and posts them to the correct Jira tickets, transitions story status, and keeps the session file current.
---

# SIT and Evidence

The agent cannot deploy or test. It receives evidence from the SME and handles all Jira bookkeeping — so the team focuses on testing, not ticket admin.

---

## Step 0 — Read session file

Read `.cursor/sessions/<feature-name>-session.md` to get the Jira story keys (`TAT-XXXX`) and current status.

---

## Step 1 — Confirm deployment

Ask: "Has the PR been merged and the feature deployed to SIT?"

- If not yet — wait. Do not proceed until the SME confirms deployment is complete. Deployment is a manual/pipeline step; the agent plays no part in it.
- If yes — proceed to Step 2.

---

## Step 2 — SIT Testing

Ask: "Ready to capture test evidence?"

For each Jira story, ask the SME to provide:
- Test execution results (pass/fail per AC)
- Evidence: screenshots, curl responses, logs — paste directly into chat

Format and post as a Jira comment:

```
##### SIT Test Evidence

**Environment:** SIT
**Date:** [today's date — fill automatically]
**Executed by:** SME

**Results:**
- AC 1: ✅ Pass
- AC 2: ✅ Pass
- AC 3: ❌ Fail — [reason]

**Evidence:**
[Paste screenshots, curl responses, logs here]
```

**If all ACs pass:** proceed to Step 3.
**If any AC fails:**
- Log the failure in the Jira comment
- Route back to the `implementation` skill with the failure details
- Fix, re-deploy, re-test

---

## Step 3 — Transition story status

After SIT evidence is posted, check available transitions for each story:
- Discover transition tools/schemas via Atlassian MCP, then list available status options
- Ask the SME: "Should I move these stories to [next status]?"
- Transition only after SME confirms

---

## Step 4 — BAT (Business Acceptance Testing)

Ask: "Has BAT been completed?"

**Pass:**
- Add Jira comment:
```
##### BAT — Passed
Business acceptance testing complete. Ready to close.
[today's date — fill automatically]
```
- Transition stories to Done/Closed after SME confirms
- Proceed to the `definition-of-done` skill

**Fail:**
- Add Jira comment with failure details
- Route back to correct phase based on the nature of the failure
- Update session file

---

## Step 5 — Update session file

When BAT passes and stories are closed, update session file:
```
## Status
current-state-analyst: complete
requirements-gatherer: complete
jira-story-creator: complete
confluence-design-page: complete
task-breakdown: complete
implementation: complete
sit-and-evidence: complete
definition-of-done: pending
```
