---
name: template-adapter
description: Adapt the bundled Flask/AdminLTE week-report template into a different competition app. Use when implementing a new app from a topic or plan and the agent must reuse existing login, dashboard, menu, forms, lists, detail/review pages, charts, mock data, and styles instead of starting from scratch.
---

# Template Adapter

## Source Template

Default source:

`templates/flask-adminlte-week-report/`

Reusable pieces:

- `login.html` and `assets/login.js`: demo login flow.
- `index.html`, `assets/app.js`, `assets/core.js`: static prototype shell.
- `assets/mock-data.js`: browser mock data pattern.
- `app.py` and `templates/`: Flask route and server-rendered page pattern.
- `assets/styles.css`: existing visual conventions.

## Workflow

1. Identify the target app's primary loop and required pages.
2. Map each target page to the closest existing template page.
3. Rename labels, menu items, mock entities, forms, tables, and charts to the new domain.
4. Preserve navigation, demo accounts, local run path, and reset/mock data behavior unless the plan requires changing them.
5. Add workflow adapter UI states: loading, success, empty, error, and mock fallback marker.
6. Verify the app locally before claiming completion.

## Output Contract

When planning, return:

- `Template Mapping`: target page -> source file/pattern.
- `Data Mapping`: old mock entity -> new mock entity.
- `Edits`: ordered file changes.
- `Risk`: anything that could break local demo.

When implementing, produce code changes and report the run command and URL.

## Rules

- Do not rebuild the UI from scratch.
- Do not leave visible week-report wording in the adapted app unless it is still relevant.
- Keep demo text concise and domain-specific.
- Add only the minimum components needed for the primary loop.

