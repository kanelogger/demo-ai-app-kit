---
name: tech-plan-generator
description: Generate a lean technical plan from frozen requirements and the pattern registry. Use after docs/requirements.md is written and before implementation.
---

# Tech Plan Generator

## Purpose

Produce a one-page pre-build contract (`docs/tech-plan.md`) from
`docs/requirements.md` and `docs/template-patterns/`. The plan is frozen before
implementation starts.

## Inputs To Read

1. `docs/requirements.md` — Requirements Baseline, Primary Loop, Acceptance Checks, Out of Scope.
2. `docs/template-patterns/README.md` — Pattern registry and read order.
3. Relevant pattern files from `docs/template-patterns/`.
4. `templates/flask-admin-shell/` — The neutral shell that all generated files start from.
5. `AGENTS.md` — Workflow and quality constraints.

## Workflow

1. Infer the target document language from `docs/requirements.md` and the original requirement. Keep the completed tech plan in that language.
2. Copy the Requirements Baseline into the tech plan verbatim.
3. Choose applicable patterns from `docs/template-patterns/` and list them in
   `Reference Patterns`.
4. Design the menu plan, page plan, entity mapping, and field mapping from the
   baseline and patterns.
5. Produce a `Generated Files Plan` where every file has `Action` and `Source`.
6. Decide storage strategy and document it in `Data Storage Decision`.
7. Copy or refine the workflow mock contract from
   `docs/workflow-integration.md`.
8. List any minor implementation changes in `Changed Decisions`.
9. If a change alters core entity, primary loop, workflow input/output, storage
   strategy, or acceptance check, stop and ask the user before continuing.

## Output Contract

Return Markdown sections that match `templates/docs/tech-plan.md`:

- `Requirements Baseline Reference`
- `Reference Patterns`
- `Stack`
- `Menu Plan`
- `Page Plan`
- `Entity Mapping`
- `Field Mapping`
- `Generated Files Plan`
- `Workflow Mock Contract`
- `Data Storage Decision`
- `Changed Decisions`
- `Known Limits`

## Rules

- Write user-facing output in the inferred target document language, including headings and table labels. Keep file paths, API routes, commands, JSON keys, enum values, and code identifiers in English.
- Use `Reference Patterns`, not the old template-oriented label.
- Every generated file must have an `Action` (`create`, `modify`, `delete`, `keep`)
  and a `Source` (`shell`, `pattern:<pattern-name>`, `business-requirement`).
- Forbidden `Source` values: any label that means original example, legacy
  template, copied page, or copied reference implementation.
- Do not create a second template when the neutral shell can be adapted.
- Keep database optional for first demo; use in-memory or local JSON if it
  reduces risk.
- Every AI capability must have a mock response with the same shape as the real
  workflow response.
- Treat `SDD-lite` as frozen after planning; during implementation, prefer a
  working demo and `bin/check-demo` over repeatedly maintaining the contract.
- Page count is not a target metric. Pages must be business-relevant.
- If a decision change affects core entity, primary loop, workflow input/output,
  storage strategy, or acceptance check, stop and ask the user.
