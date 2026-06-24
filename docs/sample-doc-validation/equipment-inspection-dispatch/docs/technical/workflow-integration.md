# 设备巡检派单 Workflow 集成文档

## 角色

AI workflow 负责根据设备风险、目标日期、人员技能和可用性推荐巡检人员，并返回优先级、路线提示、推荐理由和置信度。

## 业务 Workflow Endpoint

```text
POST /api/inspections/assign
```

| Field | Value |
|-------|-------|
| Page route | `/inspections/dispatch` |
| Business API endpoint | `/api/inspections/assign` |
| Method | POST |
| Called from UI file | `templates/inspections/dispatch.html` |

## Adapter Location

```text
workflow_adapter.py
```

## Request Shape

```json
{
  "equipment_code": "A-102",
  "equipment_type": "electrical",
  "location": "1号配电房",
  "risk_level": "high",
  "last_inspected_at": "2026-05-10",
  "target_date": "2026-06-25",
  "staff_pool": [
    {
      "name": "陈工",
      "skills": ["electrical"],
      "available": true,
      "current_load": 2
    }
  ]
}
```

必填字段：`equipment_code`、`equipment_type`、`location`、`risk_level`、`target_date`、`staff_pool`。`staff_pool` 必须至少包含一名可用人员。

## Response Shape

```json
{
  "ok": true,
  "data": {
    "recommended_staff": "陈工",
    "priority": "high",
    "route_hint": "先检查1号配电房，再处理同区域低压柜。",
    "reason": "设备风险高，陈工具备电气资质且目标日期可用。",
    "confidence": 0.9,
    "processed_at": "2026-06-24T10:00:00Z"
  },
  "error": null,
  "fallback": true
}
```

错误响应：

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "staff_pool must include at least one available staff"
  },
  "fallback": false
}
```

## Mock Fallback

当 AI 平台不可用或 `WORKFLOW_MOCK=true` 时，mock 使用本地规则保持同形输出：

| Input Signal | Mock Output |
|--------------|-------------|
| `risk_level=high` 且有匹配技能人员 | 推荐匹配技能且 `current_load` 最低的可用人员，`priority=high` |
| 无匹配技能但有可用人员 | 推荐当前负载最低人员，`priority=medium`，reason 标注技能不完全匹配 |
| 无可用人员 | 返回 `ok: false`，`error.code: INVALID_INPUT` |

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid input | 缺少设备字段、日期无效或无可用人员时返回 HTTP 400，`error.code: INVALID_INPUT`。 |
| Timeout | 真实 workflow 超过 `WORKFLOW_TIMEOUT` 秒，adapter 返回同形 mock 结果，`fallback: true`，`data._fallback_reason: timeout`。 |
| Empty result | 上游返回空结果时归一化为 `recommended_staff=null`、`priority=medium`、`empty: true`，页面要求人工选择人员。 |
| Platform error | 网络错误、5xx 或 malformed JSON 被捕获，返回同形 mock fallback，并记录错误日志。 |

## Configuration

| Name | Default | Purpose |
|------|---------|---------|
| `WORKFLOW_MOCK` | `true` | 本地默认使用 mock 派单推荐。 |
| `WORKFLOW_TIMEOUT` | `10` | 真实 workflow 超时时间。 |

## Switching to Real Workflow

1. 在 `workflow_adapter.py` 中实现 `_call_real_workflow(payload, timeout)`。
2. 把真实平台返回归一化为 `recommended_staff`、`priority`、`route_hint`、`reason`、`confidence`。
3. 设置 `WORKFLOW_MOCK=false`。
4. 复测 Invalid input、Timeout、Empty result、Platform error 四类路径。

## Readiness Probe

文档阶段只运行：

```bash
./bin/check-docs docs/sample-doc-validation/equipment-inspection-dispatch
```

实现完成后再运行：

```bash
DEMO_BASE_URL=http://127.0.0.1:5000 \
DEMO_PRIMARY_LOOP_PATH=/inspections/dispatch \
DEMO_BUSINESS_API_PATH=/api/inspections/assign \
DEMO_BUSINESS_API_PAYLOAD='{"equipment_code":"A-102","equipment_type":"electrical","location":"1号配电房","risk_level":"high","target_date":"2026-06-25","staff_pool":[{"name":"陈工","skills":["electrical"],"available":true,"current_load":2}]}' \
./bin/check-demo .
```

## Test Examples

```bash
curl -s -X POST http://127.0.0.1:5000/api/inspections/assign \
  -H "Content-Type: application/json" \
  -d '{"equipment_code":"A-102","equipment_type":"electrical","location":"1号配电房","risk_level":"high","target_date":"2026-06-25","staff_pool":[{"name":"陈工","skills":["electrical"],"available":true,"current_load":2}]}'
```
