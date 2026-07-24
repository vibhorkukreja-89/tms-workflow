# Requirements: Highlight unassigned ticket row

## What we're building
On the ticket list page only, highlight unassigned ticket rows with background `#fbdddd` (including hover) so agents can identify unassigned work faster.

## Functional Requirements
1. On the ticket list page (`/`), any ticket with no assignee (`assignedTo == null`) must render its row with background color `#fbdddd`.
2. On hover of an unassigned row, the background must remain `#fbdddd` (must not switch to the default `.ticket-row:hover` color `#f8fafc`).
3. Assigned ticket rows must keep the existing default and hover styling (no `#fbdddd`).
4. The highlight must appear only on the ticket list page — ticket detail and create pages must not show this row highlight.
5. Row navigation must be unchanged: clicking a row still navigates to `/tickets/:id`.
6. Search and status filters must not remove the highlight behaviour — any unassigned ticket visible in the filtered list remains highlighted.
7. Apply the highlight via a dedicated modifier class on `TicketCard` (e.g. `ticket-row--unassigned`) plus scoped CSS — do not change global `.ticket-row` styling in a way that affects assigned rows.

## Fit
- Entry: `TicketListPage` at `/` via `App.tsx`, rendering `TicketCard` per ticket
- Modify: `frontend/src/components/TicketCard.tsx` — add unassigned modifier class when `ticket.assignedTo == null`
- Modify: `frontend/src/index.css` — scoped rules for unassigned default and hover (`#fbdddd`)
- Reuse: existing `Ticket` type and list API payload (`assignedTo`); no new components required

## Regression Surface
- At risk if mishandled: assigned-row hover (`#f8fafc`); unassigned hover washed out by `.ticket-row:hover`
- Not at risk when scoped correctly: routing, filters/search, backend APIs, detail/create assignee UI
- No BE↔FE contract changes

## Constraints
- Frontend only — no API, Prisma, auth, or feature-toggle changes
- No new TypeScript types or shared FE/BE contracts
- No frontend unit/e2e harness in package scripts today; prefer a static assert script (same pattern as `frontend/scripts/assert-new-ticket-button.mjs`) plus SIT/BAT visual checks
- Match existing CSS patterns in `index.css` (no new styling libraries)

## Open Questions Resolved
- New feature (not bug fix): yes
- Business problem: help identify unassigned work
- Color: `#fbdddd` (from Confluence Feature-2)
- Scope: ticket list page only — yes
- Hover: keep `#fbdddd` — yes
- Data shape changes: none — ruled out
- Feature name / services: `highlight-unassigned-ticket-row`, frontend only
