# 智能鑫AI系统API设计文档

## 1. API概述

智能鑫AI系统API采用RESTful设计风格，使用JSON格式进行数据交换，支持HTTPS协议。所有API端点均以`/api/v1`为前缀，确保版本控制和向后兼容性。

## 2. 认证与授权

### 2.1 认证方式

系统采用JWT（JSON Web Token）进行认证，客户端在登录成功后获取Token，后续请求需在`Authorization` header中携带Token。

### 2.2 授权机制

基于角色的访问控制（RBAC），支持以下角色：
- `user`：普通用户
- `admin`：管理员
- `super_admin`：超级管理员

## 3. API列表

### 3.1 用户管理

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/auth/register` | POST | 用户注册 | 否 | 无 | `{"username": "string", "email": "string", "password": "string", "phone": "string"}` | `{"user_id": 1, "username": "string", "email": "string", "token": "string"}` |
| `/api/v1/auth/login` | POST | 用户登录 | 否 | 无 | `{"username": "string", "password": "string"}` | `{"user_id": 1, "username": "string", "email": "string", "token": "string"}` |
| `/api/v1/auth/logout` | POST | 用户登出 | 是 | 无 | 无 | `{"success": true, "message": "Logout successful"}` |
| `/api/v1/users/me` | GET | 获取当前用户信息 | 是 | 无 | 无 | `{"user_id": 1, "username": "string", "email": "string", "phone": "string", "avatar": "string", "status": "active", "created_at": "2025-01-01T10:00:00Z"}` |
| `/api/v1/users/me` | PUT | 更新当前用户信息 | 是 | 无 | `{"username": "string", "email": "string", "phone": "string", "avatar": "string"}` | `{"user_id": 1, "username": "string", "email": "string", "phone": "string", "avatar": "string"}` |
| `/api/v1/users/me/password` | PUT | 修改密码 | 是 | 无 | `{"old_password": "string", "new_password": "string"}` | `{"success": true, "message": "Password updated successfully"}` |
| `/api/v1/users/:user_id` | GET | 获取指定用户信息 | 是 | 无 | 无 | `{"user_id": 1, "username": "string", "email": "string", "avatar": "string", "status": "active"}` |
| `/api/v1/users` | GET | 搜索用户 | 是 | 无 | `{"keyword": "string", "page": 1, "limit": 20}` | `{"total": 100, "page": 1, "limit": 20, "users": [{...}, {...}]}` |

### 3.2 股票信息

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/stocks` | GET | 获取股票列表 | 是 | 无 | `{"market_type": "A股", "industry": "银行", "page": 1, "limit": 20}` | `{"total": 100, "page": 1, "limit": 20, "stocks": [{...}, {...}]}` |
| `/api/v1/stocks/:stock_id` | GET | 获取股票详情 | 是 | 无 | 无 | `{"stock_id": 1, "stock_code": "000001", "stock_name": "平安银行", "market_type": "A股", "industry": "银行", "listing_date": "1991-04-03", "is_active": true}` |
| `/api/v1/stocks/search` | GET | 搜索股票 | 是 | 无 | `{"keyword": "平安", "page": 1, "limit": 20}` | `{"total": 10, "page": 1, "limit": 20, "stocks": [{...}, {...}]}` |
| `/api/v1/stocks/:stock_id/market-data` | GET | 获取股票行情数据 | 是 | 无 | `{"start_time": "2025-01-01T00:00:00Z", "end_time": "2025-12-31T23:59:59Z", "interval": "1d"}` | `{"stock_id": 1, "stock_code": "000001", "market_data": [{"price": 14.50, "change_percent": 2.11, "volume": 12500000, "timestamp": "2025-12-15T09:30:00Z"}, {...}]}` |
| `/api/v1/stocks/:stock_id/comments` | GET | 获取股票评论 | 是 | 无 | `{"page": 1, "limit": 20, "sort": "latest"}` | `{"total": 50, "page": 1, "limit": 20, "comments": [{...}, {...}]}` |
| `/api/v1/stocks/:stock_id/comments` | POST | 添加股票评论 | 是 | 无 | `{"content": "string", "parent_id": 1}` | `{"comment_id": 1, "stock_id": 1, "user_id": 1, "content": "string", "created_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/stocks/:stock_id/comments/:comment_id` | PUT | 修改股票评论 | 是 | 无 | `{"content": "string"}` | `{"comment_id": 1, "content": "string", "updated_at": "2025-12-15T10:05:00Z"}` |
| `/api/v1/stocks/:stock_id/comments/:comment_id` | DELETE | 删除股票评论 | 是 | 无 | 无 | `{"success": true, "message": "Comment deleted successfully"}` |
| `/api/v1/stocks/:stock_id/comments/:comment_id/like` | POST | 点赞/取消点赞股票评论 | 是 | 无 | 无 | `{"success": true, "likes_count": 10, "is_liked": true}` |

### 3.3 好友关系

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/friends` | GET | 获取好友列表 | 是 | 无 | `{"status": "accepted", "page": 1, "limit": 20}` | `{"total": 50, "page": 1, "limit": 20, "friends": [{"user_id": 2, "username": "lisi", "avatar": "user2", "status": "accepted", "created_at": "2025-02-01T10:00:00Z"}, {...}]}` |
| `/api/v1/friends/requests` | GET | 获取好友请求 | 是 | 无 | `{"status": "pending", "page": 1, "limit": 20}` | `{"total": 5, "page": 1, "limit": 20, "requests": [{"user_id": 3, "username": "wangwu", "avatar": "user3", "status": "pending", "created_at": "2025-02-02T11:00:00Z"}, {...}]}` |
| `/api/v1/friends/requests` | POST | 发送好友请求 | 是 | 无 | `{"friend_id": 2}` | `{"success": true, "message": "Friend request sent successfully"}` |
| `/api/v1/friends/requests/:request_id` | PUT | 处理好友请求 | 是 | 无 | `{"action": "accept"}` | `{"success": true, "message": "Friend request accepted"}` |
| `/api/v1/friends/requests/:request_id` | DELETE | 拒绝好友请求 | 是 | 无 | 无 | `{"success": true, "message": "Friend request rejected"}` |
| `/api/v1/friends/:friend_id` | DELETE | 删除好友 | 是 | 无 | 无 | `{"success": true, "message": "Friend removed successfully"}` |
| `/api/v1/friends/:friend_id/block` | POST | 拉黑/取消拉黑好友 | 是 | 无 | 无 | `{"success": true, "is_blocked": true}` |

### 3.4 聊天消息

#### 3.4.1 好友聊天

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/messages/friends/:friend_id` | GET | 获取与指定好友的聊天记录 | 是 | 无 | `{"page": 1, "limit": 50, "direction": "desc"}` | `{"total": 100, "page": 1, "limit": 50, "messages": [{...}, {...}]}` |
| `/api/v1/messages/friends/:friend_id` | POST | 发送好友消息 | 是 | 无 | `{"content": "string", "message_type": "text", "stock_reference": 1}` | `{"message_id": 1, "sender_id": 1, "receiver_id": 2, "content": "string", "message_type": "text", "sent_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/messages/friends/:friend_id/read` | PUT | 标记好友消息为已读 | 是 | 无 | 无 | `{"success": true, "message": "Messages marked as read"}` |
| `/api/v1/messages/friends/unread` | GET | 获取未读好友消息数量 | 是 | 无 | 无 | `{"unread_count": 5}` |

#### 3.4.2 群组聊天

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/messages/groups/:group_id` | GET | 获取群组聊天记录 | 是 | 无 | `{"page": 1, "limit": 50, "direction": "desc"}` | `{"total": 1000, "page": 1, "limit": 50, "messages": [{...}, {...}]}` |
| `/api/v1/messages/groups/:group_id` | POST | 发送群组消息 | 是 | 无 | `{"content": "string", "message_type": "text", "stock_reference": 1}` | `{"message_id": 1, "group_id": 1, "sender_id": 1, "content": "string", "message_type": "text", "sent_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/messages/groups/:group_id/read` | PUT | 标记群组消息为已读 | 是 | 无 | 无 | `{"success": true, "message": "Messages marked as read"}` |

### 3.5 群组管理

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/groups` | GET | 获取群组列表 | 是 | 无 | `{"page": 1, "limit": 20}` | `{"total": 10, "page": 1, "limit": 20, "groups": [{...}, {...}]}` |
| `/api/v1/groups` | POST | 创建群组 | 是 | 无 | `{"group_name": "string", "group_type": "private", "description": "string", "avatar": "string"}` | `{"group_id": 1, "group_name": "string", "group_type": "private", "creator_id": 1, "created_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/groups/:group_id` | GET | 获取群组详情 | 是 | 无 | 无 | `{"group_id": 1, "group_name": "string", "group_type": "private", "creator_id": 1, "description": "string", "avatar": "string", "status": "active", "created_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/groups/:group_id` | PUT | 修改群组信息 | 是 | 管理员 | `{"group_name": "string", "description": "string", "avatar": "string"}` | `{"group_id": 1, "group_name": "string", "description": "string", "avatar": "string"}` |
| `/api/v1/groups/:group_id` | DELETE | 解散群组 | 是 | 群主 | 无 | `{"success": true, "message": "Group disbanded successfully"}` |
| `/api/v1/groups/:group_id/members` | GET | 获取群成员列表 | 是 | 无 | `{"page": 1, "limit": 20}` | `{"total": 50, "page": 1, "limit": 20, "members": [{"user_id": 1, "username": "zhangsan", "role": "owner", "status": "active", "joined_at": "2025-12-15T10:00:00Z"}, {...}]}` |
| `/api/v1/groups/:group_id/members` | POST | 添加群成员 | 是 | 管理员 | `{"user_id": 2, "role": "member"}` | `{"success": true, "message": "Member added successfully"}` |
| `/api/v1/groups/:group_id/members/:user_id` | PUT | 修改群成员角色 | 是 | 群主 | `{"role": "admin"}` | `{"success": true, "message": "Member role updated successfully"}` |
| `/api/v1/groups/:group_id/members/:user_id` | DELETE | 移除群成员 | 是 | 管理员 | 无 | `{"success": true, "message": "Member removed successfully"}` |
| `/api/v1/groups/:group_id/join` | POST | 加入群组 | 是 | 无 | 无 | `{"success": true, "message": "Joined group successfully"}` |
| `/api/v1/groups/:group_id/leave` | POST | 退出群组 | 是 | 无 | 无 | `{"success": true, "message": "Left group successfully"}` |
| `/api/v1/groups/:group_id/invite` | POST | 邀请用户加入群组 | 是 | 管理员 | `{"user_id": 2}` | `{"success": true, "message": "Invitation sent successfully"}` |

### 3.6 AI推荐

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/ai/recommendations` | GET | 获取AI推荐股票 | 是 | 无 | `{"page": 1, "limit": 10}` | `{"total": 50, "page": 1, "limit": 10, "recommendations": [{...}, {...}]}` |
| `/api/v1/ai/recommendations/:recommendation_id/feedback` | POST | 提交AI推荐反馈 | 是 | 无 | `{"feedback": "positive"}` | `{"success": true, "message": "Feedback submitted successfully"}` |
| `/api/v1/ai/recommendations/generate` | POST | 请求AI生成新的推荐 | 是 | 无 | `{"count": 5}` | `{"success": true, "recommendations": [{...}, {...}]}` |

### 3.7 自选股

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/favorites` | GET | 获取自选股列表 | 是 | 无 | `{"page": 1, "limit": 50}` | `{"total": 20, "page": 1, "limit": 50, "favorites": [{...}, {...}]}` |
| `/api/v1/favorites` | POST | 添加自选股 | 是 | 无 | `{"stock_id": 1, "notes": "长期持有", "alert_price": 15.00}` | `{"favorite_id": 1, "user_id": 1, "stock_id": 1, "added_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/favorites/:favorite_id` | PUT | 修改自选股信息 | 是 | 无 | `{"notes": "看好未来发展", "alert_price": 16.00}` | `{"favorite_id": 1, "notes": "看好未来发展", "alert_price": 16.00, "updated_at": "2025-12-15T10:05:00Z"}` |
| `/api/v1/favorites/:favorite_id` | DELETE | 删除自选股 | 是 | 无 | 无 | `{"success": true, "message": "Favorite removed successfully"}` |
| `/api/v1/favorites/:stock_id/check` | GET | 检查股票是否在自选股中 | 是 | 无 | 无 | `{"is_favorite": true}` |

### 3.8 市场行情

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/market-data` | GET | 获取市场行情概览 | 是 | 无 | `{"market_type": "A股"}` | `{"market_summary": {...}, "hot_stocks": [{...}, {...}]}` |
| `/api/v1/market-data/stocks/:stock_id` | GET | 获取股票实时行情 | 是 | 无 | 无 | `{"data_id": 1, "stock_id": 1, "price": 14.50, "change_percent": 2.11, "change_amount": 0.30, "volume": 12500000, "timestamp": "2025-12-15T09:30:00Z"}` |
| `/api/v1/market-data/stocks/:stock_id/history` | GET | 获取股票历史行情 | 是 | 无 | `{"start_date": "2025-01-01", "end_date": "2025-12-31", "interval": "1d"}` | `{"stock_id": 1, "stock_code": "000001", "history_data": [{...}, {...}]}` |
| `/api/v1/market-data/hot` | GET | 获取热门股票 | 是 | 无 | `{"limit": 20, "sort_by": "volume"}` | `{"hot_stocks": [{...}, {...}]}` |
| `/api/v1/market-data/sectors` | GET | 获取行业板块行情 | 是 | 无 | 无 | `{"sectors": [{"industry": "银行", "avg_change_percent": 1.50, "stocks": [{...}, {...}]}, {...}]}` |

### 3.9 用户兴趣

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/interests` | GET | 获取用户兴趣标签 | 是 | 无 | 无 | `{"interests": [{...}, {...}]}` |
| `/api/v1/interests` | POST | 添加用户兴趣标签 | 是 | 无 | `{"interest_type": "industry", "interest_value": "银行", "weight": 80}` | `{"interest_id": 1, "user_id": 1, "interest_type": "industry", "interest_value": "银行", "weight": 80}` |
| `/api/v1/interests/:interest_id` | PUT | 修改用户兴趣标签 | 是 | 无 | `{"weight": 90}` | `{"interest_id": 1, "weight": 90, "updated_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/interests/:interest_id` | DELETE | 删除用户兴趣标签 | 是 | 无 | 无 | `{"success": true, "message": "Interest deleted successfully"}` |

### 3.10 系统通知

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/notifications` | GET | 获取系统通知 | 是 | 无 | `{"is_read": false, "page": 1, "limit": 20}` | `{"total": 50, "page": 1, "limit": 20, "notifications": [{...}, {...}]}` |
| `/api/v1/notifications/:notification_id` | GET | 获取通知详情 | 是 | 无 | 无 | `{"notification_id": 1, "user_id": 1, "notification_type": "system", "title": "系统更新", "content": "...", "is_read": false, "created_at": "2025-12-15T10:00:00Z"}` |
| `/api/v1/notifications/:notification_id/read` | PUT | 标记通知为已读 | 是 | 无 | 无 | `{"success": true, "message": "Notification marked as read"}` |
| `/api/v1/notifications/read-all` | PUT | 标记所有通知为已读 | 是 | 无 | 无 | `{"success": true, "message": "All notifications marked as read"}` |
| `/api/v1/notifications/unread-count` | GET | 获取未读通知数量 | 是 | 无 | 无 | `{"unread_count": 5}` |

### 3.11 管理员操作

| API路径 | HTTP方法 | 功能描述 | 认证 | 授权 | 请求体 | 响应体 |
|---------|----------|----------|------|------|--------|--------|
| `/api/v1/admin/users` | GET | 获取用户列表（管理员） | 是 | admin+ | `{"status": "active", "page": 1, "limit": 20}` | `{"total": 1000, "page": 1, "limit": 20, "users": [{...}, {...}]}` |
| `/api/v1/admin/users/:user_id` | PUT | 修改用户状态（管理员） | 是 | admin+ | `{"status": "banned", "reason": "违规操作"}` | `{"success": true, "message": "User status updated successfully"}` |
| `/api/v1/admin/stocks` | GET | 获取股票列表（管理员） | 是 | admin+ | `{"is_active": true, "page": 1, "limit": 20}` | `{"total": 1000, "page": 1, "limit": 20, "stocks": [{...}, {...}]}` |
| `/api/v1/admin/stocks` | POST | 添加股票（管理员） | 是 | admin+ | `{"stock_code": "000001", "stock_name": "平安银行", "market_type": "A股", "industry": "银行"}` | `{"success": true, "stock_id": 1}` |
| `/api/v1/admin/stocks/:stock_id` | PUT | 修改股票信息（管理员） | 是 | admin+ | `{"stock_name": "平安银行", "industry": "银行"}` | `{"success": true, "message": "Stock updated successfully"}` |
| `/api/v1/admin/stocks/:stock_id` | DELETE | 删除股票（管理员） | 是 | admin+ | 无 | `{"success": true, "message": "Stock deleted successfully"}` |
| `/api/v1/admin/logs` | GET | 查看管理员操作日志 | 是 | admin+ | `{"admin_id": 1, "action_type": "user_ban", "start_time": "2025-12-01T00:00:00Z", "end_time": "2025-12-31T23:59:59Z", "page": 1, "limit": 20}` | `{"total": 100, "page": 1, "limit": 20, "logs": [{...}, {...}]}` |
| `/api/v1/admin/audit-logs` | GET | 查看系统审计日志 | 是 | super_admin | `{"action_type": "login", "start_time": "2025-12-01T00:00:00Z", "end_time": "2025-12-31T23:59:59Z", "page": 1, "limit": 20}` | `{"total": 1000, "page": 1, "limit": 20, "logs": [{...}, {...}]}` |

## 4. WebSocket API

系统使用WebSocket提供实时通信功能，支持以下事件：

| 事件类型 | 功能描述 | 数据格式 |
|---------|----------|----------|
| `message:friend` | 接收好友消息 | `{"message_id": 1, "sender_id": 2, "content": "string", "message_type": "text", "sent_at": "2025-12-15T10:00:00Z"}` |
| `message:group` | 接收群组消息 | `{"message_id": 1, "group_id": 1, "sender_id": 2, "content": "string", "message_type": "text", "sent_at": "2025-12-15T10:00:00Z"}` |
| `friend:request` | 收到好友请求 | `{"request_id": 1, "user_id": 2, "username": "lisi", "avatar": "user2", "created_at": "2025-12-15T10:00:00Z"}` |
| `friend:accepted` | 好友请求被接受 | `{"user_id": 2, "username": "lisi", "avatar": "user2"}` |
| `group:invite` | 收到群组邀请 | `{"invite_id": 1, "group_id": 1, "group_name": "股票交流群", "inviter_id": 2, "inviter_name": "lisi"}` |
| `group:join` | 用户加入群组 | `{"group_id": 1, "user_id": 2, "username": "lisi", "role": "member"}` |
| `group:leave` | 用户离开群组 | `{"group_id": 1, "user_id": 2, "username": "lisi"}` |
| `market:update` | 股票行情更新 | `{"stock_id": 1, "stock_code": "000001", "price": 14.50, "change_percent": 2.11, "change_amount": 0.30, "volume": 12500000, "timestamp": "2025-12-15T09:30:00Z"}` |
| `notification:new` | 新系统通知 | `{"notification_id": 1, "title": "系统更新", "content": "...", "is_read": false, "created_at": "2025-12-15T10:00:00Z"}` |

## 5. API响应格式

### 5.1 成功响应

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### 5.2 分页响应

```json
{
  "success": true,
  "data": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "items": [...]
  },
  "message": "Operation successful"
}
```

### 5.3 错误响应

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Bad request",
    "details": "Invalid parameter: username is required"
  }
}
```

## 6. 错误码

| 错误码 | 描述 |
|-------|------|
| 200 | 成功 |
| 400 | 错误请求 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 405 | 方法不允许 |
| 500 | 服务器内部错误 |
| 501 | 未实现 |
| 503 | 服务不可用 |

## 7. 速率限制

| API类型 | 速率限制 |
|---------|----------|
| 认证相关 | 10次/分钟 |
| 普通API | 100次/分钟 |
| 敏感操作 | 20次/分钟 |
| WebSocket | 500条/分钟 |

## 8. 安全性

1. **HTTPS**：所有API必须通过HTTPS访问
2. **JWT认证**：使用HS256算法签名，有效期24小时
3. **输入验证**：所有请求参数必须经过严格验证
4. **输出过滤**：敏感信息（如密码哈希）不得返回给客户端
5. **SQL注入防护**：使用参数化查询
6. **XSS防护**：对输出进行HTML转义
7. **CSRF防护**：使用CSRF令牌
8. **日志记录**：记录所有敏感操作

## 9. 性能优化

1. **缓存策略**：使用Redis缓存热点数据
2. **分页查询**：所有列表API必须支持分页
3. **索引优化**：合理设计数据库索引
4. **异步处理**：耗时操作使用异步处理
5. **批量操作**：支持批量API调用
6. **CDN加速**：静态资源使用CDN加速

## 10. 文档与测试

1. **API文档**：使用Swagger/OpenAPI自动生成文档
2. **单元测试**：覆盖率>80%
3. **集成测试**：覆盖主要业务流程
4. **负载测试**：确保系统能处理预期流量
5. **监控告警**：实时监控API性能和错误率

## 11. 版本管理

API版本控制采用URL前缀方式，如`/api/v1/`，便于向后兼容和升级。

## 12. 部署建议

1. **容器化部署**：使用Docker容器化部署
2. **集群部署**：高可用集群设计
3. **自动扩缩容**：根据流量自动调整实例数量
4. **灰度发布**：支持灰度发布新功能
5. **监控日志**：完善的监控和日志系统

---

# 智能鑫AI系统API清单

## 1. 用户管理API

- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/logout` - 用户登出
- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me` - 更新当前用户信息
- `PUT /api/v1/users/me/password` - 修改密码
- `GET /api/v1/users/:user_id` - 获取指定用户信息
- `GET /api/v1/users` - 搜索用户

## 2. 股票信息API

- `GET /api/v1/stocks` - 获取股票列表
- `GET /api/v1/stocks/:stock_id` - 获取股票详情
- `GET /api/v1/stocks/search` - 搜索股票
- `GET /api/v1/stocks/:stock_id/market-data` - 获取股票行情数据
- `GET /api/v1/stocks/:stock_id/comments` - 获取股票评论
- `POST /api/v1/stocks/:stock_id/comments` - 添加股票评论
- `PUT /api/v1/stocks/:stock_id/comments/:comment_id` - 修改股票评论
- `DELETE /api/v1/stocks/:stock_id/comments/:comment_id` - 删除股票评论
- `POST /api/v1/stocks/:stock_id/comments/:comment_id/like` - 点赞/取消点赞股票评论

## 3. 好友关系API

- `GET /api/v1/friends` - 获取好友列表
- `GET /api/v1/friends/requests` - 获取好友请求
- `POST /api/v1/friends/requests` - 发送好友请求
- `PUT /api/v1/friends/requests/:request_id` - 处理好友请求
- `DELETE /api/v1/friends/requests/:request_id` - 拒绝好友请求
- `DELETE /api/v1/friends/:friend_id` - 删除好友
- `POST /api/v1/friends/:friend_id/block` - 拉黑/取消拉黑好友

## 4. 聊天消息API

### 4.1 好友聊天

- `GET /api/v1/messages/friends/:friend_id` - 获取与指定好友的聊天记录
- `POST /api/v1/messages/friends/:friend_id` - 发送好友消息
- `PUT /api/v1/messages/friends/:friend_id/read` - 标记好友消息为已读
- `GET /api/v1/messages/friends/unread` - 获取未读好友消息数量

### 4.2 群组聊天

- `GET /api/v1/messages/groups/:group_id` - 获取群组聊天记录
- `POST /api/v1/messages/groups/:group_id` - 发送群组消息
- `PUT /api/v1/messages/groups/:group_id/read` - 标记群组消息为已读

## 5. 群组管理API

- `GET /api/v1/groups` - 获取群组列表
- `POST /api/v1/groups` - 创建群组
- `GET /api/v1/groups/:group_id` - 获取群组详情
- `PUT /api/v1/groups/:group_id` - 修改群组信息
- `DELETE /api/v1/groups/:group_id` - 解散群组
- `GET /api/v1/groups/:group_id/members` - 获取群成员列表
- `POST /api/v1/groups/:group_id/members` - 添加群成员
- `PUT /api/v1/groups/:group_id/members/:user_id` - 修改群成员角色
- `DELETE /api/v1/groups/:group_id/members/:user_id` - 移除群成员
- `POST /api/v1/groups/:group_id/join` - 加入群组
- `POST /api/v1/groups/:group_id/leave` - 退出群组
- `POST /api/v1/groups/:group_id/invite` - 邀请用户加入群组

## 6. AI推荐API

- `GET /api/v1/ai/recommendations` - 获取AI推荐股票
- `POST /api/v1/ai/recommendations/:recommendation_id/feedback` - 提交AI推荐反馈
- `POST /api/v1/ai/recommendations/generate` - 请求AI生成新的推荐

## 7. 自选股API

- `GET /api/v1/favorites` - 获取自选股列表
- `POST /api/v1/favorites` - 添加自选股
- `PUT /api/v1/favorites/:favorite_id` - 修改自选股信息
- `DELETE /api/v1/favorites/:favorite_id` - 删除自选股
- `GET /api/v1/favorites/:stock_id/check` - 检查股票是否在自选股中

## 8. 市场行情API

- `GET /api/v1/market-data` - 获取市场行情概览
- `GET /api/v1/market-data/stocks/:stock_id` - 获取股票实时行情
- `GET /api/v1/market-data/stocks/:stock_id/history` - 获取股票历史行情
- `GET /api/v1/market-data/hot` - 获取热门股票
- `GET /api/v1/market-data/sectors` - 获取行业板块行情

## 9. 用户兴趣API

- `GET /api/v1/interests` - 获取用户兴趣标签
- `POST /api/v1/interests` - 添加用户兴趣标签
- `PUT /api/v1/interests/:interest_id` - 修改用户兴趣标签
- `DELETE /api/v1/interests/:interest_id` - 删除用户兴趣标签

## 10. 系统通知API

- `GET /api/v1/notifications` - 获取系统通知
- `GET /api/v1/notifications/:notification_id` - 获取通知详情
- `PUT /api/v1/notifications/:notification_id/read` - 标记通知为已读
- `PUT /api/v1/notifications/read-all` - 标记所有通知为已读
- `GET /api/v1/notifications/unread-count` - 获取未读通知数量

## 11. 管理员操作API

- `GET /api/v1/admin/users` - 获取用户列表（管理员）
- `PUT /api/v1/admin/users/:user_id` - 修改用户状态（管理员）
- `GET /api/v1/admin/stocks` - 获取股票列表（管理员）
- `POST /api/v1/admin/stocks` - 添加股票（管理员）
- `PUT /api/v1/admin/stocks/:stock_id` - 修改股票信息（管理员）
- `DELETE /api/v1/admin/stocks/:stock_id` - 删除股票（管理员）
- `GET /api/v1/admin/logs` - 查看管理员操作日志
- `GET /api/v1/admin/audit-logs` - 查看系统审计日志

## 12. WebSocket事件

- `message:friend` - 接收好友消息
- `message:group` - 接收群组消息
- `friend:request` - 收到好友请求
- `friend:accepted` - 好友请求被接受
- `group:invite` - 收到群组邀请
- `group:join` - 用户加入群组
- `group:leave` - 用户离开群组
- `market:update` - 股票行情更新
- `notification:new` - 新系统通知