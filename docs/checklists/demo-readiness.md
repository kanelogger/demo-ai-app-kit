# Demo Readiness Checklist

Use this checklist before a competition simulation or final submission.

- Local app has a documented run command.
- Local URL is explicit.
- README explains purpose, core workflow, workflow integration, mock fallback, known limits, and demo account if any.
- Primary user loop can be completed without live platform access.
- Workflow adapter has stable request and response JSON.
- Error, timeout, empty, and mock states are visible or documented.
- No private event notes, secrets, `.env`, or local credentials are included.
- Primary loop demo path is documented with sample input, click path, expected output, and fallback path.
- `docs/technical/tech-plan.md` includes Menu Plan, Page Plan (with layer and cut plan), Entity Mapping, Field Mapping, and Workflow Mock Contract.
- Pages are classified as `core`, `supporting`, `foundation`, `optional-cut`, or `delete` with a recorded cut scope for `optional-cut` and `delete` pages.
- Non-week-report apps do not retain visible weekly-report wording in pages, README, docs, or mock data.