---
name: solution-stress-test
description: Stress-test a proposed competition app plan for demo feasibility. Use when there is an app idea, requirements draft, technical plan, or feature list that must be checked against a 10-hour build window, local runnable delivery, Star Agent workflow integration, demo clarity, and judging risk.
---

# Solution Stress Test

## Workflow

1. Identify the promised user loops, pages, data dependencies, workflow dependencies, and local run path.
2. Classify task granularity: small direct edit, medium template-driven feature, or large/ambiguous feature requiring SDD-lite.
3. Score feasibility for a 10-hour competition build.
4. Check AI failure modes: specification vacuum, information island, and vague goal.
5. Find blockers that would prevent a local demo or repository scoring.
6. Cut scope aggressively until one complete primary loop remains.
7. Produce a revised build plan with pass/fail gates.

## Scoring

Use 0-5 for each dimension:

- `Build speed`: can it be implemented with the bundled template?
- `Demo clarity`: can judges understand the value in 10 minutes?
- `Workflow dependency risk`: can it run with mock fallback?
- `Local reliability`: can it run without fragile services?
- `Repository scan quality`: README, structure, comments, errors, no secrets.
- `AI execution risk`: are requirements, reference template, contracts, and success criteria concrete enough?

## Output Contract

Return:

- `Verdict`: PASS / PASS WITH CUTS / FAIL.
- `Score Table`: 5 dimensions with one-line evidence.
- `Granularity Route`: SMALL / MEDIUM / LARGE, with the recommended execution mode.
- `Failure Mode Check`: specification vacuum, information island, vague goal; mark PASS / RISK for each.
- `Top Risks`: ordered by probability and impact.
- `Required Cuts`: concrete removals or simplifications.
- `Revised Primary Loop`: the smallest demoable loop.
- `Next Build Steps`: 5-8 ordered steps.

## Rules

- Challenge plans that depend on unverified platform behavior.
- Treat "nice to have" as out of scope unless it improves the demo directly.
- Do not recommend a rewrite when template adaptation is enough.
- Route small changes directly to implementation when the request is limited to copy, labels, simple styling, or one obvious UI behavior.
- Route medium work through template adaptation and the core competition skills when it is a standard page, form, list, dashboard, or workflow-backed loop.
- Route large or ambiguous work through SDD-lite only when it lacks clear success criteria, has multiple user loops, has risky data/workflow contracts, or has no obvious template reference.
- Treat specification vacuum as high risk when there is no reference template, field contract, mock fixture, or acceptance check.
- Treat information island as high risk when the plan depends on live platform, network, external docs, or unavailable credentials without mock fallback.
- Treat vague goal as high risk when verbs like "optimize", "intelligent", "improve", or "analyze" lack observable success criteria.
