---
name: grilling
description: Build a requirements baseline one Mom-Test-style blocking question at a time. Use after an initial idea exists and before writing docs/requirements.md.
---

# Grilling

## Purpose

Turn a rough app idea into a frozen requirements baseline by asking one
blocking question at a time. Each answer is classified so the user can see
what is fact, what is assumption, and what is still wishful thinking.

## Question Style

- Ask **one question per turn**.
- Use Mom-Test-style questions: ask about behavior, constraints, data, rules,
  and evidence, not opinions or feature requests.
- Always ask the **next best blocking question** — the question whose answer
  removes the most uncertainty from the baseline.
- Offer 2-4 concrete options when that surfaces the trade-off faster, but allow
  free-text answers.

## Answer Types

Classify every answer before asking the next question:

| Answer Type | Definition | What To Do |
|-------------|------------|------------|
| Behavior Fact | Observable action a user takes | Add to Primary Loop |
| Concrete Constraint | Hard limit (time, role, source, volume) | Add to Assumptions or Baseline |
| Workflow Rule | Business rule that changes state | Add to Primary Loop and Acceptance Checks |
| Data Fact | Shape, source, or cardinality of data | Add to Entity/Field Mapping |
| Acceptance Fact | Observable evidence that the feature works | Add to Acceptance Checks |
| Attitude / Wish | Preference, feeling, or "would be nice" | Convert to assumption or risk; ask for observable evidence |
| Unknown | Cannot classify yet | Ask a follow-up question |

## Baseline Sufficient Gate

The baseline is sufficient only when all of the following are filled with
Behavior Fact, Concrete Constraint, Workflow Rule, Data Fact, or Acceptance Fact
(no Attitude / Wish or Unknown):

- Primary user
- Primary loop
- Core entity
- Core states
- Workflow input
- Workflow output
- Acceptance check
- Out of scope

When the gate is reached, stop asking questions and write `docs/requirements.md`
using the structure in `docs/template-patterns/pc-admin-requirements-pattern.md`.

## Output Contract

When the baseline is sufficient, produce `docs/requirements.md` with:

- `Clarifications` table
- `Assumptions` table
- `Requirements Baseline` fields
- `Primary Loop`
- `Acceptance Checks`
- `Out of Scope`

Do not produce code, menu plans, or tech plans. Those come after the baseline is
frozen.

## Rules

- One question per turn. Never batch multiple blocking questions.
- Convert attitude answers into assumptions with a risk note unless the user
  provides observable evidence.
- If an answer contradicts an earlier answer, surface the conflict and ask which
  one wins.
- Stop when the baseline sufficient gate is met, even if the user wants more
  features. Extra features go into `Out of Scope`.
