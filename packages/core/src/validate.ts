import { readFile } from "node:fs/promises";
import { WorkflowStateSchema } from "./schemas/workflow-state.js";

/** Validate workflow-state.json against schema */
export async function validateWorkflow(filePath: string): Promise<{
  valid: boolean;
  errors?: string[];
  stage?: string;
}> {
  try {
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    const result = WorkflowStateSchema.safeParse(data);

    if (result.success) {
      return { valid: true, stage: result.data.stage };
    }
    return {
      valid: false,
      errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  } catch (err) {
    return {
      valid: false,
      errors: [(err as Error).message],
    };
  }
}
