# 301 — PC 后台模板

## 技术栈

- 前端: Vue 3 + TypeScript + Element Plus + Vite
- 后端: Express + TypeScript + MySQL
- 包管理: pnpm workspace

## 模板组成

| 目录 | 说明 |
|------|------|
| `frontend/` | Vue3 应用（pureadmin 基础） |
| `backend/` | Express API 服务 |
| `docs/` | 阶段产物文档 |
| `scripts/` | 校验与工具脚本 |
| `reference/` | 参考代码和设计模式 |
| `.agents/skills/` | 投影的技能文件 |

## 模板变量渲染

- `{{projectName}}` → `package.json` name 字段
- `{{startedAt}}` → `workflow-state.json` startedAt 字段

## 参考代码约定

`reference/` 目录存放：
- 通用组件模式
- 路由配置范例
- API 请求封装示例
- 数据库模型参考
