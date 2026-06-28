/** Validate workflow-state.json against schema */
export declare function validateWorkflow(filePath: string): Promise<{
    valid: boolean;
    errors?: string[];
    stage?: string;
}>;
//# sourceMappingURL=validate.d.ts.map