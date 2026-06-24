# 合同风险审核技术方案

## 需求基线引用

- Primary user: 法务助理。
- Primary loop: 法务助理提交合同条款，系统调用 AI workflow 扫描风险，法务确认风险等级和处理建议。
- Core entity: 合同审核单。
- Core states: draft, scanned, reviewed, archived。
- Workflow input: 合同名称、相对方、金额、合同类型、条款文本、业务部门、截止日期。
- Workflow output: risk_level、risk_items、suggested_action、confidence。
- Acceptance check: 在本地后台粘贴含“自动续约且无单方解除权”的条款后，页面展示高风险条款和建议补充解除条款。
- Out of scope: 文件上传/OCR、电子签、真实规则库、自动审批。

## 已选方案引用

- Selected option: Option 1 - Fast Flask Admin。
- Selected by: Agent default。
- Tradeoff accepted: 使用粘贴文本和内置 mock 规则，不验证文件解析。
- Customization: 预留 `risk_rules` 字段，后续接企业规则库。

## 参考模式

| Pattern | Source File | Why Used |
|---------|-------------|----------|
| pc-admin-requirements-pattern | docs/template-patterns/pc-admin-requirements-pattern.md | 保证审核基线来自事实分类。 |
| pc-admin-tech-plan-pattern | docs/template-patterns/pc-admin-tech-plan-pattern.md | 规划菜单、页面、实体、字段和文件。 |
| operation-flow-patterns | docs/template-patterns/operation-flow-patterns.md | 使用 Review-and-Decide 与 List-and-Act。 |
| page-component-patterns | docs/template-patterns/page-component-patterns.md | 复用 dashboard、form、detail/review 页面。 |
| workflow-integration-pattern | docs/template-patterns/workflow-integration-pattern.md | 统一风险扫描 API 和 fallback。 |

## 技术栈

- Backend: Flask。
- Frontend: Tailwind CSS + native HTML/JS。
- AI workflow adapter: `workflow_adapter.py`。
- Test runner: `bin/check-docs .` 验证文档包，`bin/check-demo .` 留给实现后验收。

## Primary Loop API

| Item | Value |
|------|-------|
| Page route | `/contracts/new` |
| Business API endpoint | `/api/contracts/risk-scan` |
| Method | POST |
| Success JSON envelope | `{ok, data, error, fallback}` |
| Invalid input behavior | HTTP 400 with `error.code: INVALID_INPUT` |

## 菜单规划

| Top Menu | Sub Menu | Route | Layer |
|----------|----------|-------|-------|
| 工作台 | 风险概览 | `/dashboard` | foundation |
| 合同审核 | 新建审核 | `/contracts/new` | core |
| 合同审核 | 待确认列表 | `/contracts` | core |
| 合同审核 | 风险详情 | `/contracts/<id>` | supporting |

## 页面规划

| Page | Route | Layer | Source | Keep Reason | Cut Plan |
|------|-------|-------|--------|-------------|----------|
| 风险工作台 | `/dashboard` | foundation | shell + pattern:page-component-patterns | 展示待确认、高风险、已归档统计。 | 保留。 |
| 新建合同审核 | `/contracts/new` | core | business-requirement | 主闭环输入合同条款。 | 不裁剪。 |
| 审核列表 | `/contracts` | core | pattern:operation-flow-patterns | 法务按风险等级筛选处理。 | 不裁剪。 |
| 风险详情 | `/contracts/<id>` | supporting | pattern:page-component-patterns | 展示风险条款和确认动作。 | 时间不足时合并到列表。 |

## 实体映射

| Entity | Fields | Storage | Notes |
|--------|--------|---------|-------|
| ContractReview | id, title, counterparty, amount, contract_type, department, due_date, clause_text, risk_level, risk_items, suggested_action, status, created_at | in-memory list | V1 文档样例和本地演示足够。 |
| RiskItem | clause, risk_type, severity, reason, suggestion | workflow response data | 可由 mock 或真实 workflow 返回。 |

## 字段映射

| UI Field | Data Field | Type | Required | Validation |
|----------|------------|------|----------|------------|
| 合同名称 | title | string | yes | 2-80 chars |
| 相对方 | counterparty | string | yes | 2-80 chars |
| 合同金额 | amount | number | no | >= 0 |
| 合同类型 | contract_type | enum | yes | procurement / service |
| 条款文本 | clause_text | text | yes | 20-5000 chars |
| 业务部门 | department | string | yes | 2-60 chars |
| 截止日期 | due_date | date | no | ISO date |

## 生成文件计划

| File | Action | Source | Purpose |
|------|--------|--------|---------|
| `app.py` | modify | shell | 增加合同审核页面、内存列表和业务 API。 |
| `workflow_adapter.py` | modify | shell | 增加合同风险 mock 扫描逻辑。 |
| `templates/dashboard/index.html` | modify | shell + pattern:page-component-patterns | 展示合同风险统计。 |
| `templates/contracts/new.html` | create | business-requirement | 合同条款输入表单。 |
| `templates/contracts/index.html` | create | pattern:operation-flow-patterns | 待确认合同列表。 |
| `templates/contracts/detail.html` | create | pattern:page-component-patterns | 风险条款和法务确认。 |
| `docs/workflow-integration.md` | modify | pattern:workflow-integration-pattern | 记录风险扫描契约。 |
| `docs/test-cases.md` | modify | business-requirement | 记录文档阶段和实现阶段测试。 |

## Workflow Mock Contract

```json
{
  "request": {
    "title": "采购服务合同",
    "counterparty": "乙方科技有限公司",
    "amount": 300000,
    "contract_type": "service",
    "clause_text": "本合同自动续约，甲方无单方解除权。"
  },
  "response": {
    "ok": true,
    "data": {
      "risk_level": "high",
      "risk_items": [
        {
          "clause": "自动续约且无单方解除权",
          "risk_type": "termination_right",
          "severity": "high",
          "suggestion": "补充甲方提前通知后的单方解除权。"
        }
      ],
      "suggested_action": "requires_legal_revision",
      "confidence": 0.88
    },
    "error": null,
    "fallback": true
  }
}
```

## 数据存储决策

| Store | Why Enough For V1 | Reset / Seed Strategy | Upgrade Path |
|-------|-------------------|-----------------------|--------------|
| in-memory list | 文档验证只需证明合同审核闭环设计可落地。 | 启动时可 seed 2 条合同审核单。 | JSON 文件、SQLite 或企业合同库。 |

## 变更决策

| Decision | Original Plan | Changed To | Reason |
|----------|---------------|------------|--------|
| 文件解析 | 待定 | V1 粘贴条款文本 | 避免文档样例扩展到 OCR/PDF 解析。 |

## 已知限制

- 本样例只验证文档包，不验证真实法律规则正确性。
- 风险结论必须由法务人工确认，不能自动替代法律判断。
