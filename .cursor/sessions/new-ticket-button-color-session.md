# Feature-1: Change New ticket button color — Session Notes

## Current State Findings

### What we're working with
Homepage ticket list (`TicketListPage` at `/`) exposes a **New ticket** CTA that currently uses shared primary button styles (`btn btn-primary`).

### How the system works today
- Route `/` → `TicketListPage` (`frontend/src/App.tsx`)
- CTA: `<Link to="/tickets/new" className="btn btn-primary">New ticket</Link>` in `frontend/src/pages/TicketListPage.tsx`
- Shared styles in `frontend/src/index.css`: `--primary: #0f766e`, `--primary-hover: #0d9488`, `.btn-primary` / `.btn-primary:hover`
- Other `btn-primary` consumers: Create ticket submit (`CreateTicketPage.tsx`), comment submit (`CommentThread.tsx`), Save changes (`TicketDetailPage.tsx`)
- No frontend unit/integration tests for this control
- Backend is out of scope (no API, Prisma, or auth change)

### Where the change fits
Add a dedicated class (or equivalent scoped style) on the homepage New ticket `Link` plus matching CSS so default is `#8957e5` and hover/active uses a darker purple in the same family — without changing global `--primary` / `.btn-primary`.

## Regression Surface
- **High risk if done wrong:** changing `--primary` or `.btn-primary` globally recolors Create / Comment / Detail primary actions
- **Low risk if scoped to list-page CTA only:** routing, ticket list behaviour, and backend untouched
- No BE↔FE contract, Prisma, or auth impact

## Second-Pass Analysis

### Summary
Pure frontend presentation change on the homepage CTA. Second pass confirmed there is no API, Prisma, or auth blast radius; the only real risk is accidentally restyling shared `.btn-primary` consumers.

### Key gaps
1. No existing frontend tests — visual regression must be covered by new tests or explicit SIT/BAT checks
2. Hover purple shade not specified in Confluence — must pick a darker purple derived from `#8957e5` at design/requirements time
3. Cross-team: Frontend + QA only; Backend not involved

### Conflicts
None

### Confirmed
- Change belongs only on the New ticket `Link` in `TicketListPage.tsx`
- Global `--primary` / `.btn-primary` must stay teal for Create, Comment, and Detail actions
- Backend out of scope

## Requirements

### What we're building
Restyle the homepage **New ticket** button to `#8957e5` with hover/active `#7340d4`, without changing other primary buttons.

### Functional Requirements
1. Homepage New ticket default background `#8957e5`
2. Hover/active background `#7340d4`
3. Still links to `/tickets/new` with label New ticket
4. Other `btn-primary` actions remain teal
5. Use dedicated/scoped class — do not change global `--primary` / `.btn-primary`

### Risks and Concerns
- No frontend test runner today — rely on lint/build + SIT/BAT visual checks unless a harness is added
- Incorrect global CSS would recolor Create / Comment / Detail primary actions

## Jira Field IDs
- Acceptance Criteria: not present on TAT Story create metadata — ACs placed in Description
- Story Points: customfield_10016 (Story point estimate)

## Jira Stories Created
- [FE] Change New ticket button color on homepage → TAT-2
- Epic: TAT-1 (BAU)

## Confluence Design Page
URL: https://mytestingai.atlassian.net/wiki/spaces/TAT/pages/1146882/Design:+Change+New+ticket+button+color

## Tasks
frontend: .cursor/specs/new-ticket-button-color/frontend/tasks.md

## Implementation Progress
- [x] Task 1 — Add failing coverage for New ticket CTA class contract — complete
- [x] Task 2 — Apply scoped purple styles to homepage New ticket button — complete

## Status
current-state-analyst: complete (second-pass cross-referenced)
requirements-gatherer: complete
jira-story-creator: complete
confluence-design-page: complete
task-breakdown: complete
implementation: in progress — code review passed, awaiting PR
sit-and-evidence: pending
definition-of-done: pending
