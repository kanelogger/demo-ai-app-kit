# Test Cases

> Generated from demo-ai-app-kit. Fill this in before implementation.
> Language policy: when completing this file, infer the user's native/dominant
> language from the requirement and rewrite this document in that language.
> Keep code identifiers, paths, commands, API routes, and JSON keys in English.

## Primary Loop Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| PL-001  | Happy path primary loop | requirements.md | 1. Log in. 2. Navigate to primary loop page. 3. Submit valid input. 4. View result. | Primary loop completes with visible result. |

## Workflow Fallback Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| WF-001  | Mock fallback returns stable envelope | workflow-integration.md | 1. Set `WORKFLOW_MOCK=true`. 2. Call business workflow endpoint with valid input. | Response has `{ok, data, error, fallback}` with `fallback: true`. |

## Invalid Input Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| II-001  | Missing required field | workflow-integration.md | 1. Call business workflow endpoint with `{}`. | HTTP 400, `ok: false`, `error.code: INVALID_INPUT`. |

## Browser Test

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| BR-001  | Login and dashboard render | shell | 1. Open `/login`. 2. Enter demo account. 3. Submit. | Dashboard page loads without console errors. |

## Readiness Check

| Test ID | Scenario | Source | Steps | Expected Result |
|---------|----------|--------|-------|-----------------|
| RC-001  | `bin/check-demo .` passes | tech-plan.md | 1. Run `./bin/check-demo .` in generated project. | All checks pass. |
| RC-002  | `bin/check-demo .` probes running app | workflow-integration.md | 1. Start the app. 2. Run `DEMO_BASE_URL=... DEMO_PRIMARY_LOOP_PATH=... DEMO_BUSINESS_API_PATH=... DEMO_BUSINESS_API_PAYLOAD=... ./bin/check-demo .`. | Primary page returns HTTP 200/302 and business API returns stable JSON envelope. |
