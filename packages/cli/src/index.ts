#!/usr/bin/env node
// CLI entry — `npx kit-test init <project-name>`

import { initProject } from "@kit-test/core";

const rawArgs = process.argv.slice(2);
const args = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;
const command = args[0];

if (command === "init") {
  const projectName = args[1];
  if (!projectName) {
    console.error("Usage: npx kit-test init <project-name>");
    process.exit(1);
  }
  try {
    await initProject(projectName);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}`);
  console.error("Usage: npx kit-test init <project-name>");
  process.exit(1);
}
