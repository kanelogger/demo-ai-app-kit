# 通用 PC 后台业务壳 Demo 说明

本目录是 demo-ai-app-kit 的默认模板来源，定位为通用 PC 后台业务壳，而非固定的周报业务系统。生成项目时，Agent 会据此改造为目标业务应用。

## 运行方式

1. 进入生成后的项目目录。
2. 安装依赖并启动 Flask：
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python3 app.py
   ```
3. 浏览器打开 http://127.0.0.1:5000。
4. 使用默认演示账号 `ADMIN001 / admin123` 登录，或切换 `E1001`、`M2001`、`V3001` 体验不同角色。

## 模板定位

- 页面模式：登录、工作台、列表、表单/详情、处理/审核、基础配置、公告/日志。
- 菜单中的“业务管理”等模块是占位示例，Agent 会根据目标业务重新命名或删除。
- 所有浏览器端数据保存在 `localStorage` 中，可通过“重置数据”恢复初始模拟数据。

## 改造提示

改造前请在 `docs/tech-plan.md` 中输出：

- Menu Plan
- Page Plan（含页面层级与删除切口）
- Entity Mapping
- Field Mapping
- Copy Rewrite Checklist
- Workflow Mock Contract

改造后应移除与目标业务明显无关的“周报”文案，并确保主业务闭环可本地演示。
