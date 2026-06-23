# Reference: Week Report App

This directory contains the original week-report source material and the
reference implementation produced from it. It exists **only for repository
maintenance** and is **not** a starter template for generated projects.

## Layout

```text
docs/reference/week-report/
├── requirements/   # Original requirement documents
├── design/         # Original design documents (e.g., database design)
└── demo-ref/       # Original HTML demo snapshots
```

## Reference Implementation

```text
examples/week-report-app/
```

`examples/week-report-app/` is the runnable week-report application built from
these requirements. It can be started locally to understand the original shape
of the app, but generated projects must use `templates/flask-admin-shell/` plus
`docs/template-patterns/` instead.

## Usage Rules

- Do not copy files from `docs/reference/week-report/` or
  `examples/week-report-app/` into a generated project.
- Do not use these paths as `Source` in a generated `tech-plan.md`.
- Use these materials only to understand what patterns were extracted into
  `docs/template-patterns/`.
