-- 智能鑫AI系统模拟数据插入脚本（ASCII版）
-- 创建时间: 2025-12-14
-- 数据库: stockdb

-- 开始事务
BEGIN;

-- 1. 插入用户数据（10个唯一用户，纯ASCII）
INSERT INTO users (username, email, password_hash, phone, avatar, status, created_at, last_login) 
VALUES
('user1_smartxin', 'user1@smartxin.com', '$2a$10$testpasshash1234567890', '13800000001', 'default', 'active', '2024-10-01 10:30:00', '2025-12-14 09:15:30'),
('user2_smartxin', 'user2@smartxin.com', '$2a$10$testpasshash1234567890', '13800000002', 'default', 'active', '2024-10-15 14:20:00', '2025-12-13 16:45:20'),
('user3_smartxin', 'user3@smartxin.com', '$2a$10$testpasshash1234567890', '13800000003', 'default', 'active', '2024-11-05 09:45:00', '2025-12-14 10:20:15'),
('user4_smartxin', 'user4@smartxin.com', '$2a$10$testpasshash1234567890', '13800000004', 'default', 'active', '2024-11-20 11:15:00', '2025-12-12 14:50:45'),
('user5_smartxin', 'user5@smartxin.com', '$2a$10$testpasshash1234567890', '13800000005', 'default', 'active', '2024-12-01 16:30:00', '2025-12-14 08:30:20'),
('user6_smartxin', 'user6@smartxin.com', '$2a$10$testpasshash1234567890', '13800000006', 'default', 'active', '2024-12-15 13:45:00', '2025-12-13 11:25:30'),
('user7_smartxin', 'user7@smartxin.com', '$2a$10$testpasshash1234567890', '13800000007', 'default', 'inactive', '2025-01-05 10:15:00', '2025-12-01 09:40:10'),
('user8_smartxin', 'user8@smartxin.com', '$2a$10$testpasshash1234567890', '13800000008', 'default', 'active', '2025-01-20 15:20:00', '2025-12-14 11:05:45'),
('user9_smartxin', 'user9@smartxin.com', '$2a$10$testpasshash1234567890', '13800000009', 'default', 'active', '2025-02-01 09:30:00', '2025-12-13 14:20:30'),
('user10_smartxin', 'user10@smartxin.com', '$2a$10$testpasshash1234567890', '13800000010', 'default', 'active', '2025-02-15 16:45:00', '2025-12-14 10:10:25');

-- 2. 插入股票数据（15只股票，纯ASCII）
INSERT INTO stocks (stock_code, stock_name, market_type, industry, listing_date, is_active) 
VALUES
('600036', 'China Merchants Bank', 'A', 'Banking', '2002-04-09', true),
('000858', 'Wuliangye', 'A', 'Alcohol', '1998-04-27', true),
('600519', 'Kweichow Moutai', 'A', 'Alcohol', '2001-08-27', true),
('000001', 'Ping An Bank', 'A', 'Banking', '1991-04-03', true),
('002415', 'Hikvision', 'A', 'Electronics', '2010-05-28', true),
('601318', 'Ping An Insurance', 'A', 'Insurance', '2007-03-01', true),
('300750', 'CATL', 'A', 'New Energy', '2018-06-11', true),
('600028', 'Sinopec', 'A', 'Oil', '2001-08-08', true),
('601288', 'ABC', 'A', 'Banking', '2010-07-15', true),
('000002', 'Vanke', 'A', 'Real Estate', '1991-01-29', true),
('AAPL', 'Apple', 'US', 'Technology', '1980-12-12', true),
('MSFT', 'Microsoft', 'US', 'Technology', '1986-03-13', true),
('GOOGL', 'Google', 'US', 'Technology', '2004-08-19', true),
('TSLA', 'Tesla', 'US', 'New Energy', '2010-06-29', true),
('BABA', 'Alibaba', 'US', 'E-commerce', '2014-09-19', true);

-- 3. 插入好友关系数据
INSERT INTO friend_relationships (user_id, friend_id, status, created_at, accepted_at) 
VALUES
(1, 2, 'accepted', '2025-02-01 10:30:00', '2025-02-01 10:35:00'),
(1, 3, 'accepted', '2025-02-15 14:20:00', '2025-02-15 14:25:00'),
(1, 4, 'accepted', '2025-03-01 09:45:00', '2025-03-01 09:50:00'),
(1, 5, 'pending', '2025-12-14 09:15:00', NULL),
(2, 3, 'accepted', '2025-02-20 11:15:00', '2025-02-20 11:20:00'),
(2, 6, 'accepted', '2025-03-05 16:30:00', '2025-03-05 16:35:00'),
(2, 7, 'blocked', '2025-04-10 13:45:00', NULL),
(3, 8, 'accepted', '2025-03-15 10:15:00', '2025-03-15 10:20:00'),
(3, 9, 'accepted', '2025-04-01 14:30:00', '2025-04-01 14:35:00'),
(4, 5, 'accepted', '2025-03-20 15:45:00', '2025-03-20 15:50:00'),
(4, 10, 'accepted', '2025-04-15 11:20:00', '2025-04-15 11:25:00'),
(5, 6, 'accepted', '2025-04-05 14:20:00', '2025-04-05 14:25:00'),
(5, 8, 'accepted', '2025-04-20 10:30:00', '2025-04-20 10:35:00'),
(6, 9, 'accepted', '2025-04-12 15:15:00', '2025-04-12 15:20:00'),
(8, 10, 'accepted', '2025-05-01 14:45:00', '2025-05-01 14:50:00'),
(9, 10, 'accepted', '2025-05-05 11:30:00', '2025-05-05 11:35:00');

-- 4. 插入聊天消息数据
INSERT INTO friend_messages (sender_id, receiver_id, content, message_type, stock_reference, sent_at, is_read) 
VALUES
(1, 2, 'China Merchants Bank is up 2% today, did you see it?', 'text', 1, '2025-12-13 09:30:00', true),
(2, 1, 'Yes, China Merchants Bank is a leading retail bank!', 'text', 1, '2025-12-13 09:35:00', true),
(1, 3, 'CATL has been adjusting recently, what do you think?', 'text', 7, '2025-12-13 14:20:00', true),
(3, 1, 'Short-term adjustment, long-term still bullish on new energy, I plan to add positions', 'text', 7, '2025-12-13 14:25:00', true),
(2, 3, 'What do you think about Hikvision? I want to buy it', 'text', 5, '2025-12-13 16:15:00', true),
(3, 2, 'Hikvision has strong AI capabilities, high market share in security, can consider', 'text', 5, '2025-12-13 16:20:00', true),
(4, 1, 'China Merchants Bank''s annual report is out, good performance', 'text', 1, '2025-12-14 08:45:00', true),
(1, 4, 'I also saw it, retail business grew quickly', 'text', 1, '2025-12-14 08:50:00', true),
(5, 4, 'Any good stock recommendations recently?', 'text', NULL, '2025-12-14 09:10:00', true),
(4, 5, 'CATL and Hikvision are good, can pay attention', 'text', NULL, '2025-12-14 09:15:00', true),
(6, 2, 'Apple''s MR headset is released, do you think it will boost the stock price?', 'text', 11, '2025-12-14 10:20:00', true),
(2, 6, 'Apple has a strong ecosystem, there should be a wave of market', 'text', 11, '2025-12-14 10:25:00', true),
(8, 3, 'Vanke has good dividends, have you considered?', 'text', 10, '2025-12-14 11:15:00', true),
(3, 8, 'Real estate policies are good now, Vanke is industry leader, can consider', 'text', 10, '2025-12-14 11:20:00', true),
(9, 10, 'How is Tesla''s full self-driving progressing?', 'text', 14, '2025-12-14 13:30:00', false),
(10, 9, 'Tesla''s FSD Beta is very mature now, I''m test driving', 'text', 14, '2025-12-14 13:35:00', false);

-- 5. 插入AI推荐数据
INSERT INTO ai_recommendations (user_id, stock_id, confidence_score, reasoning, recommended_at, user_feedback) 
VALUES
(1, 7, 92.50, 'CATL is the world''s largest power battery supplier, benefiting from rapid growth of new energy vehicles.', '2025-12-01 10:30:00', 'positive'),
(1, 5, 88.20, 'Hikvision has leading advantages in AI security, actively layout AI models and smart IoT.', '2025-12-08 14:20:00', NULL),
(2, 3, 95.80, 'Kweichow Moutai is absolute leader in Chinese liquor industry, high brand value, strong pricing power.', '2025-12-02 09:45:00', 'positive'),
(2, 11, 87.50, 'Apple continues to invest in AI, Vision Pro headset will open new era of spatial computing.', '2025-12-09 11:15:00', NULL),
(3, 14, 90.30, 'Tesla leads in EVs and autonomous driving, Cybertruck delivery will drive sales growth.', '2025-12-03 16:30:00', 'positive'),
(3, 12, 89.10, 'Microsoft has comprehensive AI layout, Copilot and Azure cloud services growing rapidly.', '2025-12-10 13:45:00', NULL),
(4, 1, 86.70, 'China Merchants Bank is retail bank leader, excellent asset quality, solid customer base.', '2025-12-04 10:15:00', 'positive'),
(4, 6, 84.20, 'Ping An Insurance has comprehensive advantages in insurance, banking, asset management.', '2025-12-11 15:30:00', NULL),
(5, 5, 85.90, 'Hikvision''s AI technology widely used in smart cities, smart manufacturing.', '2025-12-05 14:45:00', NULL),
(5, 10, 82.60, 'Vanke is real estate industry leader, stable financial situation, low financing costs.', '2025-12-12 09:30:00', NULL),
(6, 12, 91.40, 'Microsoft has clear AI strategy, Copilot successful in enterprise market.', '2025-12-06 11:20:00', 'positive'),
(6, 3, 88.70, 'Kweichow Moutai''s brand value irreplaceable, stable demand for premium liquor.', '2025-12-13 14:20:00', NULL),
(7, 7, 87.30, 'CATL has obvious technological advantages in power batteries, rich global customer resources.', '2025-12-07 16:15:00', NULL),
(8, 1, 85.10, 'China Merchants Bank has obvious advantages in retail business, wealth management growing rapidly.', '2025-12-08 09:45:00', NULL),
(8, 5, 83.80, 'Hikvision leads market share in AI security, actively expanding new business areas.', '2025-12-14 10:15:00', NULL),
(9, 13, 89.50, 'Google leads in AI search and cloud services, Gemini model launch will enhance competitiveness.', '2025-12-09 14:30:00', NULL),
(9, 14, 86.90, 'Tesla''s autonomous driving technology maturing continuously, diversified growth potential.', '2025-12-15 11:15:00', NULL),
(10, 11, 90.70, 'Apple has strong product innovation capability, Vision Pro will open new growth space.', '2025-12-10 15:45:00', 'positive'),
(10, 7, 88.40, 'CATL''s global market share continues to increase, solid progress in solid-state battery R&D.', '2025-12-16 09:30:00', NULL);

-- 6. 插入自选股数据
INSERT INTO favorites (user_id, stock_id, added_at, notes, alert_price) 
VALUES
(1, 1, '2025-01-10 14:30:00', 'Long-term hold, steady growth', 45.00),
(1, 2, '2025-02-15 09:45:00', 'Liquor leader, Spring Festival market', 180.00),
(1, 7, '2025-03-20 11:20:00', 'New energy track, high growth', 220.00),
(2, 3, '2025-01-05 16:15:00', 'Moutai forever', 1800.00),
(2, 5, '2025-02-10 14:30:00', 'Security leader, AI empowered', 35.00),
(2, 9, '2025-03-05 10:20:00', 'Low valuation, high dividend', 3.20),
(3, 6, '2025-01-20 15:45:00', 'Insurance leader, comprehensive finance', 55.00),
(3, 7, '2025-02-25 09:30:00', 'Global No.1 in power batteries', 230.00),
(3, 11, '2025-03-10 14:20:00', 'Apple ecosystem, innovation driven', 190.00),
(3, 14, '2025-04-05 11:15:00', 'Electric car revolution', 250.00),
(4, 1, '2025-01-15 16:30:00', 'Retail bank leader', 48.00),
(4, 4, '2025-02-20 10:15:00', 'Shenzhen local bank', 15.00),
(4, 8, '2025-03-25 14:45:00', 'Energy security, stable dividend', 5.50),
(5, 2, '2025-01-12 09:30:00', 'Wuliangye, Luzhou-flavor liquor', 175.00),
(5, 5, '2025-02-18 11:20:00', 'AI video analysis', 38.00),
(5, 10, '2025-03-22 15:15:00', 'Real estate leader, stable', 12.00),
(5, 13, '2025-04-10 14:30:00', 'AI search, cloud computing', 140.00),
(6, 3, '2025-01-08 16:45:00', 'Sauce-flavor liquor king', 1750.00),
(6, 6, '2025-02-28 10:30:00', 'Ping An Group, comprehensive finance', 58.00),
(6, 11, '2025-03-15 14:20:00', 'iPhone, service ecosystem', 185.00),
(6, 12, '2025-04-08 11:15:00', 'AI, cloud, games', 420.00),
(7, 7, '2025-01-25 09:45:00', 'New energy battery', 215.00),
(7, 9, '2025-02-12 15:30:00', 'Agricultural Bank, low valuation', 3.30),
(8, 1, '2025-01-30 14:20:00', 'China Merchants Bank, retail king', 46.00),
(8, 5, '2025-03-02 10:15:00', 'Hikvision, security AI', 36.00),
(8, 10, '2025-03-28 15:45:00', 'Vanke, real estate', 13.00),
(8, 14, '2025-04-15 11:30:00', 'Tesla, electric vehicle', 260.00),
(9, 3, '2025-01-03 09:30:00', 'Moutai, national liquor', 1820.00),
(9, 6, '2025-02-05 14:30:00', 'Ping An Insurance', 56.00),
(9, 12, '2025-03-18 10:45:00', 'Microsoft, AI leader', 430.00),
(9, 15, '2025-04-20 15:20:00', 'Alibaba, e-commerce', 85.00),
(10, 2, '2025-01-22 11:20:00', 'Wuliangye, liquor', 178.00),
(10, 7, '2025-02-15 14:45:00', 'CATL, new energy', 225.00),
(10, 11, '2025-03-25 09:30:00', 'Apple, technology', 195.00),
(10, 13, '2025-04-12 16:15:00', 'Google, AI', 145.00);

-- 7. 插入市场行情数据
INSERT INTO market_data (stock_id, price, change_percent, change_amount, volume, timestamp) 
VALUES
(1, 46.50, 1.20, 0.55, 12500000, '2025-12-08 15:00:00'),
(1, 46.80, 0.65, 0.30, 10800000, '2025-12-09 15:00:00'),
(1, 47.20, 0.85, 0.40, 13200000, '2025-12-10 15:00:00'),
(1, 46.90, -0.63, -0.30, 9500000, '2025-12-11 15:00:00'),
(1, 47.50, 1.28, 0.60, 14500000, '2025-12-12 15:00:00'),
(1, 47.80, 0.63, 0.30, 11200000, '2025-12-13 15:00:00'),
(1, 48.20, 0.84, 0.40, 15800000, '2025-12-14 11:30:00'),
(3, 1780.50, 0.85, 15.00, 320000, '2025-12-08 15:00:00'),
(3, 1795.20, 0.83, 14.70, 280000, '2025-12-09 15:00:00'),
(3, 1810.80, 0.87, 15.60, 350000, '2025-12-10 15:00:00'),
(3, 1802.50, -0.46, -8.30, 250000, '2025-12-11 15:00:00'),
(3, 1820.30, 0.99, 17.80, 420000, '2025-12-12 15:00:00'),
(3, 1835.60, 0.84, 15.30, 380000, '2025-12-13 15:00:00'),
(3, 1848.20, 0.69, 12.60, 450000, '2025-12-14 11:30:00'),
(7, 220.50, 1.15, 2.50, 28500000, '2025-12-08 15:00:00'),
(7, 223.80, 1.50, 3.30, 32000000, '2025-12-09 15:00:00'),
(7, 221.20, -1.16, -2.60, 25800000, '2025-12-10 15:00:00'),
(7, 218.50, -1.22, -2.70, 23500000, '2025-12-11 15:00:00'),
(7, 222.30, 1.74, 3.80, 29800000, '2025-12-12 15:00:00'),
(7, 225.60, 1.48, 3.30, 34200000, '2025-12-13 15:00:00'),
(7, 228.90, 1.46, 3.30, 38500000, '2025-12-14 11:30:00'),
(5, 35.20, 0.86, 0.30, 18500000, '2025-12-08 15:00:00'),
(5, 35.60, 1.14, 0.40, 21200000, '2025-12-09 15:00:00'),
(5, 36.10, 1.40, 0.50, 24500000, '2025-12-10 15:00:00'),
(5, 35.80, -0.83, -0.30, 16800000, '2025-12-11 15:00:00'),
(5, 36.30, 1.40, 0.50, 22300000, '2025-12-12 15:00:00'),
(5, 36.70, 1.10, 0.40, 20500000, '2025-12-13 15:00:00'),
(5, 37.10, 1.09, 0.40, 25800000, '2025-12-14 11:30:00');

-- 8. 插入用户登录会话数据
INSERT INTO user_sessions (user_id, session_token, login_time, last_activity, ip_address, device_info) 
VALUES
(1, 'session_' || random()::text, '2025-12-14 09:15:30', '2025-12-14 10:30:00', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(2, 'session_' || random()::text, '2025-12-13 16:45:20', '2025-12-13 17:00:00', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(3, 'session_' || random()::text, '2025-12-14 10:20:15', '2025-12-14 11:30:00', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15'),
(4, 'session_' || random()::text, '2025-12-12 14:50:45', '2025-12-12 15:05:00', '192.168.1.103', 'Mozilla/5.0 (Android 14; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0'),
(5, 'session_' || random()::text, '2025-12-14 08:30:20', '2025-12-14 09:45:00', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(6, 'session_' || random()::text, '2025-12-13 11:25:30', '2025-12-13 12:40:00', '192.168.1.105', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(8, 'session_' || random()::text, '2025-12-14 11:05:45', '2025-12-14 12:20:00', '192.168.1.106', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15'),
(9, 'session_' || random()::text, '2025-12-13 14:20:30', '2025-12-13 15:35:00', '192.168.1.107', 'Mozilla/5.0 (Android 14; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0'),
(10, 'session_' || random()::text, '2025-12-14 10:10:25', '2025-12-14 11:25:00', '192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- 提交事务
COMMIT;

-- 显示插入结果
SELECT 'Mock data insertion completed successfully!' AS result;
