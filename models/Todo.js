const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '标题不能为空'
      },
      len: {
        args: [1, 255],
        msg: '标题长度必须在1-255个字符之间'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  estimatedHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  actualHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  }
}, {
  tableName: 'todos',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['completed']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['due_date']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['user_id', 'completed']
    }
  ]
});

module.exports = Todo;
