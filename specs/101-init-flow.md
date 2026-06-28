# 101 — init 流程

## 命令

```sh
npx kit-test init <project-name>
```

## 步骤

1. 解析项目名，校验合法性（kebab-case，不与现有目录冲突）
2. 复制 `templates/pc-admin/` 到目标目录
3. 渲染模板变量（`{{projectName}}`、`{{startedAt}}`）
4. 写入 `workflow-state.json`，初始阶段为 `requirements-draft`
5. 输出初始化完成提示

## 模板变量

| 变量 | 来源 | 示例 |
|------|------|------|
| `{{projectName}}` | CLI 参数 | `my-admin-project` |
| `{{startedAt}}` | `new Date().toISOString()` | `2026-06-27T10:00:00.000Z` |

## 错误处理

- 目录冲突 → 报错提示，不覆盖
- 权限不足 → 报错并退出
