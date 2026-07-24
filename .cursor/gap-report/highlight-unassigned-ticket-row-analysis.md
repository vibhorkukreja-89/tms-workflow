# Feature-2: Highlight unassigned ticket row — Analysis Intelligence Report

## Feature
**Jira:** [TAT-3](https://mytestingai.atlassian.net/browse/TAT-3) (Epic [TAT-1](https://mytestingai.atlassian.net/browse/TAT-1))
**Confluence:** [Feature-2: Highlight the row in ticket list for unassigned](https://mytestingai.atlassian.net/wiki/spaces/TAT/pages/2162689/Feature-2+Highlight+the+row+in+ticket+list+for+unassigned)
**One-liner:** On the ticket list page only, highlight unassigned ticket rows with background `#fbdddd` (including hover).
**Service(s):** frontend
**Date:** 2026-07-24
**Author:** Cursor Agent

---

## Agent's Independent Analysis

### What was found
- Homepage list: `TicketListPage` at `/` via `frontend/src/App.tsx`
- Rows: `TicketCard` (`frontend/src/components/TicketCard.tsx`) with fixed `className="ticket-row"`
- Unassigned already surfaced in meta: `ticket.assignedTo?.name ?? 'Unassigned'`
- Types: `Ticket.assignedTo: UserSummary | null`, `assignedToId: string | null` (`frontend/src/types/index.ts`)
- Styles: `.ticket-row` / `.ticket-row:hover` (`#f8fafc`) in `frontend/src/index.css`
- `TicketCard` is only consumed by `TicketListPage`

### Regression surface identified
Assigned rows must stay unchanged; hover can wash out highlight unless overridden; detail/create must not gain the highlight; no backend contract change.

---

## Second-Pass Analysis

### Summary
High-visibility list cue on every ticket-list visit. Failure modes are visual only: missing highlight, hover override to `#f8fafc`, or accidental styling outside the list. Data for the cue already exists on the list API response.

### What the second pass added (gaps the first pass missed)

**Business impact framing:**
Agents scanning the list need unassigned work to stand out. Scope is list-only; wrong global CSS would confuse other screens that show assignee text but are not the ticket list.

**Risk table:**

| Risk | Severity | Mitigation |
|------|----------|------------|
| `.ticket-row:hover` overrides `#fbdddd` | 🔴 | Explicit `.ticket-row--unassigned:hover { background: #fbdddd }` |
| Over-broad CSS affecting non-list UIs | 🟡 | Modifier class only on `TicketCard`; do not style detail/create |
| Predicate mismatch (`assignedTo` vs `assignedToId`) | 🟢 | Use `assignedTo == null` consistent with displayed label |
| No automated UI/style tests | 🟡 | Add static assert script + SIT visual check |

**Cross-team coordination flags:**
- Frontend: implement modifier class + CSS (including hover)
- QA: verify unassigned highlight + hover; verify assigned rows unchanged; verify detail/create unaffected
- Backend: none

**Test case matrix:**

| Case | Input / action | Expected |
|------|----------------|----------|
| Progression | Load `/` with an unassigned ticket | That row background `#fbdddd` |
| Progression | Hover unassigned row | Background remains `#fbdddd` |
| Progression | Unassigned ticket shows meta "Unassigned" | Highlight present |
| Regression | Assigned ticket row | No `#fbdddd`; hover still `#f8fafc` |
| Regression | Filter/search list | Only unassigned visible rows highlighted |
| Regression | Ticket detail / create pages | No unassigned row highlight styling |
| Regression | Click unassigned row | Still navigates to `/tickets/:id` |

**Other gaps (files, functions, API contracts, Prisma models, auth paths, shared types, tests):**
- Confirmed no BE↔FE contract, Prisma, or auth involvement
- Frontend has no unit/e2e harness; prior feature used `frontend/scripts/assert-new-ticket-button.mjs` — same pattern recommended

### Conflicts (first pass and second pass disagreed)
None.

### Confirmed (both agreed)
Scoped frontend-only change on list rows via `TicketCard` + `index.css`; protect assigned-row hover; backend untouched; hover keeps `#fbdddd`.

---

## Impact on Requirements

### Did the second pass change anything?
No — it strengthened risk framing (hover specificity, test strategy) without changing scope.

### What changed
Second pass confirmed the first-pass analysis. No requirement changes. Requirements should still capture: exact hex `#fbdddd`, hover keeps `#fbdddd`, ticket list page only, unassigned = no assignee.

### Final regression surface (after second pass)
- In scope: `TicketCard.tsx` class logic + `index.css` unassigned/hover rules
- At risk if mishandled: assigned-row hover, any future reuse of `TicketCard`
- Out of scope: backend APIs, Prisma, auth, detail/create assignee controls
- QA must run the progression/regression matrix above
