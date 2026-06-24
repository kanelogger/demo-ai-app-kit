# Sample Document Validation

This directory records docs-only validation for three PC backend business
scenarios. It is a maintenance asset for the kit, not a generated-project
template and not an implementation fixture.

## Scope

The validation target is the pre-implementation document package:

- `docs/requirements.md`
- `docs/tech-plan.md`
- `docs/workflow-integration.md`
- `docs/test-cases.md`

System implementation is intentionally out of scope here. Full app readiness
stays covered by `bin/check-demo` after implementation.

## Samples

| Sample | Business Shape | Primary Loop |
|--------|----------------|--------------|
| `community-repair` | 社区报修 PC 后台 | 报修登记 -> AI 分流 -> 人工确认派单 |
| `contract-risk-review` | 合同风险审核 PC 后台 | 合同条款提交 -> AI 风险扫描 -> 法务确认 |
| `equipment-inspection-dispatch` | 设备巡检派单 PC 后台 | 设备选择 -> AI 推荐人员 -> 主管确认派单 |

## Validation Commands

```bash
./bin/check-docs --patterns-only .
./bin/check-docs docs/sample-doc-validation/community-repair
./bin/check-docs docs/sample-doc-validation/contract-risk-review
./bin/check-docs docs/sample-doc-validation/equipment-inspection-dispatch
```

## P3 Decisions

| Topic | Decision | Evidence / Reason |
|-------|----------|-------------------|
| Stricter document quality checker | Add `bin/check-docs` now. | Three samples need repeatable docs-only validation without requiring implementation. |
| Business document subagent | Do not split out yet. | A deterministic checker plus samples is enough for V1; a subagent would add workflow weight before repeated failures prove it is needed. |
| Template pattern additions | Add `Baseline Classification` to requirements template and pattern. | Samples showed the answer-type classification must be attached to the frozen baseline, not only to raw clarification rows. |
| Full-system automated test boundary | Keep V1 docs validation separate from app readiness. | P1 explicitly excludes implementation; `check-docs` validates documents, `check-demo` validates implemented app skeleton/full readiness. |

## Quality Bar

A sample passes only when:

- The app shape is clearly PC backend/admin.
- Required baseline fields are backed by Behavior Fact, Concrete Constraint,
  Workflow Rule, Data Fact, or Acceptance Fact.
- Attitude / Wish and Unknown items are recorded but do not freeze required
  baseline fields.
- The technical plan includes selected solution, menu/page/entity/field/file
  plans, workflow mock contract, and storage decision.
- The workflow document covers business endpoint, request/response shape,
  stable `{ok, data, error, fallback}` envelope, mock fallback, invalid input,
  timeout, empty result, and platform failure.
- Test cases cover primary loop, fallback, invalid input, browser path, and
  readiness checks.
- Pattern documents do not contain default/reference business semantics.
