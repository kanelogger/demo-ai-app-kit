import { z } from "zod";
export const DocsContractSchema = z.object({
    /** 前一阶段的文档路径（必须存在且有内容） */
    prerequisite: z.string(),
    /** 当前阶段的产出文档路径 */
    output: z.string(),
    /** 阶段通过条件 */
    acceptanceCriteria: z.array(z.string()).min(1),
});
//# sourceMappingURL=docs-contract.js.map