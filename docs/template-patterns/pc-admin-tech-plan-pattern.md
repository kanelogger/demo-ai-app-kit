# PC Admin Tech Plan Pattern

## Purpose

Produce a one-page pre-build contract from `docs/requirements.md` plus the
pattern registry. The tech plan is frozen before implementation starts.

## Required Anchors

```text
Requirements Baseline Reference
Reference Patterns
Menu Plan
Page Plan
Entity Mapping
Field Mapping
Generated Files Plan
Workflow Mock Contract
Data Storage Decision
Changed Decisions
```

## Requirements Baseline Reference

Copy the Requirements Baseline fields from `docs/requirements.md`. Do not
rewrite them. If a requirement changes, stop and ask the user.

## Reference Patterns

Use this table to show which patterns from `docs/template-patterns/` apply:

```markdown
| Pattern | Source File | Why Used |
|---------|-------------|----------|
```

## Menu Plan

List top-level menus and their sub-menus. Each menu must map to a primary loop
step or a supporting management page.

```markdown
| Menu | Sub-menu | Route | Primary Loop Step |
|------|----------|-------|-------------------|
```

## Page Plan

List every page. Each page must have a route, a purpose, and the main entity it
operates on.

```markdown
| Page | Route | Purpose | Main Entity |
|------|-------|---------|-------------|
```

## Entity Mapping

Map business entities to storage or code representations.

```markdown
| Entity | Fields | Storage | Notes |
|--------|--------|---------|-------|
```

## Field Mapping

Map user-visible fields to data fields, types, and validation rules.

```markdown
| UI Field | Data Field | Type | Required | Validation |
|----------|------------|------|----------|------------|
```

## Generated Files Plan

Every file created, modified, deleted, or kept must be listed.

```markdown
| File | Action | Source | Purpose |
|------|--------|--------|---------|
```

Allowed `Action`:

```text
create
modify
delete
keep
```

Allowed `Source`:

```text
shell
pattern:<pattern-name>
business-requirement
```

Forbidden `Source`:

```text
<original-example>
<legacy-template>
copied-page
```

`<original-example>` and `<legacy-template>` stand for any path or label that
copies the original reference implementation instead of deriving from the
neutral shell and patterns.

## Workflow Mock Contract

Copy or refine the contract from `docs/workflow-integration.md`.

## Data Storage Decision

```markdown
| Store | Why Enough For V1 | Reset / Seed Strategy | Upgrade Path |
|-------|-------------------|-----------------------|--------------|
```

Default policy:

- Simplest demo: in-memory store.
- Repeatable seed needed: JSON fixture.
- Explicit persistence needed: local JSON file.
- Database: out of V1 by default.

## Changed Decisions

Minor implementation details go here. If a change affects core entity, primary
loop, workflow input/output, storage strategy, or acceptance check, stop and ask
the user instead.

```markdown
| Decision | Original Plan | Changed To | Reason |
|----------|---------------|------------|--------|
```
