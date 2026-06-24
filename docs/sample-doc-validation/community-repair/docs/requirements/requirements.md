# 社区报修需求文档

## 澄清记录

| 问题 | 回答 | Answer Type | 决策影响 |
|------|------|-------------|----------|
| 谁发起报修闭环？ | 社区居民或网格员在后台录入报修问题。 | Behavior Fact | Primary user 设为报修登记员。 |
| 报修后最短可演示结果是什么？ | 系统根据描述给出分类、紧急程度和建议处理部门。 | Workflow Rule | Primary loop 聚焦智能分流。 |
| V1 是否需要真实派单通知？ | 不需要，只在后台生成建议派单结果。 | Concrete Constraint | 外部通知列为范围外。 |
| 报修数据从哪里来？ | 页面表单录入位置、问题描述、联系人和图片备注。 | Data Fact | 字段映射包含位置、描述、联系人、附件备注。 |
| 怎么判断文档阶段符合业务诉求？ | 能说明“录入报修 -> AI 分流 -> 人工确认派单”的后台闭环。 | Acceptance Fact | 验收标准绑定主闭环。 |
| 希望后续更智能 | 这是期望，不作为 V1 必做。 | Attitude / Wish | 记录为后续风险，不进入必需基线。 |
| 是否接入物业真实工单系统？ | 未知。 | Unknown | V1 使用 mock fallback 和本地台账。 |

## 假设

| 假设 | 原因 | 错误风险 |
|------|------|----------|
| 单社区、单后台账号即可演示。 | 样例目标是文档质量验证，不验证多租户。 | 后续真实部署需要权限和租户模型。 |
| 附件只记录文字备注。 | 文档阶段不实现上传链路。 | 图片证据无法演示。 |
| AI 平台不可用时必须同形 mock。 | 本地手测需要稳定结果。 | 如果 mock 和真实响应不同，后续联调会漂移。 |

## 产品形态

- 目标应用类型：PC 后台/社区治理工作台。
- 登录后首屏：报修工单工作台，展示待分流、待派单、处理中和已关闭统计。
- 必需后台页面：工作台、报修登记表单、报修台账列表、工单详情/派单确认。
- 明确不做：营销页、移动端居民小程序、纯聊天页、纯统计报告页。

## 需求基线

- Primary user: 社区报修登记员。
- Primary loop: 登记员录入居民报修，系统调用 AI workflow 给出分类、紧急程度和建议处理部门，登记员确认派单。
- Core entity: 报修工单。
- Core states: draft, triaged, dispatched, closed。
- Workflow input: 小区位置、故障描述、联系人、附件备注。
- Workflow output: 问题分类、priority、建议处理部门、处理建议、confidence。
- Acceptance check: 在本地后台输入“3 号楼电梯反复停运”，页面展示 AI 分流结果并可确认派单。
- Out of scope: 真实物业系统同步、短信/微信通知、图片上传、复杂权限。

## 基线分类

| Baseline Field | Evidence | Answer Type | Risk / Follow-up |
|----------------|----------|-------------|------------------|
| Primary user | “社区居民或网格员在后台录入报修问题” | Behavior Fact | 若居民端优先，需要改成移动端入口。 |
| Primary loop | “录入报修 -> AI 分流 -> 人工确认派单” | Workflow Rule | 派单后处理流不展开。 |
| Core entity | 报修问题有位置、描述、联系人、状态 | Data Fact | 附件先用备注代替。 |
| Core states | draft, triaged, dispatched, closed | Workflow Rule | 后续可加 rejected/escalated。 |
| Workflow input | 位置、描述、联系人、附件备注 | Data Fact | 真实图片识别不纳入。 |
| Workflow output | 分类、priority、部门、建议、confidence | Data Fact | 真实平台字段需按 envelope 适配。 |
| Acceptance check | 本地输入电梯停运并看到分流结果 | Acceptance Fact | 只验证文档，不验证实现。 |
| Out of scope | 通知、上传、权限、系统同步 | Concrete Constraint | 业务方要求时进入二期。 |
| 智能程度更高 | 后续希望，不影响 V1 闭环 | Attitude / Wish | 转为后续增强。 |
| 物业系统接口 | 未提供接口资料 | Unknown | V1 只保留 mock adapter。 |

## 主闭环

```text
1. 登记员登录 PC 后台。
2. 打开“报修登记”页面，填写位置、描述、联系人和附件备注。
3. 点击“智能分流”，本地业务 API 调用 workflow adapter。
4. AI workflow / mock 返回分类、priority、建议处理部门和处理建议。
5. 页面展示分流结果，登记员确认派单并进入台账。
```

## 验收检查

- [x] 文档明确 PC 后台/工作台形态。
- [x] 主闭环覆盖用户输入、业务 API、workflow adapter、结果展示和人工确认。
- [x] AI workflow adapter 有同形 mock fallback。
- [x] 必需基线字段没有停留在 `Attitude / Wish` 或 `Unknown`。
- [x] 范围外事项明确，不把通知、上传、真实系统同步放入 V1。

## 范围外

- 真实物业/工单平台同步。
- 短信、微信、电话通知。
- 图片上传与图片识别。
- 多角色细粒度权限。
