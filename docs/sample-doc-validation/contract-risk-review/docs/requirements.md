# 合同风险审核需求文档

## 澄清记录

| 问题 | 回答 | Answer Type | 决策影响 |
|------|------|-------------|----------|
| 谁发起审核？ | 法务助理在后台上传或粘贴合同关键条款。 | Behavior Fact | Primary user 设为法务助理。 |
| 最短可演示闭环是什么？ | 输入合同摘要/条款，AI 标注风险等级、风险条款和建议动作，审核员确认。 | Workflow Rule | Primary loop 聚焦风险扫描和人工确认。 |
| V1 是否需要真实文件解析？ | 不需要，先粘贴文本或摘要。 | Concrete Constraint | 文件上传和 OCR 列为范围外。 |
| 合同需要哪些字段？ | 合同名称、相对方、金额、条款文本、业务部门、截止日期。 | Data Fact | 形成 ContractReview 字段映射。 |
| 怎么验收文档阶段？ | 文档能说明“提交合同 -> 风险扫描 -> 法务确认处理建议”的后台闭环。 | Acceptance Fact | 测试用例覆盖主闭环和 INVALID_INPUT。 |
| 希望支持所有合同类型 | 这是愿望，V1 先覆盖采购/服务合同。 | Attitude / Wish | 降级为假设和后续增强。 |
| 公司风险规则库是否已有？ | 未知。 | Unknown | V1 使用内置 mock 规则，保留规则库扩展点。 |

## 假设

| 假设 | 原因 | 错误风险 |
|------|------|----------|
| V1 只处理采购合同和服务合同。 | 缺少完整规则库，样例目标是文档验证。 | 真实业务覆盖面不足。 |
| 条款文本由用户粘贴。 | 文档阶段不验证文件解析。 | 后续需要接入文件上传和解析。 |
| AI 输出必须由法务人工确认。 | 风险审核不能自动替代决策。 | 如果业务要求自动通过，需要新增规则边界。 |

## 产品形态

- 目标应用类型：PC 后台/合同风险审核工作台。
- 登录后首屏：待审核合同列表和风险分布统计。
- 必需后台页面：工作台、合同录入表单、风险审核列表、风险详情/确认处理。
- 明确不做：合同管理营销页、移动审批、聊天问答页、纯风险报告生成器。

## 需求基线

- Primary user: 法务助理。
- Primary loop: 法务助理提交合同条款，系统调用 AI workflow 扫描风险，法务确认风险等级和处理建议。
- Core entity: 合同审核单。
- Core states: draft, scanned, reviewed, archived。
- Workflow input: 合同名称、相对方、金额、合同类型、条款文本、业务部门、截止日期。
- Workflow output: risk_level、risk_items、suggested_action、confidence。
- Acceptance check: 在本地后台粘贴含“自动续约且无单方解除权”的条款后，页面展示高风险条款和建议补充解除条款。
- Out of scope: 文件上传/OCR、电子签、真实规则库、自动审批。

## 基线分类

| Baseline Field | Evidence | Answer Type | Risk / Follow-up |
|----------------|----------|-------------|------------------|
| Primary user | “法务助理在后台上传或粘贴合同关键条款” | Behavior Fact | 如果业务部门自助提交，需要新增提交人角色。 |
| Primary loop | “提交合同 -> 风险扫描 -> 法务确认处理建议” | Workflow Rule | 自动审批不纳入。 |
| Core entity | 合同审核单包含合同、相对方、金额、条款、状态 | Data Fact | 文件附件先不做。 |
| Core states | draft, scanned, reviewed, archived | Workflow Rule | 可扩展 rejected / needs_revision。 |
| Workflow input | 合同字段和条款文本 | Data Fact | OCR 不作为输入来源。 |
| Workflow output | risk_level、risk_items、suggested_action、confidence | Data Fact | 风险规则需后续真实校准。 |
| Acceptance check | 自动续约条款被标为高风险 | Acceptance Fact | 只验证文档包，不保证法律结论。 |
| Out of scope | 文件解析、电子签、真实规则库、自动审批 | Concrete Constraint | 真实上线前必须补充。 |
| 支持所有合同类型 | 业务期望 | Attitude / Wish | V1 限定采购/服务合同。 |
| 风险规则库 | 未提供资料 | Unknown | 保留扩展点。 |

## 主闭环

```text
1. 法务助理登录 PC 后台。
2. 打开“新建合同审核”，填写合同基本信息并粘贴条款文本。
3. 点击“扫描风险”，业务 API 调用 workflow adapter。
4. AI workflow / mock 返回风险等级、风险条目和建议动作。
5. 法务确认风险处理建议，审核单进入 reviewed 状态。
```

## 验收检查

- [x] 文档明确 PC 后台/审核工作台形态。
- [x] 主闭环覆盖合同输入、风险扫描、AI workflow、结果展示和人工确认。
- [x] 风险审核输出使用稳定 JSON envelope。
- [x] 必需基线字段没有停留在 `Attitude / Wish` 或 `Unknown`。
- [x] 范围外事项明确，不把文件解析和自动审批塞进 V1。

## 范围外

- 文件上传、OCR 和 Word/PDF 解析。
- 电子签和合同归档系统集成。
- 企业真实风险规则库维护。
- 自动审批或自动放行合同。
