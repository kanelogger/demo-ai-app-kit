# kit-test

当前仓库要收敛成一个 **Agent-friendly PC 后台项目生成器**。核心意图以 `product-ref.md` 为准。

## 当前边界

这个仓库包含两层东西：

- **kit 本体**：`packages/cli`、`packages/core`、`specs`、`rules`、`scripts`，负责初始化项目、复制模板、渲染变量、校验阶段状态。
- **PC admin 模板源**：`templates/pc-admin/`，内含 `frontend/`、`backend/` 及其他模板文件。`init` 时会复制整个模板目录到目标项目。

## 事实源

- 产品意图：`product-ref.md`
- 当前开发清单：`TODO.md`
- 初始化流程：`specs/101-init-flow.md`
- 阶段闸门：`rules/stage-gates.md`
- 生成项目入口：`templates/pc-admin/AGENTS.md`

## 当前不要混在一起做

- 不把根目录继续当一个业务后台项目打磨。
- 不在整理阶段做 Fastify 迁移、CRUD 模板、workflow 接口、MySQL 初始化。
- 不把比赛现场笔记、私有路径、本机配置塞进生成模板。

## 开发命令

### Kit 本体开发

```bash
pnpm install
pnpm typecheck
pnpm build
node packages/cli/dist/index.js init my-admin
```

### 模板系统开发（启动前后端服务）

```bash
# 1. 先启动 MySQL（需要 Docker）
pnpm template:mysql

# 2. 安装模板依赖（仅首次）
pnpm template:install

# 3. 启动前后端开发服务器
pnpm template:dev
# 前端: http://localhost:8848
# 后端: http://localhost:3000
```

生成项目后：

```bash
cd my-admin
node scripts/check-stage
node scripts/check-docs
node scripts/check-base
```

## 阶段模型

```text
requirements-draft
  -> user-confirmed
  -> solution-selected
  -> implementation-ready
```

硬停顿协议：

```text
STOP after asking the clarification question. Do not continue until the user replies.
```
