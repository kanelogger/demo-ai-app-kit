本项目的核心功能是打造一个对Agent友好的，帮助用户快速搭建PC端后台项目的工具。

1. 整个项目重置。定位是给vibe coding搭建一个良好的开发环境。体现在：
   - 有控制文件 AGENTS.md\SPEC\RULES\参考代码\SKILLS
   - 有基础模板
2. 用户旅程：从第六步开始 在收到用户回答前，不得创建/修改这些文件，没有验收文档，不得进入下一阶段。  
   1. npm install <kit>
   2. npx <kit> init <project-name>：初始化项目，把项目结构搭建好。
   3. cd <project-name>
   4. 运行 Agent
   5. 输入业务需求
   6. Agent 调用技能询问用户完善需求 -> 产出需求文档
   7. 用户查看需求文档，再进行对话并且迭代 -> 调整的需求文档
   8. 根据调整的需求文档，调用技能、结合项目模板进行技术方案设计，提供3个技术方案以及推荐理由让用户进行选择，提供用户推荐方案，也允许用户自主定义 -> 技术方案文档
   9. 调用技能，将用户选择的技术方案
3. 如何实现整个PDCA过程的阶段感？（可以在每个大阶段暂停换Agent/llm）
   1. 阶段锁。把流程拆成阶段文件（存放在 `docs/` 下）：`requirements/draft.md -> requirements/confirmed.md -> technical/options.md -> technical/selected.md -> execution/ready.md`。后一阶段必须引用前一阶段的确认字段，否则禁止继续。
   2. 状态文件。写一个机器可读状态，比如 workflow-state.json，校验脚本读这个状态，不满足就重回上一步。
   3. 给推荐方案，但禁止默认选择。可以改成：`Selected by: Agent default` 只允许在用户显式说“你替我选”后使用。否则方案选择必须停下来等用户。
   4. 硬停顿协议。明确写：`STOP after asking the clarification question. Do not continue until the user replies.`

