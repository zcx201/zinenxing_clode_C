-- 智能鑫AI系统完整数据库迁移脚本
-- 版本: 20251215_000000
-- 生成时间: 2025-12-15 00:00:00
-- 描述: 创建完整的智能鑫AI系统数据库表结构，包含所有原始表和补充表

-- === UPGRADE 升级操作 === --

-- 1. 创建迁移历史记录表（如果不存在）
CREATE TABLE IF NOT EXISTS migration_history (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

COMMENT ON TABLE migration_history IS '数据库迁移历史记录表';
COMMENT ON COLUMN migration_history.id IS '记录ID';
COMMENT ON COLUMN migration_history.version IS '迁移版本号';
COMMENT ON COLUMN migration_history.name IS '迁移名称';
COMMENT ON COLUMN migration_history.applied_at IS '应用时间';
COMMENT ON COLUMN migration_history.description IS '迁移描述';

-- 2. 创建用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(255) DEFAULT '用户',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 3. 创建股票信息表 (stocks)
CREATE TABLE IF NOT EXISTS stocks (
    stock_id SERIAL PRIMARY KEY,
    stock_code VARCHAR(20) UNIQUE NOT NULL,
    stock_name VARCHAR(100) NOT NULL,
    market_type VARCHAR(20) DEFAULT 'A股',
    industry VARCHAR(50),
    listing_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 创建管理员用户表 (admin_users)
CREATE TABLE IF NOT EXISTS admin_users (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 5. 创建群组表 (groups)
CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    group_type VARCHAR(20) DEFAULT 'private' CHECK (group_type IN ('public', 'private')),
    creator_id INTEGER NOT NULL,
    avatar VARCHAR(255) DEFAULT '群',
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disbanded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. 创建群成员表 (group_members)
CREATE TABLE IF NOT EXISTS group_members (
    group_member_id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 7. 创建自选股表 (favorites)
CREATE TABLE IF NOT EXISTS favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    stock_id INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    alert_price DECIMAL(10,2),
    UNIQUE(user_id, stock_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

-- 8. 创建好友关系表 (friend_relationships)
CREATE TABLE IF NOT EXISTS friend_relationships (
    relationship_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    CHECK (user_id != friend_id),
    UNIQUE(user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 9. 创建好友聊天消息表 (friend_messages)
CREATE TABLE IF NOT EXISTS friend_messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'stock_card', 'image')),
    stock_reference INTEGER,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    CHECK (sender_id != receiver_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_reference) REFERENCES stocks(stock_id) ON DELETE SET NULL
);

-- 10. 创建群聊消息表 (group_messages)
CREATE TABLE IF NOT EXISTS group_messages (
    message_id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'stock_card', 'image')),
    stock_reference INTEGER,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_reference) REFERENCES stocks(stock_id) ON DELETE SET NULL
);

-- 11. 创建AI推荐记录表 (ai_recommendations)
CREATE TABLE IF NOT EXISTS ai_recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    stock_id INTEGER NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    reasoning TEXT,
    recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_feedback VARCHAR(20) CHECK (user_feedback IN ('positive', 'negative', NULL)),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

-- 12. 创建用户登录会话表 (user_sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    device_info TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 13. 创建市场行情数据表 (market_data)
CREATE TABLE IF NOT EXISTS market_data (
    data_id SERIAL PRIMARY KEY,
    stock_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    change_percent DECIMAL(5,2),
    change_amount DECIMAL(10,2),
    volume BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

-- 14. 创建管理员操作日志表 (admin_logs)
CREATE TABLE IF NOT EXISTS admin_logs (
    log_id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_user_id INTEGER,
    details TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id) ON DELETE SET NULL,
    FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 15. 创建用户兴趣标签表 (user_interests)
CREATE TABLE IF NOT EXISTS user_interests (
    interest_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    interest_type VARCHAR(20) CHECK (interest_type IN ('industry', 'concept', 'style')),
    interest_value VARCHAR(50) NOT NULL,
    weight INTEGER DEFAULT 50 CHECK (weight BETWEEN 0 AND 100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, interest_type, interest_value),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 16. 创建系统通知表 (system_notifications)
CREATE TABLE IF NOT EXISTS system_notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    notification_type VARCHAR(20) CHECK (notification_type IN ('system', 'friend', 'stock', 'ai_recommendation', 'group')),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 17. 创建操作审计表 (audit_logs)
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INTEGER,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 18. 创建股票评论表 (stock_comments)
CREATE TABLE IF NOT EXISTS stock_comments (
    comment_id SERIAL PRIMARY KEY,
    stock_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id INTEGER,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES stock_comments(comment_id) ON DELETE SET NULL
);

-- === CREATE INDEXES 创建索引 === --

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 股票表索引
CREATE INDEX IF NOT EXISTS idx_stocks_stock_code ON stocks(stock_code);
CREATE INDEX IF NOT EXISTS idx_stocks_market_type ON stocks(market_type);
CREATE INDEX IF NOT EXISTS idx_stocks_industry ON stocks(industry);

-- 管理员用户表索引
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON admin_users(status);

-- 群组表索引
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_group_type ON groups(group_type);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);

-- 群成员表索引
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON group_members(role);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON group_members(status);

-- 自选股表索引
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_stock_id ON favorites(stock_id);
CREATE INDEX IF NOT EXISTS idx_favorites_added_at ON favorites(added_at);

-- 好友关系表索引
CREATE INDEX IF NOT EXISTS idx_friend_relationships_user_id ON friend_relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_relationships_friend_id ON friend_relationships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friend_relationships_status ON friend_relationships(status);
CREATE INDEX IF NOT EXISTS idx_friend_relationships_created_at ON friend_relationships(created_at);

-- 好友消息表索引
CREATE INDEX IF NOT EXISTS idx_friend_messages_sender_id ON friend_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_messages_receiver_id ON friend_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_messages_sent_at ON friend_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_friend_messages_message_type ON friend_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_friend_messages_is_read ON friend_messages(is_read);

-- 群消息表索引
CREATE INDEX IF NOT EXISTS idx_group_messages_group_id ON group_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_sender_id ON group_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_sent_at ON group_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_group_messages_message_type ON group_messages(message_type);

-- AI推荐表索引
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_stock_id ON ai_recommendations(stock_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_recommended_at ON ai_recommendations(recommended_at);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_confidence_score ON ai_recommendations(confidence_score);

-- 用户会话表索引
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_login_time ON user_sessions(login_time);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

-- 市场数据表索引
CREATE INDEX IF NOT EXISTS idx_market_data_stock_id ON market_data(stock_id);
CREATE INDEX IF NOT EXISTS idx_market_data_timestamp ON market_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_market_data_price ON market_data(price);

-- 管理员日志表索引
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target_user_id ON admin_logs(target_user_id);

-- 用户兴趣表索引
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_interest_type ON user_interests(interest_type);
CREATE INDEX IF NOT EXISTS idx_user_interests_interest_value ON user_interests(interest_value);

-- 系统通知表索引
CREATE INDEX IF NOT EXISTS idx_system_notifications_user_id ON system_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_notification_type ON system_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_system_notifications_is_read ON system_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_system_notifications_created_at ON system_notifications(created_at);

-- 审计日志表索引
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 股票评论表索引
CREATE INDEX IF NOT EXISTS idx_stock_comments_stock_id ON stock_comments(stock_id);
CREATE INDEX IF NOT EXISTS idx_stock_comments_user_id ON stock_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_comments_parent_id ON stock_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_stock_comments_created_at ON stock_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_comments_is_deleted ON stock_comments(is_deleted);

-- === MIGRATION HISTORY 迁移历史记录 === --

-- 记录迁移历史
INSERT INTO migration_history (version, name, description, applied_at)
VALUES ('20251215_000000', 'create_complete_schema', '创建完整的智能鑫AI系统数据库表结构，包含所有原始表和补充表', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO UPDATE SET
    applied_at = CURRENT_TIMESTAMP,
    description = EXCLUDED.description;

SELECT '✅ 完整数据库迁移执行完成!' as migration_result;
