-- 智能鑫AI系统数据库重置脚本
-- 创建时间: 2025-12-15
-- 数据库: stockdb

-- 开始事务
BEGIN;

-- 禁用外键约束检查，加速删除过程
SET CONSTRAINTS ALL DEFERRED;

-- 1. 删除依赖最多的表（从表）
TRUNCATE TABLE friend_messages CASCADE;
TRUNCATE TABLE group_messages CASCADE;
TRUNCATE TABLE ai_recommendations CASCADE;
TRUNCATE TABLE market_data CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE user_sessions CASCADE;
TRUNCATE TABLE system_notifications CASCADE;
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE stock_comments CASCADE;
TRUNCATE TABLE user_interests CASCADE;

-- 2. 删除中间关系表
TRUNCATE TABLE friend_relationships CASCADE;
TRUNCATE TABLE group_members CASCADE;

-- 3. 删除主表
TRUNCATE TABLE groups CASCADE;
TRUNCATE TABLE admin_logs CASCADE;
TRUNCATE TABLE stocks CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE admin_users CASCADE;

-- 4. 重新启用外键约束检查
SET CONSTRAINTS ALL IMMEDIATE;

-- 5. 重置所有自增序列为1
-- 重置users表序列
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;

-- 重置stocks表序列
ALTER SEQUENCE stocks_stock_id_seq RESTART WITH 1;

-- 重置favorites表序列
ALTER SEQUENCE favorites_favorite_id_seq RESTART WITH 1;

-- 重置friend_relationships表序列
ALTER SEQUENCE friend_relationships_relationship_id_seq RESTART WITH 1;

-- 重置friend_messages表序列
ALTER SEQUENCE friend_messages_message_id_seq RESTART WITH 1;

-- 重置ai_recommendations表序列
ALTER SEQUENCE ai_recommendations_recommendation_id_seq RESTART WITH 1;

-- 重置user_sessions表序列
ALTER SEQUENCE user_sessions_session_id_seq RESTART WITH 1;

-- 重置market_data表序列
ALTER SEQUENCE market_data_data_id_seq RESTART WITH 1;

-- 重置admin_logs表序列
ALTER SEQUENCE admin_logs_log_id_seq RESTART WITH 1;

-- 重置admin_users表序列
ALTER SEQUENCE admin_users_admin_id_seq RESTART WITH 1;

-- 重置groups表序列
ALTER SEQUENCE groups_group_id_seq RESTART WITH 1;

-- 重置group_members表序列
ALTER SEQUENCE group_members_group_member_id_seq RESTART WITH 1;

-- 重置group_messages表序列
ALTER SEQUENCE group_messages_message_id_seq RESTART WITH 1;

-- 重置user_interests表序列
ALTER SEQUENCE user_interests_interest_id_seq RESTART WITH 1;

-- 重置system_notifications表序列
ALTER SEQUENCE system_notifications_notification_id_seq RESTART WITH 1;

-- 重置audit_logs表序列
ALTER SEQUENCE audit_logs_audit_id_seq RESTART WITH 1;

-- 重置stock_comments表序列
ALTER SEQUENCE stock_comments_comment_id_seq RESTART WITH 1;

-- 提交事务
COMMIT;

-- 显示重置结果
SELECT '数据库已成功重置，所有表数据清空，自增ID已重置为1！' AS result;
