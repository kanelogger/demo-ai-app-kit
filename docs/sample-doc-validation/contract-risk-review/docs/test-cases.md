# 合同风险审核测试用例

## Primary Loop Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| PL-001 | 合同条款风险扫描 | `docs/requirements.md` | 1. 登录后台。2. 打开 `/contracts/new`。3. 填写合同信息和条款文本。4. 点击风险扫描。5. 法务确认建议动作。 | 页面展示 `risk_level`、风险条款、建议动作，审核单状态从 `draft` 变为 `reviewed`。 |
| PL-002 | 风险列表筛选 | `docs/tech-plan.md` | 1. 打开 `/contracts`。2. 按 `risk_level=high` 过滤。3. 打开风险详情。 | 可看到高风险条款、原因、建议和人工确认记录。 |

## Workflow Fallback Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| WF-001 | Mock fallback returns stable envelope | `docs/workflow-integration.md` | 1. 设置 `WORKFLOW_MOCK=true`。2. POST `/api/contracts/risk-scan`。 | 响应包含 `{ok, data, error, fallback}`，`fallback: true`，`data.risk_level` 非空。 |
| WF-002 | Empty result normalization | `docs/workflow-integration.md` | 1. 模拟上游空响应。2. POST 有效合同条款。 | 响应仍为稳定 envelope，`data.empty: true`，不导致页面崩溃。 |

## Invalid Input Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| II-001 | 缺少 clause_text | `docs/workflow-integration.md` | POST `{"title":"采购合同","counterparty":"乙方","contract_type":"service","department":"采购部"}`。 | HTTP 400，`ok: false`，`error.code: INVALID_INPUT`。 |
| II-002 | 条款文本过短 | `docs/requirements.md` | POST `clause_text="无"`。 | HTTP 400，提示条款文本长度不足。 |

## Browser Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| BR-001 | PC 审核工作台形态 | `docs/tech-plan.md` | 打开 `/dashboard`、`/contracts/new`、`/contracts`。 | 页面是后台工作台/表单/列表/审核详情，不是营销页、聊天页或纯报告页。 |
| BR-002 | 风险结果展示 | `docs/requirements.md` | 在浏览器提交含“自动续约且无单方解除权”的条款。 | 页面展示高风险条款和补充解除权建议，可点击确认。 |

## Readiness Check

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| RC-001 | 文档包质量检查 | `docs/requirements.md`、`docs/tech-plan.md`、`docs/workflow-integration.md` | 运行 `./bin/check-docs docs/sample-doc-validation/contract-risk-review`。 | Document quality: PASS。 |
| RC-002 | 实现后 full readiness | `docs/workflow-integration.md` | 启动应用后运行 `DEMO_BASE_URL=... DEMO_PRIMARY_LOOP_PATH=/contracts/new DEMO_BUSINESS_API_PATH=/api/contracts/risk-scan DEMO_BUSINESS_API_PAYLOAD=... ./bin/check-demo .`。 | 页面返回 200/302，业务 API 返回稳定 JSON envelope。 |
