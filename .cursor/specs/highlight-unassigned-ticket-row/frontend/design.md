# Design: Highlight unassigned ticket row

## Overview
Highlight unassigned ticket rows on the ticket list page with background `#fbdddd` (including hover) so agents can identify unassigned work faster. Frontend-only change; no API or data-model updates.

## Current State
- Route `/` → `TicketListPage` → `useTickets` → `listTickets` (`GET /api/tickets`)
- Each row is `TicketCard` with fixed `className="ticket-row"`
- Unassigned already shown as `ticket.assignedTo?.name ?? 'Unassigned'`; `assignedTo` is `UserSummary | null`
- Styles in `index.css`: `.ticket-row` and `.ticket-row:hover` (`#f8fafc`)
- `TicketCard` is used only on the ticket list page

## Proposed Changes
> 📋 **[TAT-3 — [FE] Highlight unassigned rows on ticket list](https://mytestingai.atlassian.net/browse/TAT-3)**

- When `ticket.assignedTo == null`, add modifier class `ticket-row--unassigned` on the row `Link` in `TicketCard`
- CSS: background `#fbdddd` for `.ticket-row--unassigned` and `.ticket-row--unassigned:hover` so hover does not fall through to `#f8fafc`
- Assigned rows unchanged; detail/create pages unaffected (no `TicketCard`)

## Architecture / Flow
```
TicketListPage (/)
  └─ useTickets → listTickets
       └─ TicketCard(ticket)
            ├─ assignedTo == null → class "ticket-row ticket-row--unassigned"
            └─ assignedTo set   → class "ticket-row"
                 └─ index.css applies #fbdddd (+ hover) only for --unassigned
```

## Data Shape Changes
N/A — no changes to data shapes in this feature. Existing `Ticket.assignedTo` is sufficient.

## Integration Contracts
N/A — single-service (`frontend`) change; no BE↔FE contract changes.

## Test Approach
> 📋 **[TAT-3 — [FE] Highlight unassigned rows on ticket list](https://mytestingai.atlassian.net/browse/TAT-3)**

- Static assert script (same pattern as `assert-new-ticket-button.mjs`): unassigned class contract on `TicketCard` + CSS contains `#fbdddd` and unassigned hover rule
- SIT/BAT visual checks mapped to story ACs (highlight, hover, assigned unchanged, detail/create unaffected, click/navigation, filters)
- No React unit harness today — intentionally not adding a new test framework for this change

## Key Decisions
1. Modifier class on `TicketCard` rather than inline styles — matches existing CSS patterns and prior scoped CTA approach
2. Predicate `assignedTo == null` — matches displayed “Unassigned” label
3. Explicit unassigned hover rule — required so `.ticket-row:hover` does not wash out `#fbdddd`
4. List-only by construction — `TicketCard` is only used on the list page

## Open Questions
None — requirements and hover colour confirmed.
