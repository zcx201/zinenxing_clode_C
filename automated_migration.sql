-- 智能鑫AI系统自动化数据库迁移脚本
-- 生成时间: 20241207_143000
-- 描述: 智能检测并执行数据库迁移

-- === 迁移前置检查 === --
DO $$
BEGIN
    -- 检查迁移历史表是否存在
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_history') THEN
        -- 创建迁移历史记录表
        CREATE TABLE migration_history (
            id SERIAL PRIMARY KEY,
            version VARCHAR(50) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            description TEXT
        );

        RAISE NOTICE '✅ 迁移历史记录表创建完成';
    END IF;

    -- 记录本次迁移
    INSERT INTO migration_history (version, name, description)
    VALUES ('20241207_143000', 'automated_migration', '自动化数据库迁移：检查并创建缺失的表和索引')
    ON CONFLICT (version) DO UPDATE SET applied_at = CURRENT_TIMESTAMP;
END
$$;

-- === DOWNGRADE检查模式：生成降级脚本参考 === --
-- 如果需要进行降级操作，可以执行以下命令（危险操作，请谨慎使用）：
/*
-- 删除顺序：先删除依赖表，再删除基础表
DROP TABLE IF EXISTS migration_history CASCADE;
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

-- === UPGRADE升级操作：智能检测并创建缺失的表 === --

-- 1. 用户表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
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
        RAISE NOTICE '✅ 用户表创建完成';
    END IF;
END
$$;

-- 2. 股票信息表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name GROUP_BY 'stocks') THEN
        CREATE TABLE stocks (
            stock_id SERIAL PRIMARY KEY,
            stock_code VARCHAR(20) UNIQUE NOT NULL,
            stock_name VARCHAR(100) NOT NULL,
            market_type VARCHAR(20) DEFAULT 'A股',
            industry VARCHAR(50),
            listing_date DATE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        RAISE NOTICE '✅ 股票信息表创建完成';
    END IF;
END
$$;

-- 3. 自选股表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favorites') THEN
        CREATE TABLE favorites (
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
        RAISE NOTICE '✅ 自选股表创建完成';
    END IF;
END
$$;

-- 4. 好友关系表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'friend_relationships') THEN
        CREATE TABLE friend_relationships (
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
        RAISE NOTICE '✅ 好友关系表创建完成';
    END IF;
END
$$;

-- 5. 聊天消息表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'friend_messages') THEN
        CREATE TABLE friend_messages (
            message_id SERIAL PRIMARY KEY,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'stock_card', 'image')),
ement stock_reference INTEGER,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT FALSE,
            CHECK (sender_id != receiver_id),
            FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (stock_reference) REFERENCES stocks(stock_id) ON DELETE SET NULL
        );
        RAISE NOTICE '✅ 聊天消息表创建完成';
    END IF;
END
$$;

-- 6. AI推荐记录表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_recommendations') THEN
        CREATE TABLE ai_recommendations (
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
        RAISE NOTICE '✅ AI推荐记录表创建完成';
    END IF;
END
$$;

-- 7. 用户登录会话表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        CREATE TABLE user_sessions (
            session_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            session_token VARCHAR(255) UNIQUE NOT NULL,
            login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address INET,
            device_info TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
        RAISE NOTICE '✅ 用户登录会话表创建完成';
    END IF;
END
$$;

-- 8. 市场行情数据表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'market_data') THEN
        CREATE TABLE market_data (
            data_id SERIAL PRIMARY KEY,
            stock_id INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            change_percent DECIMAL(5,2),
            change_amount DECIMAL(10,2),
            volume BIGINT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
        );
        RAISE NOTICE '✅ 市场行情数据表创建完成';
    END IF;
END
$$;

-- 9. 管理员操作日志表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_logs') THEN
        CREATE TABLE admin_logs (
            log_id SERIAL PRIMARY KEY,
            admin_id VARCHAR(50) NOT NULL,
            action_type VARCHAR(50) NOT NULL,
            target_user_id INTEGER,
            details TEXT,
            ip_address INET,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE SET NULL
        );
        RAISE NOTICE '✅ 管理员操作日志表创建完成';
    END IF;
END
$$;

-- === 创建索引（如果需要） === --

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 股票表索引
CREATE INDEX IF NOT EXISTS idx_stocks_stock_code ON stocks(stock_code);
CREATE INDEX IF NOT EXISTS idx_stocks_market_type ON stocks(market_type);
CREATE INDEX IF NOT EXISTS idx_stocks_industry ON stocks(industry);

-- 其他表的索引...

-- === 迁移状态报告 === --
SELECT
    '📊 数据库迁移状态报告' as report_title,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
    EXISTS(SELECT 1 FROM migration_history WHERE version = '20241207_143000') as migration_applied;

SELECT '✅ 智能鑫AI系统数据库迁移执行完成！' as migration_result;