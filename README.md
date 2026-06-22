# demo-ai-app-kit

面向 AI Coding 场景的应用生成工具包，用于从一个简单业务需求生成可运行、可演示、可维护的 AI Web 应用。

## 项目定位

`demo-ai-app-kit` 不是固定业务系统，也不只是比赛脚手架。它是一条生成应用的生产线：给 Agent 一个需求，Agent 基于项目内模板、提示词、技能和验收脚本，产出可本地运行的应用、技术方案、测试结果和汇报材料。

目标流程：

```text
安装 kit
-> demo-ai-app <project-name>
-> 进入生成项目
-> 启动 Agent / OpenCode
-> 输入简单需求
-> 追问关键问题
-> 输出需求文档 + 技术方案 + SDD-lite
-> 按方案改模板生成代码
-> 联调测试 + check-demo
-> 生成汇报材料
```

当前比赛场景是第一条验证线，但项目核心目标是生成应用的质量：需求清楚、接口稳定、代码可读、能本地运行、有 mock fallback、有测试/验收、有可讲清的汇报材料。

## 当前状态

已完成：

- 自包含 `AGENTS.md`：不依赖用户本机全局配置，可复制进生成项目。
- `prompts/opencode-entry.md`：OpenCode / Agent 的入口总控提示词。
- 核心技能链路：需求追问、方案拷问、技术方案、模板改造、工作流集成、汇报生成。
- SDD-lite：已合并到 `skills/tech-plan-generator`，不使用独立重型 SDD 流程。
- `bin/check-demo`：基础 demo readiness 检查。
- `docs/checklists/demo-readiness.md`：本地 demo 验收清单。
- `docs/checklists/skill-pruning.md`：项目内技能筛选和 workflow。
- 第一批技能清理：已删除 `grill-me`、`decision-mapping`、`ce-test-browser`、`spec-driven-development`。
- 已删除不再使用的 `AGENTS-template.md`。

未完成：

- 还没有 `package.json`。
- 还没有真正的 `demo-ai-app <project-name>` 生成命令。
- 还需要固定生成项目中的 `docs/requirements.md`、`docs/tech-plan.md`、`docs/demo-script.md` 等产物路径。
- 还需要补 `docs/workflow-integration.md` 和 `docs/demo-script.md`。

## Product Workflow

```text
需求输入
-> question-refiner
-> solution-stress-test
-> tech-plan-generator / SDD-lite
-> template-adapter
-> workflow-integration-planner
-> tdd / webapp-testing / debugging-and-error-recovery
-> code-review-and-quality
-> demo-script-generator
```

默认行为：

1. 只追问真正阻塞的问题。
2. 先收敛一个完整主流程，再考虑扩展功能。
3. 优先复用模板，不从空白项目开始。
4. AI 工作流先定义稳定 request / response / error / timeout / mock fallback。
5. 所有生成应用都要能本地运行，并能通过 README 和 `bin/check-demo` 被检查。
6. 汇报材料必须基于已实现或已验证的应用行为生成。

## 核心资产

- `AGENTS.md`：自包含项目级 Agent 指令，定义产品目标、工作流、编码规则、验证规则和 Definition of Done。
- `prompts/opencode-entry.md`：输入需求后的第一条 Agent 总控提示词。
- `skills/question-refiner/`：把题目或应用想法收敛成用户、场景、痛点、输入、输出和验收标准。
- `skills/solution-stress-test/`：检查方案是否可构建、可运行、可讲清、风险是否可控。
- `skills/tech-plan-generator/`：生成页面、数据模型、接口、工作流契约、SDD-lite 和验证计划。
- `skills/template-adapter/`：要求优先改造现有后台模板，不从零搭应用。
- `skills/workflow-integration-planner/`：设计智能体工作流入参、出参、错误处理和 mock fallback。
- `skills/demo-script-generator/`：生成展示稿和评委问答。
- `skills/tdd/`：为本地 API、工作流 adapter、字段映射和 mock fixture 提供行为测试思路。
- `skills/webapp-testing/`：用 Playwright 验证本地 Web 应用。
- `skills/debugging-and-error-recovery/`：构建、测试或运行失败时定位根因。
- `skills/code-review-and-quality/`：提交或交付前做轻量质量审查。
- `bin/check-demo`：检查 README、运行入口、本地 URL、工作流说明和 mock fallback。

## 本地运行当前模板

查看当前周报模板原型：

```bash
cd templates/flask-adminlte-week-report
python3 app.py
```

默认访问地址：

```text
http://127.0.0.1:5000
```

静态原型也可以直接打开：

```text
templates/flask-adminlte-week-report/login.html
```

验收当前仓库或生成后的项目：

```bash
./bin/check-demo .
```

## 目录说明

```text
AGENTS.md                   自包含 Agent 项目指令
bin/                        CLI、生成脚本和验收脚本
docs/                       参考资料、检查清单和 workflow 文档
docs/original-requirements/ 周报系统原始需求参考
docs/original-design/       周报系统原始设计参考
docs/original-demo-ref/     周报系统原型参考
prompts/                    Agent / OpenCode 入口提示词
skills/                     项目内技能库
templates/                  可复用应用模板
```

## 下一步

优先级最高的是把当前 prompt-level workflow 变成真实 CLI 生成闭环：

1. 补 `package.json`。
2. 实现 `demo-ai-app <project-name>`。
3. 生成项目时带上自包含 `AGENTS.md`、入口 prompt、核心技能、模板代码、README 骨架和 `bin/check-demo`。
4. 用样题完整跑通一次：需求 -> 技术方案 -> 代码 -> 联调测试 -> 汇报材料。
