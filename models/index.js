const { sequelize } = require('../config/database');
const Todo = require('./Todo');
const User = require('./User');

// 建立模型关联
User.hasMany(Todo, {
  foreignKey: 'userId',
  as: 'todos'
});

Todo.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// 同步所有模型
const syncDatabase = async () => {
  try {
    // 开发环境：强制重新创建表（会删除现有数据）
    // 生产环境：只创建不存在的表
    const force = process.env.NODE_ENV === 'development' && process.env.DB_FORCE_SYNC === 'true';
    
    await sequelize.sync({ force });
    
    if (force) {
      console.log('🔄 数据库表已重新创建');
      // 插入示例数据
      await insertSampleData();
    } else {
      console.log('✅ 数据库同步完成');
    }
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
    throw error;
  }
};

// 插入示例数据
const insertSampleData = async () => {
  try {
    // 先创建用户
    const sampleUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: '123456'
    });

    const sampleTodos = [
      {
        title: '学习PostgreSQL',
        description: '掌握PostgreSQL数据库的基本操作',
        priority: 'high',
        completed: false,
        userId: sampleUser.id
      },
      {
        title: '完成API开发',
        description: '实现完整的RESTful API',
        priority: 'medium',
        completed: true,
        userId: sampleUser.id
      },
      {
        title: '编写单元测试',
        description: '为API编写全面的单元测试',
        priority: 'medium',
        completed: false,
        userId: sampleUser.id
      }
    ];

    await Todo.bulkCreate(sampleTodos);
    console.log('✅ 示例数据插入成功');
  } catch (error) {
    console.error('❌ 示例数据插入失败:', error);
  }
};

module.exports = {
  syncDatabase,
  Todo,
  User
};
