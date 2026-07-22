---
name: jira-story-creator
description: Creates Jira stories with correct field mapping for the TAT project. Use this skill when requirements have been agreed and stories need to be created in Jira — covering description, acceptance criteria, test cases, story points, and epic linking. Handles Atlassian API quirks to avoid ADF format errors.
---

# Jira Story Creator

Creates well-structured Jira stories for the TAT project following the team's agreed field mapping and API conventions.

## Setup
- Jira: https://mytestingai.atlassian.net — project key: TAT
- MCP server: configured Atlassian MCP (discover tools/schemas at runtime)

---

## Step 0 — Read session file

Check for `.cursor/sessions/*-session.md` in the workspace. If found, read it — use the requirements and context already captured rather than starting from scratch.

Also check the session file for a `Jira Field IDs` note. If Acceptance Criteria and Story Points field IDs are already stored, reuse them. If not, discover them in Step 1a before the first create.

---

## Step 1 — Confirm before creating

Check the session file for an epic key. If not present, ask the user: "What's the epic key for these stories? (e.g. TAT-123)"

Do not proceed without a confirmed epic key.

Present the full list of stories to the user before touching Jira:
- Title, story points, epic link for each
- Ask: "Happy with these? Should I go ahead and create them in Jira?"
- Do not create until the user confirms.

---

## Step 1a — Discover Jira field IDs (before first create)

Before creating the first story in a feature session, discover the Acceptance Criteria and Story Points custom field IDs via the Atlassian MCP (issue create metadata / fields tools — discover the exact tool names and schemas at runtime).

**Rules:**
- Do **not** hardcode field IDs such as `customfield_10064` or `customfield_10058` as required values
- Those IDs may appear as examples only if discovery returns them for this site
- Store the discovered IDs in the session file under a `Jira Field IDs` note, for example:

```
## Jira Field IDs
- Acceptance Criteria: <discovered-id>
- Story Points: <discovered-id>
```

Reuse the stored IDs for the rest of the feature. Re-discover only if create calls fail because fields moved or the note is missing.

---

## Step 2 — Create each story

### Title → `summary`
- Prefix with system tag: `[BE]`, `[FE]`, `[BE + FE]`, `[QA]`
- Sentence case

### Description → direct `description` parameter
Pass as markdown — auto-converted to ADF on Cloud.

```
As a [persona], I want [goal], so that [outcome].

##### Impact Analysis
- Files touched: ...
- Downstream systems affected: ...
- DB migration required: yes/no
- Feature toggle required: yes/no

##### Before / After
**Before:** ...
**After:** ...

##### Testing Note
[Cross-ticket dependencies or notes]
```

### Acceptance Criteria → discovered AC field in `additional_fields`
Must be passed as ADF JSON. Write ACs in **plain business language** — no code, no field names, no technical jargon. The AC field is read by BAs, QAs, and product — not just developers.

**Rules:**
- Describe observable behaviour, not implementation
- Use "Given / When / Then" or plain "When X happens, Y is the result"
- No variable names, no file paths, no API field names
- If technical detail is needed, put it in the description under `##### Technical Notes`

**Good AC:**
- When an agent creates a ticket with a subject and description, the ticket appears in the list with status Open
- When a comment is added to a ticket, the comment is visible on that ticket and the ticket's updated time changes
- When a ticket is closed, new comments can still be added but the ticket status remains Closed

**Bad AC (too technical):**
- Given POST /api/tickets with { subject, description }, when createTicketService runs, then Prisma ticket.create is called and status defaults to OPEN

ADF JSON format:
```json
{
  "version": 1,
  "type": "doc",
  "content": [{
    "type": "bulletList",
    "content": [
      {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "plain language AC here"}]}]}
    ]
  }]
}
```

### Story Points → discovered Story Points field in `additional_fields`
Plain number.
- 1 — trivial, single file
- 2 — small, few files
- 3 — moderate, multiple layers
- 5 — complex, cross-system
- 8 — large, consider splitting

### All three above go in a single create-issue call:
- `description` as direct parameter
- Discovered AC field (ADF) and Story Points field (number) in `additional_fields`

### Epic Link
Link via the epic-link MCP tool after creation. Never create a story without a confirmed epic key.

---

## Step 3 — Add test cases as a comment

Immediately after creating each story, add a comment. Use actual newlines in the body — do NOT use `\n` escape sequences.

Format:
```
##### Progression Test Cases

**Test 1: [name]**
- Steps: ...
- Expected: ...

---

##### Regression Test Cases

**Test 1: [name]**
- Steps: ...
- Expected: ...
```

---

## Step 4 — Confirm each story

After creating each story, share the Jira link and ask:
"Story created — does it look correct? Ready for the next one?"

Update the session file — append the `Jira Stories Created` section (and `Jira Field IDs` if newly discovered) and update the Status block in place, following `.cursor/skills/session-template.md`.

---

## Service Abbreviations

| Abbreviation | Service |
|--------------|---------|
| **BE** | backend |
| **FE** | frontend |
| **QA** | QA |

## Naming Conventions
- Prefix summary with system tag: `[BE]`, `[FE]`, `[BE + FE]`, `[QA]`
- Sentence case for summaries
- Priority defaults to `3 - Medium` unless specified

---

## API Gotchas
- `description` → direct parameter on create-issue, NOT in `additional_fields`
- Acceptance Criteria → must be ADF JSON in `additional_fields` using the **discovered** field ID; plain string fails on current Atlassian Cloud APIs
- Story Points → plain number in `additional_fields` using the **discovered** field ID
- All three can go in a single create-issue call
- Comment bodies → use actual newlines, never `\n` escape sequences
- `#####` renders as h5 in Jira — use for all section headings in description and comments
- Discover AC and Story Points field IDs at runtime — never assume hardcoded `customfield_*` values
