# 社区报修测试用例

## Primary Loop Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| PL-001 | 报修登记智能分流 | `docs/requirements/requirements.md` | 1. 登录后台。2. 打开 `/repairs/new`。3. 输入位置、描述、联系人。4. 点击智能分流。5. 确认派单。 | 页面展示分类、priority、建议部门和处理建议，工单状态从 `draft` 变为 `dispatched`。 |
| PL-002 | 台账查看派单结果 | `docs/technical/tech-plan.md` | 1. 打开 `/repairs`。2. 过滤 `dispatched`。3. 打开详情。 | 可看到报修输入、AI 分流结果、人工确认记录。 |

## Workflow Fallback Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| WF-001 | Mock fallback returns stable envelope | `docs/technical/workflow-integration.md` | 1. 设置 `WORKFLOW_MOCK=true`。2. POST `/api/repairs/triage`。 | 响应包含 `{ok, data, error, fallback}`，`fallback: true`，`data.category` 非空。 |
| WF-002 | Timeout fallback | `docs/technical/workflow-integration.md` | 1. 模拟真实 workflow 超时。2. POST 有效报修数据。 | 返回同形 mock，`data._fallback_reason: timeout`。 |

## Invalid Input Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| II-001 | 缺少 description | `docs/technical/workflow-integration.md` | POST `{"location":"幸福社区","contact":"王阿姨"}` 到 `/api/repairs/triage`。 | HTTP 400，`ok: false`，`error.code: INVALID_INPUT`。 |
| II-002 | 描述过短 | `docs/requirements/requirements.md` | POST `description="坏"`。 | HTTP 400，提示描述长度不足。 |

## Browser Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| BR-001 | PC 后台页面形态 | `docs/technical/tech-plan.md` | 打开 `/dashboard`、`/repairs/new`、`/repairs`。 | 页面是后台工作台/表单/列表，不是营销页、聊天页或纯报告页。 |
| BR-002 | 表单结果展示 | `docs/requirements/requirements.md` | 在浏览器提交“电梯反复停运”。 | 页面原地展示 AI 分流卡片，可点击确认派单。 |

## Readiness Check

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| RC-001 | 文档包质量检查 | `docs/requirements/requirements.md`、`docs/technical/tech-plan.md`、`docs/technical/workflow-integration.md` | 运行 `./bin/check-docs docs/sample-doc-validation/community-repair`。 | Document quality: PASS。 |
| RC-002 | 实现后 full readiness | `docs/technical/workflow-integration.md` | 启动应用后运行 `DEMO_BASE_URL=... DEMO_PRIMARY_LOOP_PATH=/repairs/new DEMO_BUSINESS_API_PATH=/api/repairs/triage DEMO_BUSINESS_API_PAYLOAD=... ./bin/check-demo .`。 | 页面返回 200/302，业务 API 返回稳定 JSON envelope。 |
