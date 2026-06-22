# 方案 B 具体调整方案：通用 PC 后台模板 + Agent 动态规划

## 结论

选择方案 B：保留现有 Flask + 原生 HTML/CSS/JS + PC 后台模板底座，轻量去周报化，并把“页面、菜单、实体、字段、主流程文案”的动态调整责任写进 Agent 合同。

核心判断：

- 页面不需要先按数量压缩。只要和目标业务相关，就可以先保留。
- 真正要控制的是相关性、主次关系和后续删除成本。
- 生成项目先保证业务闭环完整，再按 `optional-cut` 清单聚焦精简。

## 目标

把当前 `templates/flask-adminlte-week-report/` 从“周报系统模板”调整为“通用 PC 后台业务壳”。

生成项目应满足：

- 符合技术栈：Python 3.10 后端、原生 HTML/CSS/JS 前端、Node.js CLI。
- 面向 PC 浏览器，不做移动端适配。
- 页面数量由业务相关性决定，不设固定上限。
- 相关页面可以保留，但必须标注主次和删除切口。
- 非周报业务不得残留明显无关的周报可见文案。
- AI workflow 通过 `workflow_adapter.py` 接入，必须有同形 mock fallback。

## 页面策略

Agent 在实现前必须产出 Page Plan，并按下面五类标注每个页面。

| 层级 | 含义 | 处理策略 |
| --- | --- | --- |
| `core` | 完成主业务闭环必须经过的页面 | 必须实现、必须验收 |
| `supporting` | 与主闭环相关，能增强演示可信度或解释完整性的页面 | 可以保留，必须写保留理由 |
| `foundation` | 登录、工作台、用户、角色、字典、菜单等后台基础能力 | 按业务需要保留，不能喧宾夺主 |
| `optional-cut` | 业务相关但当前演示不一定需要的页面 | 可以先保留，必须写删除切口 |
| `delete` | 与目标业务无关，或只是周报遗留的页面 | 应删除或彻底弱化 |

页面数量不设固定上限。判断标准不是“少”，而是：

- 是否服务目标业务。
- 是否支撑主闭环或演示解释。
- 是否已经去周报化。
- 是否能在后续快速裁剪。

## Agent 输出合同

生成项目实现前，Agent 必须在 `docs/tech-plan.md` 中写出以下合同。

### 1. Menu Plan

必须包含：

- 系统名称。
- 一级菜单、二级菜单。
- 每个菜单的目标路由。
- 每个菜单对应的页面层级：`core` / `supporting` / `foundation` / `optional-cut` / `delete`。
- 从源模板保留、重命名、删除的菜单列表。

### 2. Page Plan

必须包含：

| Page | Route | Layer | Source template | Keep reason | Cut plan |
| --- | --- | --- | --- | --- | --- |

要求：

- `core` 页面必须覆盖完整主业务闭环。
- `supporting` 和 `foundation` 页面必须写清保留理由。
- `optional-cut` 页面必须写删除切口。
- `delete` 页面必须列出删除范围。

删除切口至少包括：

- Flask route。
- Jinja template 或静态 HTML。
- sidebar/menu 配置。
- mock data。
- JS 事件或渲染入口。
- README/docs/test-report 引用。

### 3. Entity Mapping

必须把源模板实体映射到目标业务实体。

| Source entity | Target entity | Keep/rename/delete | Reason |
| --- | --- | --- | --- |

常见源实体包括：

- 周报。
- 周报模板。
- 用户。
- 角色。
- 部门。
- 字典。
- 菜单。
- 公告。
- 操作日志。

### 4. Field Mapping

必须说明字段在 UI、API/workflow、mock fixture 中的对应关系。

| UI field | Local/API field | Workflow field | Mock fixture field | Required |
| --- | --- | --- | --- | --- |

规则：

- 主闭环字段必须同时出现在 UI 和 mock/API/workflow 中。
- 只出现在 UI、不进入数据或 workflow 的字段，必须说明原因。
- 只出现在 mock、不展示给用户的字段，必须标为内部字段或删除。

### 5. Copy Rewrite Checklist

必须替换：

- 系统名。
- 登录页标题。
- 首页标题和统计卡片。
- 菜单名。
- 页面标题。
- 表格列。
- 筛选项。
- 表单 label。
- 按钮。
- badge。
- 空状态。
- toast / alert / modal 文案。
- mock 数据中的实体名称。
- README、docs、test-report 中的业务名称。

非周报业务中，明显无关的“周报”可见文案视为未完成。

### 6. Workflow Mock Contract

必须保留统一 envelope：

```json
{
  "ok": true,
  "data": {},
  "error": null,
  "fallback": true
}
```

必须定义：

- request JSON。
- success response JSON。
- invalid input response。
- timeout response。
- empty result response。
- platform failure response。
- mock response 与真实 workflow response 的同形约束。

## 文件级调整清单

### P1：更新 `skills/template-adapter/SKILL.md`

目标：让 Agent 不再只做“换文案”，而是先规划页面、菜单、实体、字段和删除切口。

具体调整：

- 把描述从“adapt week-report template”改成“adapt generic PC admin shell derived from week-report template”。
- 在 Workflow 中新增：
  - 先输出 `Menu Plan`。
  - 再输出 `Page Plan`。
  - 再输出 `Entity Mapping`。
  - 再输出 `Field Mapping`。
  - 最后执行模板改造。
- 在 Output Contract 中新增：
  - `Page Layers`。
  - `Optional Cut Plan`。
  - `Copy Rewrite Checklist`。
- 在 Rules 中明确：
  - 页面数量不设固定上限。
  - 业务相关页面可保留。
  - `optional-cut` 页面必须可删除。
  - 不得残留无关周报可见文案。

### P2：更新 `skills/tech-plan-generator/SKILL.md`

目标：让 SDD-lite 成为模板改造前的冻结合同。

具体调整：

- 在 `Pages` 输出中增加 `Layer` 和 `Cut plan`。
- 在 `SDD-Lite Contract` 中增加：
  - `Menu Plan`。
  - `Page Plan`。
  - `Entity Mapping`。
  - `Field Mapping`。
  - `Workflow Mock Contract`。
- 修改规则：
  - 不要求页面数量最少。
  - 要求页面必须业务相关。
  - 要求 `optional-cut` 页面列出删除切口。
  - 要求 `delete` 页面列出删除范围。

### P3：更新 `prompts/opencode-entry.md`

目标：入口 prompt 明确 Agent 的执行顺序。

具体调整：

- 在实施前要求先产出：
  - `Menu Plan`。
  - `Page Plan`。
  - `Entity Mapping`。
  - `Field Mapping`。
  - `Copy Rewrite Checklist`。
- 明确页面策略：
  - 不按固定数量裁剪。
  - 业务相关页面可保留。
  - 先完成主闭环，再裁剪 `optional-cut`。
- 明确 PC 端优先。
- 明确不做 React/Vue/Java 多模板矩阵。

### P4：更新 `bin/demo-ai-app`

目标：生成项目 README 从一开始就告诉 Agent 和开发者：这是待改造后台壳，不是周报系统。

具体调整：

- README skeleton 中加入“Template Adaptation Contract”。
- README skeleton 中说明页面分层。
- README skeleton 中加入 `optional-cut` 页面记录要求。
- README skeleton 中保留 workflow adapter 说明。
- 默认技术栈继续写 Flask + 原生 HTML/CSS/JS。

### P5：更新 `bin/check-demo`

目标：验收重点从“页面数量”转为“业务闭环和去周报化质量”。

具体调整：

- 不检查页面数量。
- 检查 README 是否包含：
  - run command。
  - local URL。
  - primary loop。
  - workflow adapter。
  - mock fallback。
  - page plan 或页面分层说明。
- 对 generated app 增加领域残留检查：
  - 如果 README 或 docs 表明目标业务不是周报，则可见页面、README、docs、mock 数据中不应残留明显无关“周报”文案。
- 检查 `docs/tech-plan.md` 是否包含：
  - `Menu Plan`。
  - `Page Plan`。
  - `Field Mapping`。
  - `Workflow Mock Contract`。

### P6：轻量改造模板文案和结构说明

目标：降低 Agent 漏改风险，但不重构整个模板。

具体调整：

- 保留 `templates/flask-adminlte-week-report/` 目录名，避免一次性大迁移。
- 在模板 README 或新增说明中声明：该目录是通用后台壳来源，不是固定周报业务。
- 把明显入口文案改得更通用：
  - 登录页说明。
  - 系统标题。
  - README 示例描述。
- 保留页面模式：
  - 登录。
  - 工作台。
  - 列表。
  - 表单。
  - 详情。
  - 审核/处理。
  - 基础配置。
  - 公告/日志。
- 周报专属页面不必马上全删，但必须在 Page Plan 中被归类和说明。

### P7：更新 `docs/checklists/demo-readiness.md`

目标：手工验收也按新策略检查。

具体调整：

- 增加页面分层检查。
- 增加 `optional-cut` 删除切口检查。
- 增加无关周报文案残留检查。
- 增加主闭环可演示检查。

## 推荐实施顺序

1. 改 `skills/template-adapter/SKILL.md`。
2. 改 `skills/tech-plan-generator/SKILL.md`。
3. 改 `prompts/opencode-entry.md`。
4. 改 `bin/demo-ai-app` 的 README skeleton。
5. 改 `bin/check-demo`。
6. 补模板说明和少量入口文案。
7. 用样题生成项目验证。
8. 根据样题结果再决定是否继续重构模板目录。

## 样题验证

用 3 个业务题测试模板迁移性：

1. 社区报修。
2. 设备巡检。
3. 工单分派。

每个样题至少验证：

- 生成项目能启动。
- Agent 能先输出页面、菜单、实体、字段规划。
- 主闭环能在 PC 浏览器完成。
- workflow mock fallback 可用。
- 相关页面可以保留。
- `optional-cut` 页面有删除切口。
- 非周报业务无明显无关周报文案。
- `./bin/check-demo .` 通过，或失败项具体可修。

## 不做事项

- 不引入 React/Vue 多模板矩阵。
- 不引入 Java17 后端模板。
- 不把 MySQL / Redis 变成首版强依赖。
- 不做移动端适配。
- 不把 Star Agent 平台细节写死进模板。
- 不把页面数量作为验收指标。

## 完成标准

方案 B 第一阶段完成时，应满足：

- Agent 合同已经写进 `template-adapter`、`tech-plan-generator` 和入口 prompt。
- 生成项目 README 已包含页面分层和 workflow fallback 说明。
- `check-demo` 能检查主闭环、workflow fallback、页面计划和领域残留。
- 当前模板仍可本地启动。
- 至少一个非周报样题可以完成主闭环并通过 readiness 检查。
