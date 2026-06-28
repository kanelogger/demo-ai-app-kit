#!/usr/bin/env node
// copy-skills.mjs — 将指定技能从仓库复制到项目 skills 目录
// Usage: node scripts/copy-skills.mjs [--force] [--dry-run] <skill-name>...

import { cp, access, constants } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const SOURCE = "/Users/kanehua/project/hk-skills/warehouse/adapted";
const TARGET = join(PROJECT_ROOT, "skills");

// ---- CLI parsing ----
const args = process.argv.slice(2);
const flags = { force: false, dryRun: false };

const names = [];
for (const a of args) {
  if (a === "--force" || a === "-f") flags.force = true;
  else if (a === "--dry-run" || a === "-n") flags.dryRun = true;
  else names.push(a);
}

if (names.length === 0) {
  console.error("Usage: node scripts/copy-skills.mjs [--force] [--dry-run] <skill-name>...");
  process.exit(1);
}

// ---- helpers ----
async function exists(p) {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
}

async function copyOne(name) {
  const src = join(SOURCE, name);
  const dst = join(TARGET, name);

  if (!(await exists(src))) {
    return { name, ok: false, reason: `source not found: ${src}` };
  }

  if (!flags.force && (await exists(dst))) {
    return { name, ok: false, reason: `target already exists: ${dst} (use --force to overwrite)` };
  }

  if (flags.dryRun) {
    return { name, ok: true, reason: "dry-run: would copy" };
  }

  await cp(src, dst, { recursive: true });
  return { name, ok: true };
}

// ---- main ----
let failures = 0;
for (const name of names) {
  const r = await copyOne(name);
  if (r.ok) {
    console.log(`✅ ${r.name}${r.reason ? `  (${r.reason})` : ""}`);
  } else {
    console.error(`❌ ${r.name}: ${r.reason}`);
    failures++;
  }
}

if (failures > 0) process.exit(1);
