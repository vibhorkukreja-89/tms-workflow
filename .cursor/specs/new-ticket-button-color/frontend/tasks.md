# Tasks: Change New ticket button color

## Overview
Frontend-only change: scoped purple styling for the homepage New ticket CTA without altering shared primary buttons.

## Tasks

- [x] 1. Add failing coverage for New ticket CTA class contract
  - Jira: TAT-2 (parent story this task implements)
  - What: Encode that the homepage New ticket control uses a dedicated class (not `btn-primary`) and that Create/Comment/Save stay on `btn-primary`
  - Files: `frontend/scripts/assert-new-ticket-button.mjs`
  - Done when: A failing test (or explicit failing check) asserts the New ticket `Link` class contract before implementation
  - TDD: Write this first; it must fail against current `btn btn-primary` markup

- [x] 2. Apply scoped purple styles to homepage New ticket button
  - Jira: TAT-2 (parent story this task implements)
  - What: Swap `btn-primary` for dedicated class on the New ticket `Link`; add CSS for `#8957e5` / hover-active `#7340d4`; leave global `--primary` / `.btn-primary` unchanged
  - Files: `frontend/src/pages/TicketListPage.tsx`, `frontend/src/index.css`
  - Done when: Default/hover colours match requirements; link still goes to `/tickets/new`; other primary buttons remain teal; task 1 checks pass
  - TDD: Implement only enough to make task 1 pass

## Notes
- Artefact review approved; implementation in progress on branch `TAT-2-new-ticket-button-color`
- Cross-service dependencies: none (frontend only)
- Class contract check: `node scripts/assert-new-ticket-button.mjs` (cwd: frontend)
