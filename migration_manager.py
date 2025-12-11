#!/usr/bin/env python3
"""
智能鑫AI系统数据库迁移管理器
自动生成和管理数据库迁移脚本
"""

import os
import sys
from datetime import datetime

class MigrationManager:
    def __init__(self, db_connection=None):
        """初始化迁移管理器"""
        self.migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
        os.makedirs(self.migrations_dir, exist_ok=True)

    def create_migration(self, name=None):
        """创建新的迁移脚本"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        if not name:
            name = 'auto_migration'

        filename = f"{timestamp}_{name}.sql"
        filepath = os.path.join(self.migrations_dir, filename)

        migration_content = self._generate_migration_content()

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(migration_content)

        print(f"✅ 迁移脚本创建成功: {filename}")
        return filepath

    def _generate_migration_content(self):
        """生成迁移脚本内容"""
        return f"""-- 智能鑫AI系统数据库迁移脚本
-- 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- 描述: 创建完整的数据库表结构

-- == UPGRADE 升级操作 == --

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

-- == CREATE INDEXES 创建索引 == --

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
CREATE INDEX IF NOT EXISTS idx_user_sessions_login_time ON user_sessionslogin_time);
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

-- == DOWNGRADE 降级操作 == --

-- 以下注释部分为降级操作，需要时取消注释执行
/*
-- 删除顺序：先删除依赖表，再删除基础表
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS market_data CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS friend_messages CASCADE;
DROP TABLE IF EXISTS friend_relationships CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
*/

-- 迁移完成标记
INSERT INTO migration_history (version, name, applied_at) VALUES
('{datetime.now().strftime('%Y%m%d_%H%M%S')}', 'create_complete_schema', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO UPDATE SET applied_at = CURRENT_TIMESTAMP;

SELECT '✅ 数据库迁移完成！' as migration_status;
"""

    def create_downgrade_script(self):
        """创建降级脚本"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"downgrade_{timestamp}.sql"
        filepath = os.path.join(self.migrations_dir, filename)

        downgrade_content = """-- 智能鑫AI系统数据库降级脚本
-- 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- 警告: 此操作将删除所有表和数据，请谨慎使用！

-- == DOWNGRADE 降级操作 == --

-- 删除顺序：先删除依赖表，再删除基础表
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS market_data CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS friend_messages CASCADE;
DROP TABLE IF EXISTS friend_relationships CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 删除迁移历史记录
DROP TABLE IF EXISTS migration_history CASCADE;

SELECT '✅ 数据库降级完成！所有表已删除。' as downgrade_status;
"""

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(downgrade_content)

        print(f"✅ 降级脚本创建成功: {filename}")
        return filepath

    def create_migration_history_table(self):
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

def main():
    """主函数"""
    manager = MigrationManager()

    print("📊 智能鑫AI系统数据库迁移管理器")
    print("=" * 50)

    # 创建迁移历史表脚本
    print("1. 创建迁移历史表...")
    history_sql = manager.create_migration_history_table()

    # 创建主迁移脚本
    print("2. 创建主迁移脚本...")
    migration_file = manager.create_migration("create_complete_schema")

    # 创建降级脚本
    print("3. 创建降级脚本...")
    downgrade_file = manager.create_downgrade_script()

    print("\n🎉 迁移脚本创建完成!")
    print(f"📁 迁移目录: {manager.migrations_dir}")
    print(f"📄 主迁移脚本: {os.path.basename(migration_file)}")
    print(f"📄 降级脚本: {os.path.basename(downgrade_file)}")
    print("\n执行步骤:")
    print("1. 首先执行迁移历史表创建:")
    print("   docker exec -i postgres-container psql -U admin -d stockdb -c \"{history_sql}\"")
    print("2. 然后执行主迁移脚本:")
    print(f"   docker exec -i postgres-container psql -U admin -d stockdb -f /dev/stdin < \"{migration_file}\"")

if __name__ == "__main__":
    main()