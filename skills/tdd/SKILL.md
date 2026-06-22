---
name: tdd
description: "Project testing workflow for demo-ai-app-kit generated apps. Use when implementing or changing behavior that needs proof: local APIs, workflow adapters, field mapping, mock fixtures, regression fixes, edge cases, or any request for TDD, test-first, red-green-refactor, integration tests, or proving a bug fix."
---

# TDD For Generated Apps

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** are integration-style: they exercise real code paths through public APIs. They describe _what_ the system does, not _how_ it does it. A good test reads like a specification - "user can checkout with valid cart" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They mock internal collaborators, test private methods, or verify through external means (like querying a database directly instead of using the interface). The warning sign: your test breaks when you refactor, but behavior hasn't changed. If you rename an internal function and tests fail, those tests were testing implementation, not behavior.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Generated-App Test Targets

For `demo-ai-app-kit` generated apps, prioritize tests that protect the product contract:

- Primary user loop: form/list/detail/review path, including empty and invalid input.
- Local API behavior: request validation, response shape, error shape, and status codes.
- Workflow adapter: real and mock adapters return the same stable response contract.
- Field mapping: every SDD-lite field used by UI, API/workflow, and fixtures stays aligned.
- Mock fixture behavior: canned data covers success, empty, timeout/error, and degraded fallback.
- Regression fixes: every confirmed bug gets a red-capable reproduction test before the fix when a correct seam exists.

Do not test every visual detail in unit tests. Use `webapp-testing` for browser-level verification after implementation.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing" - treating RED as "write all tests" and GREEN as "write all code."

This produces **crap tests**:

- Tests written in bulk test _imagined_ behavior, not _actual_ behavior
- You end up testing the _shape_ of things (data structures, function signatures) rather than user-facing behavior
- Tests become insensitive to real changes - they pass when behavior breaks, fail when behavior is fine
- You outrun your headlights, committing to test structure before understanding the implementation

**Correct approach**: Vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle. Because you just wrote the code, you know exactly what behavior matters and how to verify it.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## Workflow

### 1. Planning

When exploring the codebase, read `CONTEXT.md` (if it exists) so that test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

Before writing any code:

- [ ] Identify the public interface being changed: UI action, route, API, adapter, CLI, or fixture contract.
- [ ] List the behaviors to test, not implementation steps.
- [ ] Prioritize the primary loop, workflow contract, field mapping, and known edge cases.
- [ ] Identify opportunities for deep modules (small interface, deep implementation). Use the local `codebase-design` skill only when module shape is the actual problem.
- [ ] Proceed without a blocking question unless interface intent is genuinely ambiguous.

**You can't test everything.** Confirm with the user exactly which behaviors matter most. Focus testing effort on critical paths and complex logic, not every possible edge case.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

This is your tracer bullet - proves the path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass current test
- Don't anticipate future tests
- Keep tests focused on observable behavior

### 4. Refactor

After all tests pass, look for [refactor candidates](refactoring.md):

- [ ] Extract duplication
- [ ] Deepen modules (move complexity behind simple interfaces)
- [ ] Apply SOLID principles where natural
- [ ] Consider what new code reveals about existing code
- [ ] Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

## Prove-It Pattern For Bugs

For a bug fix, prove the bug before changing code:

1. Write or script a reproduction that fails on the current code and asserts the user's exact symptom.
2. Confirm the failure is the intended bug, not a nearby unrelated failure.
3. Apply the smallest root-cause fix.
4. Watch the reproduction pass.
5. Run the narrow relevant suite, then broader checks if the surface area is shared.

If no correct test seam exists, document that as a design risk and still verify the original scenario end-to-end.

## Test Size

Use the smallest test that proves the behavior:

| Size | Use for | Constraint |
| --- | --- | --- |
| Small | pure transforms, validators, field mapping | no I/O, no network, milliseconds |
| Medium | local APIs, adapters, fixtures, persistence seams | localhost and controlled files/data only |
| Large | complete browser user loops | run only for critical flows via `webapp-testing` |

Prefer state-based assertions over interaction mocks. Use real implementations first, then fakes, then stubs. Use mocks only for slow, nondeterministic, external, or side-effect-heavy boundaries.

Write tests in a DAMP style: descriptive and meaningful even if they repeat setup. A generated app must be maintainable by another agent, so each test should read like a small specification.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```
