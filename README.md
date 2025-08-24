# Do_After - 待办事项管理系统

🚀 一个功能完整的待办事项管理系统，支持用户认证、任务管理和数据持久化。

## ✨ 主要功能

- 👤 **用户系统**: 注册、登录、JWT认证
- 📝 **待办事项管理**: 创建、查看、更新、删除任务
- 🏷️ **任务分类**: 优先级设置、标签管理
- 📊 **数据统计**: 任务完成情况统计
- 🌐 **局域网支持**: 支持移动设备局域网访问
- 🔐 **安全保障**: 密码加密、JWT令牌验证

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript运行环境
- **Express.js** - Web应用框架
- **PostgreSQL** - 关系型数据库
- **Sequelize** - ORM框架
- **JWT** - 身份认证
- **bcryptjs** - 密码加密
- **CORS** - 跨域资源共享

## 📁 项目结构

```
Do_After/
├── server.js              # 主服务器文件
├── config/
│   └── database.js        # 数据库配置
├── models/                # 数据模型
│   ├── index.js          # 模型索引
│   ├── User.js           # 用户模型
│   └── Todo.js           # 待办事项模型
├── routes/                # API路由
│   ├── auth.js           # 认证路由
│   └── todos.js          # 待办事项路由
├── middleware/
│   └── auth.js           # 认证中间件
├── package.json          # 项目依赖配置
├── .env                  # 环境变量配置
├── API.md               # API详细文档
├── AUTH_API.md          # 认证API文档
└── README.md            # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js 14.0+
- PostgreSQL 12.0+
- npm 或 yarn

### 1. 克隆项目
```bash
git clone https://github.com/Al-say/Do_After.git
cd Do_After
```

### 2. 安装依赖
```bash
npm install
```

### 3. 数据库配置
创建PostgreSQL数据库并配置环境变量：

```bash
# 复制环境变量模板
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 服务器配置
PORT=8080
NODE_ENV=development

# PostgreSQL数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=do_after
DB_USER=postgres
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 开发环境选项
DB_FORCE_SYNC=false
```

### 4. 数据库初始化
```bash
npm run migrate
```

### 5. 启动开发服务器
```bash
npm run dev
```

### 6. 访问应用
- 🌐 本地访问: `http://localhost:8080`
- 🏠 局域网访问: `http://[本机IP]:8080`
- 📖 API文档: 查看 `API.md` 和 `AUTH_API.md` 文件

## 📱 移动设备访问

项目支持局域网访问，可在移动设备上使用：

1. 确保设备连接同一WiFi网络
2. 获取电脑IP地址: `ipconfig` (Windows) 或 `ifconfig` (Mac/Linux)
3. 在移动设备浏览器访问: `http://[电脑IP]:8080`

## 📚 API文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 待办事项
- `GET /api/todos` - 获取待办事项列表
- `POST /api/todos` - 创建待办事项
- `GET /api/todos/:id` - 获取单个待办事项
- `PUT /api/todos/:id` - 更新待办事项
- `DELETE /api/todos/:id` - 删除待办事项
- `GET /api/todos/stats/summary` - 获取统计信息

详细API文档请查看：
- 📋 [API.md](./API.md) - 完整API文档
- 🔐 [AUTH_API.md](./AUTH_API.md) - 认证API文档

## 🧪 测试

```bash
# 运行API测试
node test-api.js

# 测试数据库连接
node test-postgresql.js
```

## 📦 NPM Scripts

```bash
npm start        # 生产环境启动
npm run dev      # 开发环境启动(热重载)
npm run migrate  # 数据库迁移
npm run db:reset # 重置数据库(开发环境)
```

## 🔧 开发说明

### 数据库结构
- **users**: 用户信息表
- **todos**: 待办事项表

### 安全特性
- JWT身份验证
- 密码bcrypt加密
- CORS跨域保护
- SQL注入防护

## 🤝 贡献

欢迎提交Pull Request和Issue！

## 📄 License

ISC License

---

⭐ 如果这个项目对您有帮助，请给个星星！

详细的API文档请查看 [API.md](./API.md) 文件。

### 主要端点
- `GET /` - 服务器状态
- `GET /api/todos` - 获取所有待办事项
- `POST /api/todos` - 创建新待办事项
- `PUT /api/todos/:id` - 更新待办事项
- `DELETE /api/todos/:id` - 删除待办事项

## 开发命令

- `npm start` - 启动生产服务器
- `npm run dev` - 启动开发服务器（自动重启）

## 使用方法
1. 克隆或下载本仓库
2. 安装Node.js依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 使用API进行待办事项管理

## 贡献
欢迎提交 issue 或 pull request 改进本项目。

## 许可
ISC Licenseo_After”，用于记录和管理待办事项或后续行动。

## 文件结构
请根据实际项目结构补充。

## 使用方法
1. 克隆或下载本仓库。
2. 按需编辑和使用相关文件。

## 贡献
欢迎提交 issue 或 pull request 改进本项目。

## 许可
请根据实际情况补充许可信息。
