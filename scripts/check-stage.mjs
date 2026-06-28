#!/usr/bin/env node
// check-stage.mjs — 读取 workflow-state.json 并校验阶段合法性
// Usage: node scripts/check-stage.mjs <generated-project-root>

import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

const STAGES = [
  "requirements-draft",
  "user-confirmed",
  "solution-selected",
  "implementation-ready",
];

const STAGE_FILES = {
  "requirements-draft": "docs/requirements/draft.md",
  "user-confirmed": "docs/requirements/confirmed.md",
  "solution-selected": "docs/technical/selected.md",
  "implementation-ready": "docs/execution/ready.md",
};

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function check(projectRoot) {
  const statePath = join(projectRoot, "workflow-state.json");

  if (!(await exists(statePath))) {
    console.error("❌ workflow-state.json not found in", projectRoot);
    process.exit(1);
  }

  const state = JSON.parse(await readFile(statePath, "utf-8"));

  // 1. Validate stage value
  if (!STAGES.includes(state.stage)) {
    console.error(`❌ Invalid stage: "${state.stage}". Must be one of: ${STAGES.join(", ")}`);
    process.exit(1);
  }

  // 2. selectedBy must be set when past solution-selected
  if (
    STAGES.indexOf(state.stage) >= STAGES.indexOf("solution-selected") &&
    !state.selectedBy
  ) {
    console.error("❌ selectedBy must be set (user | agent-default) at stage solution-selected or later");
    process.exit(1);
  }

  // 3. Check previous stage file exists
  const currentIdx = STAGES.indexOf(state.stage);
  if (currentIdx > 0) {
    const prevStage = STAGES[currentIdx - 1];
    const prevFile = join(projectRoot, STAGE_FILES[prevStage]);
    if (!(await exists(prevFile))) {
      console.error(`❌ Prerequisite stage file not found: ${STAGE_FILES[prevStage]}`);
      process.exit(1);
    }
  }

  // 4. Check current stage file exists (past draft)
  if (currentIdx > 0) {
    const currentFile = join(projectRoot, STAGE_FILES[state.stage]);
    if (!(await exists(currentFile))) {
      console.warn(`⚠️  Stage file not yet created: ${STAGE_FILES[state.stage]}`);
    }
  }

  console.log(`✅ Stage "${state.stage}" is valid`);
  if (state.selectedBy) {
    console.log(`   Selected by: ${state.selectedBy}`);
  }
}

const projectRoot = process.argv[2];
if (!projectRoot) {
  console.error("Usage: node scripts/check-stage.mjs <generated-project-root>");
  process.exit(1);
}
await check(projectRoot);
