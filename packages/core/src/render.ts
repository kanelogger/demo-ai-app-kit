import { readFile, writeFile } from "node:fs/promises";

/** Simple template renderer — replaces `{{KEY}}` placeholders with values */
export async function renderTemplate(
  filePath: string,
  vars: Record<string, string>
): Promise<void> {
  let content = await readFile(filePath, "utf-8");

  for (const [key, value] of Object.entries(vars)) {
    const placeholder = `{{${key}}}`;
    content = content.replaceAll(placeholder, value);
  }

  await writeFile(filePath, content, "utf-8");
}
