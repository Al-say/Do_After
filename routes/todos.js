const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Todo, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// 应用认证中间件到所有路由
router.use(authenticateToken);

// 获取所有待办事项
router.get('/', async (req, res) => {
  try {
    const { completed, priority, page = 1, limit = 10, search } = req.query;
    
    // 构建查询条件 - 只获取当前用户的数据
    const where = { userId: req.user.id };
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }
    if (priority) {
      where.priority = priority;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // 分页参数
    const offset = (page - 1) * limit;

    const { count, rows: todos } = await Todo.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      todos,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('获取待办事项失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取单个待办事项
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const todo = await Todo.findOne({
      where: { 
        id,
        userId: req.user.id // 确保只能访问自己的数据
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    
    if (!todo) {
      return res.status(404).json({ error: '待办事项未找到' });
    }
    
    res.json({ todo });
  } catch (error) {
    console.error('获取待办事项失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 创建新待办事项
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium', dueDate } = req.body;
    
    const newTodo = await Todo.create({
      title,
      description,
      priority,
      userId: req.user.id, // 关联到当前用户
      dueDate: dueDate ? new Date(dueDate) : null
    });
    
    res.status(201).json({ 
      message: '待办事项创建成功', 
      todo: newTodo 
    });
  } catch (error) {
    console.error('创建待办事项失败:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: '数据验证失败',
        details: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新待办事项
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, completed, priority, dueDate } = req.body;
    
    const todo = await Todo.findOne({
      where: { 
        id,
        userId: req.user.id // 确保只能更新自己的数据
      }
    });
    if (!todo) {
      return res.status(404).json({ error: '待办事项未找到' });
    }
    
    await todo.update({
      title: title !== undefined ? title : todo.title,
      description: description !== undefined ? description : todo.description,
      completed: completed !== undefined ? completed : todo.completed,
      priority: priority !== undefined ? priority : todo.priority,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : todo.dueDate
    });
    
    res.json({ 
      message: '待办事项更新成功', 
      todo 
    });
  } catch (error) {
    console.error('更新待办事项失败:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: '数据验证失败',
        details: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 删除待办事项
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const todo = await Todo.findOne({
      where: { 
        id,
        userId: req.user.id // 确保只能删除自己的数据
      }
    });
    
    if (!todo) {
      return res.status(404).json({ error: '待办事项未找到' });
    }
    
    await todo.destroy();
    res.json({ message: '待办事项删除成功' });
  } catch (error) {
    console.error('删除待办事项失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 批量操作
router.patch('/batch', async (req, res) => {
  try {
    const { action, ids } = req.body;
    
    if (!action || !Array.isArray(ids)) {
      return res.status(400).json({ error: '无效的批量操作参数' });
    }
    
    let result;
    switch (action) {
      case 'complete':
        result = await Todo.update(
          { completed: true },
          { 
            where: { 
              id: ids,
              userId: req.user.id // 确保只操作自己的数据
            } 
          }
        );
        break;
      case 'incomplete':
        result = await Todo.update(
          { completed: false },
          { 
            where: { 
              id: ids,
              userId: req.user.id // 确保只操作自己的数据
            } 
          }
        );
        break;
      case 'delete':
        result = await Todo.destroy({
          where: { 
            id: ids,
            userId: req.user.id // 确保只操作自己的数据
          }
        });
        break;
      default:
        return res.status(400).json({ error: '不支持的批量操作' });
    }
    
    res.json({ 
      message: `批量${action}操作成功`,
      affected: Array.isArray(result) ? result[0] : result
    });
  } catch (error) {
    console.error('批量操作失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 统计信息
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Todo.count({ where: { userId: req.user.id } });
    const completed = await Todo.count({ 
      where: { 
        completed: true,
        userId: req.user.id 
      } 
    });
    const pending = total - completed;
    
    const priorityStats = await Todo.findAll({
      attributes: [
        'priority',
        [Todo.sequelize.fn('COUNT', '*'), 'count']
      ],
      where: { userId: req.user.id },
      group: ['priority']
    });
    
    res.json({
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      priorityStats: priorityStats.reduce((acc, stat) => {
        acc[stat.priority] = parseInt(stat.dataValues.count);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;
