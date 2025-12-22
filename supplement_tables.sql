-- 智能鑫AI系统数据库表结构补充脚本
-- 创建时间: 2025-12-14
-- 数据库: stockdb

-- 1. 创建管理员用户表 (admin_users)
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

COMMENT ON TABLE admin_users IS '管理员用户表，存储系统管理员的核心信息';
COMMENT ON COLUMN admin_users.admin_id IS '管理员唯一标识，主键';
COMMENT ON COLUMN admin_users.username IS '管理员用户名，唯一约束';
COMMENT ON COLUMN admin_users.password_hash IS '管理员密码哈希值';
COMMENT ON COLUMN admin_users.email IS '管理员邮箱，唯一约束';
COMMENT ON COLUMN admin_users.role IS '管理员角色: super_admin-超级管理员, admin-管理员, moderator-版主';
COMMENT ON COLUMN admin_users.status IS '管理员状态: active-活跃, inactive-非活跃, suspended-暂停';
COMMENT ON COLUMN admin_users.created_at IS '创建时间';
COMMENT ON COLUMN admin_users.last_login IS '最后登录时间';

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_status ON admin_users(status);

-- 2. 创建群组表 (groups)
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

COMMENT ON TABLE groups IS '群组表，存储系统内的群组信息';
COMMENT ON COLUMN groups.group_id IS '群组唯一标识，主键';
COMMENT ON COLUMN groups.group_name IS '群组名称';
COMMENT ON COLUMN groups.group_type IS '群组类型: public-公开, private-私有';
COMMENT ON COLUMN groups.creator_id IS '创建者用户ID，外键关联users表';
COMMENT ON COLUMN groups.avatar IS '群组头像标识';
COMMENT ON COLUMN groups.description IS '群组描述';
COMMENT ON COLUMN groups.status IS '群组状态: active-活跃, disbanded-解散';
COMMENT ON COLUMN groups.created_at IS '创建时间';

CREATE INDEX idx_groups_creator_id ON groups(creator_id);
CREATE INDEX idx_groups_group_type ON groups(group_type);
CREATE INDEX idx_groups_status ON groups(status);

-- 3. 创建群成员表 (group_members)
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

COMMENT ON TABLE group_members IS '群成员表，管理群组成员关系';
COMMENT ON COLUMN group_members.group_member_id IS '群成员关系唯一标识，主键';
COMMENT ON COLUMN group_members.group_id IS '群组ID，外键关联groups表';
COMMENT ON COLUMN group_members.user_id IS '用户ID，外键关联users表';
COMMENT ON COLUMN group_members.role IS '群内角色: owner-群主, admin-管理员, member-成员';
COMMENT ON COLUMN group_members.status IS '成员状态: active-活跃, inactive-非活跃';
COMMENT ON COLUMN group_members.joined_at IS '加入时间';
COMMENT ON CONSTRAINT group_members_group_id_user_id_key ON group_members IS '防止重复的群成员关系';

CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(role);
CREATE INDEX idx_group_members_status ON group_members(status);

-- 4. 创建群消息表 (group_messages)
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

COMMENT ON TABLE group_messages IS '群聊消息表，存储群聊记录';
COMMENT ON COLUMN group_messages.message_id IS '消息唯一标识，主键';
COMMENT ON COLUMN group_messages.group_id IS '所属群组ID，外键关联groups表';
COMMENT ON COLUMN group_messages.sender_id IS '发送者用户ID，外键关联users表';
COMMENT ON COLUMN group_messages.content IS '消息内容';
COMMENT ON COLUMN group_messages.message_type IS '消息类型: text-文本, stock_card-股票卡片, image-图片';
COMMENT ON COLUMN group_messages.stock_reference IS '股票引用，外键关联stocks表（股票卡片消息使用）';
COMMENT ON COLUMN group_messages.sent_at IS '发送时间';

CREATE INDEX idx_group_messages_group_id ON group_messages(group_id);
CREATE INDEX idx_group_messages_sender_id ON group_messages(sender_id);
CREATE INDEX idx_group_messages_sent_at ON group_messages(sent_at);
CREATE INDEX idx_group_messages_message_type ON group_messages(message_type);

-- 5. 创建用户兴趣标签表 (user_interests)
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

COMMENT ON TABLE user_interests IS '用户兴趣标签表，存储用户的投资偏好';
COMMENT ON COLUMN user_interests.interest_id IS '兴趣标签唯一标识，主键';
COMMENT ON COLUMN user_interests.user_id IS '用户ID，外键关联users表';
COMMENT ON COLUMN user_interests.interest_type IS '兴趣类型: industry-行业, concept-概念, style-风格';
COMMENT ON COLUMN user_interests.interest_value IS '具体兴趣值，如AI、新能源、价值投资等';
COMMENT ON COLUMN user_interests.weight IS '兴趣权重，0-100';
COMMENT ON COLUMN user_interests.updated_at IS '更新时间';
COMMENT ON CONSTRAINT user_interests_user_id_interest_type_interest_value_key ON user_interests IS '防止同一用户同一类型的重复兴趣标签';

CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_interest_type ON user_interests(interest_type);
CREATE INDEX idx_user_interests_interest_value ON user_interests(interest_value);

-- 6. 创建系统通知表 (system_notifications)
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

COMMENT ON TABLE system_notifications IS '系统通知表，存储系统向用户发送的通知';
COMMENT ON COLUMN system_notifications.notification_id IS '通知唯一标识，主键';
COMMENT ON COLUMN system_notifications.user_id IS '接收用户ID，外键关联users表';
COMMENT ON COLUMN system_notifications.notification_type IS '通知类型: system-系统通知, friend-好友通知, stock-股票通知, ai_recommendation-AI推荐, group-群组通知';
COMMENT ON COLUMN system_notifications.title IS '通知标题';
COMMENT ON COLUMN system_notifications.content IS '通知内容';
COMMENT ON COLUMN system_notifications.is_read IS '是否已读';
COMMENT ON COLUMN system_notifications.created_at IS '创建时间';
COMMENT ON COLUMN system_notifications.read_at IS '阅读时间';

CREATE INDEX idx_system_notifications_user_id ON system_notifications(user_id);
CREATE INDEX idx_system_notifications_notification_type ON system_notifications(notification_type);
CREATE INDEX idx_system_notifications_is_read ON system_notifications(is_read);
CREATE INDEX idx_system_notifications_created_at ON system_notifications(created_at);

-- 7. 创建操作审计表 (audit_logs)
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

COMMENT ON TABLE audit_logs IS '操作审计表，记录所有用户的重要操作';
COMMENT ON COLUMN audit_logs.audit_id IS '审计记录唯一标识，主键';
COMMENT ON COLUMN audit_logs.user_id IS '操作用户ID，外键关联users表';
COMMENT ON COLUMN audit_logs.action_type IS '操作类型: login-登录, logout-登出, create-创建, update-更新, delete-删除等';
COMMENT ON COLUMN audit_logs.resource_type IS '资源类型: user-用户, stock-股票, friend-好友, group-群组等';
COMMENT ON COLUMN audit_logs.resource_id IS '具体资源ID';
COMMENT ON COLUMN audit_logs.details IS '操作详情';
COMMENT ON COLUMN audit_logs.ip_address IS '操作IP地址';
COMMENT ON COLUMN audit_logs.user_agent IS '用户代理信息';
COMMENT ON COLUMN audit_logs.created_at IS '操作时间';

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- 8. 创建股票评论表 (stock_comments)
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

COMMENT ON TABLE stock_comments IS '股票评论表，存储用户对股票的评论';
COMMENT ON COLUMN stock_comments.comment_id IS '评论唯一标识，主键';
COMMENT ON COLUMN stock_comments.stock_id IS '股票ID，外键关联stocks表';
COMMENT ON COLUMN stock_comments.user_id IS '评论用户ID，外键关联users表';
COMMENT ON COLUMN stock_comments.parent_id IS '父评论ID，外键关联stock_comments表（支持回复功能）';
COMMENT ON COLUMN stock_comments.content IS '评论内容';
COMMENT ON COLUMN stock_comments.likes_count IS '点赞数';
COMMENT ON COLUMN stock_comments.is_deleted IS '是否软删除';
COMMENT ON COLUMN stock_comments.created_at IS '创建时间';
COMMENT ON COLUMN stock_comments.updated_at IS '更新时间';

CREATE INDEX idx_stock_comments_stock_id ON stock_comments(stock_id);
CREATE INDEX idx_stock_comments_user_id ON stock_comments(user_id);
CREATE INDEX idx_stock_comments_parent_id ON stock_comments(parent_id);
CREATE INDEX idx_stock_comments_created_at ON stock_comments(created_at);
CREATE INDEX idx_stock_comments_is_deleted ON stock_comments(is_deleted);

-- 更新admin_logs表，添加外键关联到admin_users表
ALTER TABLE IF EXISTS admin_logs
ADD COLUMN IF NOT EXISTS admin_id INTEGER;

ALTER TABLE IF EXISTS admin_logs
ADD CONSTRAINT fk_admin_logs_admin_id
FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id) ON DELETE SET NULL;

COMMENT ON COLUMN admin_logs.admin_id IS '关联的管理员ID，外键关联admin_users表';

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);

-- 创建完成后显示表信息
SELECT '补充数据库表结构创建完成！' as result;