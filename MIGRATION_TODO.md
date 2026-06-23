# Migration TODO: Template Generalization

Tracker for the migration described in `TEMPLATE_GENERALIZATION_PLAN.md`.
This file is repo-maintenance-only and must **not** be included in the npm package.

## Current Phase

Phase 0: Baseline And Guardrails — Task 1 complete.

## Task Checklist

### Phase 0: Baseline And Guardrails

- [x] Task 1: Record Migration Tail And Baseline State
  - [x] `MIGRATION_TODO.md` exists.
  - [x] `MIGRATION_TODO.md` excluded from npm package files.
  - [x] `git status --short` recorded.
  - [x] `npm test` baseline captured with failure reason.
  - [x] `./bin/check-demo .` baseline captured.

### Phase 1: Source Isolation

- [x] Task 2: Move Week-Report Source Material Into Reference And Example Layers
  - [x] Old `docs/original-*/week-report/` directories removed.
  - [x] `docs/reference/week-report/README.md` created.
  - [x] `examples/week-report-app/` created from `templates/flask-adminlte-week-report/`.
  - [x] Old paths verified absent from filesystem.
  - [ ] Residual text references in generated-facing files to be cleaned in later tasks:
    - `README.md`, `AGENTS.md` -> Task 13
    - `bin/check-demo`, `bin/self-test` -> Task 11, Task 12
    - `templates/docs/tech-plan.md` -> Task 6
    - `skills/template-adapter/SKILL.md` -> Task 7 (skill renamed)
    - `skills/tech-plan-generator/SKILL.md` -> Task 9
- [x] Task 3: Lock The NPM Package Boundary
  - [x] `package.json files` updated to generated-facing assets only.
  - [x] `docs/reference/`, `examples/`, `MIGRATION_TODO.md`, `TEMPLATE_GENERALIZATION_PLAN.md` excluded.
  - [x] `npm pack --dry-run` / tarball inspection confirms exclusions.

### Phase 2: Generated Foundations

- [x] Task 4: Add Template Pattern Registry
  - [x] `docs/template-patterns/README.md` with Read Order, Core Rule, Pattern Names, Forbidden Source Copy.
  - [x] Pattern docs with fixed English anchors and no forbidden terms.
  - [x] Operation-flow and page-component patterns cover standard generated docs.
- [x] Task 5: Build The Neutral Flask Admin Shell
  - [x] `templates/flask-admin-shell/` created with app.py, workflow_adapter.py, requirements.txt, templates, assets.
  - [x] Shell starts locally and shows login/dashboard.
  - [x] `/api/workflow/demo` diagnostic endpoint present but not in primary loop.
  - [x] No week-report wording in shell files.
- [x] Task 6: Update Standard Generated Documents
  - [x] `templates/docs/test-cases.md` created.
  - [x] `templates/docs/requirements.md` updated with required anchors.
  - [x] `templates/docs/tech-plan.md` updated with Reference Patterns, Generated Files Plan, Data Storage Decision, Changed Decisions.
  - [x] `templates/docs/workflow-integration.md` covers business endpoint, errors, switching, test examples.
  - [x] `templates/docs/test-report.md` remains implementation-phase output.

### Phase 3: Agent Workflow Skills

- [x] Task 7: Rename Template Adapter To Shell Implementation
  - [x] `skills/template-adapter/` renamed to `skills/shell-implementation/`.
  - [x] SKILL.md updated to implementation-from-frozen-docs scope.
  - [x] No old skill name or week-report instance terms.
- [x] Task 8: Update Clarification Skills For One-Question Baseline Building
  - [x] `grilling` asks one Mom-Test-style blocking question at a time.
  - [x] Answer types and baseline sufficient gate defined.
  - [x] `question-refiner` and `ce-brainstorm` hand off next best blocking question.
- [x] Task 9: Update Tech Plan Generation To Use Patterns
  - [x] `tech-plan-generator` outputs Reference Patterns, Generated Files Plan, Data Storage Decision, Changed Decisions.
  - [x] Decision-change stop rule added.

### Phase 4: Generator And Readiness Gates

- [x] Task 10: Update demo-ai-app Generated Project Copy Rules
  - [x] Generated app copies `templates/flask-admin-shell/` and `docs/template-patterns/`.
  - [x] Generated app includes `docs/test-cases.md` and `skills/shell-implementation/`.
  - [x] Generated README describes PDCA flow and skeleton/full readiness split.
- [x] Task 11: Add check-demo Skeleton Mode And Source-Copy Detectors
  - [x] `./bin/check-demo --skeleton .` checks structure and forbids source-copy residue.
  - [x] Full mode checks completed docs and primary loop.
  - [x] Kit repo check still passes.
- [x] Task 12: Update Self-Test For Skeleton Generation
  - [x] `npm test` passes.
  - [x] Self-test validates skeleton, placeholder failure, and full-mode pass.

### Phase 5: Public Docs And Final Validation

- [x] Task 13: Update README, AGENTS, Prompt Routing, And Workflow Copy
  - [x] README updated to neutral shell + patterns.
  - [x] AGENTS default workflow uses `shell-implementation` and Clarification Workflow.
  - [x] `prompts/opencode-entry.md` routes into revised clarification chain.
- [x] Task 14: Run Package And Generated Skeleton Verification
  - [x] `npm test` passes.
  - [x] `./bin/check-demo --skeleton` passes on fresh generated app.
  - [x] Full `check-demo` fails only on expected placeholders.
  - [x] `npm pack --dry-run` excludes reference/example/migration docs.
- [ ] Task 15: Human-Review Three Document Generation Samples
  - [ ] Sample 1: 社区报修
  - [ ] Sample 2: 合同风险审核
  - [ ] Sample 3: 设备巡检派单

## Baseline State (captured before directory moves)

### Dirty Worktree

Uncommitted changes already present before migration work begins. These must be
preserved and not accidentally folded into the migration commits.

```text
 M .gitignore
 M TEMPLATE_GENERALIZATION_PLAN.md
 M bin/check-demo
 M bin/demo-ai-app
 M bin/self-test
 M skills/tech-plan-generator/SKILL.md
 M skills/template-adapter/SKILL.md
 M templates/docs/tech-plan.md
```

Note: these edits are pre-existing work-in-progress and are **not** part of the
migration's file-move operations. Treat them as a separate changeset.

### npm test Baseline

Command: `npm test` (runs `node bin/self-test`)

Result: **FAIL**

Reason: the generated project still copies the week-report template and fails
the `no unrelated weekly-report wording in generated app` gate in `bin/check-demo`.
This is the exact problem the migration is meant to solve.

Key failure excerpt:

```text
FAIL: no unrelated weekly-report wording in generated app
.../templates/settings/announcements.html:117: 新增项目管理周报模板
.../templates/dashboard/index.html:111: 本周分部门周报应填写统计
.../templates/reports/pending.html:3: 待我填报 - 周报管理系统
.../assets/app.js:251: 周报填报和查看
```

### Kit Repo Readiness Baseline

Command: `./bin/check-demo .`

Result: **PASS**

The kit repository itself passes readiness checks. The `no unrelated
weekly-report wording in generated app` check is intentionally skipped for the
kit repo because the source template is allowed to keep week-report wording.

### Package Boundary Baseline

Command: `npm pack --dry-run` (and tarball inspection)

Result: **OK — migration/reference/example items excluded**

Verified that the following are not in the produced tarball:

- `MIGRATION_TODO.md`
- `TEMPLATE_GENERALIZATION_PLAN.md`
- `docs/reference/`
- root `examples/`
- `templates/flask-adminlte-week-report/`

### Next Step

Proceed to Task 2: move week-report source material into reference/example layers.
Do this as a standalone commit so the directory renames remain reviewable and do
not absorb the unrelated dirty changes listed above.
