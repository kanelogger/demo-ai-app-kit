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
-> implement code -> run integration tests -> run local verification and quality review
```

Competition use is the first validation scenario, but the product quality target is broader: generated apps should be runnable, understandable, testable, and maintainable.

## Current Competition Context

- Event dates: 2026-07-01 closed development, 2026-07-02 demo.
- Target environment: Windows 10+, Python 3.10 or Java 17 backend, Vue/React/native frontend, Node.js, MySQL 8, Redis 7.
- Required outcome: a local web app reachable by browser, plus code submitted to the required repository.
- Required AI platform component: build a workflow on the Star Agent platform and integrate or simulate it from the app.
- Likely workflow shape: user input -> local app -> AI workflow or mock adapter -> result display -> error/fallback path.

## Operating Rules

- Generated apps must start from `templates/flask-admin-shell/` plus `docs/template-patterns/`, not from the reference example.
- `docs/reference/` and `examples/` are repository maintenance assets only; do not copy them into generated projects.
- Do not hard-bind generated apps to the repository reference business domain unless the user explicitly asks for that exact domain.
- Separate public reusable assets from private event notes. Do not copy local-only preparation details into generated public deliverables.
- Optimize for generated-app quality: clear requirements, stable contracts, local run, visible URL, mock fallback, meaningful tests, readable code, useful README, and local verification grounded in the verified app.
- Do not add long theoretical materials unless they directly improve generated-app quality or maintainability.

## Default Product-Quality Workflow

The default path is the product quality baseline. It should produce a clear, stable, testable, maintainable AI Web app, not only the quickest runnable demo.

```text
Requirement input
-> ce-brainstorm or question-refiner
-> grilling
-> solution-stress-test
-> domain-modeling
-> tech-plan-generator / SDD-lite
-> api-and-interface-design
-> security-and-hardening
-> shell-implementation
-> tdd
-> webapp-testing
-> debugging-and-error-recovery
-> code-review-and-quality
-> release-readiness
```

Routing rules:

- Simple requirement: use `skills/question-refiner`; skip full `skills/ce-brainstorm`.
- Vague, complex, or product-shape-unclear requirement: use `skills/ce-brainstorm`.
- Before freezing an important plan: use `skills/grilling`; it asks one Mom-Test-style blocking question at a time and classifies answers as behavior facts, constraints, rules, data facts, acceptance facts, attitudes, or unknown.
- More than 3 business terms, or likely UI/API/workflow field drift: use `skills/domain-modeling`.
- Frontend/backend APIs, workflow contracts, or mock fixtures: use `skills/api-and-interface-design`.
- User input, authentication, storage, files, or external calls: use `skills/security-and-hardening`.
- Implementing from the neutral shell and frozen docs: use `skills/shell-implementation`.
- Behavior logic, adapters, or mock fixtures: use `skills/tdd`.
- Any completed Web app: use `skills/webapp-testing`.
- Build, test, runtime, or browser failures: use `skills/debugging-and-error-recovery`.
- Before handoff, submission, or final quality gate: use `skills/code-review-and-quality`.
- Before npm publish, version tagging, release handoff, or after package/generator/template boundary changes: use `skills/release-readiness`.
- Run `bin/check-demo` and a lightweight quality review after testing and before handoff.

Explicit heavy workflow skills stay out of the default path unless the user or workflow clearly triggers them:

- `skills/ce-code-review`: important version, PR-level, or final heavy review.
- `skills/review`: standards/spec review when there is a clear spec and diff base.
- `skills/ce-debug`: escalation after normal debugging fails.
- `skills/ce-dogfood-beta`: final end-to-end dogfood.
- `skills/mcp-builder`: MCP integration generation.
- `skills/to-prd`, `skills/to-issues`, `skills/triage`: issue tracker product flow.
- `skills/handoff`: multi-agent or multi-session transfer.

## SDD-Lite Policy

- Use SDD-lite as a one-page pre-build contract inside the technical plan.
- Required blocks: `Primary Loop`, `Reference Patterns`, `Generated Files Plan`, `Field Mapping`, `Workflow Mock Contract`, `Data Storage Decision`, `Demo Acceptance Checks`.
- Do not create a separate SDD document or use a heavyweight SDD flow unless the user explicitly asks.
- During implementation, prefer a working demo and `bin/check-demo` over repeatedly maintaining planning documents.
- `bin/check-demo --skeleton .` is the structural gate for a fresh generated project; `bin/check-demo .` is the full app readiness gate after the Agent completes docs and implementation.

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

### Comment Policy

Keep comments load-bearing:

- Keep module boundaries and adapter contracts (what this file replaces or talks to).
- Keep complex business rules and non-obvious invariants.
- Keep external calls, fallback logic, and error-handling rationale.
- Delete explanatory fluff that merely restates the code (`# increment i`, `# loop over items`).
- Delete commented-out code instead of leaving it as a note.
- Prefer clear names and small functions over comments that explain them.

## Verification Rules

- Run the narrowest meaningful verification after changes.
- For generated or changed demo apps, prefer a real local run when feasible.
- Always report exact commands run and whether they passed.
- If a check could not be run, say so and explain why.
- `bin/check-demo` is the baseline readiness check for this repository or a generated project.

## Clarification Workflow

- Prioritize behavior facts, concrete constraints, data shape, workflow rules, and acceptance evidence over opinions and attitudes.
- Classify answers: Behavior Fact, Concrete Constraint, Workflow Rule, Data Fact, Acceptance Fact, Attitude / Wish, or Unknown.
- Attitude answers become assumptions or risks unless converted to observable acceptance checks.
- Do not freeze a requirements baseline while any required field is still an attitude or unknown.

## Definition Of Done

- The app or generated project can run locally, or the remaining blocker is explicit.
- The run command and browser URL are documented.
- At least one complete user loop is demoable.
- AI workflow integration has a real adapter or a documented mock fallback with the same response shape.
- README explains purpose, run command, core flow, workflow integration, known limits, and demo account if relevant.
- Requirements, technical plan, workflow integration, test cases, test report, and quality review exist when the workflow calls for them.
- No secrets, private event notes, or local-only credentials are included in public deliverables.
- `bin/check-demo` passes or reports concrete missing items.
