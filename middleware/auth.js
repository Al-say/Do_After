const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

// JWT密钥（生产环境应使用环境变量）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * JWT认证中间件
 * 验证用户访问令牌并将用户信息添加到req.user
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌缺失，请先登录'
      });
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 查找用户
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();

  } catch (error) {
    console.error('Token验证失败:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '访问令牌已过期，请重新登录'
      });
    }

    res.status(500).json({
      success: false,
      message: '认证服务异常'
    });
  }
};

/**
 * 可选的JWT认证中间件
 * 如果有token则验证，没有则继续（用于可选认证的场景）
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    if (!token) {
      return next();
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 查找用户
    const user = await User.findByPk(decoded.userId);
    if (user) {
      req.user = user;
    }

    next();

  } catch (error) {
    // 可选认证失败时不阻止请求，只记录错误
    console.warn('可选认证失败:', error.message);
    next();
  }
};

/**
 * 生成JWT令牌
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * 验证JWT令牌
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken,
  verifyToken,
  JWT_SECRET
};
