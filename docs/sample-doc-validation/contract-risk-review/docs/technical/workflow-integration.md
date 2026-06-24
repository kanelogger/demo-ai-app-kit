# 合同风险审核 Workflow 集成文档

## 角色

AI workflow 负责扫描合同条款风险，输出风险等级、风险条目、建议处理动作和置信度。输出只作为法务确认依据，不自动完成审批。

## 业务 Workflow Endpoint

```text
POST /api/contracts/risk-scan
```

| Field | Value |
|-------|-------|
| Page route | `/contracts/new` |
| Business API endpoint | `/api/contracts/risk-scan` |
| Method | POST |
| Called from UI file | `templates/contracts/new.html` |

## Adapter Location

```text
workflow_adapter.py
```

## Request Shape

```json
{
  "title": "采购服务合同",
  "counterparty": "乙方科技有限公司",
  "amount": 300000,
  "contract_type": "service",
  "department": "采购部",
  "due_date": "2026-07-15",
  "clause_text": "本合同自动续约，甲方无单方解除权。"
}
```

必填字段：`title`、`counterparty`、`contract_type`、`department`、`clause_text`。`clause_text` 必须是非空字符串，建议 20-5000 字。

## Response Shape

```json
{
  "ok": true,
  "data": {
    "risk_level": "high",
    "risk_items": [
      {
        "clause": "自动续约且无单方解除权",
        "risk_type": "termination_right",
        "severity": "high",
        "reason": "甲方缺少退出机制，可能形成长期履约风险。",
        "suggestion": "补充甲方提前通知后的单方解除权。"
      }
    ],
    "suggested_action": "requires_legal_revision",
    "confidence": 0.88,
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
    "message": "clause_text is required"
  },
  "fallback": false
}
```

## Mock Fallback

当 AI 平台不可用或 `WORKFLOW_MOCK=true` 时，mock 使用关键词规则保持同形输出：

| Input Signal | Mock Output |
|--------------|-------------|
| 包含“自动续约”“无单方解除权” | `risk_level=high`, `risk_type=termination_right` |
| 包含“违约金不超过”且金额较低 | `risk_level=medium`, `risk_type=liability_cap` |
| 未命中风险关键词 | `risk_level=low`, `risk_items=[]` |

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid input | 缺少必填字段或 `clause_text` 为空时返回 HTTP 400，`error.code: INVALID_INPUT`。 |
| Timeout | 真实 workflow 超过 `WORKFLOW_TIMEOUT` 秒，adapter 返回同形 mock 结果，`fallback: true`，`data._fallback_reason: timeout`。 |
| Empty result | 上游返回空结果时归一化为 `risk_level=unknown`、`risk_items=[]`、`empty: true`。 |
| Platform error | 网络错误、5xx 或 malformed JSON 被捕获，返回同形 mock fallback，并记录错误日志。 |

## Configuration

| Name | Default | Purpose |
|------|---------|---------|
| `WORKFLOW_MOCK` | `true` | 本地默认使用 mock 风险扫描。 |
| `WORKFLOW_TIMEOUT` | `10` | 真实 workflow 超时时间。 |

## Switching to Real Workflow

1. 在 `workflow_adapter.py` 中实现 `_call_real_workflow(payload, timeout)`。
2. 把真实平台返回归一化为 `risk_level`、`risk_items`、`suggested_action`、`confidence`。
3. 设置 `WORKFLOW_MOCK=false`。
4. 复测 Invalid input、Timeout、Empty result、Platform error 四类路径。

## Readiness Probe

文档阶段只运行：

```bash
./bin/check-docs docs/sample-doc-validation/contract-risk-review
```

实现完成后再运行：

```bash
DEMO_BASE_URL=http://127.0.0.1:5000 \
DEMO_PRIMARY_LOOP_PATH=/contracts/new \
DEMO_BUSINESS_API_PATH=/api/contracts/risk-scan \
DEMO_BUSINESS_API_PAYLOAD='{"title":"采购服务合同","counterparty":"乙方科技有限公司","contract_type":"service","department":"采购部","clause_text":"本合同自动续约，甲方无单方解除权。"}' \
./bin/check-demo .
```

## Test Examples

```bash
curl -s -X POST http://127.0.0.1:5000/api/contracts/risk-scan \
  -H "Content-Type: application/json" \
  -d '{"title":"采购服务合同","counterparty":"乙方科技有限公司","contract_type":"service","department":"采购部","clause_text":"本合同自动续约，甲方无单方解除权。"}'
```
