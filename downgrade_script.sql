-- 智能鑫AI系统数据库降级脚本
-- 版本: 20241207_143000_downgrade
-- 生成时间: 2024-12-07 14:30:00
-- 警告: 此操作将删除所有表和数据，操作不可逆！

-- === DOWNGRADE 降级操作 === --

-- 1. 检查迁移历史记录
SELECT '开始数据库降级操作...' as operation_start;

-- 2. 按依赖顺序删除表
-- 注意：使用CASCADE级联删除依赖关系
DO $$
BEGIN
    -- 按照依赖关系反向顺序删除表
    DROP TABLE IF EXISTS admin_logs CASCADE;
    RAISE NOTICE '✅ admin_logs 表已删除';

    DROP TABLE IF EXISTS market_data CASCADE;
    RAISE NOTICE '✅ market_data 表已删除';

    DROP TABLE IF EXISTS user_sessions CASCADE;
    RAISE NOTICE '✅ user_sessions 表已删除';

    DROP TABLE IF EXISTS ai_recommendations CASCADE;
    RAISE NOTICE '✅ ai_recommendations 表已删除';

    DROP TABLE IF EXISTS friend_messages CASCADE;
    RAISE NOTICE '✅ friend_messages 表已删除';

    DROP TABLE IF EXISTS friend_relationships CASCADE;
    RAISE NOTICE '✅ friend_relationships 表已删除';

    DROP TABLE IF EXISTS favorites CASCADE;
    RAISE NOTICE '✅ favorites 表已删除';

    DROP TABLE IF EXISTS stocks CASCADE;
    RAISE NOTICE '✅ stocks 表已删除';

    DROP TABLE IF EXISTS users CASCADE;
    RAISE NOTICE '✅ users 表已删除';

    -- 最后删除迁移历史表
    DROP TABLE IF EXISTS migration_history CASCADE;
    RAISE NOTICE '✅ migration_history 表已删除';
END
$$;

-- 3. 验证降级结果
WITH table_count AS (
    SELECT COUNT(*) as remaining_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'users', 'stocks', 'favorites', 'friend_relationships',
        'friend_messages', 'ai_recommendations', 'user_sessions',
        'market_data', 'admin_logs', 'migration_history'
    )
)
SELECT
    CASE
        WHEN remaining_tables = 0 THEN '🎉 降级完成: 所有表已成功删除'
        ELSE '⚠️ 降级不完整: 仍有 ' || remaining_tables || ' 个表存在'
    END as downgrade_status
FROM table_count;

-- 4. 显示剩余表信息
SELECT
    '剩余表清单:' as remaining_tables_title,
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;