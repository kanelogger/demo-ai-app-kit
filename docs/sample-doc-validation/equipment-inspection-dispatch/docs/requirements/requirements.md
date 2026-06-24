# 设备巡检派单需求文档

## 澄清记录

| 问题 | 回答 | Answer Type | 决策影响 |
|------|------|-------------|----------|
| 谁发起派单？ | 运维主管在后台查看待巡检设备并生成派单。 | Behavior Fact | Primary user 设为运维主管。 |
| 最短可演示闭环是什么？ | 选择设备和巡检日期，AI 根据设备风险和人员技能建议巡检人员，主管确认派单。 | Workflow Rule | Primary loop 聚焦智能推荐派单。 |
| 是否需要真实人员排班系统？ | 不需要，使用本地人员池和 mock 推荐。 | Concrete Constraint | 外部排班系统列为范围外。 |
| 巡检任务需要哪些数据？ | 设备编号、位置、设备类型、上次巡检日期、风险等级、人员技能和可用日期。 | Data Fact | 形成设备、人员、派单任务字段映射。 |
| 怎么验收文档阶段？ | 文档能说明“设备选择 -> AI 推荐人员 -> 主管确认派单”的后台闭环。 | Acceptance Fact | 测试用例覆盖推荐与确认。 |
| 希望自动平衡所有人员工作量 | 这是愿望，V1 只给建议。 | Attitude / Wish | 记录为二期优化，不进入必需闭环。 |
| 设备台账来源是否已有接口？ | 未知。 | Unknown | V1 使用本地 seed 数据。 |

## 假设

| 假设 | 原因 | 错误风险 |
|------|------|----------|
| 设备和人员数据使用本地 seed。 | 文档验证不依赖真实资产系统。 | 真实数据结构可能不同。 |
| 主管可以覆盖 AI 推荐。 | 派单仍需人工确认。 | 如果要求全自动派单，需要新增审计规则。 |
| V1 只支持单日派单。 | 避免变成复杂排班系统。 | 多日巡检计划需要后续扩展。 |

## 产品形态

- 目标应用类型：PC 后台/设备巡检派单工作台。
- 登录后首屏：设备巡检工作台，展示高风险设备、待派单任务、今日巡检和人员可用性。
- 必需后台页面：工作台、待巡检设备列表、智能派单表单、派单任务详情。
- 明确不做：移动巡检 App、地图调度大屏、聊天机器人、纯统计报告页。

## 需求基线

- Primary user: 运维主管。
- Primary loop: 主管选择待巡检设备和日期，系统调用 AI workflow 推荐巡检人员和路线/优先级，主管确认派单。
- Core entity: 巡检派单任务。
- Core states: pending, recommended, assigned, completed。
- Workflow input: 设备编号、设备类型、位置、风险等级、上次巡检日期、目标日期、可用人员及技能。
- Workflow output: recommended_staff、priority、route_hint、reason、confidence。
- Acceptance check: 在本地后台选择“高压配电柜 A-102”后，页面推荐具备电气资质且目标日期可用的人员，并可确认派单。
- Out of scope: 真实资产系统同步、人员考勤系统、地图路径规划、移动端巡检打卡。

## 基线分类

| Baseline Field | Evidence | Answer Type | Risk / Follow-up |
|----------------|----------|-------------|------------------|
| Primary user | “运维主管在后台查看待巡检设备并生成派单” | Behavior Fact | 如果巡检员自领任务，需要改主用户。 |
| Primary loop | “设备选择 -> AI 推荐人员 -> 主管确认派单” | Workflow Rule | 完成回填不纳入主闭环。 |
| Core entity | 巡检派单任务含设备、人员、日期、状态 | Data Fact | 设备/人员来源先 seed。 |
| Core states | pending, recommended, assigned, completed | Workflow Rule | 可扩展 cancelled / overdue。 |
| Workflow input | 设备、风险、日期、人员技能和可用性 | Data Fact | 真实排班系统未知。 |
| Workflow output | recommended_staff、priority、route_hint、reason、confidence | Data Fact | 路线只做提示，不做地图。 |
| Acceptance check | 高压配电柜推荐电气资质人员 | Acceptance Fact | 只验证文档包。 |
| Out of scope | 资产同步、考勤、地图、移动端 | Concrete Constraint | 实施阶段避免过重。 |
| 工作量自动均衡 | 后续优化愿望 | Attitude / Wish | 二期作为优化策略。 |
| 设备台账接口 | 未知 | Unknown | V1 使用本地 seed。 |

## 主闭环

```text
1. 运维主管登录 PC 后台。
2. 打开“待巡检设备”，选择设备和目标巡检日期。
3. 点击“智能推荐派单”，业务 API 调用 workflow adapter。
4. AI workflow / mock 返回推荐人员、优先级、路线提示和推荐理由。
5. 主管确认或覆盖推荐，派单任务进入 assigned 状态。
```

## 验收检查

- [x] 文档明确 PC 后台/派单工作台形态。
- [x] 主闭环覆盖设备选择、业务 API、workflow adapter、推荐结果和人工确认。
- [x] workflow 输出包含推荐人员、优先级、路线提示、理由和 confidence。
- [x] 必需基线字段没有停留在 `Attitude / Wish` 或 `Unknown`。
- [x] 范围外事项明确，不把地图、移动端和真实排班系统塞进 V1。

## 范围外

- 真实资产系统和人员考勤系统同步。
- 地图路径规划和定位。
- 移动端巡检打卡。
- 跨日复杂排班和自动工作量均衡。
