---
name: workflow-integration-planner
description: Plan Star Agent platform workflow integration for a local competition app. Use when an app needs to call, mock, or document an AI workflow with stable request/response JSON, timeout behavior, error handling, environment variables, and a fallback path for restricted network or unavailable platform access.
---

# Workflow Integration Planner

## Workflow

1. Infer the target document language from the user's requirement or `docs/requirements/requirements.md`.
2. Identify the user action that triggers AI.
3. Define the workflow purpose in one sentence.
4. Define request JSON from local app to workflow.
5. Define response JSON from workflow to local app.
6. Define mock response with the exact same response shape.
7. Define timeout, retry, empty result, unsafe result, and platform unavailable behavior.
8. Define environment variables and where they are documented.

## Output Contract

Return Markdown:

- `Workflow Name`: short and domain-specific.
- `Trigger Point`: page and user action.
- `Request JSON`: schema and example.
- `Response JSON`: schema and example.
- `Mock Fallback`: response fixture and when it is used.
- `Error Handling`: timeout, platform error, malformed response, empty response.
- `Implementation Notes`: backend route or frontend adapter, env vars, README notes.
- `Demo Script Hook`: how to explain it in 20 seconds.

## Rules

- Write user-facing output in the inferred target document language, including headings and table labels. Keep API routes, HTTP methods, JSON keys, environment variables, and machine-readable error codes in English.
- Never require live platform access for the first local demo.
- Keep real and mock response shapes identical.
- Do not hardcode secrets or real credentials.
- Mark unverified platform assumptions as assumptions.
