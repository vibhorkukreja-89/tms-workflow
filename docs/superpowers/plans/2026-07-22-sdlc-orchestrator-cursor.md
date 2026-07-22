# SDLC Orchestrator Cursor Conversion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `kiro/` SDLC steering + skills into Cursor project skills/rules under `.cursor/`, scrub brand/product terms, then delete `kiro/`.

**Architecture:** Skills-first orchestrator (Approach A). Always-on code-standards rule; one project skill per phase; runtime artefacts under `.cursor/sessions|gap-report|specs`. Content source is `kiro/` files transformed per `docs/superpowers/specs/2026-07-22-sdlc-orchestrator-cursor-design.md`.

**Tech Stack:** Cursor Agent Skills (`SKILL.md` + YAML frontmatter), Cursor Rules (`.mdc`), Markdown artefacts. No application code changes. No new npm dependencies.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-22-sdlc-orchestrator-cursor-design.md`
- Jira: `https://mytestingai.atlassian.net` · project `TAT`
- Confluence: same site · space `TAT` · homepageId `557233`
- Custom fields: discover at runtime via MCP (never hardcode Tabcorp field IDs)
- Story tags: `[BE]` / `[FE]` / `[BE + FE]` / `[QA]`
- Artefacts: `.cursor/sessions/`, `.cursor/gap-report/`, `.cursor/specs/<feature>/{backend,frontend}/`
- Scrub: Kiro, Tabcorp, Props, Tops, Promos/Promotions, Generosity, Studbook, PPT
- Branch naming: `TAT-<ticket>-short-description`
- Local run: root `README.md`
- Services: `backend`, `frontend`
- Delete `kiro/` only after all Cursor files exist and scrub grep is clean
- Do not commit unless user asks

---

## File map

| Path | Responsibility |
|------|----------------|
| `.cursor/rules/code-standards.mdc` | Always-on coding standards |
| `.cursor/skills/sdlc-orchestrator/SKILL.md` | Master 9-phase workflow |
| `.cursor/skills/session-template.md` | Session file schema (reference) |
| `.cursor/skills/*/SKILL.md` | Phase skills (9) |
| `.cursor/sessions/.gitkeep` | Runtime session dir |
| `.cursor/gap-report/README.md` | Gap report index |
| `.cursor/specs/.gitkeep` | Specs root |
| `kiro/` | DELETE after conversion |

---

### Task 1: Scaffold `.cursor/` + code-standards rule

**Files:**
- Create: `.cursor/sessions/.gitkeep`
- Create: `.cursor/specs/.gitkeep`
- Create: `.cursor/gap-report/README.md`
- Create: `.cursor/rules/code-standards.mdc`
- Source: `kiro/steering/code-standards.md`

**Interfaces:**
- Produces: always-on rule path that all implementation skills reference as `.cursor/rules/code-standards.mdc`

- [ ] **Step 1: Create directories and stubs**

```bash
mkdir -p .cursor/rules .cursor/skills .cursor/sessions .cursor/specs .cursor/gap-report
touch .cursor/sessions/.gitkeep .cursor/specs/.gitkeep
```

- [ ] **Step 2: Write gap-report README**

```markdown
# Gap Reports

Analysis intelligence reports from Phase 1 (agent second-pass).

| Report | Jira | Score | Summary |
|--------|------|-------|---------|
```

- [ ] **Step 3: Write `code-standards.mdc`**

Frontmatter:
```yaml
---
description: TMS coding standards for all implementation work
alwaysApply: true
---
```

Body: convert from `kiro/steering/code-standards.md` with:
- JSDoc examples about tickets/comments/auth (not TAB tokens)
- Logging examples: ticket created/updated (not campaign/token)
- Lodash: only if already in package — otherwise “match existing dependencies”
- Keep TDD coverage targets, function size, error handling, no dead code
- No Kiro/Tabcorp/Props/Promos references

- [ ] **Step 4: Verify rule exists**

Run: `test -f .cursor/rules/code-standards.mdc && head -5 .cursor/rules/code-standards.mdc`  
Expected: file exists; YAML has `alwaysApply: true`

---

### Task 2: Session template + SDLC orchestrator

**Files:**
- Create: `.cursor/skills/session-template.md`
- Create: `.cursor/skills/sdlc-orchestrator/SKILL.md`
- Source: `kiro/skills/session-template.md`, `kiro/steering/sdlc-orchestrator.md`

**Interfaces:**
- Consumes: artefact paths from Global Constraints
- Produces: orchestrator that points phase skills to `.cursor/skills/<name>/SKILL.md`

- [ ] **Step 1: Write `session-template.md`**

Adapt template:
- Path `.cursor/sessions/<feature-name>-session.md`
- Replace Studbook section with **Second-Pass Analysis**
- `TAT-XXXX` keys; Confluence `https://mytestingai.atlassian.net/wiki/...`
- Tasks: `.cursor/specs/<feature-name>/{backend|frontend}/tasks.md`
- Status: `complete (second-pass cross-referenced)`

- [ ] **Step 2: Write `sdlc-orchestrator/SKILL.md`**

Frontmatter:
```yaml
---
name: sdlc-orchestrator
description: >-
  Orchestrates the full TMS feature delivery lifecycle from current-state
  analysis through definition of done and SIT defect fixes. Use when the user
  asks to run the SDLC Orchestrator, start feature delivery, or follow the
  9-phase delivery workflow.
---
```

Body must include:
- Exact start acknowledgement (Cursor paths, start with `current-state-analyst`)
- Session handover rules → `.cursor/sessions/`
- Skill loading + phase transparency + phase boundaries + open questions rules
- Phases 1–9 pointing at `.cursor/skills/<name>/SKILL.md`
- Supporting rule: `.cursor/rules/code-standards.mdc`
- No Kiro built-in spec UI language; no Generosity/Tabcorp

- [ ] **Step 3: Verify**

Run: `rg -n "kiro|Tabcorp|Studbook|PPT-|Props|Promo" .cursor/skills/sdlc-orchestrator .cursor/skills/session-template.md || true`  
Expected: no matches

---

### Task 3: Phase skills 1–2 (current-state + requirements)

**Files:**
- Create: `.cursor/skills/current-state-analyst/SKILL.md`
- Create: `.cursor/skills/requirements-gatherer/SKILL.md`
- Source: `kiro/skills/01-current-state-analyst.md`, `02-requirements-gatherer.md`

**Interfaces:**
- Consumes: `session-template.md`, services `backend`/`frontend`
- Produces: session + gap-report; requirements under `.cursor/specs/<feature>/{svc}/`

- [ ] **Step 1: Write `current-state-analyst/SKILL.md`**

Key adaptations:
- Step 1: present services `backend`, `frontend` (no workspace file required)
- Confluence via Atlassian MCP; example host `mytestingai.atlassian.net`
- Session path `.cursor/sessions/`
- Replace Studbook steps with **agent-only second-pass** checklist (API contracts BE↔FE, Prisma, auth, shared types, tests)
- Gap report → `.cursor/gap-report/<feature>-analysis.md`; author default `"Cursor Agent"`
- Jira links in README rows → `TAT-XXXX` / mytestingai browse URLs

- [ ] **Step 2: Write `requirements-gatherer/SKILL.md`**

Key adaptations:
- Read session + `.cursor/rules/code-standards.mdc`
- Second-pass findings replace Studbook references
- Data-shape checks: Prisma, API types, FE/BE contracts (no `@tabdigital/props-shared-definitions`, no Kafka-first)
- Write to `.cursor/specs/<feature-name>/{backend|frontend}/requirements.md`

- [ ] **Step 3: Scrub verify**

Run: `rg -n "kiro|Tabcorp|Studbook|PPT-|Props|Promo|Generosity" .cursor/skills/current-state-analyst .cursor/skills/requirements-gatherer || true`  
Expected: no matches

---

### Task 4: Phase skills 3–5 (Jira, Confluence, tasks)

**Files:**
- Create: `.cursor/skills/jira-story-creator/SKILL.md`
- Create: `.cursor/skills/confluence-design-page/SKILL.md`
- Create: `.cursor/skills/task-breakdown/SKILL.md`
- Source: `kiro/skills/03-*.md`, `04-*.md`, `05-*.md`

**Interfaces:**
- Consumes: session requirements; Atlassian MCP
- Produces: TAT stories; Confluence page; `tasks.md` paths under `.cursor/specs/`

- [ ] **Step 1: Write `jira-story-creator/SKILL.md`**

- Setup: Jira `https://mytestingai.atlassian.net`, project `TAT`
- **Before first create:** discover AC + Story Points field IDs via MCP create-metadata/fields; store in session file under a `Jira Field IDs` note
- Do not hardcode `customfield_10064` / `10058` as required — use discovered IDs (may document as “example only if discovery finds them”)
- Abbreviations table: BE=backend, FE=frontend, QA=QA
- Tags: `[BE]`, `[FE]`, `[BE + FE]`, `[QA]`
- Epic example: `TAT-123`
- AC examples: TMS ticket/comment language (not proposition tokens)

- [ ] **Step 2: Write `confluence-design-page/SKILL.md`**

- Confluence base `https://mytestingai.atlassian.net`
- Parent from session URL; if none, TAT space homepage (`homepageId=557233`) as fallback after asking user
- Integration Contracts: HTTP API BE↔FE (not Kafka-first)
- Paths: `.cursor/specs/<feature>/{backend|frontend}/design.md`
- Story links: `https://mytestingai.atlassian.net/browse/TAT-XXXX`

- [ ] **Step 3: Write `task-breakdown/SKILL.md`**

- Read `.cursor/specs/<feature>/{svc}/{requirements,design}.md`
- Jira: `TAT-XXXX`
- Cross-service deps: backend ↔ frontend
- Write `.cursor/specs/<feature>/{svc}/tasks.md`
- Session Tasks section uses those paths

- [ ] **Step 4: Scrub verify**

Run: `rg -n "kiro|Tabcorp|Studbook|PPT-|Props|Promo|Generosity" .cursor/skills/jira-story-creator .cursor/skills/confluence-design-page .cursor/skills/task-breakdown || true`  
Expected: no matches

---

### Task 5: Phase skills 6–9 (implementation through defect-fix)

**Files:**
- Create: `.cursor/skills/implementation/SKILL.md`
- Create: `.cursor/skills/sit-and-evidence/SKILL.md`
- Create: `.cursor/skills/definition-of-done/SKILL.md`
- Create: `.cursor/skills/defect-fix/SKILL.md`
- Source: `kiro/skills/06-*.md` … `09-*.md`

**Interfaces:**
- Consumes: tasks.md, code-standards rule, README for local run
- Produces: implemented tasks, Jira evidence, DoD closeout, defect records

- [ ] **Step 1: Write `implementation/SKILL.md`**

- Replace “Kiro” with agent; load `.cursor/rules/code-standards.mdc`
- cwd: absolute path to `backend/` or `frontend/`
- Tests: backend `npm test` (Jest); frontend has `lint` (`oxlint`) — use package scripts that exist; do not invent mocha/promotions recipes
- Git branch: `TAT-<ticket>-short-description` off default branch
- Local run: root `README.md`
- Code review against code-standards rule (in-session review, not external Kiro agent)
- Remove Props/Promotions-specific guidance entirely

- [ ] **Step 2: Write `sit-and-evidence/SKILL.md`**

- Session under `.cursor/sessions/`
- Keep SIT evidence + BAT comment formats
- Route back to `implementation` skill by name (not `#implementation` Kiro hash)

- [ ] **Step 3: Write `definition-of-done/SKILL.md`**

- Checklist paths under `.cursor/`
- Status block completion unchanged in structure

- [ ] **Step 4: Write `defect-fix/SKILL.md`**

- Example keys `TAT-XXXX`
- Session scan `.cursor/sessions/`
- Specs under `.cursor/specs/<feature>/{svc}/`
- Local run via README; branch `TAT-<ticket>-…`
- Code standards path `.cursor/rules/code-standards.mdc`

- [ ] **Step 5: Scrub verify all phase skills**

Run: `rg -n "kiro|Tabcorp|Studbook|PPT-|Props|Promo|Generosity|Offer Engine|Offer Manager" .cursor/skills || true`  
Expected: no matches

---

### Task 6: Delete `kiro/` + final verification

**Files:**
- Delete: `kiro/` (entire tree including `steering/local-dev`)

- [ ] **Step 1: Confirm Cursor tree complete**

Run:
```bash
find .cursor/skills -name 'SKILL.md' | sort
test -f .cursor/rules/code-standards.mdc
test -f .cursor/skills/session-template.md
```
Expected: 10 SKILL.md files (orchestrator + 9 phases) + rule + session-template

- [ ] **Step 2: Full scrub of `.cursor/`**

Run: `rg -ni "kiro|tabcorp|studbook|\bPPT\b|props|tops|promo|generosity" .cursor || true`  
Expected: no matches (case-insensitive)

- [ ] **Step 3: Delete `kiro/`**

```bash
rm -rf kiro
```

- [ ] **Step 4: Confirm deletion**

Run: `test ! -d kiro && ls .cursor/skills`  
Expected: `kiro` gone; skills listed

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Layout under `.cursor/` | 1 |
| code-standards always-on | 1 |
| session-template + orchestrator | 2 |
| Agent second-pass + gap-report | 1, 3 |
| Requirements/specs subfolders | 3 |
| Jira TAT + runtime field discovery | 4 |
| Confluence TAT + design.md | 4 |
| Task breakdown paths | 4 |
| Implementation/SIT/DoD/defect | 5 |
| Scrub list | 2–6 |
| Delete `kiro/` | 6 |

## Placeholder scan

None intentional. Commit steps omitted per user rule (commit only when asked).
)
