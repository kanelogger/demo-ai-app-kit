---
title: Phase 1 - CLI Foundation
slug: phase-1-cli-foundation
summary: 建立 CLI 包和三个首版命令：init、check、stage advance。
---

## Goal

实现可构建的 `packages/cli`，提供 `kit init <project-name>`、`kit check`、`kit stage advance <stage> --by --quote` 的基础能力。

## Inputs

* [`00-contract.md`](/Users/kanehua/project/kit-test/plan/00-contract.md)
* Root `package.json`
* `pnpm-workspace.yaml`
* `templates/pc-admin/`

## Tasks

* Add `packages/cli` with TypeScript build config and a binary entry.
* Wire root `package.json` scripts to the built CLI.
* Implement `kit init <project-name>` with template copy, `{{projectName}}` replacement, generated control files, and overwrite protection.
* Implement `kit check` as a lightweight validator for state, stage artifacts, API source references, and forbidden future files.
* Implement `kit stage advance <stage> --by --quote` with no skip support, mandatory exact quote, JSON state update, and `history[]` append.

## Acceptance Criteria

* `pnpm build` builds the CLI package.
* `node packages/cli/dist/index.js init demo-admin` creates a generated project in a temp directory.
* Generated project contains the root and frontend/backend structure required by `00-contract.md`.
* `kit check` passes on a fresh generated project at `initialized`.
* `kit stage advance` rejects skipped stages and missing `--quote`.

## Verification

* Run `pnpm build`.
* Run `node packages/cli/dist/index.js init demo-admin` in `/tmp` or another disposable directory.
* Run generated project `kit check` command.
* Run one valid `kit stage advance requirements-draft --by user --quote "<exact quote>"`.
* Run one invalid skip attempt and confirm it fails with a repair action.

## Out of Scope

* Full fixture suite.
* Runtime-specific Agent hooks.
* Frontend/backend implementation changes.
* Markdown body parsing.

## Depends On

None. This is the foundation phase.
