---
name: demo-script-generator
description: Generate a 10-minute competition demo script and judge Q&A for a completed or planned demo-ai-app-kit app. Use when the app has a topic, workflow, pages, local URL, or README and needs a tight presentation covering problem, users, live demo, AI workflow, engineering quality, fallback, and likely judge questions.
---

# Demo Script Generator

## Workflow

1. Identify the problem, target user, primary loop, AI workflow, and local run path.
2. Allocate the 10-minute demo: opening, scenario, live demo, workflow explanation, engineering quality, close.
3. Write what to show on screen, not just what to say.
4. Prepare judge Q&A around accuracy, safety, data, workflow failure, scalability, and implementation choices.
5. Include a fallback route if live workflow access fails.

## Output Contract

Return Markdown:

- `One-Line Positioning`
- `10-Minute Timeline`: minute-by-minute.
- `Talk Track`: concise speaking script.
- `Live Demo Steps`: click/input/output sequence.
- `Technical Highlights`: 3-5 evidence-backed points.
- `Fallback Plan`: what to show if workflow/network fails.
- `Judge Q&A`: 8-12 likely questions with direct answers.
- `Final Checklist`: run URL, account, sample input, reset step.

## Rules

- Keep the demo focused on one complete workflow.
- Avoid exaggerated claims; tie every claim to visible behavior.
- Mention mock fallback as engineering reliability, not as a weakness.
- Prefer concrete sample inputs and outputs.

