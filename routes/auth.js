const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models/index');

const router = express.Router();

// JWT密钥（生产环境应使用环境变量）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码都是必填字段'
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password
    });

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: '用户注册成功',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('用户注册失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '注册失败，请稍后重试'
    });
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码都是必填字段'
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('用户登录失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '登录失败，请稍后重试'
    });
  }
});

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '请提供访问令牌'
      });
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(401).json({
      success: false,
      message: '无效的访问令牌'
    });
  }
});

/**
 * 修改密码
 * PUT /api/auth/change-password
 */
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { currentPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '请提供访问令牌'
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '当前密码和新密码都是必填字段'
      });
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    }

    // 验证当前密码
    const isCurrentPasswordValid = await user.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '当前密码错误'
      });
    }

    // 更新密码
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '修改密码失败，请稍后重试'
    });
  }
});

module.exports = router;
