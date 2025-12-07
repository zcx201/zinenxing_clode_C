-- 智能鑫AI系统数据库表结构创建脚本
-- 创建时间: 2024-12-07
-- 数据库: stockdb

-- 1. 创建用户表 (users)
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

COMMENT ON TABLE users IS '用户基本信息表，存储系统用户的核心信息';
COMMENT ON COLUMN users.user_id IS '用户唯一标识，主键';
COMMENT ON COLUMN users.username IS '用户名，唯一约束';
COMMENT ON COLUMN users.email IS '用户邮箱，唯一约束';
COMMENT ON COLUMN users.password_hash IS '密码哈希值';
COMMENT ON COLUMN users.phone IS '手机号码';
COMMENT ON COLUMN users.avatar IS '用户头像标识';
COMMENT ON COLUMN users.status IS '用户状态: active-活跃, inactive-非活跃, banned-禁用';
COMMENT ON COLUMN users.created_at IS '注册时间';
COMMENT ON COLUMN users.last_login IS '最后登录时间';

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- 2. 创建股票信息表 (stocks)
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

COMMENT ON TABLE stocks IS '股票基础信息表，存储所有股票的基础数据';
COMMENT ON COLUMN stocks.stock_id IS '股票唯一标识，主键';
COMMENT ON COLUMN stocks.stock_code IS '股票代码，唯一约束';
COMMENT ON COLUMN stocks.stock_name IS '股票名称';
COMMENT ON COLUMN stocks.market_type IS '市场类型：A股/港股/美股等';
COMMENT ON COLUMN stocks.industry IS '所属行业';
COMMENT ON COLUMN stocks.listing_date IS '上市日期';
COMMENT ON COLUMN stocks.is_active IS '是否活跃交易';
COMMENT ON COLUMN stocks.created_at IS '创建时间';

CREATE INDEX idx_stocks_stock_code ON stocks(stock_code);
CREATE INDEX idx_stocks_market_type ON stocks(market_type);
CREATE INDEX idx_stocks_industry ON stocks(industry);

-- 3. 创建自选股表 (favorites)
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

COMMENT ON TABLE favorites IS '用户自选股关联表，记录用户关注的股票';
COMMENT ON COLUMN favorites.favorite_id IS '自选股记录唯一标识，主键';
COMMENT ON COLUMN favorites.user_id IS '用户ID，外键关联users表';
COMMENT ON COLUMN favorites.stock_id IS '股票ID，外键关联stocks表';
COMMENT ON COLUMN favorites.added_at IS '添加时间';
COMMENT ON COLUMN favorites.notes IS '用户自选备注';
COMMENT ON COLUMN favorites.alert_price IS '价格提醒设置';
COMMENT ON CONSTRAINT favorites_user_id_stock_id_key ON favorites IS '同一用户不能重复添加同一只股票';

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_stock_id ON favorites(stock_id);
CREATE INDEX idx_favorites_added_at ON favorites(added_at);

-- 4. 创建好友关系表 (friend_relationships)
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

COMMENT ON TABLE friend_relationships IS '好友关系表，管理用户之间的好友关系';
COMMENT ON COLUMN friend_relationships.relationship_id IS '好友关系唯一标识，主键';
COMMENT ON COLUMN friend_relationships.user_id IS '发起方用户ID，外键关联users表';
COMMENT ON COLUMN friend_relationships.friend_id IS '好友用户ID，外键关联users表';
COMMENT ON COLUMN friend_relationships.status IS '关系状态: pending-待处理, accepted-已接受, blocked-已拉黑';
COMMENT ON COLUMN friend_relationships.created_at IS '关系建立时间';
COMMENT ON COLUMN friend_relationships.accepted_at IS '关系接受时间';
COMMENT ON CONSTRAINT friend_relationships_user_id_friend_id_key ON friend_relationships IS '防止重复的好友关系';

CREATE INDEX idx_friend_relationships_user_id ON friend_relationships(user_id);
CREATE INDEX idx_friend_relationships_friend_id ON friend_relationships(friend_id);
CREATE INDEX idx_friend_relationships_status ON friend_relationships(status);
CREATE INDEX idx_friend_relationships_created_at ON friend_relationships(created_at);

-- 5. 创建聊天消息表 (friend_messages)
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

COMMENT ON TABLE friend_messages IS '好友聊天消息表，存储用户之间的聊天记录';
COMMENT ON COLUMN friend_messages.message_id IS '消息唯一标识，主键';
COMMENT ON COLUMN friend_messages.sender_id IS '发送者用户ID，外键关联users表';
COMMENT ON COLUMN friend_messages.receiver_id IS '接收者用户ID，外键关联users表';
COMMENT ON COLUMN friend_messages.content IS '消息内容';
COMMENT ON COLUMN friend_messages.message_type IS '消息类型: text-文本, stock_card-股票卡片, image-图片';
COMMENT ON COLUMN friend_messages.stock_reference IS '股票引用，外键关联stocks表（股票卡片消息使用）';
COMMENT ON COLUMN friend_messages.sent_at IS '发送时间';
COMMENT ON COLUMN friend_messages.is_read IS '是否已读';

CREATE INDEX idx_friend_messages_sender_id ON friend_messages(sender_id);
CREATE INDEX idx_friend_messages_receiver_id ON friend_messages(receiver_id);
CREATE INDEX idx_friend_messages_sent_at ON friend_messages(sent_at);
CREATE INDEX idx_friend_messages_message_type ON friend_messages(message_type);
CREATE INDEX idx_friend_messages_is_read ON friend_messages(is_read);

-- 6. 创建AI推荐记录表 (ai_recommendations)
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

COMMENT ON TABLE ai_recommendations IS 'AI推荐记录表，存储AI对用户的股票推荐历史';
COMMENT ON COLUMN ai_recommendations.recommendation_id IS '推荐记录唯一标识，主键';
COMMENT ON COLUMN ai_recommendations.user_id IS '目标用户ID，外键关联users表';
COMMENT ON COLUMN ai_recommendations.stock_id IS '推荐股票ID，外键关联stocks表';
COMMENT ON COLUMN ai_recommendations.confidence_score IS 'AI置信度评分(0-100)';
COMMENT ON COLUMN ai_recommendations.reasoning IS 'AI分析理由';
COMMENT ON COLUMN ai_recommendations.recommended_at IS '推荐时间';
COMMENT ON COLUMN ai_recommendations.user_feedback IS '用户反馈: positive-积极, negative-消极';

CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_stock_id ON ai_recommendations(stock_id);
CREATE INDEX idx_ai_recommendations_recommended_at ON ai_recommendations(recommended_at);
CREATE INDEX idx_ai_recommendations_confidence_score ON ai_recommendations(confidence_score);

-- 7. 创建用户登录会话表 (user_sessions)
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

COMMENT ON TABLE user_sessions IS '用户登录会话表，管理用户登录状态和会话信息';
COMMENT ON COLUMN user_sessions.session_id IS '会话唯一标识，主键';
COMMENT ON COLUMN user_sessions.user_id IS '用户ID，外键关联users表';
COMMENT ON COLUMN user_sessions.session_token IS '会话令牌，唯一约束';
COMMENT ON COLUMN user_sessions.login_time IS '登录时间';
COMMENT ON COLUMN user_sessions.last_activity IS '最后活跃时间';
COMMENT ON COLUMN user_sessions.ip_address IS '登录IP地址';
COMMENT ON COLUMN user_sessions.device_info IS '设备信息';

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_login_time ON user_sessions(login_time);
CREATE INDEX idx_user_sessions_last_activity ON user_sessions(last_activity);

-- 8. 创建市场行情数据表 (market_data)
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

COMMENT ON TABLE market_data IS '市场行情数据表，存储股票实时和历史价格数据';
COMMENT ON COLUMN market_data.data_id IS '行情数据唯一标识，主键';
COMMENT ON COLUMN market_data.stock_id IS '股票ID，外键关联stocks表';
COMMENT ON COLUMN market_data.price IS '当前价格';
COMMENT ON COLUMN market_data.change_percent IS '涨跌幅百分比';
COMMENT ON COLUMN market_data.change_amount IS '涨跌金额';
COMMENT ON COLUMN market_data.volume IS '成交量';
COMMENT ON COLUMN market_data.timestamp IS '数据时间戳';

CREATE INDEX idx_market_data_stock_id ON market_data(stock_id);
CREATE INDEX idx_market_data_timestamp ON market_data(timestamp);
CREATE INDEX idx_market_data_price ON market_data(price);

-- 9. 创建管理员操作日志表 (admin_logs)
CREATE TABLE IF NOT EXISTS admin_logs (
    log_id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_user_id INTEGER,
    details TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

COMMENT ON TABLE admin_logs IS '管理员操作日志表，记录系统管理员的操作行为用于审计';
COMMENT ON COLUMN admin_logs.log_id IS '日志记录唯一标识，主键';
COMMENT ON COLUMN admin_logs.admin_id IS '管理员标识';
COMMENT ON COLUMN admin_logs.action_type IS '操作类型';
COMMENT ON COLUMN admin_logs.target_user_id IS '目标用户ID，外键关联users表';
COMMENT ON COLUMN admin_logs.details IS '操作详情';
COMMENT ON COLUMN admin_logs.ip_address IS '操作IP地址';
COMMENT ON COLUMN admin_logs.created_at IS '操作时间';

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action_type ON admin_logs(action_type);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX idx_admin_logs_target_user_id ON admin_logs(target_user_id);

-- 创建完成后显示表信息
SELECT '数据库表结构创建完成！' as result;