---
status: draft
database: MySQL 8.0
driver: mysql2
---

# PC Admin 数据库设计

## 1. 概述

本文档描述 PC 后台管理模板的数据库设计，覆盖登录认证、首页工作台、用户管理、角色管理、菜单权限、部门管理、岗位管理、数据字典、文件附件、消息中心、日志审计、系统配置和个人信息模块。

数据库采用 MySQL 8.0，后端通过 `mysql2` 连接池访问。设计目标是支撑 demo 级后台管理系统的真实接口联调，并保留后续扩展空间。

## 2. 设计原则

### 2.1 命名规范

- 表名和字段名采用 `lower_snake_case`。
- 表名使用复数形式或业务集合名。
- 主键统一命名为 `id`，类型为 `BIGINT UNSIGNED AUTO_INCREMENT`。
- 外键命名为 `{关联实体}_id`。
- 接口字段使用 `camelCase`，数据库字段由服务层映射。

### 2.2 审计字段

除纯日志表外，业务表统一包含以下字段：

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人用户 ID |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 最后更新人用户 ID |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最后更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志：0-正常，1-删除 |

### 2.3 数据类型约定

| 用途 | 类型 | 说明 |
| --- | --- | --- |
| 主键 | BIGINT UNSIGNED AUTO_INCREMENT | 所有业务主键 |
| 编码 | VARCHAR(64) | 登录名、角色编码、菜单编码等 |
| 名称 | VARCHAR(128) | 中文名称、标题、标签 |
| 状态 | TINYINT | 0-停用，1-启用，其他值由字段说明定义 |
| 枚举编码 | VARCHAR(32) | 消息类型、操作类型、文件来源等 |
| 日期时间 | DATETIME | 服务端统一写入 |
| JSON | JSON | 路由元数据、请求参数、配置扩展 |
| 长文本 | TEXT | 内容、说明、错误信息 |

## 3. 核心数据表设计

### 3.1 组织与用户

#### departments - 部门信息表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| dept_code | VARCHAR(64) | NOT NULL | - | 部门编码，唯一 |
| dept_name | VARCHAR(128) | NOT NULL | - | 部门名称 |
| status | TINYINT | NOT NULL | 1 | 状态：0-停用，1-启用 |
| description | VARCHAR(255) | NULL | NULL | 部门说明 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### posts - 岗位信息表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| post_code | VARCHAR(64) | NOT NULL | - | 岗位编码，唯一 |
| post_name | VARCHAR(128) | NOT NULL | - | 岗位名称 |
| status | TINYINT | NOT NULL | 1 | 状态：0-停用，1-启用 |
| description | VARCHAR(255) | NULL | NULL | 岗位说明 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### users - 用户信息表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| user_code | VARCHAR(64) | NOT NULL | - | 用户工号，唯一 |
| login_name | VARCHAR(64) | NOT NULL | - | 登录名，唯一 |
| password_hash | VARCHAR(255) | NOT NULL | - | 加密密码 |
| display_name | VARCHAR(128) | NOT NULL | - | 中文姓名 |
| phone | VARCHAR(32) | NULL | NULL | 手机号 |
| email | VARCHAR(128) | NULL | NULL | 邮箱 |
| avatar_url | VARCHAR(512) | NULL | NULL | 头像地址 |
| dept_id | BIGINT UNSIGNED | NULL | NULL | 所属部门 ID |
| post_id | BIGINT UNSIGNED | NULL | NULL | 所属岗位 ID |
| status | TINYINT | NOT NULL | 1 | 状态：0-停用，1-启用 |
| last_login_at | DATETIME | NULL | NULL | 最近登录时间 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

### 3.2 角色与菜单权限

#### roles - 角色信息表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| role_code | VARCHAR(64) | NOT NULL | - | 角色编码，唯一 |
| role_name | VARCHAR(128) | NOT NULL | - | 角色名称 |
| status | TINYINT | NOT NULL | 1 | 状态：0-停用，1-启用 |
| description | VARCHAR(255) | NULL | NULL | 角色说明 |
| is_super_admin | TINYINT | NOT NULL | 0 | 是否超级管理员角色 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### user_roles - 用户角色关联表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| user_id | BIGINT UNSIGNED | NOT NULL | - | 用户 ID |
| role_id | BIGINT UNSIGNED | NOT NULL | - | 角色 ID |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### menus - 菜单信息表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| menu_code | VARCHAR(64) | NOT NULL | - | 菜单编码，唯一 |
| menu_name | VARCHAR(128) | NOT NULL | - | 菜单名称 |
| parent_id | BIGINT UNSIGNED | NULL | NULL | 父级菜单 ID |
| icon | VARCHAR(128) | NULL | NULL | 菜单图标 |
| sort_order | INT | NOT NULL | 0 | 同父级排序号 |
| route_path | VARCHAR(255) | NOT NULL | - | 路由地址 |
| component_path | VARCHAR(255) | NULL | NULL | 前端组件路径 |
| visible | TINYINT | NOT NULL | 1 | 显示状态：0-隐藏，1-显示 |
| status | TINYINT | NOT NULL | 1 | 菜单状态：0-停用，1-启用 |
| meta_json | JSON | NULL | NULL | 路由扩展元数据 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### role_menus - 角色菜单关联表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| role_id | BIGINT UNSIGNED | NOT NULL | - | 角色 ID |
| menu_id | BIGINT UNSIGNED | NOT NULL | - | 菜单 ID |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

### 3.3 数据字典与系统配置

#### dict_types - 字典类型表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| dict_code | VARCHAR(64) | NOT NULL | - | 字典类型编码，唯一 |
| dict_name | VARCHAR(128) | NOT NULL | - | 字典类型名称 |
| status | TINYINT | NOT NULL | 1 | 状态：0-停用，1-启用 |
| description | VARCHAR(255) | NULL | NULL | 说明 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### dict_items - 字典项表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| dict_type_id | BIGINT UNSIGNED | NOT NULL | - | 字典类型 ID |
| item_value | VARCHAR(64) | NOT NULL | - | 字典值 |
| item_label | VARCHAR(128) | NOT NULL | - | 字典标签 |
| sort_order | INT | NOT NULL | 0 | 排序号 |
| status | TINYINT | NOT NULL | 1 | 状态：0-停用，1-启用 |
| description | VARCHAR(255) | NULL | NULL | 说明 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### system_configs - 系统配置表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| config_code | VARCHAR(64) | NOT NULL | - | 配置编码，唯一 |
| config_name | VARCHAR(128) | NOT NULL | - | 配置名称 |
| config_value | TEXT | NOT NULL | - | 配置值 |
| value_type | VARCHAR(32) | NOT NULL | STRING | 值类型：STRING、NUMBER、BOOLEAN、JSON |
| status | TINYINT | NOT NULL | 1 | 状态：0-停用，1-启用 |
| description | VARCHAR(255) | NULL | NULL | 配置说明 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

### 3.4 文件附件与消息

#### attachments - 附件元数据表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| original_name | VARCHAR(255) | NOT NULL | - | 原始文件名 |
| stored_name | VARCHAR(255) | NOT NULL | - | 存储文件名 |
| file_url | VARCHAR(512) | NOT NULL | - | 访问地址 |
| mime_type | VARCHAR(128) | NOT NULL | - | MIME 类型 |
| file_ext | VARCHAR(32) | NOT NULL | - | 文件后缀 |
| file_size | BIGINT UNSIGNED | NOT NULL | - | 文件大小，单位 byte |
| file_hash | VARCHAR(128) | NULL | NULL | 文件摘要 |
| business_module | VARCHAR(64) | NULL | NULL | 业务模块 |
| business_record_id | BIGINT UNSIGNED | NULL | NULL | 业务记录 ID |
| reference_status | TINYINT | NOT NULL | 1 | 引用状态：0-未引用，1-已引用 |
| upload_user_id | BIGINT UNSIGNED | NOT NULL | - | 上传人 |
| uploaded_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 上传时间 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

#### messages - 站内消息表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| receiver_id | BIGINT UNSIGNED | NOT NULL | - | 接收人 ID |
| sender_id | BIGINT UNSIGNED | NULL | NULL | 发送人 ID，系统消息可为空 |
| title | VARCHAR(128) | NOT NULL | - | 消息标题 |
| summary | VARCHAR(255) | NULL | NULL | 消息摘要 |
| content | TEXT | NOT NULL | - | 消息内容 |
| message_type | VARCHAR(32) | NOT NULL | NOTICE | 消息类型 |
| read_status | TINYINT | NOT NULL | 0 | 已读状态：0-未读，1-已读 |
| sent_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 发送时间 |
| read_at | DATETIME | NULL | NULL | 阅读时间 |
| created_by | BIGINT UNSIGNED | NULL | NULL | 创建人 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | BIGINT UNSIGNED | NULL | NULL | 更新人 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | TINYINT | NOT NULL | 0 | 逻辑删除标志 |

### 3.5 日志审计

#### login_logs - 登录日志表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| user_id | BIGINT UNSIGNED | NULL | NULL | 登录用户 ID，失败时可为空 |
| login_name | VARCHAR(64) | NOT NULL | - | 登录名 |
| login_ip | VARCHAR(64) | NULL | NULL | 登录 IP |
| user_agent | VARCHAR(512) | NULL | NULL | 浏览器标识 |
| login_result | TINYINT | NOT NULL | - | 登录结果：0-失败，1-成功 |
| failure_reason | VARCHAR(255) | NULL | NULL | 失败原因 |
| logged_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 登录时间 |

#### operation_logs - 操作日志表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| operator_id | BIGINT UNSIGNED | NULL | NULL | 操作人 ID |
| operator_name | VARCHAR(128) | NULL | NULL | 操作人名称快照 |
| module_code | VARCHAR(64) | NOT NULL | - | 操作模块 |
| operation_type | VARCHAR(32) | NOT NULL | - | 操作类型：CREATE、UPDATE、DELETE 等 |
| request_method | VARCHAR(16) | NOT NULL | - | 请求方法 |
| request_path | VARCHAR(255) | NOT NULL | - | 请求路径 |
| request_params | JSON | NULL | NULL | 脱敏后的请求参数 |
| operation_result | TINYINT | NOT NULL | - | 操作结果：0-失败，1-成功 |
| error_message | TEXT | NULL | NULL | 错误信息 |
| operated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 操作时间 |

#### exception_logs - 异常日志表

| 字段名 | 数据类型 | 是否空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | BIGINT UNSIGNED | NOT NULL | - | 主键 |
| request_path | VARCHAR(255) | NOT NULL | - | 接口路径 |
| request_method | VARCHAR(16) | NOT NULL | - | 请求方法 |
| error_type | VARCHAR(128) | NOT NULL | - | 错误类型 |
| error_message | TEXT | NOT NULL | - | 错误信息 |
| stack_summary | TEXT | NULL | NULL | 堆栈摘要 |
| handled_status | TINYINT | NOT NULL | 0 | 处理状态：0-未处理，1-已处理 |
| occurred_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 发生时间 |

## 4. 数据关系和约束

### 4.1 主要外键关系

- `users.dept_id` -> `departments.id`
- `users.post_id` -> `posts.id`
- `user_roles.user_id` -> `users.id`
- `user_roles.role_id` -> `roles.id`
- `menus.parent_id` -> `menus.id`
- `role_menus.role_id` -> `roles.id`
- `role_menus.menu_id` -> `menus.id`
- `dict_items.dict_type_id` -> `dict_types.id`
- `attachments.upload_user_id` -> `users.id`
- `messages.receiver_id` -> `users.id`
- `messages.sender_id` -> `users.id`
- `login_logs.user_id` -> `users.id`
- `operation_logs.operator_id` -> `users.id`

### 4.2 唯一约束

- `departments.dept_code`
- `posts.post_code`
- `users.user_code`
- `users.login_name`
- `roles.role_code`
- `menus.menu_code`
- `dict_types.dict_code`
- `dict_items(dict_type_id, item_value, deleted)`
- `system_configs.config_code`
- `user_roles(user_id, role_id, deleted)`
- `role_menus(role_id, menu_id, deleted)`

### 4.3 索引设计

- 用户查询：`users(login_name)`、`users(user_code)`、`users(display_name)`、`users(dept_id, post_id, status, deleted)`。
- 权限计算：`user_roles(user_id, deleted)`、`role_menus(role_id, deleted)`、`menus(parent_id, sort_order, status, deleted)`。
- 基础数据：`departments(status, deleted)`、`posts(status, deleted)`、`dict_items(dict_type_id, status, sort_order, deleted)`。
- 附件查询：`attachments(business_module, business_record_id, deleted)`、`attachments(upload_user_id, uploaded_at)`。
- 消息查询：`messages(receiver_id, read_status, sent_at, deleted)`。
- 日志查询：`login_logs(login_name, logged_at)`、`operation_logs(operator_id, operated_at)`、`operation_logs(module_code, operation_type, operated_at)`、`exception_logs(handled_status, occurred_at)`。

## 5. 预置数据

### 5.1 默认部门和岗位

| 表 | 编码 | 名称 | 说明 |
| --- | --- | --- | --- |
| departments | ADMIN | 管理部 | 系统管理与配置维护 |
| departments | OPS | 运营部 | 日常业务运营 |
| posts | ADMIN | 管理员 | 系统管理员岗位 |
| posts | OPERATOR | 运营人员 | 普通运营岗位 |
| posts | AUDITOR | 审核人员 | 审核与复核岗位 |
| posts | USER | 普通用户 | 默认用户岗位 |

### 5.2 默认角色

| 角色编码 | 角色名称 | 是否超级管理员 | 说明 |
| --- | --- | --- | --- |
| SUPER_ADMIN | 超级管理员 | 1 | 默认拥有全部菜单访问能力 |
| OPERATOR | 运营人员 | 0 | 可访问基础业务菜单 |
| COMMON_USER | 普通用户 | 0 | 仅访问个人工作台和个人信息 |

### 5.3 默认配置

| 配置编码 | 配置名称 | 示例值 | 说明 |
| --- | --- | --- | --- |
| SYSTEM_NAME | 系统名称 | PC Admin | 登录页和顶部栏展示 |
| LOGIN_TITLE | 登录页标题 | PC Admin 管理后台 | 登录页标题 |
| UPLOAD_MAX_SIZE_MB | 文件上传大小限制 | 10 | 单文件最大 MB |
| UPLOAD_ALLOWED_EXTENSIONS | 允许上传文件类型 | jpg,jpeg,png,pdf,doc,docx,xls,xlsx | 附件上传白名单 |
| ACCESS_TOKEN_TTL_MINUTES | Access Token 有效期 | 30 | 访问令牌有效期 |
| REFRESH_TOKEN_TTL_DAYS | Refresh Token 有效期 | 7 | 刷新令牌有效期 |

## 6. 模块到表映射

| 模块 | 主要表 |
| --- | --- |
| 登录认证 | users, user_roles, roles, role_menus, menus, login_logs |
| 首页工作台 | messages, operation_logs, users, roles, menus |
| 用户管理 | users, departments, posts, roles, user_roles |
| 角色管理 | roles, users, user_roles, role_menus |
| 菜单权限 | menus, roles, role_menus |
| 部门管理 | departments, users |
| 岗位管理 | posts, users |
| 数据字典 | dict_types, dict_items |
| 文件附件 | attachments, system_configs |
| 消息中心 | messages |
| 日志审计 | login_logs, operation_logs, exception_logs |
| 系统配置 | system_configs, operation_logs |
| 个人信息 | users, departments, posts, roles, user_roles |

## 7. 实现约束

- 删除业务数据默认使用逻辑删除，日志表只追加不修改。
- 密码字段只保存加密后的 `password_hash`，不得保存明文密码。
- 登录、操作和异常日志不得保存明文密码、Access Token、Refresh Token。
- 文件访问必须通过登录态鉴权，附件表只保存元数据和可控访问地址。
- 第一阶段权限控制到菜单级别，按钮级和接口级权限仅保留扩展字段或字典项。
- 第一阶段系统配置从数据库读取，不要求复杂热更新；运行态敏感配置可在下次读取或服务重启后生效。
