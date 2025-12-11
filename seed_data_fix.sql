-- 智能鑫AI系统种子数据修复脚本
-- 修复有问题的数据插入，并补充缺失的数据

-- === 修复自选股数据插入 === --
TRUNCATE TABLE favorites CASCADE;

-- 重新插入自选股数据（修复版本）
WITH user_stock_pairs AS (
    SELECT u.user_id, s.stock_id
    FROM users u
    CROSS JOIN stocks s
    WHERE u.username IN ('张财经', '李股神', '王趋势', '测试用户')
    AND s.stock_code IN ('600519', '300750', '000858', '002230', '002415', '601318')
)
INSERT INTO favorites (user_id, stock_id, added_at, notes, alert_price)
SELECT
    usp.user_id,
    usp.stock_id,
    CURRENT_TIMESTAMP - (random() * interval '30 days') as added_at,
    CASE
        WHEN s.stock_code = '600519' THEN '长期持有，价值投资'
        WHEN s.stock_code = '300750' THEN '新能源汽车龙头'
        WHEN s.stock_code = '002230' THEN 'AI概念股，有潜力'
        ELSE '关注中'
    END as notes,
    CASE
        WHEN random() > 0.7 THEN md.price * 1.1
        WHEN random() < 0.3 THEN md.price * 0.9
        ELSE NULL
    END as alert_price
FROM user_stock_pairs usp
JOIN stocks s ON usp.stock_id = s.stock_id
LEFT JOIN market_data md ON s.stock_id = md.stock_id
ORDER BY usp.user_id, usp.stock_id;

-- === 修复聊天消息数据插入 === --
TRUNCATE TABLE friend_messages CASCADE;

-- 重新插入聊天消息数据（修复版本）
-- 张财经和李股神的对话
INSERT INTO friend_messages (sender_id, receiver_id, content, message_type, stock_reference, sent_at, is_read)
SELECT
    sender.user_id,
    receiver.user_id,
    content,
    CASE
        WHEN content LIKE 'stock:%' THEN 'stock_card'
        ELSE 'text'
    END as message_type,
    CASE
        WHEN content LIKE 'stock:%' THEN (
            SELECT stock_id FROM stocks WHERE stock_code = substring(content from 'stock:(\w+)')
        )
        ELSE NULL
    END as stock_reference,
    CURRENT_TIMESTAMP - (interval '1 day' * seq) as sent_at,
    true as is_read
FROM (
    VALUES
        ('张财经', '李股神', '你好！最近关注什么股票？', 1),
        ('张财经', '李股神', '我在看科技板块，特别是AI相关的股票', 2),
        ('张财经', '李股神', '我觉得科大讯飞不错，最近资金流入明显', 3),
        ('张财经', '李股神', 'stock:002230', 4),
        ('李股神', '王趋势', '明天准备加仓宁德时代，你觉得这个位置怎么样？', 1),
        ('李股神', '王趋势', '这个位置相对安全，可以分批建仓', 2),
        ('王趋势', '张财经', '最近市场波动很大，建议控制仓位', 1),
        ('王趋势', '张财经', '是的，我也在观望，等企稳信号', 2)
) AS msgs(sender_name, receiver_name, content, seq)
JOIN users sender ON sender.username = msgs.sender_name
JOIN users receiver ON receiver.username = msgs.receiver_name;

-- === 修复用户会话数据插入 === --
TRUNCATE TABLE user_sessions CASCADE;

-- 重新插入用户会话数据（修复版本）
INSERT INTO user_sessions (user_id,session_token, login_time, last_activity, ip_address, device_info)
SELECT
    user_id,
    md5(user_id::text || extract(epoch from CURRENT_TIMESTAMP)::text || random()::text) as session_token,
    CURRENT_TIMESTAMP - (random() * interval '2 hours') as login_time,
    CURRENT_TIMESTAMP - (random() * interval '30 minutes') as last_activity,
    ('192.168.1.' || (100 + floor(random() * 50))::text)::inet as ip_address,
    CASE
        WHEN random() > 0.5 THEN 'iPhone 15 Pro iOS 17.2'
        ELSE 'Xiaomi 13 Android 14'
    END as device_info
FROM users
WHERE status = 'active'
ORDER BY user_id
LIMIT 5;

-- === 数据验证和统计 === --
SELECT '✅ 种子数据修复完成！' as completion_message;

-- 最终数据统计
WITH stats AS (
    SELECT 'users' as table_name, COUNT(*) as record_count FROM users
    UNION ALL SELECT 'stocks', COUNT(*) FROM stocks
    UNION ALL SELECT 'market_data', COUNT(*) FROM market_data
    UNION ALL SELECT 'favorites', COUNT(*) FROM favorites
    UNION ALL SELECT 'friend_relationships', COUNT(*) FROM friend_relationships
    UNION ALL SELECT 'friend_messages', COUNT(*) FROM friend_messages
    UNION ALL SELECT 'ai_recommendations', COUNT(*) FROM ai_recommendations
    UNION ALL SELECT 'user_sessions', COUNT(*) FROM user_sessions
    UNION ALL SELECT 'admin_logs', COUNT(*) FROM admin_logs
)
SELECT
    table_name,
    record_count,
    CASE
        WHEN record_count > 0 THEN '✅ 数据已插入'
        ELSE '⚠️ 无数据'
    END as status
FROM stats
ORDER BY table_name;

-- 显示一些关键数据示例
SELECT '\n📊 数据示例报告:' as sample_report;

-- 用户数据示例
SELECT '用户数据示例:' as user_sample;
SELECT user_id, username, email, status FROM users LIMIT 5;

-- 股票数据示例
SELECT '股票数据示例:' as stock_sample;
SELECT stock_id, stock_code, stock_name, industry FROM stocks LIMIT 5;

-- 市场数据示例
SELECT '市场数据示例:' as market_sample;
SELECT m.stock_id, s.stock_code, s.stock_name, m.price, m.change_percent
FROM market_data m
JOIN stocks s ON m.stock_id = s.stock_id
LIMIT 5;

-- 好友关系示例
SELECT '好友关系示例:' as friend_sample;
SELECT u1.username as user1, u2.username as user2, fr.status
FROM friend_relationships fr
JOIN users u1 ON fr.user_id = u1.user_id
JOIN users u2 ON fr.friend_id = u2.user_id
LIMIT 5;

-- 聊天消息示例
SELECT '聊天消息示例:' as message_sample;
SELECT u1.username as sender, u2.username as receiver, content, message_type
FROM friend_messages fm
JOIN users u1 ON fm.sender_id = u1.user_id
JOIN users u2 ON fm.receiver_id = u2.user_id
ORDER BY sent_at DESC
LIMIT 5;