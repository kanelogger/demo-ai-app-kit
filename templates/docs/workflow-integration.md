# Workflow Integration

> Generated from demo-ai-app-kit. Fill this in before implementation.
> Language policy: when completing this file, infer the user's native/dominant
> language from the requirement and rewrite this document in that language.
> Keep code identifiers, paths, commands, API routes, JSON keys, environment
> variables, and machine-readable error codes in English.

## Role

Describe what the AI workflow does in this app (e.g., classification, generation, recommendation).

## Business Workflow Endpoint

Each implementation must add a business-specific endpoint, for example:

```text
POST /api/repairs/triage
POST /api/contracts/risk-scan
POST /api/inspections/assign
```

This endpoint validates input, calls `workflow_adapter.call_workflow(payload)`,
and renders or stores the result. It is the only workflow endpoint that the
primary loop depends on.

The shell keeps `POST /api/workflow/demo` as a diagnostic smoke test. Do not
route the primary loop through `/api/workflow/demo`.

## Adapter Location

File / module that calls the workflow or mock:

```text
workflow_adapter.py
```

## Request Shape

```json
{
  "input": "string"
}
```

Required field: `input` must be a non-empty string.

## Response Shape

Stable envelope returned by `workflow_adapter.call_workflow`:

```json
{
  "ok": true,
  "data": {
    "output": "string",
    "confidence": 0.95,
    "processed_at": "2026-06-22T12:00:00Z"
  },
  "error": null,
  "fallback": false
}
```

Error envelope:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "missing required field: input"
  },
  "fallback": false
}
```

## Mock Fallback

When the AI platform is unavailable, or when `WORKFLOW_MOCK=true`, the app returns a mock response with the same shape.

| Input | Mock Output |
|-------|-------------|
| `{"input": "hello"}` | `{"output": "mock processed: hello", "confidence": 0.95, "processed_at": "..."}` |
| `{"input": ""}` | `INVALID_INPUT` error before mock is reached |

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Timeout | Real workflow call exceeds `WORKFLOW_TIMEOUT` seconds (default 10). Adapter catches the timeout, falls back to mock, and sets `fallback: true` with `_fallback_reason` in `data`. |
| Empty | Upstream returns an empty/null payload. Adapter normalizes it to `{"output": "", "confidence": 0.0, "empty": true}` so downstream code always receives a usable object. |
| Invalid | Missing or empty required field `input`. Adapter returns `ok: false`, `error.code: INVALID_INPUT`, HTTP 400, without calling the workflow. |
| Platform error | Any exception during the real call is caught, logged, and converted to a mock fallback with the same JSON shape and `fallback: true`. |

## Configuration

Environment variables or settings used by the adapter:

| Name | Default | Purpose |
|------|---------|---------|
| `WORKFLOW_MOCK` | `true` | When `true`, always use the mock response. |
| `WORKFLOW_TIMEOUT` | `10` | Seconds to wait for the real workflow call. |

## Switching to Real Workflow

Steps to replace the mock with a real call:

1. Implement `_call_real_workflow(payload, timeout)` in `workflow_adapter.py`.
2. Return the same data shape as `_mock_workflow` or raise an exception on failure.
3. Set `WORKFLOW_MOCK=false` and configure the real endpoint/credentials via environment variables.
4. Verify timeout, empty-result, invalid-input, and platform-error paths still work.
