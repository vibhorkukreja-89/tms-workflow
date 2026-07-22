# Requirements: Change New ticket button color

## What we're building
Restyle the homepage **New ticket** button to background `#8957e5` with hover/active `#7340d4`, without changing other primary buttons in the app.

## Functional Requirements
1. On the homepage ticket list (`/`), the **New ticket** control must use background color `#8957e5` in its default state.
2. On hover and active states, that same control must use background color `#7340d4`.
3. The control must remain a navigational link to `/tickets/new` with label **New ticket**.
4. Other primary actions that use `btn-primary` (Create ticket submit, comment submit, Save changes on ticket detail) must retain the existing teal primary styling (`--primary` / `.btn-primary`).
5. Shared `.btn` layout/chrome may be reused; the purple colors must be applied via a dedicated class (or equivalent scoped style), not by changing global `--primary` or `.btn-primary`.

## Fit
- Entry: `TicketListPage` rendered at `/` via `App.tsx`
- Modify: `frontend/src/pages/TicketListPage.tsx` — add dedicated class on the New ticket `Link` (alongside or instead of `btn-primary` for color)
- Modify: `frontend/src/index.css` — scoped default, hover, and active rules for that class
- Reuse: existing `.btn` for sizing/layout; leave `--primary` and `.btn-primary` unchanged

## Regression Surface
- At risk if mishandled: all `.btn-primary` consumers (Create, Comment, Detail Save)
- Not at risk when scoped correctly: routing, ticket list filtering/search, backend APIs
- No BE↔FE contract changes

## Constraints
- Frontend only — no API, Prisma, auth, or feature-toggle changes
- No new TypeScript types or shared FE/BE contracts
- No frontend test runner in package scripts today; verification via lint/build plus SIT/BAT visual checks (add automated coverage if a harness is introduced during implementation)
- Match existing CSS patterns in `index.css` (no new styling libraries)

## Open Questions Resolved
- Scope: homepage New ticket button only — yes
- Hover/active: purple family — yes; hex `#7340d4`
- Default color: `#8957e5` (from Confluence Feature-1)
- Global primary token change: rejected in favour of dedicated class
