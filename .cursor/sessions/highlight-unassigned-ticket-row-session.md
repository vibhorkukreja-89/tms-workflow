# Feature-2: Highlight unassigned ticket row — Session Notes

## Current State Findings

### What we're working with
Ticket list UI in `frontend` — rows rendered by `TicketCard` on `TicketListPage`, styled via `.ticket-row` in `index.css`.

### How the system works today
- Route `/` → `TicketListPage` (`App.tsx`) loads tickets via `useTickets` → `listTickets` (`GET /api/tickets`).
- Each ticket is rendered with `TicketCard`, which always uses `className="ticket-row"`.
- Unassigned is already known client-side: `ticket.assignedTo` is `UserSummary | null`; the card shows `ticket.assignedTo?.name ?? 'Unassigned'`.
- `Ticket` also has `assignedToId: string | null` — no backend change needed for this highlight.
- Row styles live in `frontend/src/index.css` (`.ticket-row`, hover `#f8fafc`). No unassigned highlight exists today.
- `TicketCard` is only used on the ticket list page (not detail/create).

### Where the change fits
- In `TicketCard`: when unassigned, add a modifier class (e.g. `ticket-row--unassigned`).
- In `index.css`: set background `#fbdddd` for that class, including hover (keep `#fbdddd`).
- Scope stays list-only because `TicketCard` is list-only; detail/create assignee UIs are separate.

## Regression Surface
- Assigned rows must keep the current white/surface look.
- Hover: `.ticket-row:hover` sets `#f8fafc` — unassigned rows must keep `#fbdddd` on hover via a more specific rule.
- Search/status filters: highlight must follow whichever tickets are unassigned in the filtered set.
- Detail/create pages must not pick up the highlight (they don’t use `TicketCard` today).
- No BE↔FE contract change; list API already returns `assignedTo`.

## Second-Pass Analysis

### Summary
List-only visual cue for unassigned tickets on every homepage visit. Risk is CSS specificity (hover washing out `#fbdddd`) or over-broad selectors affecting non-list UIs. No API, Prisma, or auth involvement — `assignedTo` is already on the list response.

### Key gaps
1. Hover specificity: `.ticket-row--unassigned:hover` must keep `#fbdddd` over `.ticket-row:hover`.
2. Unassigned predicate: use `ticket.assignedTo == null` (aligned with meta text and `assignedToId`).
3. No frontend unit harness — reuse static assert-script pattern (`frontend/scripts/assert-*.mjs`).
4. Filters: per-row class on `TicketCard` covers filtered lists without extra work.

### Conflicts
None

### Confirmed
Frontend-only change in `TicketCard` + `index.css`; list-only via sole `TicketCard` usage on `TicketListPage`; backend untouched; hover stays `#fbdddd`.

## Requirements

### What we're building
On the ticket list page only, highlight unassigned ticket rows with background `#fbdddd` (including hover) so agents can identify unassigned work faster.

### Functional Requirements
1. Unassigned list rows (`assignedTo == null`) use background `#fbdddd`.
2. Unassigned hover keeps `#fbdddd` (does not fall through to `#f8fafc`).
3. Assigned rows keep existing default/hover styling.
4. Highlight only on ticket list page — not detail/create.
5. Row click still navigates to `/tickets/:id`.
6. Filtered/search results still highlight visible unassigned rows.
7. Implement via dedicated `TicketCard` modifier class + scoped CSS.

### Risks and Concerns
- Hover CSS specificity must be explicit
- Verification via static assert script + SIT/BAT (no frontend unit harness today)

## Jira Field IDs
- Acceptance Criteria: not present on TAT Story create metadata — ACs placed in Description
- Story Points: customfield_10016 (Story point estimate)

## Jira Stories Created
- [FE] Highlight unassigned rows on ticket list → TAT-3
- Epic: TAT-1 (BAU)

## Confluence Design Page
URL: https://mytestingai.atlassian.net/wiki/spaces/TAT/pages/2490370/Design:+Highlight+unassigned+ticket+row

## Tasks
frontend: .cursor/specs/highlight-unassigned-ticket-row/frontend/tasks.md

## Implementation Progress
- [x] Task 1 — Add failing coverage for unassigned row class/CSS contract — complete
- [x] Task 2 — Apply unassigned row highlight on ticket list — complete

## SIT Evidence
- TAT-3: all ACs pass (2026-07-24) — local/pre-merge; evidence posted to Jira
- PR #4 not merged (SME choice)
- Status: Done
- BAT: Passed (2026-07-24) — comment posted

## Definition of Done
- Checklist passed with SME waiver: PR merge deferred (PR #4 left OPEN by choice)
- Tracked follow-up: merge https://github.com/vibhorkukreja-89/tms-workflow/pull/4 when ready for main
- Session final status committed to feature branch remote (not merged to main)

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
