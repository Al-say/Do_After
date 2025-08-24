# Do_After - 待办事项管理系统

本项目为"Do_After"，用于记录和管理待办事项或后续行动。

## 技术栈

### 后端
- **Node.js** - JavaScript运行环境
- **Express.js** - Web应用框架
- **CORS** - 跨域资源共享
- **dotenv** - 环境变量管理

## 项目结构

```
Do_After/
├── server.js          # 主服务器文件
├── routes/             # API路由
│   └── todos.js       # 待办事项路由
├── package.json       # 项目依赖配置
├── .env              # 环境变量配置
├── .gitignore        # Git忽略文件
├── API.md            # API文档
└── README.md         # 项目说明
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制并编辑 `.env` 文件：
```bash
PORT=3000
NODE_ENV=development
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问API
打开浏览器访问 `http://localhost:3000` 查看API状态

## API文档

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
