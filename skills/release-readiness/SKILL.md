---
name: release-readiness
description: Validate demo-ai-app-kit packaging and publish readiness. Use before npm publish, release handoff, version tagging, or after changing package.json, bin/demo-ai-app, bin/check-demo, templates, docs/template-patterns, prompts, skills, README, or generated-project structure.
---

# Release Readiness

## Purpose

Run the release gate for `demo-ai-app-kit`: package boundary, generated-project skeleton, local install, app startup, and publish evidence. Treat this as the required pre-publish workflow.

## Preconditions

- Work from the repository root.
- Preserve user changes; do not clean the worktree unless asked.
- Use a temporary npm cache if the global npm cache has permission errors.
- Prefer `/private/tmp` or `/tmp` for install checks so generated projects do not pollute the repo.
- Do not publish until this skill's gate passes or the remaining blocker is explicitly accepted.

## Gate

### 1. Repository self-test

Run:

```bash
npm test
```

Pass condition:

- Command exits `0`.
- Output includes `Self-test: PASS`.

If this fails, stop and fix the generator, template, or check script before continuing.

### 2. Package dry run

Run:

```bash
npm pack --dry-run
```

If npm fails with cache permission errors, rerun with a project-neutral temporary cache:

```bash
env npm_config_cache=/private/tmp/demo-ai-app-kit-npm-cache npm pack --dry-run
```

Pass condition:

- Command exits `0`.
- Tarball contents include the intended public assets:
  - `bin/`
  - `templates/flask-admin-shell/`
  - `templates/docs/`
  - `docs/template-patterns/`
  - `AGENTS.md`
  - `prompts/`
  - `skills/`
  - `README.md`
  - `LICENSE`
- Tarball contents do not include:
  - `docs/reference/`
  - `examples/`
  - migration planning documents
  - private notes, credentials, local-only event material, or generated temp projects

### 3. Create a real tarball

Run:

```bash
env npm_config_cache=/private/tmp/demo-ai-app-kit-npm-cache npm pack
```

Pass condition:

- Command exits `0`.
- A tarball such as `demo-ai-app-kit-<version>.tgz` exists.

Record that this file is a verification artifact. Remove it before commit unless the user explicitly wants to keep it.

### 4. Install from tarball in a clean directory

Run:

```bash
rm -rf /private/tmp/demo-ai-app-kit-publish-check
mkdir -p /private/tmp/demo-ai-app-kit-publish-check
cd /private/tmp/demo-ai-app-kit-publish-check
env npm_config_cache=/private/tmp/demo-ai-app-kit-npm-cache npm install /absolute/path/to/demo-ai-app-kit-<version>.tgz
```

Pass condition:

- Install exits `0`.
- `node_modules/.bin/demo-ai-app` exists.

### 5. Generate a sample project

Run:

```bash
./node_modules/.bin/demo-ai-app sample-admin
```

Pass condition:

- Command exits `0`.
- `sample-admin/` is created.
- Output says the project was generated and shows next steps.

### 6. Verify generated skeleton

Run from the generated project:

```bash
cd /private/tmp/demo-ai-app-kit-publish-check/sample-admin
./bin/check-demo --skeleton .
```

Pass condition:

- Command exits `0`.
- Output includes `Demo readiness: PASS`.
- Checks pass for app entry, workflow adapter, pattern registry, `docs/test-cases.md`, `skills/shell-implementation`, templates, assets, no forbidden source terms, and no copied reference/example paths.

### 7. Verify local Flask startup

First try installing dependencies:

```bash
python3 -m pip install -r requirements.txt
```

If network or cache restrictions block dependency installation, check whether the current Python already has Flask:

```bash
python3 -c 'import flask; print(flask.__version__)'
```

Start the generated app on a non-default test port:

```bash
PORT=5123 python3 app.py
```

If sandboxing blocks local port binding, rerun with the required local execution permission and state why.

Verify HTTP behavior:

```bash
curl -s -o /tmp/demo-ai-app-kit-home.html -w '%{http_code}' http://127.0.0.1:5123/
curl -s -X POST http://127.0.0.1:5123/api/workflow/demo \
  -H 'Content-Type: application/json' \
  -d '{"input":"hello workflow"}'
```

Pass condition:

- Server starts and prints a local URL.
- Home route returns an expected HTTP response such as `200` or login redirect `302`.
- Workflow demo API returns the stable envelope:
  - `ok`
  - `data`
  - `error`
  - `fallback`

Stop the server before finishing.

## Evidence To Report

Report exact command results, not general impressions:

- `npm test`: pass/fail and key output.
- `npm pack --dry-run`: pass/fail and excluded paths confirmed.
- Tarball install: pass/fail and clean directory path.
- `demo-ai-app sample-admin`: pass/fail.
- `./bin/check-demo --skeleton .`: pass/fail.
- Flask startup URL and HTTP checks.
- Any blocked check with exact reason.
- Any generated artifact left in the repo, especially `*.tgz`.

## Publish Decision

Recommend publishing only when:

- Repository self-test passes.
- Dry-run package boundary is clean.
- Tarball install works from a clean directory.
- Generated project skeleton check passes.
- Generated Flask shell starts or the only blocker is an external environment issue that has been clearly recorded.

After publishing, require a separate cross-device or clean-machine global install check.
