# 001 — 产品定义

## 定位

打造 Agent 友好的 PC 端后台项目快速搭建工具（kit）。

## 核心价值

- **Agent 友好**: AGENTS.md + skills + rules 体系让 AI 按阶段工作
- **PDCA 阶段锁**: 硬停顿 + 状态文件防止 AI 跳过确认步骤
- **模板驱动**: 一键生成完整项目结构（前端 + 后端 + 工程配置）

## 用户

- 需要快速搭建后台管理系统的开发者
- 使用 vibe coding 工作流的团队

## 成功指标

- [ ] `npx kit-test init my-project` 可在 10 秒内生成完整项目
- [ ] 生成的项目通过 `check-stage.mjs` 初始校验
- [ ] Agent 能在生成项目中按阶段工作，产出合规文档
