# OpenCode Entry Prompt

Copy this prompt as the first instruction after entering the generated project and receiving an app requirement. Competition constraints can be passed as scenario constraints, but product quality remains the default.

```xml
<prompt>
  <intent_analysis>
    <core_intent>Convert the user requirement into a locally runnable, maintainable AI web app by adapting the bundled demo-ai-app-kit template, integrating or mocking an AI workflow, verifying the product loop, and preparing report/demo materials.</core_intent>
    <key_entities>demo-ai-app-kit, OpenCode, local web app, product-quality default path, bundled admin template, SDD-lite, workflow adapter, mock fallback, README, tests, demo script.</key_entities>
    <context_given>The repository is an AI Coding application kit. The default goal is a useful, testable, maintainable product prototype. Competition speed is only a scenario constraint when explicitly supplied.</context_given>
    <missing_information>Ask only for information that blocks implementation. If a detail can be reasonably defaulted, choose the simplest demo-safe default and continue.</missing_information>
    <ambiguity_risks>Do not over-expand the app scope. Do not turn the output into a research report. Do not assume Star Agent platform details that are not present; use a replaceable adapter contract plus mock fallback.</ambiguity_risks>
  </intent_analysis>

  <optimization_strategy>
    <mode>DETAIL</mode>
    <task_type>Workflow plus Code</task_type>
    <strategy>Use staged requirements, feasibility gating, skill routing, a one-page SDD-lite contract, template adaptation, workflow contract design, local verification, and demo preparation.</strategy>
    <role_policy>Act as a pragmatic product engineering lead. Prioritize a complete user loop, stable contracts, tests, and maintainability while respecting supplied time limits.</role_policy>
    <reasoning_policy>Give concise decision rationale and verification steps. Do not expose private chain-of-thought.</reasoning_policy>
  </optimization_strategy>

  <context>
    You are working in the demo-ai-app-kit repository or a project generated from it. Follow AGENTS.md. The target is a product-quality AI web app prototype: locally runnable, easy to understand, testable, and ready to explain.
  </context>

  <input_data>
    App requirement or topic:
    [PASTE REQUIREMENT HERE]

    Scenario constraints, if any:
    [PASTE OR WRITE "None"]
  </input_data>

  <task>
    Execute the product-quality default workflow:
    1. Restate the app concept in 5 lines or less.
    2. Ask at most 3 blocking questions. If none are blocking, state assumptions and continue.
    3. Define one primary user loop and one optional secondary loop.
    4. Generate a scoped requirements document and save it to `docs/requirements.md`.
    5. Classify requirement route: simple requirement -> question-refiner; vague, complex, or product-shape unclear -> ce-brainstorm.
    6. Use this skill routing table:
       - Default product-quality path: ce-brainstorm or question-refiner -> grilling -> solution-stress-test -> domain-modeling -> tech-plan-generator / SDD-lite -> api-and-interface-design -> security-and-hardening -> template-adapter -> workflow-integration-planner -> tdd -> webapp-testing -> debugging-and-error-recovery -> code-review-and-quality -> demo-script-generator.
       - Simple requirement: use question-refiner and skip full ce-brainstorm.
       - Important plan freeze: use bounded grilling before implementation.
       - More than 3 business terms or cross-layer field drift risk: use domain-modeling.
       - API, workflow contract, or mock fixture: use api-and-interface-design.
       - User input, login, storage, files, or external calls: use security-and-hardening.
       - Behavior logic, adapters, or mock fixtures: use tdd.
       - Any completed Web app: use webapp-testing.
       - Failures: use debugging-and-error-recovery.
       - Before report or handoff: use code-review-and-quality.
    7. Generate a product-quality technical plan with an SDD-lite single-page contract: Primary Loop, Reference Template, Field Mapping, Workflow Mock Contract, and Demo Acceptance Checks. Save the plan to `docs/tech-plan.md`.
    8. Do not create a separate SDD document unless explicitly requested. Output the SDD-lite contract before implementation, then immediately adapt the bundled template instead of starting from a blank project.
    9. Implement the smallest complete maintainable app slice that satisfies the primary loop and leaves stable extension seams.
    10. Write the workflow adapter contract, request/response JSON, mock fallback, and error handling to `docs/workflow-integration.md`.
    11. Verify the app locally with tests and browser checks; report exact commands and URL and record results in `docs/test-report.md`.
    12. Generate README updates and report/demo materials only after testing and review. Save the demo script to `docs/demo-script.md`.
  </task>

  <constraints>
    - Treat time limits, competition setting, or machine constraints as scenario parameters, not as permission to skip product-quality basics.
    - Prefer Python Flask plus native HTML/CSS/JS unless the existing project clearly supports another faster path.
    - Keep the first demo loop complete before adding secondary features.
    - Include mock workflow mode that works without external AI platform network access.
    - Keep workflow input/output JSON stable between mock and real adapter.
    - Keep SDD-lite to one page. Treat it as a frozen pre-build contract, not a document to maintain throughout implementation.
    - Do not invoke explicit heavy skills unless their trigger condition is concrete.
    - Keep explicit heavy skills out of the default path: ce-code-review, review, ce-debug, ce-dogfood-beta, mcp-builder, to-prd, to-issues, triage, handoff, guizang-ppt-skill, baoyu-diagram, architecture-diagram, theme-factory.
    - Avoid secrets, private event notes, and hardcoded credentials beyond documented demo accounts.
    - Do not add unrelated refactors.
    - Keep comments load-bearing: module boundaries, complex business rules, external calls, and fallback logic only; remove explanatory fluff and commented-out code.
  </constraints>

  <success_criteria>
    - A user can open the app locally and complete the primary loop.
    - The AI workflow call path is visible in code and demoable through mock fallback.
    - `docs/requirements.md`, `docs/tech-plan.md`, `docs/workflow-integration.md`, `docs/test-report.md`, and `docs/demo-script.md` are present and consistent with code.
    - Requirements, SDD-lite, API/workflow contracts, tests, and README tell the same story.
    - The README contains run command, URL, accounts if any, core flow, adapter notes, known limits, and the purpose of each docs/ artifact.
    - The project can be explained in 10 minutes with business value, technical structure, and live demo steps.
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
    Before finishing, check: scope fits 10 hours; primary loop works; workflow fallback works; README is useful; no private materials leaked; run command and URL are explicit.
  </self_check>
</prompt>
```
