#!/usr/bin/env python3
"""
智能鑫AI系统数据库迁移执行器
"""

import os
from datetime import datetime

class MigrationRunner:
    def __init__(self):
        self.migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
        os.makedirs(self.migrations_dir, exist_ok=True)

    def create_migration_history(self):
        """创建迁移历史记录表"""
        sql = """
CREATE TABLE IF NOT EXISTS migration_history (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

COMMENT ON TABLE migration_history IS '数据库迁移历史记录表';
COMMENT ON COLUMN migration_history.version IS '迁移版本号';
COMMENT ON COLUMN migration_history.name IS '迁移名称';
COMMENT ON COLUMN migration_history.applied_at IS '应用时间';
COMMENT ON COLUMN migration_history.description IS '迁移描述';
"""
        return sql

    def generate_migration_sql(self):
        """生成完整的数据库创建SQL"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        sql_content = f"""-- 智能鑫AI系统数据库迁移脚本
-- 版本: {timestamp}
-- 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- 描述: 创建完整的数据库表结构

-- === UPGRADE 升级操作 === --

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

-- === CREATE INDEXES 创建索引 === --

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 股票表索引
CREATE INDEX IF NOT EXISTS idx_stocks_stock_code ON stocks(stock_code);
CREATE INDEX IF NOT EXISTS idx_stocks_market_type ON stocks(market_type);
CREATE INDEX IF NOT EXISTS idx_stocks_industry ON stocks(industry);

-- 自选股表索引
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_stock_id ON favorites(stock_id);
CREATE INDEX IF NOT EXISTS idx_favorites_added_at ON favorites(added_at);

-- 好友关系表索引
CREATE INDEX IF NOT EXISTS idx_friend_relationships_user_id ON friend_relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_relationships_friend_id ON friend_relationships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friend_relationships_status ON friend_relationships(status);
CREATE INDEX IF NOT EXISTS idx_friend_relationships_created_at ON friend_relationships(created_at);

-- 聊天消息表索引
CREATE INDEX IF NOT EXISTS idx_friend_messages_sender_id ON friend_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_messages_receiver_id ON friend_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_messages_sent_at ON friend_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_friend_messages_message_type ON friend_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_friend_messages_is_read ON friend_messages(is_read);

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

-- === MIGRATION HISTORY 迁移历史记录 === --

-- 记录迁移历史
INSERT INTO migration_history (version, name, description, applied_at)
VALUES ('{timestamp}', 'create_complete_schema', '创建完整的智能鑫AI系统数据库表结构', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO UPDATE SET
    applied_at = CURRENT_TIMESTAMP,
    description = EXCLUDED.description;

SELECT '✅ 数据库迁移执行完成!' as migration_result;
"""
        return sql_content

    def run_migration(self):
        """执行迁移"""
        print("🚀 开始执行数据库迁移...")

        # 创建迁移历史表
        print("📊 创建迁移历史记录表...")
        history_sql = self.create_migration_history()

        # 生成主迁移SQL
        print("🔧 生成主迁移脚本...")
        migration_sql = self.generate_migration_sql()

        # 组合完整的SQL
        complete_sql = history_sql + "\n" + migration_sql

        # 保存SQL文件
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        sql_filename = f"migration_{timestamp}.sql"
        sql_filepath = os.path.join(self.migrations_dir, sql_filename)

        with open(sql_filepath, 'w', encoding='utf-8') as f:
            f.write(complete_sql)

        print(f"📄 迁移脚本已保存: {sql_filepath}")

        # 执行迁移
        print("⚡ 执行数据库迁移...")

        docker_cmd = f'docker exec -i postgres-container psql -U admin -d stockdb -f /dev/stdin < "{sql_filepath}"'
        print(f"📋 执行命令: {docker_cmd}")

        # 在实际环境中，这里会执行命令
        # os.system(docker_cmd)

        print("✅ 迁移脚本生成完成!")
        print(f"📁 迁移文件位置: {sql_filepath}")
        print("\n💡 请手动执行以下命令应用迁移:")
        print(f'docker exec -i postgres-container psql -U admin -d stockdb -f /dev/stdin < "{sql_filepath}"')

        return sql_filepath

if __name__ == "__main__":
    runner = MigrationRunner()
    runner.run_migration()