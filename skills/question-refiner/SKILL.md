---
name: question-refiner
description: Refine a competition topic or rough app idea into scoped requirements for demo-ai-app-kit. Use when the user provides a contest prompt, business theme, scenario idea, or vague AI app requirement and needs concrete users, scenarios, pain points, inputs, outputs, acceptance criteria, and a buildable first loop.
---

# Question Refiner

## Workflow

1. Extract the topic, target users, governance or business scenario, required AI capability, and hard delivery constraints.
2. Ask at most 3 blocking questions. If answers are not required, state assumptions and continue.
3. Narrow the app to one primary loop that can be built and demoed in a 10-hour window.
4. Define optional secondary loops only after the primary loop is stable.
5. Convert the result into a requirement brief that another agent can implement.

## Output Contract

Return Markdown with these sections:

- `App Concept`: 3-5 lines.
- `Target Users`: roles and why they use it.
- `Primary Loop`: user input, system action, AI workflow, output, follow-up action.
- `Secondary Loop`: optional, low-risk extension.
- `Required Data`: mock data, user inputs, files, or platform responses.
- `Acceptance Criteria`: observable checks for demo readiness.
- `Scope Cuts`: features to avoid during the competition.

## Rules

- Prefer a complete narrow loop over multiple shallow features.
- Treat platform integration as an adapter contract plus mock fallback until proven live.
- Do not invent policies, statistics, or platform capabilities.
- Flag any requirement that cannot be verified locally.

