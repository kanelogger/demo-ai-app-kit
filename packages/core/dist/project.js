import { access, cp, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Resolve source directories relative to this module
const REPO_ROOT = join(__dirname, "../../..");
const TEMPLATE_DIR = join(REPO_ROOT, "templates/pc-admin");
const FRONTEND_DIR = join(REPO_ROOT, "templates/pc-admin/frontend");
const BACKEND_DIR = join(REPO_ROOT, "templates/pc-admin/backend");
function skipFilter(src) {
    const basename = src.split("/").pop();
    if (basename === "node_modules" || basename === "dist")
        return false;
    if (basename.startsWith(".") && basename !== ".gitignore" && basename !== ".agents")
        return false;
    return true;
}
function validateProjectName(name) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
        throw new Error(`Invalid project name "${name}". Use kebab-case, for example "my-admin".`);
    }
}
async function assertTargetAvailable(target) {
    try {
        await access(target);
    }
    catch {
        return;
    }
    throw new Error(`Target directory already exists: ${target}`);
}
export async function initProject(name) {
    const cwd = process.cwd();
    const target = join(cwd, name);
    const startedAt = new Date().toISOString();
    validateProjectName(name);
    await assertTargetAvailable(target);
    // 1. Copy template config/docs/scripts
    await cp(TEMPLATE_DIR, target, { recursive: true, filter: skipFilter });
    // 2. Copy frontend source
    await cp(FRONTEND_DIR, join(target, "frontend"), { recursive: true, filter: skipFilter });
    // 3. Copy backend source
    await cp(BACKEND_DIR, join(target, "backend"), { recursive: true, filter: skipFilter });
    // 4. Render template variables in generated files
    await renderProjectFile(join(target, "package.json"), { projectName: name });
    await renderProjectFile(join(target, "AGENTS.md"), { projectName: name });
    await renderProjectFile(join(target, "workflow-state.json"), { startedAt });
    // 5. Write final workflow state (overwrite rendered version)
    const state = {
        stage: "requirements-draft",
        startedAt,
        selectedBy: null,
    };
    await writeFile(join(target, "workflow-state.json"), JSON.stringify(state, null, 2) + "\n");
    console.log(`Project "${name}" initialized at ${target}`);
    console.log(`Next steps: cd ${name} && node scripts/check-stage`);
}
async function renderProjectFile(filePath, vars) {
    let content = await readFile(filePath, "utf-8");
    for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(`{{${key}}}`, value);
    }
    await writeFile(filePath, content, "utf-8");
}
//# sourceMappingURL=project.js.map