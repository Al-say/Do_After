# 用户认证API测试

## 1. 用户注册

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com", 
    "password": "123456"
  }'
```

**预期响应:**
```json
{
  "success": true,
  "message": "用户注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 2. 用户登录

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }'
```

**预期响应:**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 3. 获取当前用户信息

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. 修改密码

```bash
curl -X PUT http://localhost:8080/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentPassword": "123456",
    "newPassword": "newpassword123"
  }'
```

## 5. 使用Token访问Todo API

### 获取待办事项（需要认证）

```bash
curl -X GET http://localhost:8080/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 创建待办事项（需要认证）

```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "学习JWT认证",
    "description": "实现用户认证系统",
    "priority": "high"
  }'
```

## PowerShell测试命令

### 注册用户

```powershell
$body = @{
    username = "testuser"
    email = "testuser@example.com"
    password = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### 登录

```powershell
$loginBody = @{
    username = "testuser"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### 使用Token访问API

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

# 获取用户信息
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method GET -Headers $headers

# 获取待办事项
Invoke-RestMethod -Uri "http://localhost:8080/api/todos" -Method GET -Headers $headers
```

## 测试场景

### 1. 完整认证流程
1. 注册新用户
2. 使用用户名密码登录
3. 获取返回的JWT token
4. 使用token访问受保护的API

### 2. 错误处理测试
1. 使用已存在的用户名注册（应返回409错误）
2. 使用错误密码登录（应返回401错误）
3. 不提供token访问API（应返回401错误）
4. 使用无效token访问API（应返回401错误）

### 3. 数据隔离测试
1. 创建两个不同用户
2. 用户A创建待办事项
3. 用户B登录后应看不到用户A的待办事项

## 注意事项

1. **Token有效期**: JWT token默认7天有效期
2. **密码安全**: 密码使用bcrypt加密存储
3. **数据隔离**: 每个用户只能访问自己的待办事项
4. **错误处理**: 提供详细的错误信息和状态码
