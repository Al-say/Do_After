# Do After - 局域网访问配置指南

## 🌐 局域网访问配置

### 📋 当前配置信息

- **服务器端口**: 8080
- **本机IP地址**: 
  - 192.168.1.14
  - 192.168.1.25
- **服务器监听**: 0.0.0.0 (所有网络接口)

### 🔗 访问地址

#### 本地访问
```
http://localhost:8080
http://127.0.0.1:8080
```

#### 局域网访问
```
http://192.168.1.14:8080
http://192.168.1.25:8080
```

## 🛠️ API端点

### 基础信息
- **根路径**: `http://[IP地址]:8080`
- **认证端点**: `/api/auth`
- **Todo端点**: `/api/todos`

### 完整API地址示例

#### 认证相关
```bash
# 用户注册
POST http://192.168.1.14:8080/api/auth/register

# 用户登录
POST http://192.168.1.14:8080/api/auth/login

# 获取用户信息
GET http://192.168.1.14:8080/api/auth/me
```

#### Todo管理
```bash
# 获取待办列表
GET http://192.168.1.14:8080/api/todos

# 创建待办事项
POST http://192.168.1.14:8080/api/todos

# 获取统计信息
GET http://192.168.1.14:8080/api/todos/stats/summary
```

## 📱 移动端访问测试

### Android/iOS 浏览器测试
```bash
# 在移动设备浏览器中访问
http://192.168.1.14:8080
```

### 移动端应用集成
```javascript
// React Native 或其他移动端框架
const API_BASE_URL = 'http://192.168.1.14:8080';

// 登录示例
const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};
```

## 🔐 CORS 安全配置

### 支持的请求来源
- ✅ localhost (所有端口)
- ✅ 127.0.0.1 (所有端口)
- ✅ 192.168.x.x (局域网)
- ✅ 10.x.x.x (局域网)
- ✅ 172.16-31.x.x (局域网)

### 支持的请求方法
- GET, POST, PUT, DELETE, PATCH, OPTIONS

### 支持的请求头
- Content-Type
- Authorization
- X-Requested-With

## 🖥️ 客户端测试命令

### PowerShell 测试 (Windows)
```powershell
# 测试服务器连接
Invoke-RestMethod -Uri "http://192.168.1.14:8080" -Method GET

# 用户注册
$body = @{
    username = "mobile_user"
    email = "mobile@example.com"
    password = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://192.168.1.14:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### curl 测试 (跨平台)
```bash
# 测试服务器连接
curl http://192.168.1.14:8080

# 用户注册
curl -X POST http://192.168.1.14:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "mobile_user",
    "email": "mobile@example.com",
    "password": "123456"
  }'
```

### JavaScript 前端集成
```javascript
// 前端应用配置
const API_CONFIG = {
  // 开发环境
  development: 'http://192.168.1.14:8080',
  // 生产环境
  production: 'https://your-domain.com'
};

const API_BASE_URL = API_CONFIG[process.env.NODE_ENV || 'development'];

// 带认证的请求示例
const authenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};
```

## 🔧 网络配置要求

### 防火墙设置
确保以下端口开放：
- **8080** (HTTP API)
- **5432** (PostgreSQL - 仅需要本机访问)

### Windows 防火墙配置
```cmd
# 添加入站规则（以管理员身份运行）
netsh advfirewall firewall add rule name="Do After API" dir=in action=allow protocol=TCP localport=8080
```

### 路由器设置（可选）
如需外网访问，可在路由器中设置端口转发：
- 外部端口：8080
- 内部IP：192.168.1.14
- 内部端口：8080

## 📊 网络诊断

### 检查端口是否开放
```cmd
# Windows
netstat -an | findstr :8080

# 检查防火墙状态
netsh advfirewall show allprofiles state
```

### 测试局域网连接
```cmd
# 从其他设备ping测试
ping 192.168.1.14

# 测试端口连通性（需要telnet客户端）
telnet 192.168.1.14 8080
```

## 🎯 使用场景

### 1. 移动端开发测试
- 在手机/平板上测试API
- 不需要部署就能测试移动应用

### 2. 团队协作开发
- 团队成员在同一局域网内共享API
- 前端开发者可以直接调用API

### 3. 家庭网络使用
- 家庭内多设备共享Todo系统
- 智能家居集成

### 4. 办公网络部署
- 办公室内部系统
- 局域网内的生产力工具

## ⚠️ 安全提醒

1. **仅限局域网使用**: 当前配置仅适用于可信的局域网环境
2. **生产环境**: 生产部署需要HTTPS和更严格的安全配置
3. **数据备份**: 定期备份PostgreSQL数据库
4. **访问控制**: 在企业环境中考虑添加IP白名单

## 🚀 快速启动检查清单

- [ ] 服务器在8080端口运行
- [ ] 本机IP地址确认：192.168.1.14 或 192.168.1.25
- [ ] 防火墙允许8080端口
- [ ] CORS配置支持局域网访问
- [ ] 在其他设备上能ping通本机IP
- [ ] API测试成功

---

**配置完成时间**: 2025-08-25  
**支持的网络**: 局域网 (192.168.x.x)  
**下一步**: 开发移动端或Web前端应用 📱
