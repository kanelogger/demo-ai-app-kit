# Requirements

> Generated from demo-ai-app-kit. Fill this in during clarification, before
> implementation.
> Language policy: when completing this file, infer the user's native/dominant
> language from the requirement and rewrite this document in that language.
> Keep code identifiers, paths, commands, API routes, and JSON keys in English.

## Clarifications

```markdown
| Question | Answer | Answer Type | Decision Impact |
|----------|--------|-------------|-----------------|
```

## Assumptions

```markdown
| Assumption | Reason | Risk if Wrong |
|------------|--------|---------------|
```

## Product Shape

- Target app type: PC backend/admin app.
- First screen after login:
- Required workbench surfaces: dashboard / list / form / detail / review / dispatch / other.
- Explicitly not building: marketing page / mobile app / chat-only page / pure report page.

## Requirements Baseline

- Primary user:
- Primary loop:
- Core entity:
- Core states:
- Workflow input:
- Workflow output:
- Acceptance check:
- Out of scope:

## Primary Loop

```text
1. User ...
2. App ...
3. AI workflow / mock ...
4. App renders ...
5. User confirms / retries ...
```

## Acceptance Checks

- [ ] App is recognizably a PC backend/admin app.
- [ ] Primary loop works end-to-end locally.
- [ ] AI workflow adapter has a mock fallback with the same response shape.
- [ ] `docs/solution-options.md` records 3 options and the selected option before implementation.
- [ ] README documents run command, URL, and demo account if any.
- [ ] `bin/check-demo .` passes.

## Out of Scope

- Database persistence for V1.
- External notification channels.
- Admin configuration pages beyond the minimum needed for the primary loop.
