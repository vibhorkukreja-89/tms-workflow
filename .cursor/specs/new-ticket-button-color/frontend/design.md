# Design: Change New ticket button color

## Overview
Restyle the homepage **New ticket** button to purple (`#8957e5` default, `#7340d4` hover/active) so it matches the Feature-1 intent. Scope is frontend-only and limited to that control so other primary actions keep the existing teal styling.

## Current State
- `/` renders `TicketListPage` via `App.tsx`
- New ticket CTA: `Link` to `/tickets/new` with `className="btn btn-primary"` in `TicketListPage.tsx`
- Shared styles in `index.css`: `--primary` / `--primary-hover` (teal) drive `.btn-primary`
- Same `btn-primary` class is used by Create submit, Comment submit, and Detail Save changes

## Proposed Changes
> 📋 **[TAT-2 — [FE] Change New ticket button color on homepage](https://mytestingai.atlassian.net/browse/TAT-2)**

- Replace `btn-primary` on the homepage New ticket `Link` with a dedicated class (keep `btn` for shared chrome)
- Add scoped CSS for default `#8957e5` and hover/active `#7340d4`
- Leave `--primary` and `.btn-primary` unchanged

## Architecture / Flow
```
User → GET /
     → TicketListPage
     → New ticket Link (.btn + .btn-new-ticket)
     → CSS: #8957e5 / hover #7340d4
     → click → /tickets/new (unchanged)

Other primary actions → .btn-primary → teal (unchanged)
```

## Data Shape Changes
N/A — no changes to data shapes in this feature

## Integration Contracts
N/A — single-service (`frontend`) change; no BE↔FE contract impact

## Test Approach
> 📋 **[TAT-2 — [FE] Change New ticket button color on homepage](https://mytestingai.atlassian.net/browse/TAT-2)**

- No frontend test runner in package scripts today
- SIT/BAT visual checks map to story ACs: default purple, hover purple, navigation still works, Create/Comment/Save stay teal
- If a harness is added during implementation, assert the dedicated class on the New ticket control

## Key Decisions
- Dedicated class over changing `--primary` — avoids regressing shared primary buttons
- Hover hex `#7340d4` chosen as a darker purple derived from `#8957e5` (not specified in Feature-1)

## Open Questions
None
