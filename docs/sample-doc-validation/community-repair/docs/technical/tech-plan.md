# 社区报修技术方案

## 需求基线引用

- Primary user: 社区报修登记员。
- Primary loop: 登记员录入居民报修，系统调用 AI workflow 给出分类、紧急程度和建议处理部门，登记员确认派单。
- Core entity: 报修工单。
- Core states: draft, triaged, dispatched, closed。
- Workflow input: 小区位置、故障描述、联系人、附件备注。
- Workflow output: 问题分类、priority、建议处理部门、处理建议、confidence。
- Acceptance check: 在本地后台输入“3 号楼电梯反复停运”，页面展示 AI 分流结果并可确认派单。
- Out of scope: 真实物业系统同步、短信/微信通知、图片上传、复杂权限。

## 已选方案引用

- Selected option: Option 1 - Fast Flask Admin。
- Selected by: Agent default。
- Tradeoff accepted: 使用内存台账，重启后记录清空。
- Customization: 保留后续升级到 JSON 文件或 SQLite 的字段边界。

## 参考模式

| Pattern | Source File | Why Used |
|---------|-------------|----------|
| pc-admin-requirements-pattern | docs/template-patterns/pc-admin-requirements-pattern.md | 约束需求基线和事实分类。 |
| pc-admin-tech-plan-pattern | docs/template-patterns/pc-admin-tech-plan-pattern.md | 生成菜单、页面、字段和文件计划。 |
| operation-flow-patterns | docs/template-patterns/operation-flow-patterns.md | 使用 Fill-and-Submit、Assign-and-Track、List-and-Act。 |
| page-component-patterns | docs/template-patterns/page-component-patterns.md | 复用 dashboard、form、list、detail 页面形态。 |
| workflow-integration-pattern | docs/template-patterns/workflow-integration-pattern.md | 固定 JSON envelope、mock fallback 和错误处理。 |

## 技术栈

- Backend: Flask。
- Frontend: Tailwind CSS + native HTML/JS。
- AI workflow adapter: `workflow_adapter.py`。
- Test runner: `bin/check-docs .` 验证文档包，`bin/check-demo .` 留给实现后验收。

## Primary Loop API

| Item | Value |
|------|-------|
| Page route | `/repairs/new` |
| Business API endpoint | `/api/repairs/triage` |
| Method | POST |
| Success JSON envelope | `{ok, data, error, fallback}` |
| Invalid input behavior | HTTP 400 with `error.code: INVALID_INPUT` |

## 菜单规划

| Top Menu | Sub Menu | Route | Layer |
|----------|----------|-------|-------|
| 工作台 | 报修概览 | `/dashboard` | foundation |
| 报修管理 | 新建报修 | `/repairs/new` | core |
| 报修管理 | 报修台账 | `/repairs` | supporting |
| 报修管理 | 工单详情 | `/repairs/<id>` | supporting |

## 页面规划

| Page | Route | Layer | Source | Keep Reason | Cut Plan |
|------|-------|-------|--------|-------------|----------|
| 报修工作台 | `/dashboard` | foundation | shell + pattern:page-component-patterns | 展示待分流、待派单、处理中统计。 | 保留。 |
| 报修登记 | `/repairs/new` | core | business-requirement | 主闭环输入页面。 | 不裁剪。 |
| 报修台账 | `/repairs` | supporting | pattern:operation-flow-patterns | 支持确认派单后的记录查看。 | 时间不足时只做列表。 |
| 工单详情 | `/repairs/<id>` | supporting | pattern:page-component-patterns | 展示 AI 建议和人工确认记录。 | 可合并到列表抽屉。 |

## 实体映射

| Entity | Fields | Storage | Notes |
|--------|--------|---------|-------|
| RepairTicket | id, location, description, contact, attachment_note, category, priority, department, suggestion, confidence, status, created_at | in-memory list | V1 演示内存台账。 |
| TriageResult | category, priority, department, suggestion, confidence, fallback | workflow response data | 同形 mock / real 响应。 |

## 字段映射

| UI Field | Data Field | Type | Required | Validation |
|----------|------------|------|----------|------------|
| 小区位置 | location | string | yes | 2-80 chars |
| 问题描述 | description | string | yes | 5-500 chars |
| 联系人 | contact | string | yes | 2-40 chars |
| 附件备注 | attachment_note | string | no | max 200 chars |
| 分类 | category | string | no | from workflow output |
| 紧急程度 | priority | enum | no | low / medium / high |
| 处理部门 | department | string | no | from workflow output |

## 生成文件计划

| File | Action | Source | Purpose |
|------|--------|--------|---------|
| `app.py` | modify | shell | 增加报修页面、内存台账和业务 API。 |
| `workflow_adapter.py` | modify | shell | 增加社区报修 mock 分类逻辑。 |
| `templates/dashboard/index.html` | modify | shell + pattern:page-component-patterns | 展示报修统计和最近工单。 |
| `templates/repairs/new.html` | create | business-requirement | 主闭环表单页面。 |
| `templates/repairs/index.html` | create | pattern:operation-flow-patterns | 报修台账列表。 |
| `templates/repairs/detail.html` | create | pattern:page-component-patterns | 工单详情和派单确认。 |
| `docs/technical/workflow-integration.md` | modify | pattern:workflow-integration-pattern | 记录 API 契约和 fallback。 |
| `docs/technical/test-cases.md` | modify | business-requirement | 记录文档阶段和实现阶段测试。 |

## Workflow Mock Contract

```json
{
  "request": {
    "location": "幸福社区 3 号楼",
    "description": "3号楼电梯反复停运，老人上下楼困难",
    "contact": "王阿姨",
    "attachment_note": "物业群截图"
  },
  "response": {
    "ok": true,
    "data": {
      "category": "设施维修",
      "priority": "high",
      "department": "物业维修组",
      "suggestion": "优先派电梯维保单位排查，社区网格员同步跟进老人出行风险。",
      "confidence": 0.91
    },
    "error": null,
    "fallback": true
  }
}
```

## 数据存储决策

| Store | Why Enough For V1 | Reset / Seed Strategy | Upgrade Path |
|-------|-------------------|-----------------------|--------------|
| in-memory list | 文档样例和 10 小时演示只需展示闭环。 | 启动时内置 2 条示例工单。 | JSON 文件或 SQLite。 |

## 变更决策

| Decision | Original Plan | Changed To | Reason |
|----------|---------------|------------|--------|
| 持久化 | 未确定 | V1 内存台账 | 避免文档质量验证扩成完整端到端实现。 |

## 已知限制

- 本样例只验证文档包，不验证代码实现。
- 真实图片上传、通知和物业系统同步不纳入 V1。
