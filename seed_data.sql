-- 智能鑫AI系统种子数据脚本
-- 生成时间: 2024-12-07
-- 描述: 为开发测试环境生成完整的测试数据

-- === 1. 清空现有数据（可选，用于重置测试环境） === --
--
-- 如果需要清空现有数据，取消注释以下代码块
-- 注意：此操作将删除所有数据，操作不可逆！
/*
TRUNCATE TABLE admin_logs CASCADE;
TRUNCATE TABLE market_data CASCADE;
TRUNCATE TABLE user_sessions CASCADE;
TRUNCATE TABLE ai_recommendations CASCADE;
TRUNCATE TABLE friend_messages CASCADE;
TRUNCATE TABLE friend_relationships CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE stocks CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE migration_history CASCADE;
*/

-- === 2. 生成测试用户数据 === --
INSERT INTO users (username, email, password_hash, phone, avatar, status, created_at) VALUES
('张财经', 'zhang@zhinengxin.ai', '$2b$12$abc123def456ghi789jkl', '13800138001', '张', 'active', '2024-01-15 08:30:00'),
('李股神', 'li@zhinengxin.ai', '$2b$12$mno345pqr678stu901vwx', '13800138002', '李', 'active', '2024-01-16 09:15:00'),
('王趋势', 'wang@zhinengxin.ai', '$2b$12$yzab567cde890fgh123ij', '13800138003', '王', 'active', '2024-01-17 10:20:00'),
('赵价值', 'zhao@zhinengxin.ai', '$2b$12$klm901nop234qrs567tuv', '13800138004', '赵', 'inactive', '2024-01-18 11:30:00'),
('钱技术', 'qian@zhinengxin.ai', '$2b$12$wxy345zab678cde901fgh', '13800138005', '钱', 'active', '2024-01-19 14:45:00'),
('孙成长', 'sun@zhinengxin.ai', '$2b$12$ijk567lmn890opq123rst', '13800138006', '孙', 'active', '2024-01-20 16:00:00'),
('周稳健', 'zhou@zhinengxin.ai', '$2b$12$uvw901xyz234abc567def', '13800138007', '周', 'active', '2024-01-21 17:30:00'),
('吴激进', 'wu@zhinengxin.ai', '$2b$12$ghi123jkl456mno789pqr', '13800138008', '吴', 'banned', '2024-01-22 18:45:00'),
('郑新手', 'zheng@zhinengxin.ai', '$2b$12$stu901vwx234yza567bcd', '13800138009', '郑', 'active', '2024-01-23 20:00:00'),
('测试用户', 'test@zhinengxin.ai', '$2b$12$efg123hij456klm789nop', '13800138100', '测', 'active', '2024-01-24 21:15:00')
ON CONFLICT (username) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    phone = EXCLUDED.phone,
    avatar = EXCLUDED.avatar,
    status = EXCLUDED.status;

-- 更新最后登录时间
UPDATE users SET last_login = '2024-12-07 09:00:00' WHERE username = '张财经';
UPDATE users SET last_login = '2024-12-07 08:45:00' WHERE username = '李股神';
UPDATE users SET last_login = '2024-12-07 10:20:00' WHERE username = '王趋势';

-- === 3. 生成股票数据 === --
INSERT INTO stocks (stock_code, stock_name, market_type, industry, listing_date, is_active) VALUES
('600519', '贵州茅台', 'A股', '食品饮料', '2001-08-27', true),
('300750', '宁德时代', 'A股', '电力设备', '2011-12-16', true),
('000858', '五粮液', 'A股', '食品饮料', '1998-04-27', true),
('601318', '中国平安', 'A股', '非银金融', '2007-03-01', true),
('000333', '美的集团', 'A股', '家用电器', '2013-09-18', true),
('002415', '海康威视', 'A股', '计算机', '2010-05-28', true),
('600036', '招商银行', 'A股', '银行', '2002-04-09', true),
('000001', '平安银行', 'A股', '银行', '1991-04-03', true),
('601888', '中国中免', 'A股', '商贸零售', '2009-10-15', true),
('000651', '格力电器', 'A股', '家用电器', '1996-11-18', true),
('002230', '科大讯飞', 'A股', '计算机', '2008-05-12', true),
('600887', '伊利股份', 'A股', '食品饮料', '1996-03-12', true),
('000725', '京东方A', 'A股', '电子', '2001-01-12', true),
('601766', '中国中车', 'A股', '机械设备', '2008-08-18', true),
('601628', '中国人寿', 'A股', '非银金融', '2007-01-09', true)
ON CONFLICT (stock_code) DO UPDATE SET
    stock_name = EXCLUDED.stock_name,
    market_type = EXCLUDED.market_type,
    industry = EXCLUDED.industry,
    listing_date = EXCLUDED.listing_date,
    is_active = EXCLUDED.is_active;

-- === 4. 生成市场行情数据 === --
WITH stock_ids AS (
    SELECT stock_id, stock_code FROM stocks
)
INSERT INTO market_data (stock_id, price, change_percent, change_amount, volume, timestamp) VALUES
((SELECT stock_id FROM stocks WHERE stock_code = '600519'), 1688.50, 2.15, 35.50, 1250000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '300750'), 214.80, -1.23, -2.68, 2560000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '000858'), 152.30, 0.85, 1.28, 1870000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '601318'), 48.92, -0.56, -0.28, 3250000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '000333'), 56.78, 1.45, 0.81, 1430000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '002415'), 32.15, 3.25, 1.01, 2180000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '600036'), 35.67, 0.85, 0.30, 1860000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '000001'), 12.34, -0.32, -0.04, 2450000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '601888'), 95.60, 4.28, 3.92, 1290000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '000651'), 38.45, -2.15, -0.85, 1670000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '002230'), 56.78, 8.20, 4.30, 890000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '600887'), 28.90, 1.05, 0.30, 1340000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '000725'), 4.12, 0.24, 0.01, 4560000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '601766'), 6.78, -1.45, -0.10, 3210000, '2024-12-07 15:00:00'),
((SELECT stock_id FROM stocks WHERE stock_code = '601628'), 30.25, 0.83, 0.25, 1980000, '2024-12-07 15:00:00');

-- === 5. 生成自选股数据 === --
WITH user_stock_pairs AS (
    SELECT u.user_id, s.stock_id
    FROM users u
    CROSS JOIN stocks s
    WHERE u.username IN ('张财经', '李股神', '王趋势', '测试用户')
    AND s.stock_code IN ('600519', '300750', '000858', '002230', '002415', '601318')
)
INSERT INTO favorites (user_id, stock_id, added_at, notes, alert_price)
SELECT
    user_id,
    stock_id,
    CURRENT_TIMESTAMP - (random() * interval '30 days'),
    CASE
        WHEN stock_id = (SELECT stock_id FROM stocks WHERE stock_code = '600519') THEN '长期持有，价值投资'
        WHEN stock_id = (SELECT stock_id FROM stocks WHERE stock_code = '300750') THEN '新能源汽车龙头'
        WHEN stock_id = (SELECT stock_id FROM stocks WHERE stock_code = '002230') THEN 'AI概念股，有潜力'
        ELSE '关注中'
    END,
    CASE
        WHEN random() > 0.7 THEN (SELECT price * 1.1 FROM market_data WHERE stock_id = s.stock_id)
        WHEN random() < 0.3 THEN (SELECT price * 0.9 FROM market_data WHERE stock_id = s.stock_id)
        ELSE NULL
    END
FROM user_stock_pairs usp
JOIN stocks s ON usp.stock_id = s.stock_id
ON CONFLICT (user_id, stock_id) DO UPDATE SET
    notes = EXCLUDED.notes,
    alert_price = EXCLUDED.alert_price;

-- === 6. 生成好友关系数据 === --
WITH user_pairs AS (
    SELECT u1.user_id as user_id, u2.user_id as friend_id
    FROM users u1, users u2
    WHERE u1.username = '张财经' AND u2.username IN ('李股神', '王趋势', '赵价值')
    UNION ALL
    SELECT u1.user_id, u2.user_id
    FROM users u1, users u2
    WHERE u1.username = '李股神' AND u2.username IN ('王趋势', '钱技术')
    UNION ALL
    SELECT u1.user_id, u2.user_id
    FROM users u1, users u2
    WHERE u1.username = '王趋势' AND u2.username IN ('孙成长', '周稳健')
    UNION ALL
    SELECT u1.user_id, u2.user_id
    FROM users u1, users u2
    WHERE u1.username = '测试用户' AND u2.username IN ('张财经', '李股神', '王趋势')
)
INSERT INTO friend_relationships (user_id, friend_id, status, created_at, accepted_at)
SELECT
    user_id,
    friend_id,
    CASE
        WHEN random() > 0.2 THEN 'accepted'
        ELSE 'pending'
    END as status,
    CURRENT_TIMESTAMP - (random() * interval '15 days'),
    CASE
        WHEN random() > 0.2 THEN CURRENT_TIMESTAMP - (random() * interval '10 days')
        ELSE NULL
    END
FROM user_pairs
WHERE user_id != friend_id
ON CONFLICT (user_id, friend_id) DO UPDATE SET
    status = EXCLUDED.status,
    accepted_at = EXCLUDED.accepted_at;

-- === 7. 生成聊天消息数据 === --
WITH chat_pairs AS (
    -- 张财经和李股神的对话
    SELECT
        (SELECT user_id FROM users WHERE username = '张财经') as sender_id,
        (SELECT user_id FROM users WHERE username = '李股神') as receiver_id,
        ARRAY[
            '你好！最近关注什么股票？',
            '我在看科技板块，特别是AI相关的股票',
            '我觉得科大讯飞不错，最近资金流入明显',
            'stock:002230'
        ] as messages
    UNION ALL
    -- 李股神和王趋势的对话
    SELECT
        (SELECT user_id FROM users WHERE username = '李股神'),
        (SELECT user_id FROM users WHERE username = '王趋势'),
        ARRAY[
            '明天准备加仓宁德时代，你觉得这个位置怎么样？',
            '这个位置相对安全，可以分批建仓',
            '我也在关注新能源板块的调整机会'
        ]
    UNION ALL
    -- 王趋势和张财经的对话
    SELECT
        (SELECT user_id FROM users WHERE username = '王趋势'),
        (SELECT user_id FROM users WHERE username = '张财经'),
        ARRAY[
            '最近市场波动很大，建议控制仓位',
            '是的，我也在观望，等企稳信号'
        ]
)
INSERT INTO friend_messages (sender_id, receiver_id, content, message_type, stock_reference, sent_at, is_read)
SELECT
    sender_id,
    receiver_id,
    unnest(messages) as content,
    CASE
        WHEN unnest(messages) LIKE 'stock:%' THEN 'stock_card'
        ELSE 'text'
    END as message_type,
    CASE
        WHEN unnest(messages) LIKE 'stock:%' THEN
            (SELECT stock_id FROM stocks WHERE stock_code = substring(unnest(messages) from 'stock:(\w+)'))
        ELSE NULL
    END as stock_reference,
    CURRENT_TIMESTAMP - (random() * interval '7 days') as sent_at,
    random() > 0.3 as is_read
FROM chat_pairs;

-- === 8. 生成AI推荐记录 === --
WITH recommendations AS (
    SELECT
        u.user_id,
        s.stock_id,
        ARRAY[
            '与苹果合作关系稳固，消费电子复苏',
            '医药外包龙头，海外业务增长强劲',
            '全球动力电池龙头，新能源汽车需求旺盛',
            '5G建设加速，通信设备需求增加',
            'AI语音技术领先，行业前景广阔',
            '智能安防龙头，AI应用深入'
        ] as reasons
    FROM users u
    CROSS JOIN stocks s
    WHERE u.username IN ('张财经', '李股神', '王趋势', '测试用户')
    AND s.stock_code IN ('002475', '603259', '300750', '000063', '002230', '002415')
)
INSERT INTO ai_recommendations (user_id, stock_id, confidence_score, reasoning, recommended_at, user_feedback)
SELECT
    user_id,
    stock_id,
    (75 + random() * 20)::decimal(5,2) as confidence_score,
    reasons[1 + floor(random() * array_length(reasons, 1))] as reasoning,
    CURRENT_TIMESTAMP - (random() * interval '30 days') as recommended_at,
    CASE
        WHEN random() > 0.7 THEN 'positive'
        WHEN random() < 0.2 THEN 'negative'
        ELSE NULL
    END as user_feedback
FROM recommendations
LIMIT 20;

-- === 9. 生成用户会话数据 === --
INSERT INTO user_sessions (user_id, session_token, login_time, last_activity, ip_address, device_info)
SELECT
    user_id,
    md5(user_id::text || extract(epoch from CURRENT_TIMESTAMP)::text || random()::text) as session_token,
    CURRENT_TIMESTAMP - (random() * interval '2 hours') as login_time,
    CURRENT_TIMESTAMP - (random() * interval '30 minutes') as last_activity,
    '192.168.1.' || (100 + floor(random() * 50))::text as ip_address,
    CASE
        WHEN random() > 0.5 THEN 'iPhone 15 Pro iOS 17.2'
        ELSE 'Xiaomi 13 Android 14'
    END as device_info
FROM users
WHERE status = 'active'
LIMIT 5;

-- === 10. 生成管理员操作日志 === --
INSERT INTO admin_logs (admin_id, action_type, target_user_id, details, ip_address, created_at)
VALUES
('admin001', 'user_ban', (SELECT user_id FROM users WHERE username = '吴激进'), '用户发布违规内容，暂时封禁', '10.0.0.1', '2024-12-06 14:30:00'),
('admin001', 'user_activate', (SELECT user_id FROM users WHERE username = '赵价值'), '重新激活用户账号', '10.0.0.1', '2024-12-05 10:15:00'),
('admin002', 'data_export', NULL, '导出用户行为分析报告', '10.0.0.2', '2024-12-07 09:00:00'),
('admin001', 'system_maintenance', NULL, '执行数据库备份操作', '10.0.0.1', '2024-12-07 02:00:00');

-- === 11. 数据插入完成统计 === --
SELECT '🎉 种子数据插入完成！' as completion_message;

-- 统计插入的数据量
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