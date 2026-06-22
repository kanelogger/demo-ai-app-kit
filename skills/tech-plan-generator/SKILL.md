---
name: tech-plan-generator
description: Generate a lean technical plan for a demo-ai-app-kit competition app. Use after requirements are scoped and before implementation, especially when the app needs pages, data model, local API routes, Star Agent workflow contract, mock fallback, verification commands, and README structure.
---

# Tech Plan Generator

## Workflow

1. Read the scoped requirements and repository instructions.
2. Map the three-layer context: constraint layer, example layer, and visual layer.
3. Map the primary loop to template pages and reusable UI pieces.
4. Define the smallest data model needed for demo and local storage.
5. Define local backend routes or static mock modules.
6. Produce an `SDD-Lite Contract` before implementation. Keep it to one page and use it as a frozen pre-build contract, not a long-lived SDD system.
7. Define the workflow adapter contract: request JSON, response JSON, timeout, error shape, mock response.
8. Recommend optional support skills only when their trigger condition is concrete.
9. Define verification gates and demo script hooks.

## Output Contract

Return Markdown:

- `Architecture Choice`: stack and why it is fastest.
- `Three-Layer Context`: constraint layer, example layer, visual layer.
- `Pages`: route, purpose, source template to adapt, key components.
- `Data Model`: entities, fields, sample records.
- `SDD-Lite Contract`: one-page contract with exactly these blocks:
  - `Primary Loop`: user action, system action, AI/workflow action, visible result.
  - `Reference Template`: source page, source interaction, and source mock data to imitate.
  - `Field Mapping`: frontend display/form field -> local API or workflow field -> mock fixture field.
  - `Workflow Mock Contract`: request JSON, response JSON, timeout/error shape, and mock example.
  - `Demo Acceptance Checks`: manual checks that prove the primary loop works.
- `Local APIs`: method, path, request, response, fallback behavior.
- `Workflow Contract`: input JSON, output JSON, errors, mock mode.
- `Optional Skill Routing`: support skills to use only if their trigger condition is met.
- `Implementation Order`: 6-10 ordered steps.
- `Verification`: commands, URL, user account, manual checks.
- `README Checklist`: sections to update.

## Rules

- Prefer Flask plus existing native HTML/CSS/JS unless the user requests another stack.
- Keep database optional for first demo; use in-memory or browser storage if it reduces risk.
- Every AI capability must have a mock response with the same shape as the real workflow response.
- Do not create a second template when the bundled admin shell can be adapted.
- Do not create a separate SDD file or SDD skill unless the user explicitly asks. The SDD-lite contract is part of this technical plan.
- Treat SDD-lite as frozen after planning; during implementation, prefer a working demo and `bin/check-demo` over repeatedly maintaining the contract.
- Every field in `Field Mapping` must appear in at least one frontend display/form surface and at least one local API/workflow or mock fixture. If a field appears in only one place, cut it or mark it as deferred.
- In `Three-Layer Context`, use `AGENTS.md` and this skill as the constraint layer, `templates/flask-adminlte-week-report/` as the default example layer, and `docs/original-demo-ref/` or available screenshots/HTML prototypes as the visual layer.
- Optional skill routing must stay small: use `api-and-interface-design` for complex contracts, `security-and-hardening` for auth/user input/external calls, `webapp-testing` for browser verification, `debugging-and-error-recovery` for failing builds/tests, and `code-review-and-quality` for final risk review.
- Do not call optional support skills by default; list them with trigger conditions so the implementer can keep the main path light.
