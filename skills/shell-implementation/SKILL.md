---
name: shell-implementation
description: Implement a generated PC admin app from frozen docs and the neutral Flask admin shell. Use after requirements, tech plan, workflow integration, and test cases are written and frozen.
---

# Shell Implementation

## Purpose

Turn the frozen planning documents and the neutral shell into a runnable,
business-specific app. This skill does not rewrite requirements, tech plan,
workflow contract, or test cases. It only produces code and minimal README
updates.

## Inputs To Read

Before writing code, read:

1. `docs/requirements/requirements.md` — Requirements Baseline and Primary Loop.
2. `docs/technical/tech-plan.md` — Menu Plan, Page Plan, Entity Mapping, Field Mapping,
   Generated Files Plan, Data Storage Decision.
3. `docs/technical/workflow-integration.md` — Business workflow endpoint, request/response
   envelope, error cases.
4. `docs/technical/test-cases.md` — Scenarios to verify.
5. `kit/template-patterns/README.md` — Pattern registry and read order.
6. `templates/flask-admin-shell/` — The only allowed starting code.

## Workflow

1. Copy the neutral shell into the generated project if it is not already there.
2. Create or modify files according to `Generated Files Plan`.
3. Add Flask routes, templates, and static assets for business pages.
4. Add the business workflow endpoint in `app.py` or a separate module.
5. Keep mock data minimal and business-specific.
6. Update the generated README with run command, URL, and demo account.
7. Do not modify `docs/requirements/requirements.md`, `docs/technical/tech-plan.md`,
   `docs/technical/workflow-integration.md`, or `docs/technical/test-cases.md`.
8. Run the app locally and verify at least one primary loop path.
9. Run `./bin/check-demo .` and fix blocking issues.

## Output Contract

When implementing, produce:

- Modified `app.py` with business routes and workflow endpoint.
- New/modified templates under `templates/`.
- New/modified static assets under `assets/` if needed.
- Updated `README.md` run instructions.
- Optional `data/` fixture files if the tech plan requires them.

When reporting completion, return:

- Run command and local URL.
- Demo account if any.
- Which primary loop path was verified.
- Any failing `bin/check-demo .` checks that are expected placeholders.

## Rules

- Start from `templates/flask-admin-shell/`, not from the reference example.
- Do not copy files, mock data, UI copy, or business logic from
  `docs/reference/` or `examples/`.
- Every file in `Generated Files Plan` must match the planned `Action` and
  `Source`.
- Do not introduce pages or components not in the Page Plan.
- Do not rewrite the Requirements Baseline, tech plan sections, or test cases.
- Keep the workflow adapter contract unchanged; only change the business input
  shape and how the result is rendered.
- Prefer modifying existing shell files over creating new abstractions.
- Ensure the app starts with `python3 app.py` after dependencies are installed.
