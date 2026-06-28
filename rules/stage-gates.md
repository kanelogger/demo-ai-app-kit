# 阶段闸门规则

## 硬停顿协议

每次 Agent 产出一个阶段文档后，**MUST** 输出：

```
STOP after asking the clarification question. Do not continue until the user replies.
```

期间禁止 Agent 自行进入下一阶段。

## 阶段链

```
requirements/draft.md
  ↓ 用户确认
requirements/confirmed.md
  ↓ Agent 产出方案选项
technical/options.md
  ↓ 用户选择（或显式说"你替我选"）
technical/selected.md
  ↓ Agent 产出实施计划
execution/ready.md
```

## 校验规则

`scripts/check-stage.mjs` 读取 `workflow-state.json` 并校验：

1. `stage` 字段必须为枚举值之一
2. `selectedBy` 为 `agent-default` 时，`stage` 才能是 `solution-selected`
3. 下一阶段文档创建前，前一阶段文档必须存在且非空
4. 不允许跳阶段：必须按序推进

## 方案选择

- Agent **MUST** 提供 3 个技术方案 + 推荐理由
- Agent **NEVER** 默认选择方案，除非用户显式说"你替我选"
- 如果用户让 Agent 代选，`workflow-state.json` 中 `selectedBy` 必须为 `agent-default`
