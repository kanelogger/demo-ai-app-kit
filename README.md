# Fullstack Admin Starter

一个精简的全栈管理后台起点项目，使用 pnpm workspace 统一管理前后端依赖。

- **前端**：Vue 3 + Vite + TypeScript + Element Plus + Tailwind CSS
- **后端**：Express + TypeScript + MySQL

## 项目结构

```text
.
├── package.json           # 根工作区配置与统一脚本
├── pnpm-workspace.yaml    # pnpm 工作区声明
├── pnpm-lock.yaml         # 统一 lockfile
├── frontend/              # 前端 Vue 管理后台
└── backend/               # Express 后端 API
```

## 环境要求

- Node.js `^20.19.0 || >=22.13.0`
- pnpm `>=9`
- MySQL 8

## 快速开始

### 1. 安装依赖

在根目录执行一次即可安装前后端所有依赖：

```bash
pnpm install
```

### 2. 配置数据库

后端默认连接本地 MySQL，配置在 `backend/src/config/index.ts`：

```ts
mysql: {
  host: "localhost",
  user: "root",
  password: "123456789",
  charset: "utf8_general_ci"
}
```

创建数据库并导入初始表结构（示例表 `users`）：

```sql
CREATE DATABASE IF NOT EXISTS pure_admin DEFAULT CHARACTER SET utf8mb4;
USE pure_admin;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  time DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password) VALUES
('admin', MD5('admin123'));
```

后端启动时会自动检测 `users` 表是否存在（见 `backend/src/utils/mysql.ts`）。

### 3. 启动开发服务

```bash
# 同时启动前端（localhost:8848）和后端（localhost:3000）
pnpm dev
```

也可以分别启动：

```bash
pnpm --filter frontend dev
pnpm --filter backend start
```

- 前端地址：http://localhost:8848
- 后端地址：http://localhost:3000
- Swagger 文档：http://localhost:3000/swagger-ui.html

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## 常用命令

```bash
pnpm install          # 安装/更新所有工作区依赖
pnpm dev              # 并行启动前后端开发服务
pnpm build            # 构建前后端
pnpm typecheck        # 前后端类型检查
pnpm start            # 仅启动后端（等价于 pnpm --filter backend start）
pnpm clean            # 清空所有 node_modules、dist 和 lockfile
```

## 依赖管理

通用开发依赖（如 `typescript`、`rimraf`）已提升到根目录 `package.json` 的 `devDependencies`，通过 pnpm workspace 共享给前后端。各工作区 `package.json` 只保留：

- **运行时依赖**（`dependencies`）：业务代码直接引用的库
- **专属开发依赖**（`devDependencies`）：仅该工作区使用的构建/调试工具

新增依赖时：

```bash
# 安装到根目录（共享开发依赖）
pnpm add -D <pkg>

# 安装到前端
pnpm --filter frontend add <pkg>

# 安装到后端
pnpm --filter backend add <pkg>
```

## 核心功能

- 登录 / JWT 鉴权
- 管理后台布局（侧边栏、标签页、主题）
- 用户列表分页、模糊搜索、增删改查
- 文件上传示例
- WebSocket 示例

## 注意事项

- 本项目已移除 mock 服务，前端请求会发送到真实后端。
- 开发时如需跨域，可在 `frontend/vite.config.ts` 中配置 `server.proxy`。
- 生产部署前请修改 `backend/.env` 中的 `JWT_SECRET`。
