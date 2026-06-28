import { z } from "zod";
export declare const DocsContractSchema: z.ZodObject<{
    /** 前一阶段的文档路径（必须存在且有内容） */
    prerequisite: z.ZodString;
    /** 当前阶段的产出文档路径 */
    output: z.ZodString;
    /** 阶段通过条件 */
    acceptanceCriteria: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    prerequisite: string;
    output: string;
    acceptanceCriteria: string[];
}, {
    prerequisite: string;
    output: string;
    acceptanceCriteria: string[];
}>;
export type DocsContract = z.infer<typeof DocsContractSchema>;
//# sourceMappingURL=docs-contract.d.ts.map