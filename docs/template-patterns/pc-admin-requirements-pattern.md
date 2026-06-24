# PC Admin Requirements Pattern

## Purpose

Turn a vague business request into a frozen, reviewable requirements baseline
before any code is written.

## Clarification Rule

Ask **one blocking question at a time**. Prefer Mom-Test-style questions that
uncover behavior, constraints, data, rules, and acceptance evidence. Avoid
leading questions that invite opinions.

## Answer Types

Classify every answer into one of these types:

| Answer Type | Definition | What To Do With It |
|-------------|------------|--------------------|
| Behavior Fact | An observable action a user takes | Put into Primary Loop |
| Concrete Constraint | A hard limit (time, role, data source) | Put into Assumptions or Requirements Baseline |
| Workflow Rule | A business rule that changes state | Put into Primary Loop and Acceptance Checks |
| Data Fact | The shape, source, or cardinality of data | Put into Entity Mapping and Field Mapping |
| Acceptance Fact | How we know the feature works in production | Put into Acceptance Checks |
| Attitude / Wish | A preference, feeling, or "would be nice" | Convert to assumption or risk; ask for observable evidence |
| Unknown | Cannot classify yet | Ask a follow-up question |

## Requirements Baseline Fields

A sufficient baseline must be able to fill in every field below:

- **Product shape:** the PC backend/admin surface type; reject marketing,
  mobile-only, chat-only, or pure report outputs.
- **Primary user:** the role who starts the primary loop.
- **Primary loop:** the shortest complete path from user intent to user value.
- **Core entity:** the single noun the loop creates, updates, or consumes.
- **Core states:** the main statuses the entity moves through.
- **Workflow input:** what data is sent to the AI workflow.
- **Workflow output:** what result is returned and how it is used.
- **Acceptance check:** one concrete, demonstrable success criterion.
- **Out of scope:** what the first version deliberately does not do.

## Required Document Structure

```text
Clarifications
Assumptions
Product Shape
Requirements Baseline
Primary Loop
Acceptance Checks
Out of Scope
```

### Clarifications table

```markdown
| Question | Answer | Answer Type | Decision Impact |
|----------|--------|-------------|-----------------|
```

### Assumptions table

```markdown
| Assumption | Reason | Risk if Wrong |
|------------|--------|---------------|
```

### Baseline sufficient gate

The baseline is sufficient only when **all** of the following are Behavior
Facts, Concrete Constraints, Workflow Rules, Data Facts, or Acceptance Facts:

- Primary user
- Primary loop
- Core entity
- Core states
- Workflow input
- Workflow output
- Acceptance check
- Out of scope

If any item is still Attitude / Wish or Unknown, keep asking questions.
