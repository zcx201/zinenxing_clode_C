# 智能鑫AI系统数据库结构文档

## 1. 数据库概述

智能鑫AI系统使用PostgreSQL数据库，包含18个核心表，涵盖用户管理、股票信息、好友关系、聊天消息、群组、AI推荐等功能模块。

## 2. 表结构详情

### 2.1 迁移历史记录表 (migration_history)

**用途**：记录数据库迁移历史

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| id | SERIAL | PRIMARY KEY | - | 记录ID |
| version | VARCHAR(50) | UNIQUE NOT NULL | - | 迁移版本号 |
| name | VARCHAR(255) | NOT NULL | - | 迁移名称 |
| applied_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 应用时间 |
| description | TEXT | - | - | 迁移描述 |

**索引**：无

### 2.2 用户表 (users)

**用途**：存储系统用户信息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| user_id | SERIAL | PRIMARY KEY | - | 用户ID |
| username | VARCHAR(50) | UNIQUE NOT NULL | - | 用户名 |
| email | VARCHAR(100) | UNIQUE NOT NULL | - | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | - | 密码哈希 |
| phone | VARCHAR(20) | - | - | 手机号 |
| avatar | VARCHAR(255) | - | '用户' | 头像 |
| status | VARCHAR(20) | CHECK (status IN ('active', 'inactive', 'banned')) NOT NULL | 'active' | 用户状态 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| last_login | TIMESTAMP | - | - | 最后登录时间 |

**索引**：
- idx_users_username (username)
- idx_users_email (email)
- idx_users_status (status)

### 2.3 股票信息表 (stocks)

**用途**：存储股票基本信息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| stock_id | SERIAL | PRIMARY KEY | - | 股票ID |
| stock_code | VARCHAR(20) | UNIQUE NOT NULL | - | 股票代码 |
| stock_name | VARCHAR(100) | NOT NULL | - | 股票名称 |
| market_type | VARCHAR(20) | - | 'A股' | 市场类型 |
| industry | VARCHAR(50) | - | - | 所属行业 |
| listing_date | DATE | - | - | 上市日期 |
| is_active | BOOLEAN | - | TRUE | 是否活跃 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**索引**：
- idx_stocks_stock_code (stock_code)
- idx_stocks_market_type (market_type)
- idx_stocks_industry (industry)

### 2.4 管理员用户表 (admin_users)

**用途**：存储系统管理员信息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| admin_id | SERIAL | PRIMARY KEY | - | 管理员ID |
| username | VARCHAR(50) | UNIQUE NOT NULL | - | 用户名 |
| password_hash | VARCHAR(255) | NOT NULL | - | 密码哈希 |
| email | VARCHAR(100) | UNIQUE NOT NULL | - | 邮箱 |
| role | VARCHAR(20) | CHECK (role IN ('super_admin', 'admin', 'moderator')) NOT NULL | 'admin' | 角色 |
| status | VARCHAR(20) | CHECK (status IN ('active', 'inactive', 'suspended')) NOT NULL | 'active' | 状态 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| last_login | TIMESTAMP | - | - | 最后登录时间 |

**索引**：
- idx_admin_users_username (username)
- idx_admin_users_email (email)
- idx_admin_users_role (role)
- idx_admin_users_status (status)

### 2.5 群组表 (groups)

**用途**：存储聊天群组信息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| group_id | SERIAL | PRIMARY KEY | - | 群组ID |
| group_name | VARCHAR(100) | NOT NULL | - | 群组名称 |
| group_type | VARCHAR(20) | CHECK (group_type IN ('public', 'private')) NOT NULL | 'private' | 群组类型 |
| creator_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 创建者ID |
| avatar | VARCHAR(255) | - | '群' | 群组头像 |
| description | TEXT | - | - | 群组描述 |
| status | VARCHAR(20) | CHECK (status IN ('active', 'disbanded')) NOT NULL | 'active' | 群组状态 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**索引**：
- idx_groups_creator_id (creator_id)
- idx_groups_group_type (group_type)
- idx_groups_status (status)

### 2.6 群成员表 (group_members)

**用途**：存储群组与用户的关系

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| group_member_id | SERIAL | PRIMARY KEY | - | 群成员ID |
| group_id | INTEGER | FOREIGN KEY REFERENCES groups(group_id) ON DELETE CASCADE NOT NULL | - | 群组ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| role | VARCHAR(20) | CHECK (role IN ('owner', 'admin', 'member')) NOT NULL | 'member' | 成员角色 |
| status | VARCHAR(20) | CHECK (status IN ('active', 'inactive')) NOT NULL | 'active' | 成员状态 |
| joined_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 加入时间 |

**约束**：
- UNIQUE (group_id, user_id)

**索引**：
- idx_group_members_group_id (group_id)
- idx_group_members_user_id (user_id)
- idx_group_members_role (role)
- idx_group_members_status (status)

### 2.7 自选股表 (favorites)

**用途**：存储用户的自选股信息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| favorite_id | SERIAL | PRIMARY KEY | - | 自选股ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| stock_id | INTEGER | FOREIGN KEY REFERENCES stocks(stock_id) ON DELETE CASCADE NOT NULL | - | 股票ID |
| added_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 添加时间 |
| notes | TEXT | - | - | 备注 |
| alert_price | DECIMAL(10,2) | - | - | 预警价格 |

**约束**：
- UNIQUE (user_id, stock_id)

**索引**：
- idx_favorites_user_id (user_id)
- idx_favorites_stock_id (stock_id)
- idx_favorites_added_at (added_at)

### 2.8 好友关系表 (friend_relationships)

**用途**：存储用户之间的好友关系

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| relationship_id | SERIAL | PRIMARY KEY | - | 关系ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| friend_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 好友ID |
| status | VARCHAR(20) | CHECK (status IN ('pending', 'accepted', 'blocked')) NOT NULL | 'pending' | 关系状态 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| accepted_at | TIMESTAMP | - | - | 接受时间 |

**约束**：
- UNIQUE (user_id, friend_id)
- CHECK (user_id != friend_id)

**索引**：
- idx_friend_relationships_user_id (user_id)
- idx_friend_relationships_friend_id (friend_id)
- idx_friend_relationships_status (status)
- idx_friend_relationships_created_at (created_at)

### 2.9 好友聊天消息表 (friend_messages)

**用途**：存储用户之间的聊天消息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| message_id | SERIAL | PRIMARY KEY | - | 消息ID |
| sender_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 发送者ID |
| receiver_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 接收者ID |
| content | TEXT | NOT NULL | - | 消息内容 |
| message_type | VARCHAR(20) | CHECK (message_type IN ('text', 'stock_card', 'image')) NOT NULL | 'text' | 消息类型 |
| stock_reference | INTEGER | FOREIGN KEY REFERENCES stocks(stock_id) ON DELETE SET NULL | - | 股票引用ID |
| sent_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 发送时间 |
| is_read | BOOLEAN | - | FALSE | 是否已读 |

**约束**：
- CHECK (sender_id != receiver_id)

**索引**：
- idx_friend_messages_sender_id (sender_id)
- idx_friend_messages_receiver_id (receiver_id)
- idx_friend_messages_sent_at (sent_at)
- idx_friend_messages_message_type (message_type)
- idx_friend_messages_is_read (is_read)

### 2.10 群聊消息表 (group_messages)

**用途**：存储群组内的聊天消息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| message_id | SERIAL | PRIMARY KEY | - | 消息ID |
| group_id | INTEGER | FOREIGN KEY REFERENCES groups(group_id) ON DELETE CASCADE NOT NULL | - | 群组ID |
| sender_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 发送者ID |
| content | TEXT | NOT NULL | - | 消息内容 |
| message_type | VARCHAR(20) | CHECK (message_type IN ('text', 'stock_card', 'image')) NOT NULL | 'text' | 消息类型 |
| stock_reference | INTEGER | FOREIGN KEY REFERENCES stocks(stock_id) ON DELETE SET NULL | - | 股票引用ID |
| sent_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 发送时间 |

**索引**：
- idx_group_messages_group_id (group_id)
- idx_group_messages_sender_id (sender_id)
- idx_group_messages_sent_at (sent_at)
- idx_group_messages_message_type (message_type)

### 2.11 AI推荐记录表 (ai_recommendations)

**用途**：存储AI为用户推荐的股票记录

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| recommendation_id | SERIAL | PRIMARY KEY | - | 推荐ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| stock_id | INTEGER | FOREIGN KEY REFERENCES stocks(stock_id) ON DELETE CASCADE NOT NULL | - | 股票ID |
| confidence_score | DECIMAL(5,2) | NOT NULL | - | 置信度分数 |
| reasoning | TEXT | - | - | 推荐理由 |
| recommended_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 推荐时间 |
| user_feedback | VARCHAR(20) | CHECK (user_feedback IN ('positive', 'negative', NULL)) | - | 用户反馈 |

**索引**：
- idx_ai_recommendations_user_id (user_id)
- idx_ai_recommendations_stock_id (stock_id)
- idx_ai_recommendations_recommended_at (recommended_at)
- idx_ai_recommendations_confidence_score (confidence_score)

### 2.12 用户登录会话表 (user_sessions)

**用途**：存储用户的登录会话信息

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| session_id | SERIAL | PRIMARY KEY | - | 会话ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| session_token | VARCHAR(255) | UNIQUE NOT NULL | - | 会话令牌 |
| login_time | TIMESTAMP | - | CURRENT_TIMESTAMP | 登录时间 |
| last_activity | TIMESTAMP | - | CURRENT_TIMESTAMP | 最后活动时间 |
| ip_address | INET | - | - | IP地址 |
| device_info | TEXT | - | - | 设备信息 |

**索引**：
- idx_user_sessions_user_id (user_id)
- idx_user_sessions_session_token (session_token)
- idx_user_sessions_login_time (login_time)
- idx_user_sessions_last_activity (last_activity)

### 2.13 市场行情数据表 (market_data)

**用途**：存储股票的市场行情数据

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| data_id | SERIAL | PRIMARY KEY | - | 数据ID |
| stock_id | INTEGER | FOREIGN KEY REFERENCES stocks(stock_id) ON DELETE CASCADE NOT NULL | - | 股票ID |
| price | DECIMAL(10,2) | NOT NULL | - | 当前价格 |
| change_percent | DECIMAL(5,2) | - | - | 涨跌幅 |
| change_amount | DECIMAL(10,2) | - | - | 涨跌额 |
| volume | BIGINT | - | - | 成交量 |
| timestamp | TIMESTAMP | - | CURRENT_TIMESTAMP | 数据时间 |

**索引**：
- idx_market_data_stock_id (stock_id)
- idx_market_data_timestamp (timestamp)
- idx_market_data_price (price)

### 2.14 管理员操作日志表 (admin_logs)

**用途**：存储管理员的操作日志

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| log_id | SERIAL | PRIMARY KEY | - | 日志ID |
| admin_id | INTEGER | FOREIGN KEY REFERENCES admin_users(admin_id) ON DELETE SET NULL NOT NULL | - | 管理员ID |
| action_type | VARCHAR(50) | NOT NULL | - | 操作类型 |
| target_user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE SET NULL | - | 目标用户ID |
| details | TEXT | - | - | 操作详情 |
| ip_address | INET | - | - | IP地址 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**索引**：
- idx_admin_logs_admin_id (admin_id)
- idx_admin_logs_action_type (action_type)
- idx_admin_logs_created_at (created_at)
- idx_admin_logs_target_user_id (target_user_id)

### 2.15 用户兴趣标签表 (user_interests)

**用途**：存储用户的兴趣标签

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| interest_id | SERIAL | PRIMARY KEY | - | 兴趣ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| interest_type | VARCHAR(20) | CHECK (interest_type IN ('industry', 'concept', 'style')) NOT NULL | - | 兴趣类型 |
| interest_value | VARCHAR(50) | NOT NULL | - | 兴趣值 |
| weight | INTEGER | CHECK (weight BETWEEN 0 AND 100) NOT NULL | 50 | 权重 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**约束**：
- UNIQUE (user_id, interest_type, interest_value)

**索引**：
- idx_user_interests_user_id (user_id)
- idx_user_interests_interest_type (interest_type)
- idx_user_interests_interest_value (interest_value)

### 2.16 系统通知表 (system_notifications)

**用途**：存储系统向用户发送的通知

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| notification_id | SERIAL | PRIMARY KEY | - | 通知ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| notification_type | VARCHAR(20) | CHECK (notification_type IN ('system', 'friend', 'stock', 'ai_recommendation', 'group')) NOT NULL | - | 通知类型 |
| title | VARCHAR(100) | NOT NULL | - | 通知标题 |
| content | TEXT | NOT NULL | - | 通知内容 |
| is_read | BOOLEAN | - | FALSE | 是否已读 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| read_at | TIMESTAMP | - | - | 阅读时间 |

**索引**：
- idx_system_notifications_user_id (user_id)
- idx_system_notifications_notification_type (notification_type)
- idx_system_notifications_is_read (is_read)
- idx_system_notifications_created_at (created_at)

### 2.17 操作审计表 (audit_logs)

**用途**：存储系统内所有操作的审计日志

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| audit_id | SERIAL | PRIMARY KEY | - | 审计ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE SET NULL | - | 用户ID |
| action_type | VARCHAR(50) | NOT NULL | - | 操作类型 |
| resource_type | VARCHAR(50) | NOT NULL | - | 资源类型 |
| resource_id | INTEGER | - | - | 资源ID |
| details | TEXT | - | - | 操作详情 |
| ip_address | INET | - | - | IP地址 |
| user_agent | TEXT | - | - | 用户代理 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**索引**：
- idx_audit_logs_user_id (user_id)
- idx_audit_logs_action_type (action_type)
- idx_audit_logs_resource_type (resource_type)
- idx_audit_logs_created_at (created_at)

### 2.18 股票评论表 (stock_comments)

**用途**：存储用户对股票的评论

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|-------|---------|------|--------|------|
| comment_id | SERIAL | PRIMARY KEY | - | 评论ID |
| stock_id | INTEGER | FOREIGN KEY REFERENCES stocks(stock_id) ON DELETE CASCADE NOT NULL | - | 股票ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE NOT NULL | - | 用户ID |
| parent_id | INTEGER | FOREIGN KEY REFERENCES stock_comments(comment_id) ON DELETE SET NULL | - | 父评论ID |
| content | TEXT | NOT NULL | - | 评论内容 |
| likes_count | INTEGER | - | 0 | 点赞数 |
| is_deleted | BOOLEAN | - | FALSE | 是否已删除 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**索引**：
- idx_stock_comments_stock_id (stock_id)
- idx_stock_comments_user_id (user_id)
- idx_stock_comments_parent_id (parent_id)
- idx_stock_comments_created_at (created_at)
- idx_stock_comments_is_deleted (is_deleted)

## 3. 外键关系图

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   admin_users │      │     users     │      │    stocks     │
└───────────────┘      └───────────────┘      └───────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   admin_logs  │      │    groups     │      │  market_data  │
└───────────────┘      └───────────────┘      └───────────────┘
                              │                       │
                              │                       │
                              ▼                       ▼
                       ┌───────────────┐      ┌───────────────┐
                       │ group_members │      │  ai_recom...  │
                       └───────────────┘      └───────────────┘
                              │
                              │
                              ▼
                       ┌───────────────┐
                       │ group_mes...  │
                       └───────────────┘
```

## 4. 索引优化建议

1. **market_data表**：考虑添加复合索引 (stock_id, timestamp)，以优化按股票和时间范围查询的性能
2. **friend_messages表**：考虑添加复合索引 (receiver_id, is_read, sent_at)，以优化未读消息查询
3. **system_notifications表**：考虑添加复合索引 (user_id, is_read, created_at)，以优化未读通知查询

## 5. 约束完整性检查

所有表都已添加了适当的约束，包括：
- 主键约束
- 外键约束，带适当的级联操作
- 唯一约束
- CHECK约束，限制字段取值范围
- NOT NULL约束

## 6. 版本信息

- 数据库版本：PostgreSQL 12.0+
- 迁移脚本版本：1.0.0
- 生成时间：2025-12-15 00:00:00

## 7. 执行命令

### 7.1 创建数据库结构

```bash
# 使用迁移脚本创建数据库结构
psql -U admin -d stockdb -f migrations/20251215_000000_complete_schema.sql

# 或在Docker容器中执行
docker exec -i postgres-container psql -U admin -d stockdb -f /dev/stdin < migrations/20251215_000000_complete_schema.sql
```

### 7.2 插入种子数据

```bash
# 插入种子数据
psql -U admin -d stockdb -f seed_data.sql

# 或在Docker容器中执行
docker exec -i postgres-container psql -U admin -d stockdb -f /dev/stdin < seed_data.sql
```

### 7.3 执行数据库迁移

```powershell
# 使用PowerShell脚本执行迁移
.\migrate.ps1

# 执行向下迁移
.\migrate.ps1 -Action Down -Version 20251215_000000
```

## 8. 维护建议

1. **定期备份**：定期备份数据库，确保数据安全
2. **监控性能**：监控数据库性能，根据需要调整索引
3. **更新统计信息**：定期执行`ANALYZE`命令，更新表统计信息
4. **清理历史数据**：定期清理过期的日志和会话数据
5. **安全性检查**：定期检查数据库权限和安全设置

## 9. 扩展建议

1. **添加全文搜索**：为股票名称、评论内容等添加全文搜索功能
2. **分区表**：对于market_data等大数据量表，考虑使用分区表
3. **缓存机制**：添加缓存层，提高高频查询的性能
4. **读写分离**：考虑实现读写分离，提高系统吞吐量
5. **数据归档**：实现数据归档策略，优化数据库性能
