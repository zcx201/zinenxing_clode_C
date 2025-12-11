-- 智能鑫AI系统数据库迁移状态检查和脚本生成
-- 生成时间: 2024-12-07 14:30:00

-- === 1. 检查当前数据库状态 === --
WITH table_check AS (
    SELECT
        table_name,
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tc.table_name) as exists_flag
    FROM (VALUES
        ('users'),
        ('stocks'),
        ('favorites'),
        ('friend_relationships'),
        ('friend_messages'),
        ('ai_recommendations'),
        ('user_sessions'),
        ('market_data'),
        ('admin_logs'),
        ('migration_history')
    ) AS tc(table_name)
),
status_summary AS (
    SELECT
        COUNT(*) as total_tables,
        SUM(CASE WHEN exists_flag THEN 1 ELSE 0 END) as existing_tables,
        SUM(CASE WHEN NOT exists_flag THEN 1 ELSE 0 END) as missing_tables
    FROM table_check
)
SELECT
    '📊 数据库状态报告' as report_title,
    total_tables,
    existing_tables,
    missing_tables,
    CASE
        WHEN missing_tables = 0 THEN '✅ 数据库结构完整，无需迁移'
        WHEN missing_tables = total_tables THEN '🔧 数据库为空，需要完整初始迁移'
        ELSE '⚠️ 数据库不完整，需要增量迁移'
    END as migration_needed
FROM status_summary;

-- === 2. 显示表详细信息 === --
SELECT '\n📋 表详情:' as table_details_title;
SELECT
    table_name,
    CASE
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tc.table_name)
        THEN '✅ 已存在'
        ELSE '❌ 缺失'
    END as status
FROM (VALUES
    ('users'),
    ('stocks'),
    ('favorites'),
    ('friend_relationships'),
    ('friend_messages'),
    ('ai_recommendations'),
    ('user_sessions'),
    ('market_data'),
    ('admin_logs'),
    ('migration_history')
) AS tc(table_name)
ORDER BY status, table_name;

-- === 3. 生成降级脚本（仅供参考） === --
SELECT '\n⚠️ DOWNGRADE降级脚本（危险操作 - 仅供参考）:' as downgrade_title;
SELECT '-- 降级操作（按依赖顺序删除表）' as downgrade_note;
SELECT 'DROP TABLE IF EXISTS ' || table_name || ' CASCADE;' as downgrade_sql
FROM (
    VALUES
        ('admin_logs'),
        ('market_data'),
        ('user_sessions'),
        ('ai_recommendations'),
        ('friend_messages'),
        ('friend_relationships'),
        ('favorites'),
        ('stocks'),
        ('users'),
        ('migration_history')
) AS t(table_name);

-- === 4. 生成升级脚本（根据缺失表动态生成） === --
SELECT '\n🔧 UPGRADE升级脚本（根据当前状态生成）:' as upgrade_title;

-- migration_history表创建
SELECT '-- 创建迁移历史记录表' as upgrade_note;
SELECT 'CREATE TABLE IF NOT EXISTS migration_history (' as upgrade_sql
UNION ALL SELECT '    id SERIAL PRIMARY KEY,'
UNION ALL SELECT '    version VARCHAR(50) UNIQUE NOT NULL,'
UNION ALL SELECT '    name VARCHAR(255) NOT NULL,'
UNION ALL SELECT '    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
UNION ALL SELECT '    description TEXT'
UNION ALL SELECT ');';

-- 其他表的创建脚本（仅为示例，完整脚本见完整迁移文件）
SELECT '\n-- 其他表创建脚本请参考 create_tables.sql 文件' as upgrade_reference;