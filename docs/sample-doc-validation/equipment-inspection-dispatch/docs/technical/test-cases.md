# 设备巡检派单测试用例

## Primary Loop Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| PL-001 | 高风险设备智能派单 | `docs/requirements/requirements.md` | 1. 登录后台。2. 打开 `/inspections/dispatch`。3. 选择 `A-102` 和目标日期。4. 点击智能推荐派单。5. 确认推荐人员。 | 页面展示推荐人员、priority、route_hint 和 reason，任务状态从 `pending` 变为 `assigned`。 |
| PL-002 | 派单任务台账 | `docs/technical/tech-plan.md` | 1. 打开 `/inspections/tasks`。2. 过滤 `assigned`。3. 打开任务详情。 | 可看到设备、目标日期、推荐理由和主管确认记录。 |

## Workflow Fallback Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| WF-001 | Mock fallback returns stable envelope | `docs/technical/workflow-integration.md` | 1. 设置 `WORKFLOW_MOCK=true`。2. POST `/api/inspections/assign`。 | 响应包含 `{ok, data, error, fallback}`，`fallback: true`，`data.recommended_staff` 非空。 |
| WF-002 | Empty result requires manual choice | `docs/technical/workflow-integration.md` | 1. 模拟上游空响应。2. POST 有效设备和人员池。 | 响应仍为稳定 envelope，`data.empty: true`，页面提示人工选择人员。 |

## Invalid Input Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| II-001 | 无可用人员 | `docs/technical/workflow-integration.md` | POST `staff_pool=[]` 到 `/api/inspections/assign`。 | HTTP 400，`ok: false`，`error.code: INVALID_INPUT`。 |
| II-002 | 缺少设备编号 | `docs/requirements/requirements.md` | POST 缺少 `equipment_code` 的 payload。 | HTTP 400，提示设备编号必填。 |

## Browser Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| BR-001 | PC 派单工作台形态 | `docs/technical/tech-plan.md` | 打开 `/dashboard`、`/inspections/equipment`、`/inspections/dispatch`。 | 页面是后台工作台/列表/派单表单，不是营销页、聊天页或纯报告页。 |
| BR-002 | 推荐结果确认 | `docs/requirements/requirements.md` | 在浏览器选择“高压配电柜 A-102”和目标日期。 | 页面展示陈工推荐理由，可点击确认派单。 |

## Readiness Check

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| RC-001 | 文档包质量检查 | `docs/requirements/requirements.md`、`docs/technical/tech-plan.md`、`docs/technical/workflow-integration.md` | 运行 `./bin/check-docs docs/sample-doc-validation/equipment-inspection-dispatch`。 | Document quality: PASS。 |
| RC-002 | 实现后 full readiness | `docs/technical/workflow-integration.md` | 启动应用后运行 `DEMO_BASE_URL=... DEMO_PRIMARY_LOOP_PATH=/inspections/dispatch DEMO_BUSINESS_API_PATH=/api/inspections/assign DEMO_BUSINESS_API_PAYLOAD=... ./bin/check-demo .`。 | 页面返回 200/302，业务 API 返回稳定 JSON envelope。 |
