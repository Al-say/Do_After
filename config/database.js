const { Sequelize } = require('sequelize');
require('dotenv').config();

// 创建Sequelize实例
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'do_after',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    // 允许连接到不存在的数据库
    connectTimeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // 定义表名和字段名的默认行为
  define: {
    underscored: true, // 使用下划线命名
    freezeTableName: true, // 禁用表名复数化
    timestamps: true // 启用时间戳
  }
});

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};
