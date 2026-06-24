# 设备巡检派单技术方案

## 需求基线引用

- Primary user: 运维主管。
- Primary loop: 主管选择待巡检设备和日期，系统调用 AI workflow 推荐巡检人员和路线/优先级，主管确认派单。
- Core entity: 巡检派单任务。
- Core states: pending, recommended, assigned, completed。
- Workflow input: 设备编号、设备类型、位置、风险等级、上次巡检日期、目标日期、可用人员及技能。
- Workflow output: recommended_staff、priority、route_hint、reason、confidence。
- Acceptance check: 在本地后台选择“高压配电柜 A-102”后，页面推荐具备电气资质且目标日期可用的人员，并可确认派单。
- Out of scope: 真实资产系统同步、人员考勤系统、地图路径规划、移动端巡检打卡。

## 已选方案引用

- Selected option: Option 3 - Persistence-First Admin。
- Selected by: Agent default。
- Tradeoff accepted: 使用本地 JSON seed 表示设备和人员池，不接真实资产/考勤系统。
- Customization: 派单结果仍通过 `workflow_adapter.py` 保持同形 mock / real envelope。

## 参考模式

| Pattern | Source File | Why Used |
|---------|-------------|----------|
| pc-admin-requirements-pattern | docs/template-patterns/pc-admin-requirements-pattern.md | 固定需求事实和未知项边界。 |
| pc-admin-tech-plan-pattern | docs/template-patterns/pc-admin-tech-plan-pattern.md | 生成页面、字段、文件和存储计划。 |
| operation-flow-patterns | docs/template-patterns/operation-flow-patterns.md | 使用 Assign-and-Track、List-and-Act、Dashboard Summary。 |
| page-component-patterns | docs/template-patterns/page-component-patterns.md | 复用 dashboard、list、form、detail/review 页面。 |
| workflow-integration-pattern | docs/template-patterns/workflow-integration-pattern.md | 统一派单推荐 API、fallback 和错误处理。 |

## 技术栈

- Backend: Flask。
- Frontend: Tailwind CSS + native HTML/JS。
- AI workflow adapter: `workflow_adapter.py`。
- Data store: local JSON fixture for equipment/staff seed plus in-memory task updates。
- Test runner: `bin/check-docs .` 验证文档包，`bin/check-demo .` 留给实现后验收。

## Primary Loop API

| Item | Value |
|------|-------|
| Page route | `/inspections/dispatch` |
| Business API endpoint | `/api/inspections/assign` |
| Method | POST |
| Success JSON envelope | `{ok, data, error, fallback}` |
| Invalid input behavior | HTTP 400 with `error.code: INVALID_INPUT` |

## 菜单规划

| Top Menu | Sub Menu | Route | Layer |
|----------|----------|-------|-------|
| 工作台 | 巡检概览 | `/dashboard` | foundation |
| 设备巡检 | 待巡检设备 | `/inspections/equipment` | core |
| 设备巡检 | 智能派单 | `/inspections/dispatch` | core |
| 设备巡检 | 派单任务 | `/inspections/tasks` | supporting |

## 页面规划

| Page | Route | Layer | Source | Keep Reason | Cut Plan |
|------|-------|-------|--------|-------------|----------|
| 巡检工作台 | `/dashboard` | foundation | shell + pattern:page-component-patterns | 展示高风险设备、待派单和今日任务。 | 保留。 |
| 待巡检设备 | `/inspections/equipment` | core | pattern:operation-flow-patterns | 主管从设备列表进入派单。 | 不裁剪。 |
| 智能派单 | `/inspections/dispatch` | core | business-requirement | 主闭环页面，选择设备和日期并推荐人员。 | 不裁剪。 |
| 派单任务 | `/inspections/tasks` | supporting | pattern:operation-flow-patterns | 查看 assigned/completed 任务。 | 时间不足时只做列表。 |
| 任务详情 | `/inspections/tasks/<id>` | supporting | pattern:page-component-patterns | 展示推荐理由和确认记录。 | 可合并到列表抽屉。 |

## 实体映射

| Entity | Fields | Storage | Notes |
|--------|--------|---------|-------|
| Equipment | id, code, name, type, location, risk_level, last_inspected_at, required_skill | JSON fixture | V1 使用 seed 数据。 |
| Staff | id, name, skills, available_dates, current_load | JSON fixture | 用于 mock 推荐。 |
| InspectionTask | id, equipment_id, target_date, recommended_staff, priority, route_hint, reason, status, created_at | in-memory list | 实现后可持久化到 JSON。 |

## 字段映射

| UI Field | Data Field | Type | Required | Validation |
|----------|------------|------|----------|------------|
| 设备编号 | equipment_code | string | yes | must exist in fixture |
| 目标日期 | target_date | date | yes | today or future |
| 风险等级 | risk_level | enum | yes | low / medium / high |
| 设备类型 | equipment_type | enum | yes | electrical / elevator / fire / hvac |
| 可用人员 | staff_pool | array | yes | at least one available staff |
| 推荐人员 | recommended_staff | string | no | from workflow output |
| 优先级 | priority | enum | no | low / medium / high |

## 生成文件计划

| File | Action | Source | Purpose |
|------|--------|--------|---------|
| `app.py` | modify | shell | 增加巡检页面、fixture 加载、派单任务和业务 API。 |
| `workflow_adapter.py` | modify | shell | 增加设备巡检 mock 推荐逻辑。 |
| `data/equipment.json` | create | business-requirement | seed 设备台账。 |
| `data/staff.json` | create | business-requirement | seed 人员技能和可用性。 |
| `templates/dashboard/index.html` | modify | shell + pattern:page-component-patterns | 展示巡检统计。 |
| `templates/inspections/equipment.html` | create | pattern:operation-flow-patterns | 待巡检设备列表。 |
| `templates/inspections/dispatch.html` | create | business-requirement | 主闭环派单页面。 |
| `templates/inspections/tasks.html` | create | pattern:operation-flow-patterns | 派单任务列表。 |
| `docs/technical/workflow-integration.md` | modify | pattern:workflow-integration-pattern | 记录派单 API 契约。 |
| `docs/technical/test-cases.md` | modify | business-requirement | 记录文档阶段和实现阶段测试。 |

## Workflow Mock Contract

```json
{
  "request": {
    "equipment_code": "A-102",
    "equipment_type": "electrical",
    "location": "1号配电房",
    "risk_level": "high",
    "last_inspected_at": "2026-05-10",
    "target_date": "2026-06-25",
    "staff_pool": [
      {"name": "陈工", "skills": ["electrical"], "available": true, "current_load": 2}
    ]
  },
  "response": {
    "ok": true,
    "data": {
      "recommended_staff": "陈工",
      "priority": "high",
      "route_hint": "先检查1号配电房，再处理同区域低压柜。",
      "reason": "设备风险高，陈工具备电气资质且目标日期可用。",
      "confidence": 0.9
    },
    "error": null,
    "fallback": true
  }
}
```

## 数据存储决策

| Store | Why Enough For V1 | Reset / Seed Strategy | Upgrade Path |
|-------|-------------------|-----------------------|--------------|
| JSON fixture + in-memory tasks | 设备和人员需要可重复 seed，派单结果只需本地演示。 | `data/equipment.json`、`data/staff.json` 启动加载，任务重启清空。 | SQLite 或资产/考勤系统 API。 |

## 变更决策

| Decision | Original Plan | Changed To | Reason |
|----------|---------------|------------|--------|
| 数据来源 | 未确定 | JSON fixture | 设备台账接口未知，文档验证阶段不阻塞。 |

## 已知限制

- 本样例只验证文档包，不验证真实排班算法。
- 地图路线、移动端巡检和人员考勤不纳入 V1。
