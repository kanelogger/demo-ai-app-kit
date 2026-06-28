import { z } from "zod";
export declare const WorkflowStateSchema: z.ZodObject<{
    stage: z.ZodEnum<["requirements-draft", "user-confirmed", "solution-selected", "implementation-ready"]>;
    startedAt: z.ZodString;
    selectedBy: z.ZodNullable<z.ZodEnum<["user", "agent-default"]>>;
    lastUpdatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startedAt: string;
    stage: "requirements-draft" | "user-confirmed" | "solution-selected" | "implementation-ready";
    selectedBy: "user" | "agent-default" | null;
    lastUpdatedAt?: string | undefined;
}, {
    startedAt: string;
    stage: "requirements-draft" | "user-confirmed" | "solution-selected" | "implementation-ready";
    selectedBy: "user" | "agent-default" | null;
    lastUpdatedAt?: string | undefined;
}>;
export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
//# sourceMappingURL=workflow-state.d.ts.map