# 智能鑫AI系统种子数据使用说明

## 📋 概述

本目录包含智能鑫AI系统的种子数据脚本，用于为开发测试环境生成完整的测试数据。

## 📁 文件说明

### 主要脚本文件

| 文件名 | 描述 | 用途 |
|--------|------|------|
| `seed_data.sql` | 主要种子数据脚本 | 生成完整的测试数据，包含所有表和关联关系 |
| `seed_data_fix.sql` | 数据修复脚本 | 修复有问题的数据插入，补充缺失数据 |

### 执行顺序
1. 首先运行 `seed_data.sql`
2. 如果出现错误，运行 `seed_data_fix.sql` 进行修复

## 🚀 执行命令

### 1. 执行主种子数据脚本
```bash
docker exec -i postgres-container psql -U admin -d stockdb -f /dev/stdin < "seed_data.sql"
```

### 2. 执行修复脚本（如果需要）
```bash
docker exec -i postgres-container psql -U admin -d stockdb -f /dev/stdin < "seed_data_fix.sql"
```

### 3. 数据验证命令
```bash
# 检查数据插入情况
docker exec postgres-container psql -U admin -d stockdb -c "
SELECT
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL SELECT 'stocks', COUNT(*) FROM stocks
UNION ALL SELECT 'market_data', COUNT(*) FROM market_data
UNION ALL SELECT 'favorites', COUNT(*) FROM favorites
UNION ALL SELECT 'friend_relationships', COUNT(*) FROM friend_relationships
UNION ALL SELECT 'friend_messages', COUNT(*) FROM friend_messages
UNION ALL SELECT 'ai_recommendations', COUNT(*) FROM ai_recommendations
UNION ALL SELECT 'user_sessions', COUNT(*) FROM user_sessions
UNION ALL SELECT 'admin_logs', COUNT(*) FROM admin_logs;"
```

## 📊 数据统计

执行成功后，数据库将包含以下测试数据：

| 表名 | 记录数 | 描述 |
|------|--------|------|
| `users` | 10 | 10个测试用户，包含不同状态 |
| `stocks` | 15 | 15只常见A股股票数据 |
| `market_data` | 15 | 股票实时行情数据 |
| `favorites` | 24 | 用户自选股关联关系 |
| `friend_relationships` | 10 | 用户好友关系网 |
| `friend_messages` | 8 | 用户间聊天记录 |
| `ai_recommendations` | 12 | AI股票推荐记录 |
| `user_sessions` | 5 | 用户登录会话记录 |
| `admin_logs` | 4 | 管理员操作日志 |

## 👥 测试用户信息

**主要测试用户账号:**

| 用户名 | 邮箱 | 密码哈希 | 状态 | 用途 |
|--------|------|----------|------|------|
| 张财经 | zhang@zhinengxin.ai | $2b$12$abc123... | active | 主测试用户 |
| 李股神 | li@zhinengxin.ai | $2b$12$mno345... | active | 好友关系测试 |
| 测试用户 | test@zhinengxin.ai | $2b$12$efg123... | active | 通用测试 |
| 吴激进 | wu@zhinengxin.ai | $2b$12$ghi123... | banned | 封禁用户测试 |

## 📈 股票数据示例

包含15只常见A股，如：
- 贵州茅台 (600519)
- 宁德时代 (300750)
- 中国平安 (601318)
- 科大讯飞 (002230)
- 五粮液 (000858)

## 🔗 关系数据特征

- **好友关系**: 张财经 ↔ 李股神 ↔ 王趋势 形成关系网
- **聊天记录**: 包含文本消息和股票卡片分享
- **自选股**: 用户关注不同行业的股票组合
- **AI推荐**: 包含置信度评分和用户反馈

## 🧪 测试用例场景

1. **用户登录测试**: 使用测试用户进行登录功能测试
2. **好友聊天测试**: 测试消息发送和股票卡片功能
3. **自选股管理**: 测试添加/删除自选股功能
4. **AI推荐测试**: 验证推荐算法的数据展示
5. **权限测试**: 测试封禁用户的行为限制

## ⚠️ 注意事项

1. **生产环境**: 这些是测试数据，不应在生产环境使用
2. **密码安全**: 测试密码仅为示例，实际使用时需要加密存储
3. **数据重置**: 脚本包含清理功能，可用于重置测试环境
4. **依赖关系**: 确保数据库表结构已创建后再执行数据插入

## 🆘 故障排除

如果脚本执行失败：

1. **检查数据库连接**: 确保PostgreSQL容器正在运行
2. **验证表结构**: 确认表结构已正确创建
3. **查看错误信息**: 根据错误信息调整SQL语句
4. **分步执行**: 可以分部分执行脚本定位问题

## 📞 技术支持

如有问题，请检查：
- 数据库连接状态
- 表结构是否正确创建
- 外键约束是否满足
- 数据类型是否匹配

---

**种子数据创建时间**: 2024-12-07
**数据库版本**: PostgreSQL 18.1
**数据量**: 约90条测试记录