# Do_After API 文档 (PostgreSQL版)

## 概述
Do_After 是一个基于PostgreSQL的待办事项管理API，提供完整的CRUD操作、分页、搜索、过滤和批量操作功能。

## 技术栈
- **Node.js** - JavaScript运行环境
- **Express.js** - Web应用框架
- **PostgreSQL** - 关系型数据库
- **Sequelize** - JavaScript ORM
- **CORS** - 跨域资源共享

## 基础信息
- **基础URL**: `http://localhost:3000`
- **内容类型**: `application/json`
- **数据库**: PostgreSQL with Sequelize ORM

## 数据模型

### Todo模型
```javascript
{
  id: Integer (主键, 自增)
  title: String (必填, 1-255字符)
  description: Text (可选)
  completed: Boolean (默认: false)
  priority: Enum ['low', 'medium', 'high'] (默认: 'medium')
  dueDate: DateTime (可选)
  createdAt: DateTime (自动生成)
  updatedAt: DateTime (自动更新)
}
```

## API端点

### 1. 服务器状态
```
GET /
```
返回服务器状态和可用端点信息。

**响应示例:**
```json
{
  "message": "Do_After API 服务器运行中",
  "version": "1.0.0",
  "database": "PostgreSQL",
  "endpoints": {
    "todos": "/api/todos",
    "stats": "/api/todos/stats/summary",
    "batch": "/api/todos/batch"
  }
}
```

### 2. 获取所有待办事项
```
GET /api/todos
```

**查询参数:**
- `page` (integer): 页码 (默认: 1)
- `limit` (integer): 每页数量 (默认: 10)
- `completed` (boolean): 筛选完成状态
- `priority` (string): 筛选优先级 ['low', 'medium', 'high']
- `search` (string): 搜索标题和描述

**示例请求:**
```
GET /api/todos?page=1&limit=5&priority=high&search=学习
```

**响应示例:**
```json
{
  "todos": [
    {
      "id": 1,
      "title": "学习PostgreSQL",
      "description": "掌握PostgreSQL数据库操作",
      "completed": false,
      "priority": "high",
      "dueDate": "2025-08-30T00:00:00.000Z",
      "createdAt": "2025-08-25T10:00:00.000Z",
      "updatedAt": "2025-08-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 5,
    "totalPages": 3
  }
}
```

### 3. 获取单个待办事项
```
GET /api/todos/:id
```

**参数:**
- `id` (integer): 待办事项ID

### 4. 创建新待办事项
```
POST /api/todos
```

**请求体:**
```json
{
  "title": "新的待办事项",
  "description": "描述信息（可选）",
  "priority": "high",
  "dueDate": "2025-08-30"
}
```

**响应示例:**
```json
{
  "message": "待办事项创建成功",
  "todo": {
    "id": 4,
    "title": "新的待办事项",
    "description": "描述信息",
    "completed": false,
    "priority": "high",
    "dueDate": "2025-08-30T00:00:00.000Z",
    "createdAt": "2025-08-25T10:00:00.000Z",
    "updatedAt": "2025-08-25T10:00:00.000Z"
  }
}
```

### 5. 更新待办事项
```
PUT /api/todos/:id
```

**请求体:**
```json
{
  "title": "更新的标题",
  "description": "更新的描述",
  "completed": true,
  "priority": "low",
  "dueDate": "2025-09-01"
}
```

### 6. 删除待办事项
```
DELETE /api/todos/:id
```

### 7. 批量操作
```
PATCH /api/todos/batch
```

**请求体:**
```json
{
  "action": "complete",
  "ids": [1, 2, 3]
}
```

**支持的操作:**
- `complete`: 批量标记为完成
- `incomplete`: 批量标记为未完成
- `delete`: 批量删除

### 8. 统计信息
```
GET /api/todos/stats/summary
```

**响应示例:**
```json
{
  "total": 15,
  "completed": 8,
  "pending": 7,
  "completionRate": 53,
  "priorityStats": {
    "high": 3,
    "medium": 8,
    "low": 4
  }
}
```

## 错误响应

### 400 - 数据验证失败
```json
{
  "error": "数据验证失败",
  "details": ["标题不能为空"]
}
```

### 404 - 未找到
```json
{
  "error": "待办事项未找到"
}
```

### 500 - 服务器错误
```json
{
  "error": "服务器内部错误"
}
```

## 数据库设置

### 1. 安装PostgreSQL
确保PostgreSQL服务正在运行。

### 2. 配置环境变量
编辑 `.env` 文件：
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=do_after
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. 数据库命令
```bash
# 运行数据库迁移
npm run migrate

# 重置数据库（删除所有数据）
npm run db:reset
```

## 开发命令

### 启动服务器
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

### 数据库操作
```bash
# 同步数据库结构
npm run migrate

# 重置数据库并插入示例数据
npm run db:reset
```

## 测试示例

### 使用 Node.js 测试
```bash
node test-postgresql.js
```

### 使用 curl 测试

1. **创建待办事项:**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"学习PostgreSQL","priority":"high","dueDate":"2025-08-30"}'
```

2. **搜索待办事项:**
```bash
curl "http://localhost:3000/api/todos?search=PostgreSQL&priority=high"
```

3. **批量完成:**
```bash
curl -X PATCH http://localhost:3000/api/todos/batch \
  -H "Content-Type: application/json" \
  -d '{"action":"complete","ids":[1,2,3]}'
```

4. **获取统计信息:**
```bash
curl http://localhost:3000/api/todos/stats/summary
```

## 新增功能

### 🆕 PostgreSQL版本新功能
- ✅ **数据持久化** - 使用PostgreSQL存储
- ✅ **数据验证** - Sequelize模型验证
- ✅ **分页支持** - 支持页码和每页数量
- ✅ **搜索功能** - 模糊搜索标题和描述
- ✅ **过滤功能** - 按完成状态和优先级过滤
- ✅ **优先级管理** - 低/中/高三级优先级
- ✅ **截止日期** - 可设置任务截止时间
- ✅ **批量操作** - 批量完成/取消/删除
- ✅ **统计信息** - 完成率和优先级统计
- ✅ **错误处理** - 详细的错误信息和验证
- ✅ **请求日志** - 自动记录API请求

## 依赖包

### 生产依赖
- **express**: Web应用框架
- **cors**: 跨域资源共享
- **dotenv**: 环境变量加载
- **pg**: PostgreSQL客户端
- **sequelize**: JavaScript ORM

### 开发依赖
- **nodemon**: 开发时自动重启
