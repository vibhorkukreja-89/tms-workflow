# SDLC Orchestrator — Cursor Conversion Design

**Date:** 2026-07-22  
**Status:** Approved approach (pending user review of this written spec)  
**Approach:** A — Skills-first orchestrator  
**Source:** `kiro/` steering + skills (to be deleted after conversion)

---

## Goal

Convert the Kiro-based 9-phase feature delivery lifecycle into Cursor project skills and rules for the TMS repo (`backend` + `frontend`), preserving the full Atlassian lifecycle (Jira + Confluence via MCP), while removing all Kiro / Tabcorp / Props / Tops / Promos / Generosity / Studbook / PPT branding and coupling.

---

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| Approach | Skills-first: orchestrator skill + one skill per phase + always-on code-standards rule |
| Atlassian | Full lifecycle — create Jira stories + Confluence design pages via MCP |
| Jira | `https://mytestingai.atlassian.net` · project key `TAT` |
| Confluence | Same site · space TAT · homepageId `557233` |
| Custom fields | Discover at runtime via MCP (do not hardcode field IDs) |
| Studbook | Replace with agent-only second-pass analysis + gap report |
| Artefact root | Everything under `.cursor/` |
| Spec layout | `.cursor/specs/<feature>/{backend,frontend}/` |
| Story tags | `[BE]` / `[FE]` / `[BE + FE]` / `[QA]` |
| Branch naming | `TAT-<ticket>-short-description` |
| Old source | Delete `kiro/` after conversion |
| Local runbooks | Point to root `README.md` (no separate local-dev steering files) |

---

## Target layout

```
.cursor/
  rules/
    code-standards.mdc                 # alwaysApply: true
  skills/
    sdlc-orchestrator/
      SKILL.md                         # master workflow; phase gates; session handover
    session-template.md                # reference only — not a skill
    current-state-analyst/SKILL.md
    requirements-gatherer/SKILL.md
    jira-story-creator/SKILL.md
    confluence-design-page/SKILL.md
    task-breakdown/SKILL.md
    implementation/SKILL.md
    sit-and-evidence/SKILL.md
    definition-of-done/SKILL.md
    defect-fix/SKILL.md
  sessions/                            # runtime: <feature>-session.md
  gap-report/                          # runtime: <feature>-analysis.md + README.md
  specs/
    <feature-name>/
      backend/
        requirements.md
        design.md
        tasks.md
      frontend/
        requirements.md
        design.md
        tasks.md
```

Only create `backend/` or `frontend/` subfolders for services actually impacted by the feature.

---

## Cursor mapping

| Former Kiro concept | Cursor target |
|---------------------|---------------|
| `#sdlc-orchestrator` steering | `.cursor/skills/sdlc-orchestrator/SKILL.md` |
| `#code-standards` steering | `.cursor/rules/code-standards.mdc` (`alwaysApply: true`) |
| `.kiro/skills/01–09-*.md` | `.cursor/skills/<name>/SKILL.md` |
| `.kiro/skills/session-template.md` | `.cursor/skills/session-template.md` |
| `.kiro/sessions/` | `.cursor/sessions/` |
| `.kiro/gap-report/` | `.cursor/gap-report/` |
| `<service>/.kiro/specs/<feature>/` | `.cursor/specs/<feature>/{backend\|frontend}/` |
| `#skill-name` load syntax | Read corresponding `.cursor/skills/<name>/SKILL.md` in full |
| Kiro built-in spec UI warnings | Remove; use conversational Cursor agent only |
| Studbook MCP | Agent-only second-pass (see Phase 1) |
| `generosity-workspace.code-workspace` | Hardcode TMS services: `backend`, `frontend` (or discover from repo layout) |
| `mcp-atlassian` | Use configured Atlassian MCP; discover tools/schemas at runtime |
| Missing `local-dev-*.md` | Use root `README.md` for how to run backend/frontend locally |

---

## Orchestrator behaviour

### Invocation

Triggers include: “Run the SDLC Orchestrator”, “Start feature delivery”, “SDLC workflow for \<feature\>”.

On load, acknowledge with:

> I'm running the **SDLC Orchestrator** workflow. I'll follow the delivery lifecycle using the skills in `.cursor/skills/` — starting with `current-state-analyst`. Let's go.

### Non-negotiable rules (preserved)

1. **Session handover** — start: resume from `.cursor/sessions/*-session.md` if present; end: always write/update session file using `session-template.md`.
2. **Skill loading** — at the start of every phase, read the corresponding `SKILL.md` in full before acting.
3. **Phase transparency** — announce: `Reading <skill>/SKILL.md — following Step N: [name].`
4. **Phase boundaries** — do not advance until user explicitly confirms (“confirmed”, “proceed”, “looks good”). Clarifications stay in-phase.
5. **Open questions** — track unanswered questions; do not proceed until the full set is answered.

### Phases

| Phase | Skill | Output |
|-------|-------|--------|
| 1 Current State | `current-state-analyst` | Session file + gap report |
| 2 Requirements | `requirements-gatherer` | `.cursor/specs/<feature>/{svc}/requirements.md` |
| 3 Jira Stories | `jira-story-creator` | TAT stories + test-case comments |
| 4 Confluence Design | `confluence-design-page` | Design page + `design.md` per service |
| 5 Task Breakdown | `task-breakdown` | `tasks.md` per service (parked for review) |
| 6 Implementation | `implementation` | TDD tasks complete, PR-ready |
| 7 SIT + Evidence | `sit-and-evidence` | Evidence on Jira, BAT, transitions |
| 8 Definition of Done | `definition-of-done` | Checklist + session closed |
| 9 Defect Fix | `defect-fix` | Slip report, failing test, fix, Jira update |

Phase 6 still asks about artefact review outcome before coding. Phase 9 is triggered by a SIT defect ticket key.

---

## Phase-specific adaptations

### Phase 1 — Current state + agent second pass

- Scope to `backend` and/or `frontend` (max 2 without explicit confirmation — already the full TMS surface).
- If user provides a Confluence URL, extract page ID and fetch via Atlassian MCP (not web fetch).
- After user confirms findings, write session file.
- **Second pass (replaces Studbook):** re-read scoped code with a focused blast-radius checklist (shared types, API contracts between BE/FE, Prisma schema, auth paths, tests). Present gaps / conflicts / confirmed vs first pass.
- Write `.cursor/gap-report/<feature>-analysis.md` and maintain `.cursor/gap-report/README.md`.
- If second pass is skipped by user choice, note that in the session file and continue only if user agrees.

### Phase 2 — Requirements

- Drop Generosity/Props package and Kafka-centric examples.
- Data-shape checks focused on: Prisma models, API request/response types, shared FE/BE contracts, auth/role rules.
- Write requirements under `.cursor/specs/<feature>/{backend|frontend}/requirements.md`.

### Phase 3 — Jira

- Project `TAT`; base URL `https://mytestingai.atlassian.net`.
- Before first create: discover Acceptance Criteria and Story Points field IDs via MCP (list issue create metadata / fields). Cache discovered IDs in the session file for the rest of the feature.
- Story title prefixes: `[BE]`, `[FE]`, `[BE + FE]`, `[QA]`.
- Keep description structure (Impact Analysis, Before/After, Testing Note) and test-case comment format.
- Epic key required before create.

### Phase 4 — Confluence

- Parent: requirements/change-request page from session context (or TAT space homepage if none).
- Same section structure as before; Integration Contracts for BE↔FE HTTP/API (not Kafka-first).
- Browseable URLs use `/wiki/spaces/...`.
- Inline story links: `https://mytestingai.atlassian.net/browse/TAT-XXXX`.
- Write `design.md` per impacted service under `.cursor/specs/...`.

### Phase 5 — Tasks

- Derive from design.md sections; TDD ordering rules preserved.
- Paths in session file point to `.cursor/specs/<feature>/{svc}/tasks.md`.
- Jira references use `TAT-XXXX`.

### Phase 6 — Implementation

- Supervised TDD; one task at a time; SME confirmation gates.
- Working directory = `backend/` or `frontend/`; use package scripts from that package (`npm test`, `npm run lint` if present).
- Node: prefer `.nvmrc` if present; otherwise README Node 20+ guidance.
- Git: branch off default branch as `TAT-<ticket>-short-description`.
- Local run: follow root `README.md`.
- Code review: against `.cursor/rules/code-standards.mdc` (agent review in-session; no external Kiro agent).
- Remove Props/Promotions/mocha-specific test recipes; use this repo’s actual test runners (Jest/Vitest/etc. as defined in each package).

### Phase 7–8 — SIT / DoD

- Unchanged process; Jira URLs and ticket keys use TAT.
- DoD checklist paths updated to `.cursor/` artefacts.

### Phase 9 — Defect fix

- Load defect + linked user story; find session by story key under `.cursor/sessions/`.
- Slip report → failing test → fix → lint/tests → Jira comment + transition → Defect Record in session.

---

## Code standards rule

Convert `kiro/steering/code-standards.md` into `.cursor/rules/code-standards.mdc` with `alwaysApply: true`.

Adaptations:
- Keep architecture-fit, function design, JSDoc-why, error handling, no dead code, TDD, organisation guidance.
- Remove TAB/Melbourne token example; use TMS-relevant JSDoc examples (tickets, comments, auth).
- Logging examples: ticket created/updated, not campaign/token.
- Drop lodash mandate unless the TMS packages already use it — prefer “match existing project dependencies”.
- Coverage targets: keep as team targets unless README/tests say otherwise.

---

## Session template adaptations

- Paths: `.cursor/sessions/<feature>-session.md`
- Replace **Studbook Cross-Reference** with **Second-Pass Analysis** (same subsections: summary, gaps, conflicts, confirmed)
- Jira keys: `TAT-XXXX`
- Confluence URL: `https://mytestingai.atlassian.net/wiki/spaces/...`
- Tasks paths: `.cursor/specs/<feature>/{backend|frontend}/tasks.md`
- Status value `complete (studbook cross-referenced)` → `complete (second-pass cross-referenced)`

---

## Content scrub checklist (must not appear in Cursor artefacts)

- Kiro, `.kiro`, `#sdlc-orchestrator` Kiro load syntax as product name
- Tabcorp, tabcorp.atlassian.net, `@tabdigital`
- Props, Tops, Promos, Promotions, Offer Manager/Engine, Generosity
- Studbook, studbook-trainer MCP
- PPT project key / PPT-XXXX (except historical notes in this design doc)
- Service examples: `service-props-offer-engine`, `api-service-promotions`, etc.

---

## Implementation plan (high level)

1. Create `.cursor/` directory tree (skills, rules, empty sessions/gap-report with README stubs as needed).
2. Write `code-standards.mdc`.
3. Write `session-template.md`.
4. Write `sdlc-orchestrator/SKILL.md`.
5. Convert each phase skill 01→09 into `SKILL.md` with scrubbed content and new paths.
6. Add `.cursor/gap-report/README.md` table stub.
7. Delete `kiro/` entirely.
8. Optionally note SDLC usage in root README (only if user wants — default: skip unless asked).

---

## Out of scope

- Configuring Atlassian MCP credentials (assumed available in Cursor MCP settings).
- Creating real Jira/Confluence content as part of this conversion.
- Changing TMS application code.
- Committing unless explicitly requested.

---

## Success criteria

- Invoking the orchestrator skill drives the 9-phase flow with confirmation gates.
- All artefact paths resolve under `.cursor/`.
- Jira/Confluence skills target `mytestingai` / `TAT` with runtime field discovery.
- No scrubbed brand/product terms remain under `.cursor/`.
- `kiro/` is gone.
- Code standards apply automatically via rule.

---

## Spec self-review

- [x] No unresolved placeholders for locked decisions
- [x] Paths consistent (`.cursor/specs/<feature>/{backend|frontend}/`)
- [x] Studbook replacement specified
- [x] Custom field discovery specified
- [x] Delete `kiro/` specified
- [x] Scope limited to Cursor skills/rules/artefact layout (no app code changes)
)
