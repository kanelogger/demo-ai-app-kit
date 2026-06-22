# OpenCode Entry Prompt

Copy this prompt as the first instruction after receiving the competition topic.

```xml
<prompt>
  <intent_analysis>
    <core_intent>Convert the competition topic into a locally runnable AI web app by adapting the bundled demo-ai-app-kit template, integrating or mocking a Star Agent workflow, and preparing a 10-minute demo.</core_intent>
    <key_entities>demo-ai-app-kit, OpenCode, Star Agent platform, local web app, 10-hour closed development, Windows competition machine, bundled admin template, mock fallback, README, demo script.</key_entities>
    <context_given>The repository is an AI Coding prototype kit. The fastest reliable path is to adapt the existing admin shell instead of creating a new stack from scratch.</context_given>
    <missing_information>Ask only for information that blocks implementation. If a detail can be reasonably defaulted, choose the simplest demo-safe default and continue.</missing_information>
    <ambiguity_risks>Do not over-expand the app scope. Do not turn the output into a research report. Do not assume Star Agent platform details that are not present; use a replaceable adapter contract plus mock fallback.</ambiguity_risks>
  </intent_analysis>

  <optimization_strategy>
    <mode>DETAIL</mode>
    <task_type>Workflow plus Code</task_type>
    <strategy>Use staged requirements, feasibility gating, skill routing, a one-page SDD-lite contract, template adaptation, workflow contract design, local verification, and demo preparation.</strategy>
    <role_policy>Act as a pragmatic competition engineering lead. Prioritize runnable outcomes over architecture completeness.</role_policy>
    <reasoning_policy>Give concise decision rationale and verification steps. Do not expose private chain-of-thought.</reasoning_policy>
  </optimization_strategy>

  <context>
    You are working in the demo-ai-app-kit repository. Follow AGENTS.md. The target is a competition app, not a production platform. The app must be locally runnable and easy to demo.
  </context>

  <input_data>
    Competition topic:
    [PASTE TOPIC HERE]

    Extra constraints, if any:
    [PASTE OR WRITE "None"]
  </input_data>

  <task>
    Execute the competition build workflow:
    1. Restate the app concept in 5 lines or less.
    2. Ask at most 3 blocking questions. If none are blocking, state assumptions and continue.
    3. Define one primary user loop and one optional secondary loop.
    4. Generate a scoped requirements document.
    5. Classify task granularity: SMALL direct edit, MEDIUM template-driven feature, or LARGE/ambiguous feature requiring SDD-lite.
    6. Use this skill routing table:
       - Core path: question-refiner -> solution-stress-test -> tech-plan-generator -> template-adapter -> workflow-integration-planner -> demo-script-generator.
       - Optional only when triggered: api-and-interface-design for complex contracts; security-and-hardening for auth/user input/external calls; webapp-testing for browser verification; debugging-and-error-recovery for failing builds/tests; code-review-and-quality for final risk review; architecture-diagram for architecture visuals; guizang-ppt-skill for web PPT output.
    7. Generate a technical plan with an SDD-lite single-page contract: Primary Loop, Reference Template, Field Mapping, Workflow Mock Contract, and Demo Acceptance Checks.
    8. Do not create a separate SDD document unless explicitly requested. Output the SDD-lite contract first, then immediately adapt the bundled template instead of starting from a blank project.
    9. Implement the smallest complete local demo.
    10. Verify the app locally and report exact commands and URL.
    11. Generate README updates and a 10-minute demo script.
  </task>

  <constraints>
    - Build for a 10-hour competition window.
    - Prefer Python Flask plus native HTML/CSS/JS unless the existing project clearly supports another faster path.
    - Keep the first demo loop complete before adding secondary features.
    - Include mock workflow mode that works without Star Agent network access.
    - Keep workflow input/output JSON stable between mock and real adapter.
    - Keep SDD-lite to one page. Treat it as a frozen pre-build contract, not a document to maintain throughout implementation.
    - Do not invoke optional support skills unless their trigger condition is concrete.
    - Avoid secrets, private event notes, and hardcoded credentials beyond documented demo accounts.
    - Do not add unrelated refactors.
  </constraints>

  <success_criteria>
    - A user can open the app locally and complete the primary loop.
    - The AI workflow call path is visible in code and demoable through mock fallback.
    - The README contains run command, URL, accounts if any, core flow, adapter notes, and known limits.
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
