# {{projectName}} — Agent 工作入口

本项目由 `kit-test` 生成，用于快速搭建 PC 端后台管理系统。

## 工作流

本项目使用 **PDCA 阶段锁** 控制开发节奏。Agent 在每个阶段结束时 **MUST** 停下来等用户确认。

### 阶段文件（位于 `docs/`）

| 阶段 | 文件 | 产出方 | 触发下一阶段 |
|------|------|--------|-------------|
| 1. 需求草稿 | `docs/requirements/draft.md` | Agent | 用户确认 |
| 2. 需求确认 | `docs/requirements/confirmed.md` | 用户 | 进入方案设计 |
| 3. 方案选项 | `docs/technical/options.md` | Agent | 用户选择方案 |
| 4. 方案选定 | `docs/technical/selected.md` | 用户 | 进入实施计划 |
| 5. 实施就绪 | `docs/execution/ready.md` | Agent | 开始编码 |

### 状态文件

`workflow-state.json` 记录当前阶段和方案选择来源。Agent 每次操作前 **MUST** 读取并校验。

### 校验

```sh
node scripts/check-stage
```

## 目录结构

```
├── frontend/       # Vue3 + ElementPlus 前端
├── backend/        # Express + MySQL 后端
├── docs/           # 阶段产物文档
├── scripts/        # 校验与工具脚本
├── specs/          # 项目开发规格
├── rules/          # 项目规则
├── reference/      # 参考代码与模式
└── .agents/skills/ # 投影的技能文件
```

## 硬停顿协议

```
STOP after asking the clarification question. Do not continue until the user replies.
```
