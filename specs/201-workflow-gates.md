# 201 — 工作流闸门

## 阶段模型

```
requirements-draft  →  user-confirmed  →  solution-selected  →  implementation-ready
```

过渡规则见 `rules/stage-gates.md`。

## check-stage.mjs 规范

- 输入: `workflow-state.json` 路径
- 校验项:
  1. `stage` 合法性
  2. `selectedBy` 设置时间点（solution-selected 之后必须设置）
  3. 前一阶段文档存在性
  4. 不允许跳阶段
- 输出: 通过/失败 + 具体错误信息

## 与 Agent 的交互

Agent 每次开始工作前调用 `scripts/check-stage.mjs`，失败则终止。
Agent 每次完成阶段产出后更新 `workflow-state.json`，输出硬停顿。
