# Flask Admin Shell

Neutral, runnable PC admin skeleton used by `demo-ai-app` generated projects.

This is **not** a finished business app. It provides:

- Flask login / logout / session handling
- A dashboard layout with sidebar and header
- A stable workflow adapter with `{ok, data, error, fallback}` envelope
- A diagnostic `/api/workflow/demo` endpoint
- A health endpoint `/api/workflow/health`

## Run locally

```bash
cd templates/flask-admin-shell
pip install -r requirements.txt
python3 app.py
```

Open http://127.0.0.1:5000 and log in with:

- username: `admin`
- password: `admin`

## Primary loop

After the Agent adapts the shell, the primary loop is:

1. User logs in.
2. User navigates to a business page generated from `kit/template-patterns/`.
3. User submits data to a business-specific workflow endpoint.
4. Backend calls `workflow_adapter.call_workflow()`.
5. Result is rendered or stored according to `docs/technical/tech-plan.md`.

The diagnostic `/api/workflow/demo` endpoint is only for smoke tests and is not
part of the primary loop.
