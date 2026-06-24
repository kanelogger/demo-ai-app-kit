# 社区报修 Workflow 集成文档

## 角色

AI workflow 负责把报修描述转成可执行的分流建议：问题分类、紧急程度、建议处理部门、处理建议和置信度。

## 业务 Workflow Endpoint

```text
POST /api/repairs/triage
```

| Field | Value |
|-------|-------|
| Page route | `/repairs/new` |
| Business API endpoint | `/api/repairs/triage` |
| Method | POST |
| Called from UI file | `templates/repairs/new.html` |

## Adapter Location

```text
workflow_adapter.py
```

## Request Shape

```json
{
  "location": "幸福社区 3 号楼",
  "description": "3号楼电梯反复停运，老人上下楼困难",
  "contact": "王阿姨",
  "attachment_note": "物业群截图"
}
```

必填字段：`location`、`description`、`contact`。`description` 必须是非空字符串，建议 5-500 字。

## Response Shape

```json
{
  "ok": true,
  "data": {
    "category": "设施维修",
    "priority": "high",
    "department": "物业维修组",
    "suggestion": "优先派电梯维保单位排查，社区网格员同步跟进老人出行风险。",
    "confidence": 0.91,
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
    "message": "description is required"
  },
  "fallback": false
}
```

## Mock Fallback

当 AI 平台不可用或 `WORKFLOW_MOCK=true` 时，mock 仍返回同一 envelope。mock 规则：

| Input Signal | Mock Output |
|--------------|-------------|
| 包含“电梯”“停运” | `category=设施维修`, `priority=high`, `department=物业维修组` |
| 包含“漏水”“管道” | `category=水电维修`, `priority=medium`, `department=水电维修组` |
| 其他描述 | `category=综合报修`, `priority=medium`, `department=社区服务中心` |

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid input | 缺少 `location`、`description` 或 `contact` 时返回 HTTP 400，`error.code: INVALID_INPUT`。 |
| Timeout | 真实 workflow 超过 `WORKFLOW_TIMEOUT` 秒，adapter 返回 mock 分流结果，`fallback: true`，`data._fallback_reason: timeout`。 |
| Empty result | 上游返回空结果时归一化为 `category=综合报修`、`priority=medium`，并带 `empty: true`。 |
| Platform error | 网络错误、5xx 或 malformed JSON 被捕获，返回同形 mock fallback，并记录错误日志。 |

## Configuration

| Name | Default | Purpose |
|------|---------|---------|
| `WORKFLOW_MOCK` | `true` | 本地默认走 mock。 |
| `WORKFLOW_TIMEOUT` | `10` | 真实 workflow 超时时间。 |

## Switching to Real Workflow

1. 在 `workflow_adapter.py` 中实现 `_call_real_workflow(payload, timeout)`。
2. 保证真实返回字段映射到 `category`、`priority`、`department`、`suggestion`、`confidence`。
3. 设置 `WORKFLOW_MOCK=false`。
4. 复测 invalid input、Timeout、Empty、Platform error 四类路径。

## Readiness Probe

文档阶段只运行：

```bash
./bin/check-docs docs/sample-doc-validation/community-repair
```

实现完成后再运行：

```bash
DEMO_BASE_URL=http://127.0.0.1:5000 \
DEMO_PRIMARY_LOOP_PATH=/repairs/new \
DEMO_BUSINESS_API_PATH=/api/repairs/triage \
DEMO_BUSINESS_API_PAYLOAD='{"location":"幸福社区 3 号楼","description":"3号楼电梯反复停运，老人上下楼困难","contact":"王阿姨"}' \
./bin/check-demo .
```

## Test Examples

```bash
curl -s -X POST http://127.0.0.1:5000/api/repairs/triage \
  -H "Content-Type: application/json" \
  -d '{"location":"幸福社区 3 号楼","description":"3号楼电梯反复停运，老人上下楼困难","contact":"王阿姨"}'
```
