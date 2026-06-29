---
status: draft
---

# PC Admin API 设计

本文档是前后端共享接口契约。前端 VO 字段、后端响应 JSON 字段和错误语义必须以本文档为准。

## 1. 通用约定

### 1.1 Base URL

- 开发环境：`http://localhost:3000`
- 接口路径不额外添加 `/api` 前缀（前端通过 Vite proxy 将 `/api` 请求代理到后端）。
- 所有非公开接口必须携带 `Authorization: Bearer <accessToken>`。

### 1.2 响应结构

成功响应：

```json
{
  "success": true,
  "data": {}
}
```

失败响应：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数不合法",
    "details": {}
  }
}
```

分页响应：

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 0,
      "totalPages": 0
    }
  }
}
```

### 1.3 状态码与错误码

| HTTP 状态码 | 错误码 | 说明 |
| --- | --- | --- |
| 400 | BAD_REQUEST | 请求格式错误 |
| 401 | UNAUTHORIZED | 未登录、Token 无效或 Token 过期 |
| 403 | FORBIDDEN | 已登录但无权限 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 编码、登录名等唯一字段冲突 |
| 422 | VALIDATION_ERROR | 业务校验失败 |
| 500 | INTERNAL_ERROR | 服务端错误 |

### 1.4 通用字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 资源 ID |
| status | number | 0-停用，1-启用 |
| createdAt | string | ISO 8601 时间 |
| updatedAt | string | ISO 8601 时间 |
| deleted | number | 0-正常，1-删除；默认不返回已删除数据 |

### 1.5 分页参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 20，最大 100 |
| sortBy | string | 否 | 排序字段 |
| sortOrder | string | 否 | `asc` 或 `desc` |

## 2. 登录认证

### 2.1 登录

`POST /login`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 登录名 |
| password | string | 是 | 密码 |
| rememberMe | boolean | 否 | 是否记住登录状态 |

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| userId | number | 用户 ID |
| username | string | 登录名 |
| nickname | string | 中文姓名 |
| avatar | string | 头像 URL |
| roles | string[] | 当前用户角色编码集合 |
| permissions | string[] | 按钮级权限预留，第一阶段可返回空数组 |
| accessToken | string | Access Token |
| refreshToken | string | Refresh Token |
| expires | string | Access Token 过期时间 |

业务规则：

- 停用用户返回 `USER_DISABLED`。
- 密码错误返回 `INVALID_CREDENTIALS`。
- 登录成功和失败都必须写入登录日志。

### 2.2 刷新 Token

`POST /refresh-token`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| refreshToken | string | 是 | Refresh Token |

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| accessToken | string | 新 Access Token |
| refreshToken | string | 新 Refresh Token |
| expires | string | 新 Access Token 过期时间 |

### 2.3 退出登录

`POST /logout`

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| message | string | 退出结果 |

前端收到成功响应后必须清除本地 Token、用户信息、角色和菜单缓存。

### 2.4 当前用户信息

`GET /auth/me`

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| user | UserProfile | 当前用户基础资料 |
| roles | RoleSummary[] | 启用角色集合 |
| menus | MenuRoute[] | 可访问菜单树 |
| permissions | string[] | 按钮级权限预留 |

### 2.5 动态菜单路由

`GET /get-async-routes`

响应 `data`：`MenuRoute[]`

`MenuRoute` 字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 菜单 ID |
| name | string | 路由名称 |
| path | string | 路由地址 |
| component | string | 组件路径 |
| redirect | string | 重定向地址，可为空 |
| meta | object | 标题、图标、排序、显示状态等元数据 |
| children | MenuRoute[] | 子菜单 |

## 3. 首页工作台

### 3.1 工作台概览

`GET /dashboard/overview`

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| todoCount | number | 我的待办数量 |
| unreadMessageCount | number | 未读消息数量 |
| recentOperations | OperationLogSummary[] | 最近操作记录 |
| announcements | MessageSummary[] | 系统公告 |
| adminStats | AdminStats \| null | 管理员统计，普通用户返回 null |

`AdminStats` 字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| userCount | number | 用户数 |
| roleCount | number | 角色数 |
| menuCount | number | 菜单数 |
| todayLoginCount | number | 今日登录数 |
| apiErrorCount | number | 接口异常数 |

## 4. 用户管理

### 4.1 用户分页查询

`GET /users`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userCode | string | 否 | 用户工号 |
| username | string | 否 | 登录名 |
| nickname | string | 否 | 中文姓名 |
| phone | string | 否 | 手机号 |
| deptId | number | 否 | 所属部门 |
| postId | number | 否 | 岗位 |
| status | number | 否 | 用户状态 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

响应 `items[]`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 用户 ID |
| userCode | string | 用户工号 |
| username | string | 登录名 |
| nickname | string | 中文姓名 |
| phone | string | 手机号 |
| email | string | 邮箱 |
| deptId | number | 部门 ID |
| deptName | string | 部门名称 |
| postId | number | 岗位 ID |
| postName | string | 岗位名称 |
| status | number | 用户状态 |
| roles | RoleSummary[] | 角色集合 |
| createdAt | string | 创建时间 |

### 4.2 新增用户

`POST /users`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userCode | string | 是 | 用户工号，唯一 |
| username | string | 是 | 登录名，唯一 |
| password | string | 是 | 初始密码 |
| nickname | string | 是 | 中文姓名 |
| phone | string | 否 | 手机号 |
| email | string | 否 | 邮箱 |
| deptId | number | 是 | 部门 ID |
| postId | number | 是 | 岗位 ID |
| status | number | 是 | 用户状态 |
| roleIds | number[] | 是 | 角色 ID 集合 |

响应 `data`：`UserDetail`

### 4.3 用户详情

`GET /users/:id`

响应 `data`：`UserDetail`

### 4.4 编辑用户

`PATCH /users/:id`

请求字段同新增用户，`password` 不允许通过此接口修改。

响应 `data`：`UserDetail`

### 4.5 启用/停用用户

`PATCH /users/:id/status`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| status | number | 是 | 0-停用，1-启用 |

### 4.6 重置密码

`POST /users/:id/reset-password`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| newPassword | string | 是 | 新密码 |

### 4.7 删除用户

`DELETE /users/:id`

采用逻辑删除。历史日志继续展示用户名称快照。

## 5. 角色管理

### 5.1 角色分页查询

`GET /roles`

查询参数：`roleName`、`roleCode`、`status`、通用分页参数。

响应 `items[]`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 角色 ID |
| roleName | string | 角色名称 |
| roleCode | string | 角色编码 |
| status | number | 角色状态 |
| description | string | 角色说明 |
| userCount | number | 用户数量 |
| createdAt | string | 创建时间 |

### 5.2 新增角色

`POST /roles`

请求字段：`roleName`、`roleCode`、`status`、`description`。

响应 `data`：`RoleDetail`

### 5.3 角色详情

`GET /roles/:id`

响应 `data`：`RoleDetail`

### 5.4 编辑角色

`PATCH /roles/:id`

请求字段：`roleName`、`status`、`description`。

### 5.5 启用/停用角色

`PATCH /roles/:id/status`

请求字段：`status`。

### 5.6 删除角色

`DELETE /roles/:id`

已被用户使用的角色返回 `ROLE_IN_USE`，只能停用或逻辑删除。

### 5.7 角色用户维护

`GET /roles/:id/users`

返回该角色下的用户分页列表。

`PUT /roles/:id/users`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userIds | number[] | 是 | 该角色最终绑定的用户 ID 集合 |

## 6. 菜单权限

### 6.1 菜单树

`GET /menus/tree`

响应 `data`：`MenuDetail[]`

### 6.2 新增菜单

`POST /menus`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| menuName | string | 是 | 菜单名称 |
| menuCode | string | 是 | 菜单编码，唯一 |
| parentId | number | 否 | 父级菜单 ID |
| icon | string | 否 | 菜单图标 |
| sortOrder | number | 是 | 排序号 |
| routePath | string | 是 | 路由地址 |
| componentPath | string | 否 | 组件路径 |
| visible | number | 是 | 0-隐藏，1-显示 |
| status | number | 是 | 0-停用，1-启用 |
| roleIds | number[] | 否 | 可访问角色 |

### 6.3 菜单详情

`GET /menus/:id`

响应 `data`：`MenuDetail`

### 6.4 编辑菜单

`PATCH /menus/:id`

请求字段同新增菜单。

### 6.5 启用/停用菜单

`PATCH /menus/:id/status`

请求字段：`status`。

### 6.6 菜单排序

`PATCH /menus/tree/sort`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| items | Array<{ id: number, parentId?: number, sortOrder: number }> | 是 | 菜单排序结果 |

### 6.7 菜单授权角色

`PUT /menus/:id/roles`

请求字段：`roleIds`。

## 7. 部门管理

### 7.1 部门分页查询

`GET /departments`

查询参数：`deptCode`、`deptName`、`status`、通用分页参数。

### 7.2 部门选项

`GET /departments/options`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| enabledOnly | boolean | 否 | 是否只返回启用部门，默认 true |

### 7.3 部门维护

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /departments | 新增部门 |
| GET | /departments/:id | 部门详情 |
| PATCH | /departments/:id | 编辑部门 |
| PATCH | /departments/:id/status | 启用或停用部门 |
| DELETE | /departments/:id | 删除部门 |

维护字段：`deptCode`、`deptName`、`status`、`description`。

已被用户引用的部门删除时返回 `DEPARTMENT_IN_USE`。

## 8. 岗位管理

### 8.1 岗位分页查询

`GET /posts`

查询参数：`postCode`、`postName`、`status`、通用分页参数。

### 8.2 岗位选项

`GET /posts/options`

查询参数：`enabledOnly`，默认 true。

### 8.3 岗位维护

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /posts | 新增岗位 |
| GET | /posts/:id | 岗位详情 |
| PATCH | /posts/:id | 编辑岗位 |
| PATCH | /posts/:id/status | 启用或停用岗位 |
| DELETE | /posts/:id | 删除岗位 |

维护字段：`postCode`、`postName`、`status`、`description`。

已被用户引用的岗位删除时返回 `POST_IN_USE`。

## 9. 数据字典

### 9.1 字典类型分页查询

`GET /dict-types`

查询参数：`dictCode`、`dictName`、`status`、通用分页参数。

### 9.2 字典类型维护

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /dict-types | 新增字典类型 |
| GET | /dict-types/:id | 字典类型详情 |
| PATCH | /dict-types/:id | 编辑字典类型 |
| PATCH | /dict-types/:id/status | 启用或停用字典类型 |
| DELETE | /dict-types/:id | 删除字典类型 |

维护字段：`dictCode`、`dictName`、`status`、`description`。

删除字典类型前必须确认无启用字典项。

### 9.3 字典项查询

`GET /dict-types/:id/items`

响应 `items[]` 字段：`id`、`itemValue`、`itemLabel`、`sortOrder`、`status`、`description`。

### 9.4 字典项维护

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /dict-types/:id/items | 新增字典项 |
| PATCH | /dict-items/:id | 编辑字典项 |
| PATCH | /dict-items/:id/status | 启用或停用字典项 |
| PATCH | /dict-items/batch-sort | 调整字典项排序 |
| DELETE | /dict-items/:id | 删除字典项 |

维护字段：`itemValue`、`itemLabel`、`sortOrder`、`status`、`description`。

### 9.5 按编码获取字典项

`GET /dict-types/by-code/:dictCode/options`

查询参数：`enabledOnly`，默认 true。

## 10. 文件附件

### 10.1 上传附件

`POST /attachments`

请求类型：`multipart/form-data`

字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| file | File | 是 | 文件内容 |
| businessModule | string | 否 | 业务模块 |
| businessRecordId | number | 否 | 业务记录 ID |

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 附件 ID |
| originalName | string | 原始文件名 |
| storedName | string | 存储文件名 |
| url | string | 文件访问 URL |
| mimeType | string | MIME 类型 |
| fileSize | number | 文件大小 |
| uploadedAt | string | 上传时间 |

### 10.2 附件下载

`GET /attachments/:id/download`

必须校验登录态和访问权限。

### 10.3 图片预览

`GET /attachments/:id/preview`

仅图片类附件可预览，非图片返回 `UNSUPPORTED_PREVIEW_TYPE`。

### 10.4 删除附件

`DELETE /attachments/:id`

默认逻辑删除或标记为未引用，不直接删除物理文件。

## 11. 消息中心

### 11.1 我的消息分页查询

`GET /messages`

查询参数：`title`、`messageType`、`readStatus`、`sentStartAt`、`sentEndAt`、通用分页参数。

响应 `items[]`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 消息 ID |
| title | string | 消息标题 |
| messageType | string | 消息类型 |
| summary | string | 消息摘要 |
| readStatus | number | 0-未读，1-已读 |
| sentAt | string | 发送时间 |
| readAt | string | 阅读时间，可为空 |

### 11.2 消息详情

`GET /messages/:id`

用户只能查看自己的消息。

### 11.3 单条已读

`PATCH /messages/:id/read`

### 11.4 批量已读

`PATCH /messages/read`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ids | number[] | 否 | 当前页消息 ID 集合 |
| all | boolean | 否 | 是否全部已读 |

`ids` 和 `all` 必须二选一。

### 11.5 未读数量

`GET /messages/unread-count`

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| count | number | 当前用户未读消息数 |

## 12. 日志审计

### 12.1 登录日志

`GET /logs/login`

查询参数：`loginName`、`loginResult`、`startAt`、`endAt`、通用分页参数。

### 12.2 操作日志

`GET /logs/operation`

查询参数：`operatorName`、`moduleCode`、`operationType`、`operationResult`、`startAt`、`endAt`、通用分页参数。

### 12.3 异常日志

`GET /logs/exception`

查询参数：`requestPath`、`errorType`、`handledStatus`、`startAt`、`endAt`、通用分页参数。

### 12.4 日志详情

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | /logs/login/:id | 登录日志详情 |
| GET | /logs/operation/:id | 操作日志详情 |
| GET | /logs/exception/:id | 异常日志详情 |

普通用户不能删除或修改日志。

## 13. 系统配置

### 13.1 配置分页查询

`GET /system-configs`

查询参数：`configCode`、`configName`、`status`、通用分页参数。

### 13.2 配置维护

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /system-configs | 新增配置 |
| GET | /system-configs/:id | 配置详情 |
| PATCH | /system-configs/:id | 编辑配置 |
| PATCH | /system-configs/:id/status | 启用或停用配置 |
| DELETE | /system-configs/:id | 删除配置 |

维护字段：`configCode`、`configName`、`configValue`、`valueType`、`status`、`description`。

### 13.3 按编码读取配置

`GET /system-configs/by-code/:configCode/value`

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| configCode | string | 配置编码 |
| configValue | string | 配置值 |
| valueType | string | 值类型 |

## 14. 个人信息

### 14.1 当前用户资料

`GET /profile`

响应 `data`：`UserProfile`

`UserProfile` 字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 用户 ID |
| userCode | string | 用户工号 |
| username | string | 登录名 |
| nickname | string | 中文姓名 |
| phone | string | 手机号 |
| email | string | 邮箱 |
| avatar | string | 头像 URL |
| deptId | number | 部门 ID |
| deptName | string | 部门名称 |
| postId | number | 岗位 ID |
| postName | string | 岗位名称 |
| status | number | 用户状态 |
| roles | RoleSummary[] | 角色集合 |

### 14.2 修改密码

`POST /profile/change-password`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| oldPassword | string | 是 | 原密码 |
| newPassword | string | 是 | 新密码 |
| confirmPassword | string | 是 | 确认密码 |

业务规则：

- 原密码错误返回 `INVALID_OLD_PASSWORD`。
- 新密码与确认密码不一致返回 `PASSWORD_CONFIRM_MISMATCH`。
- 新密码与原密码相同返回 `PASSWORD_UNCHANGED`。
- 修改成功后前端应重新登录或刷新 Token。

## 15. 共享对象

### 15.1 RoleSummary

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 角色 ID |
| roleCode | string | 角色编码 |
| roleName | string | 角色名称 |

### 15.2 UserDetail

包含 `UserProfile` 全部字段，并额外返回：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

### 15.3 RoleDetail

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 角色 ID |
| roleName | string | 角色名称 |
| roleCode | string | 角色编码 |
| status | number | 角色状态 |
| description | string | 角色说明 |
| isSuperAdmin | boolean | 是否超级管理员 |
| menuIds | number[] | 已授权菜单 ID |
| userCount | number | 用户数量 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

### 15.4 MenuDetail

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 菜单 ID |
| menuName | string | 菜单名称 |
| menuCode | string | 菜单编码 |
| parentId | number | 父级菜单 ID，可为空 |
| icon | string | 图标 |
| sortOrder | number | 排序号 |
| routePath | string | 路由地址 |
| componentPath | string | 组件路径 |
| visible | number | 显示状态 |
| status | number | 菜单状态 |
| roleIds | number[] | 可访问角色 ID |
| children | MenuDetail[] | 子菜单 |

### 15.5 OperationLogSummary

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 日志 ID |
| operatorName | string | 操作人 |
| moduleCode | string | 操作模块 |
| operationType | string | 操作类型 |
| requestParams | object | 脱敏后的请求参数 |
| operationResult | number | 操作结果 |
| operatedAt | string | 操作时间 |

### 15.6 MessageSummary

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 消息 ID |
| title | string | 标题 |
| summary | string | 摘要 |
| messageType | string | 消息类型 |
| readStatus | number | 已读状态 |
| sentAt | string | 发送时间 |

## 16. 兼容说明

- 当前前端已有 `POST /login`、`POST /refresh-token`、`GET /get-async-routes` 调用，本文档保留这些路径。
- 用户、角色、菜单、部门、岗位、字典等管理接口采用 REST 风格资源路径。
- 第一阶段按钮级权限字段 `permissions` 可返回空数组，但字段必须保留，避免前端 VO 变更。
- 第一阶段不强制实现公告维护模块，首页公告可复用消息中心的系统公告数据。
