# Template Patterns

Pattern library for generating PC admin / workflow apps from a simple business
requirement. These patterns are source-neutral: they encode reusable structure
without binding to the original reference example.

## Read Order

1. `pc-admin-requirements-pattern.md` — how to turn a business input into a
   stable requirements baseline.
2. `pc-admin-tech-plan-pattern.md` — how to derive architecture, menu, pages,
   entities, fields, files, storage, and workflow from the baseline.
3. `operation-flow-patterns.md` — standard operation flows in PC admin apps.
4. `page-component-patterns.md` — standard page layouts and reusable UI blocks.
5. `workflow-integration-pattern.md` — how to integrate or mock the AI workflow
   platform.

## Core Rule

Generated apps must be built from the neutral shell
(`templates/flask-admin-shell/`) plus these patterns. They must **not** copy
files, mock data, UI copy, or business logic from the reference example
(`docs/reference/` or `examples/`).

## Pattern Names

| Pattern | File | What It Covers |
|---------|------|----------------|
| pc-admin-requirements-pattern | `pc-admin-requirements-pattern.md` | Clarifications, assumptions, baseline, primary loop, acceptance checks |
| pc-admin-tech-plan-pattern | `pc-admin-tech-plan-pattern.md` | Reference patterns, menu/page plan, entity/field mapping, generated files, storage, workflow contract |
| operation-flow-patterns | `operation-flow-patterns.md` | CRUD, review, assignment, dashboard, notification flows |
| page-component-patterns | `page-component-patterns.md` | Login, list, form, detail, dashboard, settings page templates |
| workflow-integration-pattern | `workflow-integration-pattern.md` | Endpoint, request/response envelope, mock fallback, error cases |

## Forbidden Source Copy

In any generated app, the following are hard failures:

- Copying files or paths from `docs/reference/`
- Copying files or paths from `examples/`
- Using forbidden source labels such as `Source=<original-example>`,
  `Source=<legacy-template>`, or `Source=copied-page` in `Generated Files Plan`
- Leaving original reference business wording in neutral shell files

If the target business explicitly uses wording that overlaps with the original
reference example, business words are allowed in business pages, but copied paths
and forbidden source labels still fail.
