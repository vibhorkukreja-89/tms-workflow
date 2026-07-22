---
name: confluence-design-page
description: Creates a structured technical design page in Confluence for a feature or change. Use this skill when the design phase is complete and agreed — after requirements are confirmed and before implementation begins. Handles page creation, required section structure, and linking back to all related Jira stories.
---

# Confluence Design Page

Creates a well-structured technical design page in Confluence, as a child of the page where the feature requirements came from. Linked back to all related Jira stories.

## Setup
- Confluence: https://mytestingai.atlassian.net
- MCP server: configured Atlassian MCP (discover tools/schemas at runtime)
- Parent page: create as a child of the Confluence page that contained the original requirements/change request. Prefer the page ID from the URL captured in the session file at the start of the feature.
  - If a parent URL/page ID is present in the session — use it. The space is determined by the parent page — do not hardcode a space.
  - If none is present — ask the user where to place the page. If they have no preference, offer the TAT space homepage (`homepageId=557233`) as the fallback parent and wait for confirmation before creating.

---

## Step 0 — Read session file

Check for `.cursor/sessions/*-session.md` in the workspace. If found, read it — use the current state findings, requirements, and Jira story keys already captured.

---

## Step 1 — Confirm before creating

Present the proposed page title and outline structure to the user. This is a confirmation of the skeleton — the user will see the full content before it is published.
- Ask: "Here's the proposed structure — happy with this outline? I'll show you the full content before publishing."
- Do not create until the user has seen and confirmed the full content.

---

## Step 2 — Required page structure

Every design page MUST contain these sections in this order:

```
## Overview
Brief summary of what is being built and why. 2-3 sentences max.

## Current State
How the relevant part of the system works today.
Reference specific files, functions, and data flows.
This section must exist — no skipping.

## Proposed Changes
What is changing and why.
If blending in: show the delta only.
If refactoring: show the before/after and justify the decision.

## Architecture / Flow
Updated sequence or flow using ASCII diagram (code block).
Reference existing system components.

## Data Shape Changes
Any new or modified schemas, Prisma models, or API contracts.
Include before/after examples for any changed shapes.

## Integration Contracts
(Required for multi-system changes — skip only if single-service change)
For every system boundary touched:
- Contract type (HTTP API / shared types / auth)
- Current contract shape
- Proposed contract change
- Backwards compatible? If not, migration strategy.

## Test Approach
Which functions get unit tests, which get integration tests, and why.
List specific test cases mapped back to story ACs.
Flag anything intentionally not tested and why.

## Key Decisions
Document the "why" behind non-obvious design choices.

## Open Questions
Any unresolved decisions that need team input.
```

---

## Step 3 — Multi-system changes: Integration Contracts are non-negotiable

If the change touches more than one service (`backend` and `frontend`), the Integration Contracts section must be completed and reviewed by the user before the page is published. Do not skip or defer this section.

Focus on **HTTP API contracts between backend and frontend** (routes, request/response payloads, status codes, auth). Do not default to message-bus or event-stream contracts unless the feature explicitly requires them.

---

## Step 4 — After creating the page

Immediately after the page is created:
- Add a remote link on every related Jira story pointing to the Confluence page (Jira → Confluence direction)
- Use the Jira epic key as a label on the page for discoverability
- Confirm with the user: "Page published and linked to stories — does everything look correct?"
- Update the session file with the Confluence page URL:
```
## Confluence Design Page
URL: https://mytestingai.atlassian.net/wiki/spaces/{space}/pages/{page_id}/{page_title}
```

Note: The API returns `/spaces/...` but the correct browseable URL is `/wiki/spaces/...` — always add `/wiki` prefix.

**Inline story linking:**
Each Jira story should be linked inline within the section it relates to — not just listed at the top. Use this pattern within the relevant section:

```
> 📋 **[TAT-XXXX — Story title](https://mytestingai.atlassian.net/browse/TAT-XXXX)**
```

Mapping guide:
- Stories about validation logic, new behaviour → link in **Proposed Changes**
- Stories about new types or data models → link in **Data Shape Changes**
- Stories about API contracts or cross-service changes → link in **Integration Contracts**
- Stories about test coverage → link in **Test Approach**
- If a story spans multiple sections, link it in each relevant section

---

## Step 5 — Confirm before writing design.md

Ask the user: "Ready for me to write design.md to [service(s)]?"
Do not write until the user confirms.

---

## Step 6 — Write design.md to each impacted service

Impacted services for TMS are `backend` and/or `frontend`. For each service impacted by this feature, write:
`.cursor/specs/<feature-name>/{backend|frontend}/design.md`

Use the same feature name established in `requirements-gatherer`.
Mirror the structure of the published Confluence page exactly — same sections, same content, scoped to what is relevant to that service.

```markdown
# Design: <Feature Name>

## Overview

## Current State

## Proposed Changes

## Architecture / Flow

## Data Shape Changes

## Integration Contracts

## Test Approach

## Key Decisions

## Open Questions
```

If the change involves an HTTP API contract between backend and frontend, include the Integration Contracts section in both services' design files — each from its own perspective (API provider vs consumer).

Update the session file — append the `Confluence Design Page` URL and update the Status block in place, following `.cursor/skills/session-template.md`.

Confirm with the user: "design.md written to [service(s)] — ready to move to task breakdown?"

---

## Guidelines
- Use ASCII diagrams in code blocks for architecture flows — same style as existing design pages in the team's Confluence space
- Keep sections focused — no padding, no restating what the code already shows
- Current State must reference actual file names and function names, not generalities
- If a section genuinely doesn't apply (e.g. no data shape changes), include the heading with "N/A — no changes to data shapes in this feature" rather than omitting it
