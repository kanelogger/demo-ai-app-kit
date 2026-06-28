import { z } from "zod";

export const WorkflowStateSchema = z.object({
  stage: z.enum([
    "requirements-draft",
    "user-confirmed",
    "solution-selected",
    "implementation-ready",
  ]),
  startedAt: z.string().datetime(),
  selectedBy: z.enum(["user", "agent-default"]).nullable(),
  lastUpdatedAt: z.string().datetime().optional(),
});

export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
