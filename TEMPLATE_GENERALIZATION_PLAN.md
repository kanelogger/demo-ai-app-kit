# Implementation Plan: Template Generalization Migration

## Overview

把当前“周报实例模板”迁移成“模式驱动的 PC 后台应用生成链路”。V1 不追求自动生成完整业务系统，也不把浏览器端到端验收作为迁移 gate。V1 的核心验收是：Agent 能通过一问一答澄清业务，并生成贴合业务、可实现、可验收的 `docs/requirements.md`、`docs/tech-plan.md`、`docs/workflow-integration.md`、`docs/test-cases.md`。

目标链路：

```text
business input
-> one-question-at-a-time grilling
-> docs/requirements.md
-> docs/tech-plan.md
-> docs/workflow-integration.md
-> docs/test-cases.md
-> later implementation from shell + patterns
```

## V1 Scope

In scope:

- 隔离周报 source/reference/example，不再作为 generated project 或 npm package 的默认生成源。
- 新增中性 `templates/flask-admin-shell/`，作为 generated project 的唯一应用骨架。
- 新增 `docs/template-patterns/`，把周报实例沉淀成可复用 PC 后台模式。
- 更新标准文档骨架，新增 `templates/docs/test-cases.md`。
- 把 `skills/template-adapter/` 物理改名为 `skills/shell-implementation/`，并收紧职责边界。
- 更新 `grilling`、`question-refiner`、`ce-brainstorm`、`tech-plan-generator`、`opencode-entry` 的文档生成链路。
- 更新 `bin/demo-ai-app`、`bin/check-demo`、`bin/self-test`、`package.json files`、README、AGENTS。
- 用 3 个业务样例做人审文档生成验收。

Out of scope for V1:

- 自动生成完整业务系统。
- 自动启动和浏览器测试完整业务系统。
- 接入真实 Star Agent 平台。
- 新增重型 SDD 流程。
- 新增 `app-testing` 技能；先复用或扩展 `tdd`、`webapp-testing`。

## Architecture Decisions

- Reference/example 只保留给仓库维护，不进入 generated project，不进入 npm package。
- generated project 只能从 `flask-admin-shell` + `template-patterns` + standard docs + skills 生成。
- pattern 文档不允许出现 `周报`、`week-report`、`weekly report` 或旧路径。
- 标准文档使用固定英文 anchors，业务内容允许中文。
- `Reference Template` 改为 `Reference Patterns`，避免把旧实例当复制源。
- fresh generated project 必须 skeleton runnable；full readiness 可以因文档占位失败。
- `check-demo --skeleton` 是 fresh skeleton 的结构 gate；`check-demo .` 是 Agent 完成后的 app readiness gate。

## Target Directory Contract

Reference layer:

```text
docs/original-requirements/week-report/ -> docs/reference/week-report/requirements/
docs/original-design/week-report/       -> docs/reference/week-report/design/
docs/original-demo-ref/week-report/     -> docs/reference/week-report/demo-ref/
templates/flask-adminlte-week-report/   -> examples/week-report-app/
```

Pattern layer:

```text
docs/template-patterns/
  README.md
  pc-admin-requirements-pattern.md
  pc-admin-tech-plan-pattern.md
  operation-flow-patterns.md
  page-component-patterns.md
  workflow-integration-pattern.md
```

Shell layer:

```text
templates/flask-admin-shell/
  app.py
  workflow_adapter.py
  requirements.txt
  templates/base.html
  templates/layout.html
  templates/auth/login.html
  templates/dashboard/index.html
  assets/styles.css
  assets/app.js
```

Generated project copy set:

```text
templates/flask-admin-shell/
templates/docs/
docs/template-patterns/
AGENTS.md
prompts/
skills/
bin/check-demo
README skeleton
```

Generated project must not copy:

```text
docs/reference/**
examples/**
MIGRATION_TODO.md
TEMPLATE_GENERALIZATION_PLAN.md
```

## Dependency Graph

```text
Reference isolation
    |
    +--> Package boundary
    |
    +--> Pattern registry
    |       |
    |       +--> templates/docs contract
    |       |       |
    |       |       +--> tech-plan-generator
    |       |       +--> workflow docs contract
    |       |
    |       +--> clarification skills
    |
    +--> Neutral shell
            |
            +--> shell-implementation skill
            +--> demo-ai-app copy rules
                    |
                    +--> check-demo --skeleton
                    +--> self-test
                            |
                            +--> npm pack --dry-run
                            +--> 3 sample doc-generation review
```

High-risk work is early: source isolation, neutral shell, generated copy rules, and `check-demo --skeleton`.

## Task List

### Phase 0: Baseline And Guardrails

## Task 1: Record Migration Tail And Baseline State

**Description:** Create the migration follow-up tracker and capture the current expected migration gates before moving files.

**Acceptance criteria:**

- [ ] `MIGRATION_TODO.md` exists and is excluded from npm package files.
- [ ] Current baseline commands and known failures are recorded in the task notes or commit message.
- [ ] The plan explicitly preserves unrelated dirty worktree changes.

**Verification:**

- [ ] `git status --short`
- [ ] `npm test` baseline captured, pass or fail with reason.
- [ ] `./bin/check-demo .` baseline captured, pass or fail with reason.

**Dependencies:** None

**Files likely touched:**

- `MIGRATION_TODO.md`

**Estimated scope:** XS

### Checkpoint: Baseline

- [ ] Dirty worktree reviewed.
- [ ] Baseline failures are known, not discovered after the migration.
- [ ] Human confirms V1 scope before directory moves.

### Phase 1: Source Isolation

## Task 2: Move Week-Report Source Material Into Reference And Example Layers

**Description:** Move original requirements/design/demo refs into `docs/reference/week-report/`, and move the old complete app into `examples/week-report-app/`.

**Acceptance criteria:**

- [ ] Old `docs/original-*/week-report/` directories no longer exist.
- [ ] `docs/reference/week-report/README.md` explains reference-only usage.
- [ ] `examples/week-report-app/` runs as a reference implementation, not as starter template.
- [ ] generated-facing files do not point to reference/example as copy sources.

**Verification:**

- [ ] `rg -n "docs/original-|templates/flask-adminlte-week-report" README.md AGENTS.md prompts skills templates bin package.json`
- [ ] `python3 app.py` from `examples/week-report-app/` if dependencies are available.

**Dependencies:** Task 1

**Files likely touched:**

- `docs/reference/week-report/README.md`
- `examples/week-report-app/**`
- moved reference docs

**Estimated scope:** M

## Task 3: Lock The NPM Package Boundary

**Description:** Update package files whitelist so migration docs, reference material, and examples are not published.

**Acceptance criteria:**

- [ ] `package.json files` contains only generated-facing assets.
- [ ] `docs/reference/`, `examples/`, `MIGRATION_TODO.md`, and `TEMPLATE_GENERALIZATION_PLAN.md` are excluded.
- [ ] `demo-ai-app` command name remains unchanged.

**Verification:**

- [ ] `npm pack --dry-run`
- [ ] Manual inspection of dry-run include/exclude list.

**Dependencies:** Task 2

**Files likely touched:**

- `package.json`

**Estimated scope:** XS

### Checkpoint: Reference Isolation

- [ ] Reference/example paths are isolated.
- [ ] Package dry run excludes migration/reference/example material.
- [ ] No generated-facing source still treats week-report as starter template.

### Phase 2: Generated Foundations

## Task 4: Add Template Pattern Registry

**Description:** Add neutral pattern docs that encode reusable PC admin flows and page/component patterns.

**Acceptance criteria:**

- [ ] `docs/template-patterns/README.md` includes Read Order, Core Rule, Pattern Names registry, and Forbidden Source Copy.
- [ ] Pattern names use English kebab-case.
- [ ] Pattern docs contain fixed English anchors and no forbidden source terms.
- [ ] Operation-flow and page-component patterns cover the standard generated docs.

**Verification:**

- [ ] `rg -n "周报|week-report|weekly report|flask-adminlte-week-report" docs/template-patterns`
- [ ] `rg -n "Read Order|Core Rule|Pattern Names|Forbidden Source Copy" docs/template-patterns/README.md`

**Dependencies:** Task 2

**Files likely touched:**

- `docs/template-patterns/README.md`
- `docs/template-patterns/pc-admin-requirements-pattern.md`
- `docs/template-patterns/pc-admin-tech-plan-pattern.md`
- `docs/template-patterns/operation-flow-patterns.md`
- `docs/template-patterns/page-component-patterns.md`
- `docs/template-patterns/workflow-integration-pattern.md`

**Estimated scope:** M

## Task 5: Build The Neutral Flask Admin Shell

**Description:** Create `templates/flask-admin-shell/` from the old app's useful structure, stripped to a neutral runnable shell.

**Acceptance criteria:**

- [ ] Shell starts locally and shows login/dashboard.
- [ ] Shell includes `workflow_adapter.py` and a stable `{ok, data, error, fallback}` envelope.
- [ ] Shell includes a diagnostic `/api/workflow/demo`, but README and primary loop do not depend on it.
- [ ] Shell has no old report pages, old mock data, old static root `index.html/login.html`, or week-report UI copy.

**Verification:**

- [ ] `python3 app.py` from `templates/flask-admin-shell/`
- [ ] `curl -s http://127.0.0.1:5000/api/workflow/demo` or equivalent POST smoke if the server is running.
- [ ] `rg -n "周报|week-report|weekly report|待我填报|我填报的周报|周报查看|周报模板" templates/flask-admin-shell`

**Dependencies:** Task 2

**Files likely touched:**

- `templates/flask-admin-shell/app.py`
- `templates/flask-admin-shell/workflow_adapter.py`
- `templates/flask-admin-shell/requirements.txt`
- `templates/flask-admin-shell/templates/**`
- `templates/flask-admin-shell/assets/**`

**Estimated scope:** M

## Task 6: Update Standard Generated Documents

**Description:** Update generated docs skeletons so V1 focuses on requirements, tech plan, workflow integration, and test cases.

**Acceptance criteria:**

- [ ] `templates/docs/test-cases.md` exists.
- [ ] `templates/docs/requirements.md` contains `Clarifications`, `Assumptions`, `Requirements Baseline`, `Primary Loop`, `Acceptance Checks`, `Out of Scope`.
- [ ] `templates/docs/tech-plan.md` contains `Requirements Baseline Reference`, `Reference Patterns`, `Menu Plan`, `Page Plan`, `Entity Mapping`, `Field Mapping`, `Generated Files Plan`, `Workflow Mock Contract`, `Data Storage Decision`, `Changed Decisions`.
- [ ] `templates/docs/workflow-integration.md` covers endpoint, request/response JSON, mock fallback, invalid input, timeout, empty result, platform failure, switching, and test examples.
- [ ] `templates/docs/test-report.md` remains implementation-phase output and is not V1 doc-generation gate.

**Verification:**

- [ ] `rg -n "Reference Template|week-report|old-template|copied-page" templates/docs`
- [ ] `rg -n "Reference Patterns|Generated Files Plan|Data Storage Decision|Changed Decisions" templates/docs/tech-plan.md`
- [ ] `rg -n "Primary Loop Test|Workflow Fallback Test|Invalid Input Test|Browser Test|Readiness Check" templates/docs/test-cases.md`

**Dependencies:** Task 4

**Files likely touched:**

- `templates/docs/requirements.md`
- `templates/docs/tech-plan.md`
- `templates/docs/workflow-integration.md`
- `templates/docs/test-cases.md`
- `templates/docs/test-report.md`

**Estimated scope:** M

### Checkpoint: Generated Foundations

- [ ] Neutral shell starts locally.
- [ ] Pattern docs are source-neutral.
- [ ] Standard docs can support later implementation without referencing old example paths.

### Phase 3: Agent Workflow Skills

## Task 7: Rename Template Adapter To Shell Implementation

**Description:** Physically rename `skills/template-adapter/` to `skills/shell-implementation/` and narrow the skill to implementation from frozen docs.

**Acceptance criteria:**

- [ ] `skills/template-adapter/` no longer exists.
- [ ] `skills/shell-implementation/SKILL.md` mentions no old skill name, old path, or week-report instance business terms.
- [ ] Skill reads requirements, tech plan, workflow integration, test cases, and template-pattern README.
- [ ] Skill writes app code and minimal README run updates, but does not rewrite requirement baseline, tech plan sections, or test cases.

**Verification:**

- [ ] `test -d skills/shell-implementation`
- [ ] `test ! -e skills/template-adapter`
- [ ] `rg -n "template-adapter|flask-adminlte-week-report|周报|week-report" skills/shell-implementation`

**Dependencies:** Task 5, Task 6

**Files likely touched:**

- `skills/shell-implementation/SKILL.md`
- `skills/shell-implementation/agents/openai.yaml`

**Estimated scope:** S

## Task 8: Update Clarification Skills For One-Question Baseline Building

**Description:** Make `grilling` the one-question-at-a-time baseline builder, and make `question-refiner` / `ce-brainstorm` hand it the next best blocking question instead of a batch.

**Acceptance criteria:**

- [ ] `grilling` requires Mom-Test-style questions and one blocking question at a time.
- [ ] `grilling` classifies answers as Behavior Fact, Concrete Constraint, Workflow Rule, Data Fact, Acceptance Fact, Attitude / Wish, or Unknown.
- [ ] Baseline sufficient gate requires Primary user, Primary loop, Core entity, Core states, Workflow input, Workflow output, Acceptance check, and Out of scope.
- [ ] `question-refiner` and `ce-brainstorm` prioritize behavior facts, constraints, data shape, workflow rules, and acceptance evidence.

**Verification:**

- [ ] `rg -n "one-question|Mom Test|Answer Type|Requirements Baseline Candidate|baseline sufficient" skills/grilling/SKILL.md`
- [ ] `rg -n "next best question|blocking|behavior facts|acceptance evidence" skills/question-refiner/SKILL.md skills/ce-brainstorm/SKILL.md`

**Dependencies:** Task 6

**Files likely touched:**

- `skills/grilling/SKILL.md`
- `skills/question-refiner/SKILL.md`
- `skills/ce-brainstorm/SKILL.md`

**Estimated scope:** M

## Task 9: Update Tech Plan Generation To Use Patterns

**Description:** Make `tech-plan-generator` produce the pre-build contract from `requirements.md` plus `docs/template-patterns/`.

**Acceptance criteria:**

- [ ] It outputs `Reference Patterns`, not `Reference Template`.
- [ ] It outputs `Generated Files Plan`, `Data Storage Decision`, and `Changed Decisions`.
- [ ] It forbids `Source=week-report`, `Source=old-template`, and `Source=copied-page`.
- [ ] It stops and asks the user when a change alters core entity, primary loop, workflow input/output, storage strategy, or acceptance check.

**Verification:**

- [ ] `rg -n "Reference Patterns|Generated Files Plan|Data Storage Decision|Changed Decisions" skills/tech-plan-generator/SKILL.md`
- [ ] `rg -n "Reference Template|week-report|old-template|copied-page" skills/tech-plan-generator/SKILL.md`

**Dependencies:** Task 4, Task 6, Task 8

**Files likely touched:**

- `skills/tech-plan-generator/SKILL.md`

**Estimated scope:** S

### Checkpoint: Workflow Skills

- [ ] Skill chain can produce frozen docs before implementation.
- [ ] Implementation skill cannot mutate upstream requirements or plan contracts.
- [ ] No generated-facing skill routes through the old template name.

### Phase 4: Generator And Readiness Gates

## Task 10: Update demo-ai-app Generated Project Copy Rules

**Description:** Make `bin/demo-ai-app` generate from shell + patterns + docs + skills, and update the generated README skeleton.

**Acceptance criteria:**

- [ ] Generated app copies `templates/flask-admin-shell/`, not the old example.
- [ ] Generated app copies `docs/template-patterns/`.
- [ ] Generated app copies `templates/docs/test-cases.md`.
- [ ] Generated app includes `skills/shell-implementation/` and not `skills/template-adapter/`.
- [ ] Generated README describes PDCA flow and skeleton/full readiness split.
- [ ] Generated app contains no reference/example paths.

**Verification:**

- [ ] `node bin/demo-ai-app tmp-generated-skeleton`
- [ ] `test -e tmp-generated-skeleton/docs/template-patterns/README.md`
- [ ] `test -e tmp-generated-skeleton/docs/test-cases.md`
- [ ] `test ! -e tmp-generated-skeleton/docs/reference`
- [ ] `test ! -e tmp-generated-skeleton/examples`
- [ ] `rg -n "template-adapter|flask-adminlte-week-report|docs/reference|examples/week-report-app" tmp-generated-skeleton`

**Dependencies:** Task 3, Task 4, Task 5, Task 6, Task 7

**Files likely touched:**

- `bin/demo-ai-app`

**Estimated scope:** M

## Task 11: Add check-demo Skeleton Mode And Source-Copy Detectors

**Description:** Add `./bin/check-demo --skeleton .` for fresh generated projects and strengthen full mode for completed apps.

**Acceptance criteria:**

- [ ] `--skeleton` checks structure without requiring completed docs or starting Flask.
- [ ] `--skeleton` hard fails missing app, adapter, `docs/template-patterns`, `docs/test-cases.md`, `skills/shell-implementation`, required shell templates, `bin/check-demo`, README run command, forbidden source terms, and copied reference/example paths.
- [ ] Full mode still checks completed docs, workflow error cases, README, and primary loop.
- [ ] Detector allows reference/example/migration docs only in explicit allowed scopes.
- [ ] If target business is weekly report, detector can allow business keywords but still fails copied path/source-copy evidence.

**Verification:**

- [ ] `./bin/check-demo --skeleton tmp-generated-skeleton`
- [ ] `./bin/check-demo tmp-generated-skeleton` fails only on expected placeholders.
- [ ] Negative fixture or manual edit proves forbidden keyword/source-copy detector fails.

**Dependencies:** Task 10

**Files likely touched:**

- `bin/check-demo`

**Estimated scope:** M

## Task 12: Update Self-Test For Skeleton Generation

**Description:** Make `bin/self-test` validate generator preflight, generated skeleton, and full-mode placeholder behavior.

**Acceptance criteria:**

- [ ] Self-test creates a temp generated project.
- [ ] Self-test runs `./bin/check-demo --skeleton` on it.
- [ ] Self-test documents or asserts expected full-mode placeholder failure for fresh skeleton.
- [ ] Self-test no longer relies on old week-report template paths.

**Verification:**

- [ ] `npm test`
- [ ] `bin/self-test`

**Dependencies:** Task 10, Task 11

**Files likely touched:**

- `bin/self-test`

**Estimated scope:** S

### Checkpoint: Generator Gate

- [ ] Fresh generated skeleton passes `check-demo --skeleton`.
- [ ] Fresh generated skeleton fails full readiness only for expected placeholders.
- [ ] `npm test` passes or has a documented, migration-related remaining failure.

### Phase 5: Public Docs And Final Validation

## Task 13: Update README, AGENTS, Prompt Routing, And Workflow Copy

**Description:** Align public docs and generated-agent instructions with the new PDCA and clarification workflow.

**Acceptance criteria:**

- [ ] README describes PC admin/workflow app scope and excludes non-operational app categories.
- [ ] README Product Workflow uses `shell-implementation`, not `template-adapter`.
- [ ] README explains reference/example as repository maintenance assets, not quick-start assets.
- [ ] AGENTS default workflow and generated instructions include Clarification Workflow: behavior facts over opinions, real data/rules/evidence first, attitude answers become assumptions/risks unless converted to observable acceptance checks.
- [ ] `prompts/opencode-entry.md` routes simple vs vague requirements into the revised clarification chain.

**Verification:**

- [ ] `rg -n "template-adapter|flask-adminlte-week-report|周报模板|weekly report" README.md AGENTS.md prompts/opencode-entry.md`
- [ ] `rg -n "shell-implementation|Clarification Workflow|behavior facts|PDCA|check-demo --skeleton" README.md AGENTS.md prompts/opencode-entry.md`

**Dependencies:** Task 7, Task 8, Task 10, Task 11

**Files likely touched:**

- `README.md`
- `AGENTS.md`
- `prompts/opencode-entry.md`

**Estimated scope:** M

## Task 14: Run Package And Generated Skeleton Verification

**Description:** Validate package contents and generated skeleton behavior after all migration edits.

**Acceptance criteria:**

- [ ] `npm test` passes.
- [ ] `./bin/check-demo --skeleton` passes on a fresh generated app.
- [ ] `npm pack --dry-run` excludes reference/example/migration docs.
- [ ] Generated app has no forbidden source-copy residue.

**Verification:**

- [ ] `npm test`
- [ ] `node bin/demo-ai-app tmp-generated-skeleton`
- [ ] `./bin/check-demo --skeleton tmp-generated-skeleton`
- [ ] `npm pack --dry-run`
- [ ] `rg -n "docs/reference|examples/week-report-app|flask-adminlte-week-report|template-adapter" tmp-generated-skeleton`

**Dependencies:** Task 3, Task 10, Task 11, Task 12, Task 13

**Files likely touched:**

- None unless verification reveals defects.

**Estimated scope:** S

## Task 15: Human-Review Three Document Generation Samples

**Description:** Use three target businesses to validate that the Agent produces usable documents before implementation.

**Sample businesses:**

- 社区报修
- 合同风险审核
- 设备巡检派单

**Acceptance criteria:**

- [ ] Clarification produces behavior facts and constraints, not attitude-only assumptions.
- [ ] `requirements.md` is business-specific and separates Clarifications from Assumptions.
- [ ] `Requirements Baseline` is complete.
- [ ] `tech-plan.md` derives menu/page/API/field/storage/workflow from requirements.
- [ ] `tech-plan.md` references `Reference Patterns`, not old reference/example paths.
- [ ] `workflow-integration.md` covers mock fallback, invalid input, empty result, timeout, and platform failure.
- [ ] `test-cases.md` covers primary loop, workflow fallback, invalid input, browser path, and readiness check.
- [ ] Generated docs contain no forbidden keyword or source-copy evidence.

**Verification:**

- [ ] Human review checklist completed for all 3 samples.
- [ ] `rg -n "Reference Template|week-report|old-template|copied-page|flask-adminlte-week-report|template-adapter" <sample-projects>`

**Dependencies:** Task 14

**Files likely touched:**

- Sample generated projects under a temp or ignored workspace only.

**Estimated scope:** M

### Checkpoint: V1 Complete

- [ ] Reference/example isolated.
- [ ] Shell + patterns are generated-facing and source-neutral.
- [ ] Skill chain produces requirements, tech plan, workflow integration, and test cases before implementation.
- [ ] Fresh skeleton passes `check-demo --skeleton`.
- [ ] Full app readiness remains a later implementation gate.
- [ ] Package boundary is verified.
- [ ] Three business samples pass human document-generation review.

## Required Document Contracts

### requirements.md

Required anchors:

```text
Clarifications
Assumptions
Requirements Baseline
Primary Loop
Acceptance Checks
Out of Scope
```

Clarifications table:

```markdown
| Question | Answer | Answer Type | Decision Impact |
|----------|--------|-------------|-----------------|
```

Assumptions table:

```markdown
| Assumption | Reason | Risk if Wrong |
|------------|--------|---------------|
```

Requirements Baseline fields:

```text
- Primary user:
- Primary loop:
- Core entity:
- Core states:
- Workflow input:
- Workflow output:
- Acceptance check:
- Out of scope:
```

### tech-plan.md

Required anchors:

```text
Requirements Baseline Reference
Reference Patterns
Menu Plan
Page Plan
Entity Mapping
Field Mapping
Generated Files Plan
Workflow Mock Contract
Data Storage Decision
Changed Decisions
```

Reference Patterns table:

```markdown
| Pattern | Source File | Why Used |
|---------|-------------|----------|
```

Generated Files Plan table:

```markdown
| File | Action | Source | Purpose |
|------|--------|--------|---------|
```

Allowed `Action`:

```text
create
modify
delete
keep
```

Allowed `Source`:

```text
shell
pattern:<pattern-name>
business-requirement
```

Forbidden `Source`:

```text
week-report
old-template
copied-page
```

Data Storage Decision table:

```markdown
| Store | Why Enough For V1 | Reset / Seed Strategy | Upgrade Path |
|-------|-------------------|-----------------------|--------------|
```

Default storage policy:

- simplest demo: in-memory store.
- repeatable seed needed: JSON fixture.
- explicit persistence needed: local JSON file.
- database: out of V1 by default.

Decision-change rule:

- Minor implementation details can go into `Changed Decisions`.
- Changes to core entity, primary loop, workflow input/output, storage strategy, or acceptance check require stopping and asking the user.

### workflow-integration.md

Required coverage:

- business workflow endpoint.
- request/response JSON.
- mock fallback.
- invalid input.
- timeout.
- empty result.
- platform failure.
- mock vs real switching.
- test examples.

Endpoint policy:

- Shell may keep `/api/workflow/demo` for smoke/diagnostic.
- Business implementation must add a target endpoint, for example `/api/repairs/triage`.
- README and primary loop must not depend on `/api/workflow/demo`.

### test-cases.md

Required anchors:

```text
Primary Loop Test
Workflow Fallback Test
Invalid Input Test
Browser Test
Readiness Check
```

Required table:

```markdown
| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
```

### test-report.md

Implementation-phase output, not V1 migration gate.

Required anchors:

```text
User Preview
Test Execution
Failures / Fixes
Final Result
```

## Forbidden Keyword And Source-Copy Policy

Generated-facing scopes hard fail on these examples:

```text
周报
week-report
weekly report
report template
待我填报
我填报的周报
待我审核
周报查看
周报模板
flask-adminlte-week-report
template-adapter
```

Generated-facing scopes:

```text
templates/flask-admin-shell/**
docs/template-patterns/**
templates/docs/**
prompts/opencode-entry.md
generated README skeleton
generated AGENTS.md
skills/shell-implementation/**
skills/tech-plan-generator/**
skills/question-refiner/**
skills/ce-brainstorm/**
skills/grilling/**
generated app default files
```

Allowed source/reference scopes:

```text
docs/reference/week-report/**
examples/week-report-app/**
TEMPLATE_GENERALIZATION_PLAN.md
MIGRATION_TODO.md
bin/check-demo detector rules
```

Copied example hard failures in generated app:

```text
examples/week-report-app path
docs/reference/week-report path
templates/flask-adminlte-week-report path
old root static index.html/login.html copied from example
old app.py docstring/title from example
Generated Files Plan Source=week-report / old-template / copied-page
```

If the target business is explicitly a weekly-report app, business words may be allowed, but copied paths and old source labels still fail.

## Package Boundary

`package.json files` should become:

```json
[
  "bin/",
  "templates/flask-admin-shell/",
  "templates/docs/",
  "docs/template-patterns/",
  "AGENTS.md",
  "prompts/",
  "skills/",
  "README.md",
  "LICENSE"
]
```

Must not enter npm package:

```text
docs/reference/
examples/
MIGRATION_TODO.md
TEMPLATE_GENERALIZATION_PLAN.md
```

## Parallelization Plan

Safe after Task 2:

- Task 4 pattern docs and Task 5 shell can run in parallel if both use the same forbidden keyword policy.
- Task 8 clarification skills and Task 9 tech-plan-generator can run in parallel after Task 6 locks document anchors.
- Task 13 docs can draft in parallel with Task 11 checker, but final copy must wait for Task 10 generated README behavior.

Must remain sequential:

- Task 2 before package boundary and generated copy rules.
- Task 5 before `shell-implementation` and `demo-ai-app`.
- Task 10 before `check-demo --skeleton`.
- Task 11 before self-test.
- Task 14 before 3-sample human review.

Needs coordination:

- Pattern names registry must be frozen before tech-plan-generator and templates/docs use it.
- Forbidden keyword allow/deny scopes must be shared by docs, generator, and checker.
- Generated README skeleton must match `check-demo` expectations.

## Final Verification Commands

Run from repo root:

```bash
npm test
node bin/demo-ai-app tmp-generated-skeleton
./bin/check-demo --skeleton tmp-generated-skeleton
./bin/check-demo tmp-generated-skeleton
npm pack --dry-run
```

Expected V1 result:

- `npm test`: pass.
- `check-demo --skeleton`: pass on fresh generated skeleton.
- full `check-demo`: may fail on documented placeholders before Agent completes docs.
- `npm pack --dry-run`: excludes reference/example/migration docs.

## Open Questions

- Should `examples/week-report-app/` have its own smoke-test command, or is manual reference use enough for V1?
- Where should 3-sample human-review artifacts live: ignored temp projects only, or a committed checklist without generated sample output?
- Should `check-demo --skeleton` inspect shell runnability in a later phase, or remain file/content-only for V1?
