# Technical Plan

> Generated from demo-ai-app-kit. Fill this in before implementation.
> Language policy: when completing this file, infer the user's native/dominant
> language from the requirement and rewrite this document in that language.
> Keep code identifiers, paths, commands, API routes, and JSON keys in English.

## Requirements Baseline Reference

Copy the Requirements Baseline from `docs/requirements/requirements.md`:

- Primary user:
- Primary loop:
- Core entity:
- Core states:
- Workflow input:
- Workflow output:
- Acceptance check:
- Out of scope:

## Selected Solution Reference

Copy the selected option from `docs/requirements/solution-options.md`:

- Selected option:
- Selected by:
- Tradeoff accepted:
- Customization:

## Reference Patterns

```markdown
| Pattern | Source File | Why Used |
|---------|-------------|----------|
```

## Stack

- Backend: Flask (from shell)
- Frontend: Tailwind CSS + native HTML/JS (from shell)
- AI workflow adapter: `workflow_adapter.py` (from shell)
- Test runner: `bin/check-demo .`

## Primary Loop API

| Item | Value |
|------|-------|
| Page route | |
| Business API endpoint | |
| Method | POST |
| Success JSON envelope | `{ok, data, error, fallback}` |
| Invalid input behavior | HTTP 400 with `error.code: INVALID_INPUT` |

## Menu Plan

| Top Menu | Sub Menu | Route | Layer |
|----------|----------|-------|-------|
|          |          |       |       |

Layers: `core` / `supporting` / `foundation` / `optional-cut` / `delete`.

## Page Plan

| Page | Route | Layer | Source | Keep Reason | Cut Plan |
|------|-------|-------|--------|-------------|----------|
|      |       |       |        |             |          |

Allowed `Source`: `shell`, `pattern:<pattern-name>`, `business-requirement`.

## Entity Mapping

| Entity | Fields | Storage | Notes |
|--------|--------|---------|-------|
|        |        |         |       |

## Field Mapping

| UI Field | Data Field | Type | Required | Validation |
|----------|------------|------|----------|------------|
|          |            |      |          |            |

## Generated Files Plan

| File | Action | Source | Purpose |
|------|--------|--------|---------|
|      |        |        |         |

Allowed `Action`: `create`, `modify`, `delete`, `keep`.
Allowed `Source`: `shell`, `pattern:<pattern-name>`, `business-requirement`.
Forbidden `Source`: see `kit/template-patterns/pc-admin-tech-plan-pattern.md`.

## Workflow Mock Contract

```json
{
  "request": {
    "input": "string"
  },
  "response": {
    "ok": true,
    "data": {
      "output": "string",
      "confidence": 0.95,
      "processed_at": "2026-06-22T12:00:00Z"
    },
    "error": null,
    "fallback": true
  }
}
```

## Data Storage Decision

| Store | Why Enough For V1 | Reset / Seed Strategy | Upgrade Path |
|-------|-------------------|-----------------------|--------------|
|       |                   |                       |              |

Default policy:

- Simplest demo: in-memory store.
- Repeatable seed needed: JSON fixture.
- Explicit persistence needed: local JSON file.
- Database: out of V1 by default.

## Changed Decisions

| Decision | Original Plan | Changed To | Reason |
|----------|---------------|------------|--------|
|          |               |            |        |

Only minor implementation details go here. If a change affects selected solution,
core entity, primary loop, workflow input/output, storage strategy, or acceptance
check, stop and ask the user.

## Known Limits

- Prototype only.
- ...
