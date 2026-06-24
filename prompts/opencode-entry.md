# OpenCode Entry Prompt

Copy this prompt as the first instruction after entering the generated project and receiving an app requirement. Competition constraints can be passed as scenario constraints, but product quality remains the default.

```xml
<prompt>
  <intent_analysis>
    <core_intent>Convert the user requirement into a locally runnable, maintainable, and verifiable PC backend app by adapting the bundled demo-ai-app-kit admin shell, integrating or mocking an AI workflow, and verifying the product loop and code quality.</core_intent>
    <key_entities>demo-ai-app-kit, OpenCode, PC backend app, product-quality default path, neutral admin shell, template patterns, solution options, selected solution, SDD-lite, workflow adapter, mock fallback, skill trace, README, tests.</key_entities>
    <context_given>The repository is an AI Coding PC backend project kit. The default goal is a useful, testable, maintainable admin prototype. Competition speed is only a scenario constraint when explicitly supplied.</context_given>
    <missing_information>Ask only for information that blocks implementation. If a detail can be reasonably defaulted, choose the simplest demo-safe default and continue.</missing_information>
    <ambiguity_risks>Do not over-expand the app scope. Do not turn the output into a research report. Do not assume Star Agent platform details that are not present; use a replaceable adapter contract plus mock fallback.</ambiguity_risks>
  </intent_analysis>

  <optimization_strategy>
    <mode>DETAIL</mode>
    <task_type>Workflow plus Code</task_type>
    <strategy>Use staged requirements, three-option solution selection, feasibility gating, auditable skill routing, a one-page SDD-lite contract, template adaptation, workflow contract design, local verification, and demo preparation.</strategy>
    <role_policy>Act as a pragmatic product engineering lead. Prioritize a complete user loop, stable contracts, tests, and maintainability while respecting supplied time limits.</role_policy>
    <reasoning_policy>Give concise decision rationale and verification steps. Do not expose private chain-of-thought.</reasoning_policy>
  </optimization_strategy>

  <context>
    You are working in the demo-ai-app-kit repository or a project generated from it. Follow AGENTS.md. The target is a product-quality PC backend app prototype: locally runnable, easy to understand, testable, and ready to explain. The first screen after login should feel like an admin/workbench surface, not a marketing page, chat-only page, or text report.
  </context>

  <language_policy>
    Infer the target document language from the user's requirement before writing any user-facing artifact.
    Use the user's native or dominant language when clear. If native language cannot be known, use the dominant natural language of the requirement. If the requirement is mixed, prefer the language used for the business scenario and acceptance constraints.
    Write completed `docs/requirements/requirements.md`, `docs/requirements/solution-options.md`, `docs/technical/tech-plan.md`, `docs/technical/workflow-integration.md`, `docs/technical/test-cases.md`, `docs/execution/skill-trace.md`, `docs/execution/test-report.md`, `README.md`, and UI copy in that target language, including headings and table labels.
    Keep code identifiers, file paths, API routes, HTTP methods, JSON keys, environment variables, CLI commands, and machine-readable error codes in English.
    If the target language is genuinely ambiguous and affects delivery, ask one concise blocking question before freezing requirements.
    Remove or translate English template scaffolding from completed human-facing documents.
  </language_policy>

  <input_data>
    App requirement or topic:
    [PASTE REQUIREMENT HERE]

    Scenario constraints, if any:
    [PASTE OR WRITE "None"]
  </input_data>

  <task>
    Execute the product-quality default workflow:
    1. Restate the app concept in 5 lines or less.
    2. State the inferred target document language and the evidence used. If ambiguous, ask one blocking language question.
    3. Ask at most 3 blocking questions. If none are blocking, state assumptions and continue.
    4. Define one primary user loop and one optional secondary loop.
    5. Generate a scoped requirements document in the target document language and save it to `docs/requirements/requirements.md`.
    6. Classify requirement route: simple requirement -> question-refiner; vague, complex, or product-shape unclear -> ce-brainstorm.
    7. Start `docs/execution/skill-trace.md` and update it as each skill is used or skipped. Record the input/evidence, output artifact, and skipped reason. Do not leave this as a generic recommendation list.
    8. Generate `docs/requirements/solution-options.md` in the target document language with exactly 3 materially different technical options, a recommended option, concrete selection rationale, customization entry, and user selection field. Differences must affect architecture, storage, AI integration, implementation risk, or demo cost.
    9. Freeze point: do not write `docs/technical/tech-plan.md`, API/interface contracts, workflow contract, or implementation code until the selected option is recorded in `docs/requirements/solution-options.md`. If the user is unavailable and the requirement is otherwise clear, choose the recommended option, record `Selected by: Agent default`, and state the tradeoff in the final report.
    10. Use this skill routing table:
       - Default product-quality path: ce-brainstorm or question-refiner -> grilling -> solution-stress-test -> domain-modeling -> tech-plan-generator / SDD-lite -> api-and-interface-design -> security-and-hardening -> shell-implementation -> tdd -> webapp-testing -> debugging-and-error-recovery -> code-review-and-quality.
       - Simple requirement: use question-refiner and hand off to grilling; skip full ce-brainstorm.
       - Vague, complex, or product-shape unclear: use ce-brainstorm and hand off to grilling with the next best blocking question.
       - Important plan freeze: use bounded grilling; it asks one Mom-Test-style blocking question at a time.
       - More than 3 business terms or cross-layer field drift risk: use domain-modeling.
       - API, workflow contract, or mock fixture: use api-and-interface-design.
       - User input, login, storage, files, or external calls: use security-and-hardening.
       - Implementing from the neutral shell and frozen docs: use shell-implementation.
       - Behavior logic, adapters, or mock fixtures: use tdd.
       - Any completed PC backend app: use webapp-testing.
       - Failures: use debugging-and-error-recovery.
       - Before handoff or final quality gate: use code-review-and-quality.
    11. Generate a product-quality technical plan in the target document language with an SDD-lite single-page contract: Requirements Baseline Reference, Selected Solution Reference, Reference Patterns, Menu Plan, Page Plan, Entity Mapping, Field Mapping, Generated Files Plan, Workflow Mock Contract, Data Storage Decision, and Changed Decisions. Save the plan to `docs/technical/tech-plan.md`. The Generated Files Plan must use Source `shell`, `pattern:<pattern-name>`, or `business-requirement`; never use a source label that means original example, legacy template, copied page, or reference implementation.
    12. Write the workflow adapter contract, business endpoint, request/response JSON, mock fallback, invalid input, timeout, empty result, platform failure, mock-vs-real switching, and test examples to `docs/technical/workflow-integration.md` in the target document language.
    13. Write test cases to `docs/technical/test-cases.md` in the target document language covering primary loop, workflow fallback, invalid input, browser path, API JSON, and readiness check.
    14. Run `./kit/checkers/check-docs .` after `docs/requirements/requirements.md`, `docs/technical/tech-plan.md`, `docs/technical/workflow-integration.md`, and `docs/technical/test-cases.md` are filled. Treat failures as document-quality issues to fix before implementation.
    15. Do not create a separate SDD document unless explicitly requested. Output the SDD-lite contract before implementation, then implement from `templates/flask-admin-shell/` plus `kit/template-patterns/` instead of copying the reference example.
    16. Implement the smallest complete maintainable PC backend app slice that satisfies the primary loop and leaves stable extension seams.
    17. Verify the app locally with tests and browser checks; report exact commands, URL, business API response, and readiness result in `docs/execution/test-report.md` in the target document language.
    18. Update README in the target document language with run command, URL, core flow, adapter notes, known limits, selected solution, and the purpose of each docs/ artifact. Do not generate demo scripts, PPT, diagrams, or visual themes unless explicitly requested.
  </task>

  <constraints>
    - Treat time limits, competition setting, or machine constraints as scenario parameters, not as permission to skip product-quality basics.
    - Prefer Python Flask plus native HTML/CSS/JS unless the existing project clearly supports another faster path.
    - Target PC backend/admin projects only. Use dashboard/list/form/detail/review workflow surfaces before adding secondary pages.
    - Target PC browsers only; do not add mobile adaptation or responsive mobile-first layouts.
    - Do not introduce a React/Vue/Java multi-template matrix; reuse and adapt the neutral admin shell.
    - Do not copy files, mock data, UI copy, or business logic from `docs/reference/` or `examples/`.
    - Keep the first demo loop complete before adding secondary features.
    - Include mock workflow mode that works without external AI platform network access.
    - Keep workflow input/output JSON stable between mock and real adapter.
    - Keep SDD-lite to one page. Treat it as a frozen pre-build contract after the solution selection, not a document to maintain throughout implementation.
    - Keep completed human-facing documents in the inferred target document language; do not leave English skeleton headings when the target language is not English.
    - Do not invoke explicit heavy skills unless their trigger condition is concrete.
    - Keep explicit heavy skills out of the default path: ce-code-review, review, ce-debug, ce-dogfood-beta, mcp-builder, to-prd, to-issues, triage, handoff.
    - Avoid secrets, private event notes, and hardcoded credentials beyond documented demo accounts.
    - Do not add unrelated refactors.
    - Keep comments load-bearing: module boundaries, complex business rules, external calls, and fallback logic only; remove explanatory fluff and commented-out code.
  </constraints>

  <success_criteria>
    - A user can open the app locally and complete the primary loop.
    - The AI workflow call path is visible in code and demoable through mock fallback.
    - `docs/requirements/requirements.md`, `docs/requirements/solution-options.md`, `docs/technical/tech-plan.md`, `docs/technical/workflow-integration.md`, `docs/technical/test-cases.md`, `docs/execution/skill-trace.md`, and `docs/execution/test-report.md` are present and consistent with code.
    - Requirements, selected solution, SDD-lite, API/workflow contracts, tests, skill trace, and README tell the same story.
    - `./kit/checkers/check-docs .` passes before implementation starts or before a docs-only handoff.
    - The README contains run command, URL, accounts if any, core flow, adapter notes, known limits, and the purpose of each docs/ artifact.
    - The README and docs support a concise technical walkthrough of business value, structure, and live demo steps.
  </success_criteria>

  <output_contract>
    <format>Markdown plus code changes</format>
    <structure>
      First output: assumptions, scoped plan, files to edit, and verification target.
      Final output: changed files, run command, local URL, verification result, known limits, and demo path.
    </structure>
    <length>Keep planning concise. Prefer implementation and verification over explanation.</length>
    <delivery>Write files directly in the repository when implementing. Do not stop at a proposal unless blocked.</delivery>
  </output_contract>

  <self_check>
    Before finishing, check: scope fits 10 hours; selected solution is recorded; primary loop works; business API returns stable JSON; workflow fallback works; README is useful; skill trace is filled; no private materials leaked; run command and URL are explicit.
  </self_check>
</prompt>
```
