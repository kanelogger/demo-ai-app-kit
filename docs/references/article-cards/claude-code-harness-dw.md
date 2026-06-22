# Article Card: Claude Code Harness 工程数仓侧落地方案

Source file:
`/Users/kanehua/project/AI-template/ClaudeCodeHarness工程数仓侧落地方案.md`

## Article Claim

AI Coding reliability improves when work is split across persistent context, deterministic checks, context-isolated agents, and reusable skill commands.

## Transferable Mechanisms

- Store high-frequency project constraints in a project instruction file.
- Turn repeatable checks into deterministic scripts instead of relying on model memory.
- Keep high-token exploration away from the main conversation and return summaries.
- Package recurring work as short skill workflows with clear output contracts.

## Actions For This Project

- Add `AGENTS.md` for competition and template-use constraints.
- Add `prompts/opencode-entry.md` as the first OpenCode instruction.
- Add project-local skills for question refinement, solution stress test, technical planning, template adaptation, workflow integration, and demo script generation.
- Add `bin/check-demo` as a lightweight deterministic gate.

## Not Applicable

- OneData, ODPS, DQC, SQL lineage, data warehouse naming rules.
- Claude-specific hook configuration until OpenCode behavior is verified.
- Claimed percentage improvements, because this project has no local evidence yet.

## Priority

P0 for workflow shape. P2 for full hook/subagent implementation.

