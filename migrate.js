const { syncDatabase } = require('./models');
const { sequelize } = require('./config/database');

const migrate = async () => {
  try {
    console.log('🔄 开始数据库迁移...');
    
    // 强制同步（重新创建表）
    await sequelize.sync({ force: true });
    console.log('✅ 数据库表已重新创建');
    
    // 插入示例数据
    await syncDatabase();
    
    console.log('🎉 数据库迁移完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error);
    process.exit(1);
  }
};

migrate();
