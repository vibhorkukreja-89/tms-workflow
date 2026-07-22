# Feature-1: Change New ticket button color — Analysis Intelligence Report

## Feature
**Jira:** [TAT-2](https://mytestingai.atlassian.net/browse/TAT-2) (Epic [TAT-1](https://mytestingai.atlassian.net/browse/TAT-1))
**Confluence:** [Feature-1: Change the button "New ticket" color](https://mytestingai.atlassian.net/spaces/TAT/pages/983041)
**One-liner:** Set the homepage New ticket button to `#8957e5` with a darker purple hover, without changing other primary buttons.
**Service(s):** frontend
**Date:** 2026-07-22
**Author:** Cursor Agent

---

## Agent's Independent Analysis

### What was found
- Homepage is `TicketListPage` at `/` via `frontend/src/App.tsx`
- New ticket CTA: `Link` with `className="btn btn-primary"` in `frontend/src/pages/TicketListPage.tsx`
- Shared tokens/styles in `frontend/src/index.css` (`--primary`, `--primary-hover`, `.btn-primary`)
- Other `.btn-primary` usages: `CreateTicketPage`, `CommentThread`, `TicketDetailPage` (Save changes)

### Regression surface identified
Changing global primary tokens would recolor all primary actions. Correct approach is a dedicated class scoped to the homepage CTA.

---

## Second-Pass Analysis

### Summary
This is a single-control UI restyle on the ticket list homepage. User-facing impact is limited to that CTA’s appearance; request frequency is every homepage visit. Incorrect global CSS would confuse users on Create / Comment / Save flows by changing unexpected buttons.

### What the second pass added (gaps the first pass missed)

**Business impact framing:**
Homepage CTA is high-visibility. Scope creep into shared `.btn-primary` would create inconsistent branding and unintended visual change across ticket create, comment, and edit flows.

**Risk table:**

| Risk | Severity | Mitigation |
|------|----------|------------|
| Changing `--primary` / `.btn-primary` globally | 🔴 | Dedicated class on New ticket `Link` only |
| Hover shade unspecified in Confluence | 🟡 | Agree darker purple derived from `#8957e5` in requirements |
| No frontend tests for button styling | 🟡 | Add CSS/class assertion test and/or SIT visual check |

**Cross-team coordination flags:**
- Frontend: implement scoped style
- QA: verify homepage CTA color + hover; verify Create/Comment/Detail primary buttons remain teal
- Backend: none

**Test case matrix:**

| Case | Input / action | Expected |
|------|----------------|----------|
| Progression | Load `/` | New ticket button background `#8957e5` |
| Progression | Hover New ticket | Darker purple (same family), not teal |
| Regression | Create ticket submit | Remains teal (`btn-primary`) |
| Regression | Comment submit | Remains teal |
| Regression | Save changes on detail | Remains teal |
| Regression | Click New ticket | Still navigates to `/tickets/new` |

**Other gaps (files, functions, API contracts, Prisma models, auth paths, shared types, tests):**
- Confirmed no BE↔FE contract, Prisma, or auth involvement
- No frontend test harness/scripts today beyond lint/build — test strategy must account for that

### Conflicts (first pass and second pass disagreed)
None.

### Confirmed (both agreed)
Scoped frontend-only change on `TicketListPage` New ticket CTA; protect shared `.btn-primary` consumers; backend untouched.

---

## Impact on Requirements

### Did the second pass change anything?
No — it strengthened risk framing and test cases without changing scope.

### What changed
Second pass confirmed the first-pass analysis. No requirement changes. Requirements should still capture: exact hex `#8957e5`, purple-family hover, homepage-only scope.

### Final regression surface (after second pass)
- In scope: `TicketListPage.tsx` CTA class + `index.css` scoped rules
- At risk if mishandled: all `.btn-primary` buttons
- Out of scope: backend APIs, Prisma, auth
- QA must run the progression/regression matrix above
