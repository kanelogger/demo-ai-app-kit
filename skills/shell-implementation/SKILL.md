---
name: template-adapter
description: Adapt the bundled Flask/AdminLTE admin shell (derived from the week-report template) into a target business app. Use when implementing a new app from a topic or plan and the agent must reuse existing login, dashboard, menu, forms, lists, detail/review pages, charts, mock data, and styles instead of starting from scratch.
---

Default source:

`templates/flask-adminlte-week-report/`

This directory is a generic PC admin shell, not a fixed week-report business system. Reusable pieces:

- `login.html` and `assets/login.js`: demo login flow.
- `index.html`, `assets/app.js`, `assets/core.js`: static prototype shell.
- `assets/mock-data.js`: browser mock data pattern.
- `app.py` and `templates/`: Flask route and server-rendered page pattern.
- `assets/styles.css`: existing visual conventions.

## Workflow

1. Identify the target app's primary loop and required pages.
2. Output a `Menu Plan`: system name, top-level menus, sub-menus, target routes, and the layer (`core` / `supporting` / `foundation` / `optional-cut` / `delete`) for each menu.
3. Output a `Page Plan`: route, purpose, source template file, layer, keep reason, and cut plan for every page.
4. Output an `Entity Mapping`: map each source template entity (e.g., week-report, user, role, department, dictionary, menu, announcement) to a target business entity with keep / rename / delete decisions.
5. Output a `Field Mapping`: UI field -> local/API field -> workflow field -> mock fixture field, with required flags.
6. Output a `Copy Rewrite Checklist`: system name, login page, dashboard, menus, page titles, table columns, filters, form labels, buttons, badges, empty states, toasts/alerts/modals, mock data, and docs.
7. Map each target page to the closest existing template page.
8. Rename labels, menu items, mock entities, forms, tables, and charts to the new domain.
9. Preserve navigation, demo accounts, local run path, and reset/mock data behavior unless the plan requires changing them.
10. Add workflow adapter UI states: loading, success, empty, error, and mock fallback marker.
11. Verify the app locally before claiming completion.

## Output Contract

When planning, return:

- `Menu Plan`: system name, menus, routes, and layers.
- `Page Plan`: route, purpose, source template, layer, keep reason, and cut plan.
- `Entity Mapping`: source entity -> target entity with keep / rename / delete decisions.
- `Field Mapping`: UI/API/workflow/mock field correspondence.
- `Copy Rewrite Checklist`: all visible text items that must be rewritten.
- `Template Mapping`: target page -> source file/pattern.
- `Data Mapping`: old mock entity -> new mock entity.
- `Edits`: ordered file changes.
- `Risk`: anything that could break local demo.


When implementing, produce code changes and report the run command and URL.

## Rules

- Do not rebuild the UI from scratch.
- Do not leave visible week-report wording in the adapted app unless it is still relevant.
- Page count is not a target metric; keep business-relevant pages and delete or weaken week-report-specific pages.
- Every `optional-cut` page must list its deletion scope: Flask route, template/menu entry, mock data, JS event or render entry, and README/docs/test-report references.
- Every `delete` page must be removed or hidden from menus and docs.
- Keep demo text concise and domain-specific.
- Add only the minimum components needed for the primary loop.
- Complete the primary loop before trimming `optional-cut` pages.
