# Tasks: Highlight unassigned ticket row

## Overview
Frontend-only change: highlight unassigned ticket list rows with `#fbdddd` (including hover) via a scoped `TicketCard` modifier class.

## Tasks

- [x] 1. Add failing coverage for unassigned row class/CSS contract
  - Jira: TAT-3 (parent story this task implements)
  - What: Encode that `TicketCard` adds `ticket-row--unassigned` when the ticket has no assignee, and that CSS defines `#fbdddd` for that class at rest and on hover
  - Files: `frontend/scripts/assert-unassigned-ticket-row.mjs`
  - Done when: A failing check asserts the unassigned class/CSS contract before implementation
  - TDD: Write this first; it must fail against current markup/CSS (no modifier class / no unassigned rules)

- [x] 2. Apply unassigned row highlight on ticket list
  - Jira: TAT-3 (parent story this task implements)
  - What: When `assignedTo == null`, add `ticket-row--unassigned` on the row `Link`; add CSS for `#fbdddd` default and hover; leave assigned-row styles unchanged
  - Files: `frontend/src/components/TicketCard.tsx`, `frontend/src/index.css`
  - Done when: Unassigned rows use `#fbdddd` at rest and on hover; assigned rows keep existing styles; detail/create unaffected; task 1 checks pass
  - TDD: Implement only enough to make task 1 pass

## Notes
- Artefact review approved; all tasks complete on branch `TAT-3-highlight-unassigned-ticket-row`
- Cross-service dependencies: none (frontend only)
- Class/CSS contract check: `node scripts/assert-unassigned-ticket-row.mjs` (cwd: frontend)
