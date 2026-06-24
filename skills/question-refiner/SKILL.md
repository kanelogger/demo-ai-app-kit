---
name: question-refiner
description: Refine a competition topic or rough app idea into a scoped requirements brief, then hand off to grilling with the next best blocking question.
---

# Question Refiner

## Workflow

1. Infer the target document language from the user's native/dominant language. If native language is unknown, use the dominant natural language of the requirement.
2. Extract the topic, target users, business scenario, required AI capability, and hard delivery constraints.
3. Produce a concise requirements brief in the target document language with behavior facts, constraints, data shape, workflow rules, and acceptance evidence.
4. Identify the single most important unanswered blocking question.
5. Hand off to `skills/grilling/SKILL.md` with that question, or ask it directly if continuing the same conversation.

## Output Contract

Return Markdown with these sections:

- `App Concept`: 3-5 lines.
- `Target Users`: roles and why they use it.
- `Primary Loop`: user input, system action, AI workflow, output, follow-up action.
- `Required Data`: mock data, user inputs, files, or platform responses.
- `Acceptance Criteria`: observable checks for demo readiness.
- `Scope Cuts`: features to avoid during the competition.
- `Next Best Blocking Question`: the one question that removes the most uncertainty.

## Rules

- Write user-facing output in the inferred target document language, including headings and table labels. Keep file paths, API routes, commands, JSON keys, and code identifiers in English.
- Prefer a complete narrow loop over multiple shallow features.
- Treat platform integration as an adapter contract plus mock fallback until proven live.
- Do not invent policies, statistics, or platform capabilities.
- Flag any requirement that cannot be verified locally.
- Prioritize behavior facts, concrete constraints, data shape, workflow rules,
  and acceptance evidence over opinions and attitudes.
- Do not ask a batch of questions. Only the next best blocking question.
