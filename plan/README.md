---
title: Kit-Test 落地计划索引
slug: kit-test-plan-index
summary: Kit-Test v1 的阶段计划入口，所有实现阶段必须引用 00-contract.md。
---

## Summary

把 [`ref.md`](/Users/kanehua/project/kit-test/ref.md) 落成一个最小可用的 **Agent-friendly PC 后台项目生成器**。第一版只解决一件事：生成一个前后端工作区，让 Agent 在明确的 `AGENTS.md`、`SPECS/`、`workflow-state.json` 和阶段门约束下推进业务需求，避免未确认就进入下一阶段。

## Plan Files

* [`00-contract.md`](/Users/kanehua/project/kit-test/plan/00-contract.md)：唯一产品契约源，定义生成项目结构、状态机、阶段门、Agent 工作流和验收边界。
* [`01-cli-foundation.md`](/Users/kanehua/project/kit-test/plan/01-cli-foundation.md)：实现 CLI 包、`kit init`、`kit check`、`kit stage advance` 的基础能力。
* [`02-template-control-files.md`](/Users/kanehua/project/kit-test/plan/02-template-control-files.md)：把 `AGENTS.md`、`SPECS/`、`workflow/`、`tasks/`、`memory/` 控制文件加入模板。
* [`03-stage-gate-fixtures.md`](/Users/kanehua/project/kit-test/plan/03-stage-gate-fixtures.md)：补齐阶段门 fixture、负向用例和命令行为测试。
* [`04-specs-contract.md`](/Users/kanehua/project/kit-test/plan/04-specs-contract.md)：把旧 SDD 思路收敛到新的 `SPECS/` 契约结构。

## Implementation Order

1. Phase 1: CLI Foundation
2. Phase 2: Template Control Files
3. Phase 3: Stage Gate Fixtures
4. Phase 4: SDD/SPECS Contract

## Rules

* `00-contract.md` 是唯一契约源。阶段文件只能引用它，不得复制并改写状态机、目录树或 Gate Rules。
* 每个阶段必须有明确 Goal、Inputs、Tasks、Acceptance Criteria、Verification、Out of Scope、Depends On。
* 阶段完成前必须通过该阶段文件里的 Verification。
* 若实现中发现契约需要变化，先改 `00-contract.md`，再同步受影响阶段文件。
