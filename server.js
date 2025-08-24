const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 导入数据库配置和模型
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// 导入路由
const todosRouter = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS配置 - 支持局域网访问
const corsOptions = {
  origin: function (origin, callback) {
    // 允许无origin的请求（移动端应用等）
    if (!origin) return callback(null, true);
    
    // 允许localhost和局域网IP访问
    const allowedPatterns = [
      /^http:\/\/localhost(:\d+)?$/,
      /^http:\/\/127\.0\.0\.1(:\d+)?$/,
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,  // 局域网 192.168.x.x
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/,   // 局域网 10.x.x.x
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+(:\d+)?$/ // 局域网 172.16-31.x.x
    ];
    
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    callback(null, isAllowed);
  },
  credentials: true, // 支持带凭证的请求
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'Do_After API 服务器运行中',
    version: '1.0.0',
    database: 'PostgreSQL',
    endpoints: {
      auth: '/api/auth',
      todos: '/api/todos',
      stats: '/api/todos/stats/summary',
      batch: '/api/todos/batch'
    }
  });
});

// 导入路由
const authRoutes = require('./routes/auth');

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRouter);

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '路由未找到' });
});

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 同步数据库
    await syncDatabase();
    
    // 启动服务器 - 监听所有网络接口以支持局域网访问
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`);
      console.log(`📊 数据库: PostgreSQL`);
      console.log(`🌐 本地访问: http://localhost:${PORT}`);
      console.log(`🏠 局域网访问: http://[本机IP]:${PORT}`);
      console.log(`📖 API文档: 查看 API.md 文件`);
      console.log(`\n💡 要获取本机IP地址，请运行: ipconfig`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();
