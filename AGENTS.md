# demo-ai-app-kit Agent Instructions

This file is self-contained. Do not depend on user-global agent instruction files, local absolute paths, or external private configuration.

## Priority

Follow this order:

1. System, tool, safety, and permission constraints.
2. User instructions in the current conversation.
3. This repository's workflow and operating rules.
4. General coding and communication rules in this file.

When rules conflict, choose the more specific project workflow and state the tradeoff briefly.

## Communication Style

Direct, concrete, low fluff.

- Lead with the answer.
- Use evidence from local files and command output for project facts.
- Keep explanations compact unless the task needs depth.
- Ask only blocking questions; otherwise choose a clear default and proceed.
- Surface uncertainty, skipped checks, and unresolved risk.
- Do not use opening filler such as "好的", "没问题", "当然", "Great question", or "Certainly".
- Do not end with vague conditional offers.

## Project Purpose

This repository is an AI Coding application prototype kit. Treat it as a reusable production line for generating useful, maintainable AI Web apps, not as a fixed business system.

Primary product goal:

```text
Install kit -> demo-ai-app <project-name> -> open generated project
-> start an Agent such as OpenCode -> input a simple requirement
-> clarify requirements -> generate requirements and technical plan
-> implement code -> run integration tests -> generate report/demo materials
```

Competition use is the first validation scenario, but the product quality target is broader: generated apps should be runnable, understandable, testable, and maintainable.

## Current Competition Context

- Event dates: 2026-07-01 closed development, 2026-07-02 demo.
- Target environment: Windows 10+, Python 3.10 or Java 17 backend, Vue/React/native frontend, Node.js, MySQL 8, Redis 7.
- Required outcome: a local web app reachable by browser, plus code submitted to the required repository.
- Required AI platform component: build a workflow on the Star Agent platform and integrate or simulate it from the app.
- Likely workflow shape: user input -> local app -> AI workflow or mock adapter -> result display -> error/fallback path.

## Operating Rules

- Prefer adapting `templates/flask-adminlte-week-report/` over creating a new app from scratch.
- Keep the bundled week-report template as a reusable admin shell: login, dashboard, menu, form, list, review/detail, charts, mock data.
- Do not hard-bind generated apps to the week-report business domain unless the user explicitly asks.
- Separate public reusable assets from private event notes. Do not copy local-only preparation details into generated public deliverables.
- Optimize for generated-app quality: clear requirements, stable contracts, local run, visible URL, mock fallback, meaningful tests, readable code, useful README, and report materials grounded in the verified app.
- Do not add long theoretical materials unless they directly improve generated-app quality or maintainability.

## Default Product Workflow

1. Read the topic or requirement and ask only blocking questions.
2. Use `skills/question-refiner` to turn the topic into scoped requirements.
3. Use `skills/solution-stress-test` to reject vague, risky, or unbuildable plans.
4. Use `skills/tech-plan-generator` to produce page list, data model, local APIs, workflow contract, SDD-lite contract, verification plan, and README checklist.
5. Use `skills/template-adapter` to adapt the bundled template.
6. Use `skills/workflow-integration-planner` to define Star Agent input/output, mock fallback, timeout, and error handling.
7. Use testing/debugging/review skills as needed:
   - `skills/tdd` for local API, workflow adapter, field mapping, and mock fixture behavior.
   - `skills/webapp-testing` for browser verification.
   - `skills/debugging-and-error-recovery` when builds, tests, or runtime behavior fail.
   - `skills/code-review-and-quality` before handoff or submission.
8. Use `skills/demo-script-generator` to produce report/demo materials only after the app behavior is known or verified.

## SDD-Lite Policy

- Use SDD-lite as a one-page pre-build contract inside the technical plan.
- Required blocks: `Primary Loop`, `Reference Template`, `Field Mapping`, `Workflow Mock Contract`, `Demo Acceptance Checks`.
- Do not create a separate SDD document or use a heavyweight SDD flow unless the user explicitly asks.
- During implementation, prefer a working demo and `bin/check-demo` over repeatedly maintaining planning documents.

## Coding Rules

- Read before writing: inspect the relevant files, scripts, instructions, and current behavior before editing.
- Keep changes surgical. Do not refactor unrelated code or clean up unrelated files.
- Preserve user changes. Never revert work you did not make unless the user explicitly asks.
- Prefer existing project patterns over new abstractions.
- Add abstractions only when they remove real complexity or match an existing local pattern.
- For deterministic checks, use commands and scripts instead of guessing.
- Use `rg` or `rg --files` first for search.
- Use `apply_patch` for manual file edits.
- Do not use destructive commands such as `git reset --hard` or `git checkout --` unless explicitly requested.
- Match existing formatting and naming.
- Add comments only when they clarify non-obvious behavior.

## Verification Rules

- Run the narrowest meaningful verification after changes.
- For generated or changed demo apps, prefer a real local run when feasible.
- Always report exact commands run and whether they passed.
- If a check could not be run, say so and explain why.
- `bin/check-demo` is the baseline readiness check for this repository or a generated project.

## Definition Of Done

- The app or generated project can run locally, or the remaining blocker is explicit.
- The run command and browser URL are documented.
- At least one complete user loop is demoable.
- AI workflow integration has a real adapter or a documented mock fallback with the same response shape.
- README explains purpose, run command, core flow, workflow integration, known limits, and demo account if relevant.
- Requirements, technical plan, tests/checks, and report/demo materials exist when the workflow calls for them.
- No secrets, private event notes, or local-only credentials are included in public deliverables.
- `bin/check-demo` passes or reports concrete missing items.
