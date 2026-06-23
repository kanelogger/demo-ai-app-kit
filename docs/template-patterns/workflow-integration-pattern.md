# Workflow Integration Pattern

## Purpose

Define a stable contract between the Flask app and the AI workflow platform,
including the mock fallback used when the real platform is unavailable.

## Response Envelope

Every workflow call returns the same JSON envelope:

```json
{
  "ok": true,
  "data": { ... },
  "error": null,
  "fallback": false
}
```

On failure or fallback:

```json
{
  "ok": true,
  "data": {
    "output": "",
    "confidence": 0.0,
    "empty": true,
    "_fallback_reason": "upstream timeout"
  },
  "error": null,
  "fallback": true
}
```

Or on invalid input:

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

## Business Endpoint

Each app adds its own business workflow endpoint, for example:

```text
POST /api/repairs/triage
POST /api/contracts/risk-scan
POST /api/inspections/assign
```

The endpoint must:

1. Validate input.
2. Call `workflow_adapter.call_workflow(payload)`.
3. Return the stable envelope.
4. Render or store `data` according to the primary loop.

## Diagnostic Endpoint

The shell provides `POST /api/workflow/demo` for smoke tests. It is not part of
the primary loop and must not appear in the README run instructions or the
primary user flow.

## Mock Fallback

Default to mock mode unless `WORKFLOW_MOCK=false` is set. The mock returns:

```json
{
  "output": "mock processed: {user_input}",
  "confidence": 0.95,
  "processed_at": "2026-06-23T06:14:49.508005Z"
}
```

## Error Cases

### Invalid input

Return `ok: false` with `error.code = INVALID_INPUT`.

### Timeout

Real call exceeds `WORKFLOW_TIMEOUT` seconds. Catch the exception, fall back to
mock, and set `_fallback_reason` to `timeout`.

### Empty result

Upstream returns empty body or `{}`. Normalize to a usable payload with
`empty: true`.

### Platform failure

Network error, 5xx, or malformed JSON. Catch the exception, fall back to mock,
and set `_fallback_reason`.

### Mock vs real switching

- Local development: `WORKFLOW_MOCK=true` (default).
- Real platform test: set `WORKFLOW_MOCK=false` and implement
  `_call_real_workflow` in `workflow_adapter.py`.
- Production: set `WORKFLOW_MOCK=false` and configure the real endpoint.

## Test Examples

```bash
# Health check
curl -s http://127.0.0.1:5000/api/workflow/health

# Mock workflow demo
curl -s -X POST http://127.0.0.1:5000/api/workflow/demo \
  -H "Content-Type: application/json" \
  -d '{"input":"test"}'

# Invalid input
curl -s -X POST http://127.0.0.1:5000/api/workflow/demo \
  -H "Content-Type: application/json" \
  -d '{}'
```
