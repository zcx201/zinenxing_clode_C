// 智能鑫AI系统模拟数据
// 用于前端开发和测试

// 生成当前时间的ISO字符串
const now = () => new Date().toISOString();

// 生成指定天数前的ISO字符串
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

// 模拟用户数据
export const mockUsers = [
  {
    user_id: 1,
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    password_hash: 'password123',
    phone: '13800138001',
    avatar: 'user1',
    status: 'active',
    created_at: daysAgo(30),
    last_login: now()
  },
  {
    user_id: 2,
    username: 'lisi',
    email: 'lisi@example.com',
    password_hash: 'password123',
    phone: '13800138002',
    avatar: 'user2',
    status: 'active',
    created_at: daysAgo(25),
    last_login: now()
  },
  {
    user_id: 3,
    username: 'wangwu',
    email: 'wangwu@example.com',
    password_hash: 'password123',
    phone: '13800138003',
    avatar: 'user3',
    status: 'active',
    created_at: daysAgo(20),
    last_login: now()
  },
  {
    user_id: 4,
    username: 'zhaoliu',
    email: 'zhaoliu@example.com',
    password_hash: 'password123',
    phone: '13800138004',
    avatar: 'user4',
    status: 'active',
    created_at: daysAgo(15),
    last_login: daysAgo(1)
  },
  {
    user_id: 5,
    username: 'sunqi',
    email: 'sunqi@example.com',
    password_hash: 'password123',
    phone: '13800138005',
    avatar: 'user5',
    status: 'active',
    created_at: daysAgo(10),
    last_login: daysAgo(2)
  },
  {
    user_id: 6,
    username: 'zhouba',
    email: 'zhouba@example.com',
    password_hash: 'password123',
    phone: '13800138006',
    avatar: 'user6',
    status: 'active',
    created_at: daysAgo(5),
    last_login: daysAgo(3)
  },
  {
    user_id: 7,
    username: 'wujin',
    email: 'wujin@example.com',
    password_hash: 'password123',
    phone: '13800138007',
    avatar: 'user7',
    status: 'active',
    created_at: daysAgo(3),
    last_login: daysAgo(4)
  },
  {
    user_id: 8,
    username: 'zhengshi',
    email: 'zhengshi@example.com',
    password_hash: 'password123',
    phone: '13800138008',
    avatar: 'user8',
    status: 'active',
    created_at: daysAgo(2),
    last_login: daysAgo(5)
  },
  {
    user_id: 9,
    username: 'wangshi',
    email: 'wangshi@example.com',
    password_hash: 'password123',
    phone: '13800138009',
    avatar: 'user9',
    status: 'active',
    created_at: daysAgo(1),
    last_login: daysAgo(6)
  },
  {
    user_id: 10,
    username: 'chenshi',
    email: 'chenshi@example.com',
    password_hash: 'password123',
    phone: '13800138010',
    avatar: 'user10',
    status: 'active',
    created_at: now(),
    last_login: now()
  }
];

// 模拟管理员用户数据
export const mockAdminUsers = [
  {
    admin_id: 1,
    username: 'admin',
    email: 'admin@smartxin.com',
    password_hash: 'admin123',
    role: 'super_admin',
    status: 'active',
    created_at: daysAgo(30),
    last_login: now()
  },
  {
    admin_id: 2,
    username: 'moderator',
    email: 'moderator@smartxin.com',
    password_hash: 'moderator123',
    role: 'moderator',
    status: 'active',
    created_at: daysAgo(20),
    last_login: daysAgo(1)
  }
];

// 模拟股票数据
export const mockStocks = [
  {
    stock_id: 1,
    stock_code: '000001',
    stock_name: '平安银行',
    market_type: 'A股',
    industry: '银行',
    listing_date: '1991-04-03',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 2,
    stock_code: '000002',
    stock_name: '万科A',
    market_type: 'A股',
    industry: '房地产',
    listing_date: '1991-01-29',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 3,
    stock_code: '600000',
    stock_name: '浦发银行',
    market_type: 'A股',
    industry: '银行',
    listing_date: '1999-11-10',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 4,
    stock_code: '600001',
    stock_name: '邯郸钢铁',
    market_type: 'A股',
    industry: '钢铁',
    listing_date: '1998-01-22',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 5,
    stock_code: '600004',
    stock_name: '白云机场',
    market_type: 'A股',
    industry: '交通运输',
    listing_date: '2003-04-28',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 6,
    stock_code: '000063',
    stock_name: '中兴通讯',
    market_type: 'A股',
    industry: '通信设备',
    listing_date: '1997-11-18',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 7,
    stock_code: '000157',
    stock_name: '中联重科',
    market_type: 'A股',
    industry: '工程机械',
    listing_date: '2000-10-12',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 8,
    stock_code: '600036',
    stock_name: '招商银行',
    market_type: 'A股',
    industry: '银行',
    listing_date: '2002-04-09',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 9,
    stock_code: '600031',
    stock_name: '三一重工',
    market_type: 'A股',
    industry: '工程机械',
    listing_date: '2003-07-03',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 10,
    stock_code: '600030',
    stock_name: '中信证券',
    market_type: 'A股',
    industry: '证券',
    listing_date: '2003-01-06',
    is_active: true,
    created_at: daysAgo(30)
  }
  ,
  {
    stock_id: 11,
    stock_code: '300750',
    stock_name: '宁德时代',
    market_type: 'A股',
    industry: '新能源',
    listing_date: '2018-06-11',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 12,
    stock_code: '002475',
    stock_name: '立讯精密',
    market_type: 'A股',
    industry: '电子制造',
    listing_date: '2010-08-12',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 13,
    stock_code: '603259',
    stock_name: '药明康德',
    market_type: 'A股',
    industry: '医药',
    listing_date: '2015-06-23',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 14,
    stock_code: '000063',
    stock_name: '中兴通讯',
    market_type: 'A股',
    industry: '通信设备',
    listing_date: '1997-11-18',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 15,
    stock_code: '002594',
    stock_name: '比亚迪',
    market_type: 'A股',
    industry: '汽车',
    listing_date: '2002-06-19',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 16,
    stock_code: '600519',
    stock_name: '贵州茅台',
    market_type: 'A股',
    industry: '白酒',
    listing_date: '2001-08-27',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 17,
    stock_code: '601318',
    stock_name: '中国平安',
    market_type: 'A股',
    industry: '保险',
    listing_date: '1994-03-05',
    is_active: true,
    created_at: daysAgo(30)
  },
  {
    stock_id: 18,
    stock_code: '600036',
    stock_name: '招商银行',
    market_type: 'A股',
    industry: '银行',
    listing_date: '2002-04-09',
    is_active: true,
    created_at: daysAgo(30)
  }
];

// 模拟好友关系数据
export const mockFriendRelationships = [
  {
    relationship_id: 1,
    user_id: 1,
    friend_id: 2,
    status: 'accepted',
    created_at: daysAgo(20),
    accepted_at: daysAgo(20)
  },
  {
    relationship_id: 2,
    user_id: 1,
    friend_id: 3,
    status: 'accepted',
    created_at: daysAgo(15),
    accepted_at: daysAgo(15)
  },
  {
    relationship_id: 3,
    user_id: 1,
    friend_id: 4,
    status: 'accepted',
    created_at: daysAgo(10),
    accepted_at: daysAgo(10)
  },
  {
    relationship_id: 4,
    user_id: 2,
    friend_id: 3,
    status: 'accepted',
    created_at: daysAgo(18),
    accepted_at: daysAgo(18)
  },
  {
    relationship_id: 5,
    user_id: 2,
    friend_id: 5,
    status: 'accepted',
    created_at: daysAgo(12),
    accepted_at: daysAgo(12)
  },
  {
    relationship_id: 6,
    user_id: 3,
    friend_id: 6,
    status: 'accepted',
    created_at: daysAgo(8),
    accepted_at: daysAgo(8)
  },
  {
    relationship_id: 7,
    user_id: 4,
    friend_id: 7,
    status: 'accepted',
    created_at: daysAgo(5),
    accepted_at: daysAgo(5)
  },
  {
    relationship_id: 8,
    user_id: 5,
    friend_id: 8,
    status: 'accepted',
    created_at: daysAgo(3),
    accepted_at: daysAgo(3)
  },
  {
    relationship_id: 9,
    user_id: 6,
    friend_id: 9,
    status: 'accepted',
    created_at: daysAgo(2),
    accepted_at: daysAgo(2)
  },
  {
    relationship_id: 10,
    user_id: 7,
    friend_id: 10,
    status: 'accepted',
    created_at: daysAgo(1),
    accepted_at: daysAgo(1)
  },
  {
    relationship_id: 11,
    user_id: 8,
    friend_id: 1,
    status: 'accepted',
    created_at: daysAgo(15),
    accepted_at: daysAgo(15)
  },
  {
    relationship_id: 12,
    user_id: 9,
    friend_id: 2,
    status: 'accepted',
    created_at: daysAgo(10),
    accepted_at: daysAgo(10)
  },
  {
    relationship_id: 13,
    user_id: 10,
    friend_id: 3,
    status: 'pending',
    created_at: now(),
    accepted_at: null
  },
  {
    relationship_id: 14,
    user_id: 10,
    friend_id: 4,
    status: 'accepted',
    created_at: daysAgo(5),
    accepted_at: daysAgo(5)
  }
];

// 模拟好友聊天消息数据
export const mockFriendMessages = [
  {
    message_id: 1,
    sender_id: 1,
    receiver_id: 2,
    content: '你好，最近股票行情怎么样？',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(5),
    is_read: true
  },
  {
    message_id: 2,
    sender_id: 2,
    receiver_id: 1,
    content: '还不错，我最近买了平安银行，表现挺好的。',
    message_type: 'text',
    stock_reference: 1,
    sent_at: daysAgo(5),
    is_read: true
  },
  {
    message_id: 3,
    sender_id: 1,
    receiver_id: 2,
    content: '平安银行确实是个不错的选择，我也关注很久了。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(5),
    is_read: true
  },
  {
    message_id: 4,
    sender_id: 3,
    receiver_id: 1,
    content: '张三，你觉得中兴通讯怎么样？',
    message_type: 'text',
    stock_reference: 6,
    sent_at: daysAgo(3),
    is_read: true
  },
  {
    message_id: 5,
    sender_id: 1,
    receiver_id: 3,
    content: '中兴通讯最近表现不错，5G领域有很大潜力。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(3),
    is_read: true
  },
  {
    message_id: 6,
    sender_id: 4,
    receiver_id: 1,
    content: '推荐你关注一下招商银行，我觉得它的财报很亮眼。',
    message_type: 'text',
    stock_reference: 8,
    sent_at: daysAgo(2),
    is_read: true
  },
  {
    message_id: 7,
    sender_id: 1,
    receiver_id: 4,
    content: '好的，我会关注的，谢谢你的推荐！',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(2),
    is_read: true
  },
  {
    message_id: 8,
    sender_id: 5,
    receiver_id: 2,
    content: '最近A股行情回暖，你有什么看好的板块？',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(1),
    is_read: true
  },
  {
    message_id: 9,
    sender_id: 2,
    receiver_id: 5,
    content: '我看好工程机械板块，三一重工和中联重科都不错。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(1),
    is_read: true
  },
  {
    message_id: 10,
    sender_id: 6,
    receiver_id: 3,
    content: '中信证券的研报说近期大盘会上涨，你怎么看？',
    message_type: 'text',
    stock_reference: 10,
    sent_at: now(),
    is_read: false
  }
];

// 模拟群组数据
export const mockGroups = [
  {
    group_id: 1,
    group_name: '股票投资交流群',
    group_type: 'public',
    creator_id: 1,
    avatar: 'group1',
    description: '交流股票投资经验和技巧',
    status: 'active',
    created_at: daysAgo(25)
  },
  {
    group_id: 2,
    group_name: '科技股讨论组',
    group_type: 'private',
    creator_id: 2,
    avatar: 'group2',
    description: '专注于科技股的讨论和分析',
    status: 'active',
    created_at: daysAgo(20)
  },
  {
    group_id: 3,
    group_name: '价值投资俱乐部',
    group_type: 'private',
    creator_id: 3,
    avatar: 'group3',
    description: '价值投资理念分享和实践',
    status: 'active',
    created_at: daysAgo(15)
  }
];

// 模拟群成员数据
export const mockGroupMembers = [
  {
    group_member_id: 1,
    group_id: 1,
    user_id: 1,
    role: 'owner',
    status: 'active',
    joined_at: daysAgo(25)
  },
  {
    group_member_id: 2,
    group_id: 1,
    user_id: 2,
    role: 'admin',
    status: 'active',
    joined_at: daysAgo(25)
  },
  {
    group_member_id: 3,
    group_id: 1,
    user_id: 3,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(24)
  },
  {
    group_member_id: 4,
    group_id: 1,
    user_id: 4,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(23)
  },
  {
    group_member_id: 5,
    group_id: 1,
    user_id: 5,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(22)
  },
  {
    group_member_id: 6,
    group_id: 2,
    user_id: 2,
    role: 'owner',
    status: 'active',
    joined_at: daysAgo(20)
  },
  {
    group_member_id: 7,
    group_id: 2,
    user_id: 1,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(20)
  },
  {
    group_member_id: 8,
    group_id: 2,
    user_id: 6,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(19)
  },
  {
    group_member_id: 9,
    group_id: 2,
    user_id: 7,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(18)
  },
  {
    group_member_id: 10,
    group_id: 3,
    user_id: 3,
    role: 'owner',
    status: 'active',
    joined_at: daysAgo(15)
  },
  {
    group_member_id: 11,
    group_id: 3,
    user_id: 1,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(15)
  },
  {
    group_member_id: 12,
    group_id: 3,
    user_id: 2,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(14)
  },
  {
    group_member_id: 13,
    group_id: 3,
    user_id: 8,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(13)
  },
  {
    group_member_id: 14,
    group_id: 3,
    user_id: 9,
    role: 'member',
    status: 'active',
    joined_at: daysAgo(12)
  }
];

// 模拟群聊消息数据
export const mockGroupMessages = [
  {
    message_id: 1,
    group_id: 1,
    sender_id: 1,
    content: '欢迎大家加入股票投资交流群！',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(25)
  },
  {
    message_id: 2,
    group_id: 1,
    sender_id: 2,
    content: '大家好，我是管理员李四，有什么问题可以问我。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(25)
  },
  {
    message_id: 3,
    group_id: 1,
    sender_id: 3,
    content: '最近有什么推荐的股票吗？',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(24)
  },
  {
    message_id: 4,
    group_id: 1,
    sender_id: 1,
    content: '我觉得平安银行和招商银行都不错，可以关注一下。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(24)
  },
  {
    message_id: 5,
    group_id: 2,
    sender_id: 2,
    content: '欢迎来到科技股讨论组！',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(20)
  },
  {
    message_id: 6,
    group_id: 2,
    sender_id: 1,
    content: '大家好，我是张三，很高兴加入这个群组。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(20)
  },
  {
    message_id: 7,
    group_id: 2,
    sender_id: 6,
    content: '最近中兴通讯的财报出来了，表现很好！',
    message_type: 'text',
    stock_reference: 6,
    sent_at: daysAgo(19)
  },
  {
    message_id: 8,
    group_id: 3,
    sender_id: 3,
    content: '欢迎加入价值投资俱乐部！',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(15)
  },
  {
    message_id: 9,
    group_id: 3,
    sender_id: 1,
    content: '价值投资是长期的，需要耐心和坚持。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(15)
  },
  {
    message_id: 10,
    group_id: 3,
    sender_id: 2,
    content: '我同意，短期波动不代表什么，要看公司的基本面。',
    message_type: 'text',
    stock_reference: null,
    sent_at: daysAgo(15)
  }
];

// 模拟AI推荐数据
export const mockAIPicks = [
  {
    recommendation_id: 1,
    user_id: 1,
    stock_id: 1,
    confidence_score: 95.50,
    reasoning: '平安银行估值合理，不良贷款率持续下降，股息率较高。',
    recommended_at: daysAgo(5),
    user_feedback: 'positive'
  },
  {
    recommendation_id: 2,
    user_id: 1,
    stock_id: 8,
    confidence_score: 92.00,
    reasoning: '招商银行资产质量优秀，盈利能力强，创新业务发展迅速。',
    recommended_at: daysAgo(4),
    user_feedback: null
  },
  {
    recommendation_id: 3,
    user_id: 2,
    stock_id: 6,
    confidence_score: 90.50,
    reasoning: '中兴通讯在5G领域处于领先地位，海外市场拓展顺利。',
    recommended_at: daysAgo(3),
    user_feedback: 'positive'
  },
  {
    recommendation_id: 4,
    user_id: 3,
    stock_id: 10,
    confidence_score: 88.00,
    reasoning: '中信证券作为行业龙头，投行业务表现优异，市场份额稳定。',
    recommended_at: daysAgo(2),
    user_feedback: null
  },
  {
    recommendation_id: 5,
    user_id: 4,
    stock_id: 9,
    confidence_score: 85.50,
    reasoning: '三一重工在工程机械领域处于领先地位，海外订单增长迅速。',
    recommended_at: daysAgo(1),
    user_feedback: 'positive'
  },
  {
    recommendation_id: 6,
    user_id: 5,
    stock_id: 7,
    confidence_score: 83.00,
    reasoning: '中联重科研发投入大，产品竞争力强，新能源业务发展前景广阔。',
    recommended_at: now(),
    user_feedback: null
  },
  {
    recommendation_id: 7,
    user_id: 6,
    stock_id: 2,
    confidence_score: 80.50,
    reasoning: '万科A作为房地产龙头，财务稳健，转型进展顺利。',
    recommended_at: daysAgo(5),
    user_feedback: 'negative'
  },
  {
    recommendation_id: 8,
    user_id: 7,
    stock_id: 5,
    confidence_score: 78.00,
    reasoning: '白云机场客流量恢复增长，免税业务发展迅速。',
    recommended_at: daysAgo(4),
    user_feedback: null
  },
  {
    recommendation_id: 9,
    user_id: 8,
    stock_id: 4,
    confidence_score: 75.50,
    reasoning: '邯郸钢铁成本控制良好，产品结构优化，盈利能力提升。',
    recommended_at: daysAgo(3),
    user_feedback: 'positive'
  },
  {
    recommendation_id: 10,
    user_id: 9,
    stock_id: 3,
    confidence_score: 73.00,
    reasoning: '浦发银行资产规模大，风控能力强，股息率较高。',
    recommended_at: daysAgo(2),
    user_feedback: null
  }
];

// 模拟自选股数据
export const mockFavorites = [
  {
    favorite_id: 1,
    user_id: 1,
    stock_id: 1,
    added_at: daysAgo(20),
    notes: '长期持有',
    alert_price: 15.00
  },
  {
    favorite_id: 2,
    user_id: 1,
    stock_id: 8,
    added_at: daysAgo(15),
    notes: '关注中',
    alert_price: 40.00
  },
  {
    favorite_id: 3,
    user_id: 1,
    stock_id: 6,
    added_at: daysAgo(10),
    notes: '科技股龙头',
    alert_price: 30.00
  },
  {
    favorite_id: 4,
    user_id: 2,
    stock_id: 6,
    added_at: daysAgo(18),
    notes: '重点关注',
    alert_price: 28.00
  },
  {
    favorite_id: 5,
    user_id: 2,
    stock_id: 9,
    added_at: daysAgo(12),
    notes: '工程机械龙头',
    alert_price: 20.00
  },
  {
    favorite_id: 6,
    user_id: 3,
    stock_id: 10,
    added_at: daysAgo(8),
    notes: '证券龙头',
    alert_price: 25.00
  },
  {
    favorite_id: 7,
    user_id: 3,
    stock_id: 3,
    added_at: daysAgo(5),
    notes: '银行股',
    alert_price: 10.00
  },
  {
    favorite_id: 8,
    user_id: 4,
    stock_id: 9,
    added_at: daysAgo(10),
    notes: '看好未来发展',
    alert_price: 22.00
  },
  {
    favorite_id: 9,
    user_id: 4,
    stock_id: 7,
    added_at: daysAgo(7),
    notes: '新能源概念',
    alert_price: 18.00
  },
  {
    favorite_id: 10,
    user_id: 5,
    stock_id: 2,
    added_at: daysAgo(5),
    notes: '房地产龙头',
    alert_price: 18.00
  }
];
  // 模拟新闻收藏（用于前端测试）
  export const mockNewsFavorites = [
    // 示例结构：{ favorite_id, user_id, title, source, time, added_at }
  ]

// 模拟市场行情数据
export const mockMarketData = [
  {
    data_id: 1,
    stock_id: 1,
    price: 14.50,
    change_percent: 2.11,
    change_amount: 0.30,
    volume: 12500000,
    timestamp: now()
  },
  {
    data_id: 2,
    stock_id: 2,
    price: 17.80,
    change_percent: -1.66,
    change_amount: -0.30,
    volume: 8900000,
    timestamp: now()
  },
  {
    data_id: 3,
    stock_id: 3,
    price: 8.90,
    change_percent: 0.56,
    change_amount: 0.05,
    volume: 6700000,
    timestamp: now()
  },
  {
    data_id: 4,
    stock_id: 4,
    price: 3.20,
    change_percent: 1.59,
    change_amount: 0.05,
    volume: 15600000,
    timestamp: now()
  },
  {
    data_id: 5,
    stock_id: 5,
    price: 12.30,
    change_percent: -0.81,
    change_amount: -0.10,
    volume: 4500000,
    timestamp: now()
  },
  {
    data_id: 6,
    stock_id: 6,
    price: 29.50,
    change_percent: 3.14,
    change_amount: 0.90,
    volume: 23400000,
    timestamp: now()
  },
  {
    data_id: 7,
    stock_id: 7,
    price: 16.70,
    change_percent: 2.46,
    change_amount: 0.40,
    volume: 11200000,
    timestamp: now()
  },
  {
    data_id: 8,
    stock_id: 8,
    price: 38.90,
    change_percent: 1.30,
    change_amount: 0.50,
    volume: 9800000,
    timestamp: now()
  },
  {
    data_id: 9,
    stock_id: 9,
    price: 21.50,
    change_percent: -0.92,
    change_amount: -0.20,
    volume: 7600000,
    timestamp: now()
  },
  {
    data_id: 10,
    stock_id: 10,
    price: 24.80,
    change_percent: 1.64,
    change_amount: 0.40,
    volume: 13400000,
    timestamp: now()
  }
];

// 模拟用户兴趣标签数据
export const mockUserInterests = [
  {
    interest_id: 1,
    user_id: 1,
    interest_type: 'industry',
    interest_value: '银行',
    weight: 80,
    updated_at: daysAgo(10)
  },
  {
    interest_id: 2,
    user_id: 1,
    interest_type: 'industry',
    interest_value: '通信设备',
    weight: 70,
    updated_at: daysAgo(10)
  },
  {
    interest_id: 3,
    user_id: 1,
    interest_type: 'style',
    interest_value: '价值投资',
    weight: 90,
    updated_at: daysAgo(10)
  },
  {
    interest_id: 4,
    user_id: 2,
    interest_type: 'industry',
    interest_value: '通信设备',
    weight: 90,
    updated_at: daysAgo(15)
  },
  {
    interest_id: 5,
    user_id: 2,
    interest_type: 'industry',
    interest_value: '工程机械',
    weight: 80,
    updated_at: daysAgo(15)
  },
  {
    interest_id: 6,
    user_id: 2,
    interest_type: 'style',
    interest_value: '成长投资',
    weight: 85,
    updated_at: daysAgo(15)
  },
  {
    interest_id: 7,
    user_id: 3,
    interest_type: 'industry',
    interest_value: '证券',
    weight: 85,
    updated_at: daysAgo(8)
  },
  {
    interest_id: 8,
    user_id: 3,
    interest_type: 'industry',
    interest_value: '银行',
    weight: 75,
    updated_at: daysAgo(8)
  },
  {
    interest_id: 9,
    user_id: 3,
    interest_type: 'style',
    interest_value: '价值投资',
    weight: 90,
    updated_at: daysAgo(8)
  },
  {
    interest_id: 10,
    user_id: 4,
    interest_type: 'industry',
    interest_value: '工程机械',
    weight: 90,
    updated_at: daysAgo(5)
  },
  {
    interest_id: 11,
    user_id: 4,
    interest_type: 'style',
    interest_value: '成长投资',
    weight: 80,
    updated_at: daysAgo(5)
  },
  {
    interest_id: 12,
    user_id: 5,
    interest_type: 'industry',
    interest_value: '房地产',
    weight: 70,
    updated_at: daysAgo(3)
  },
  {
    interest_id: 13,
    user_id: 5,
    interest_type: 'style',
    interest_value: '价值投资',
    weight: 75,
    updated_at: daysAgo(3)
  },
  {
    interest_id: 14,
    user_id: 6,
    interest_type: 'industry',
    interest_value: '通信设备',
    weight: 80,
    updated_at: daysAgo(2)
  },
  {
    interest_id: 15,
    user_id: 6,
    interest_type: 'style',
    interest_value: '成长投资',
    weight: 85,
    updated_at: daysAgo(2)
  },
  {
    interest_id: 16,
    user_id: 7,
    interest_type: 'industry',
    interest_value: '交通运输',
    weight: 75,
    updated_at: now()
  },
  {
    interest_id: 17,
    user_id: 7,
    interest_type: 'style',
    interest_value: '价值投资',
    weight: 80,
    updated_at: now()
  },
  {
    interest_id: 18,
    user_id: 8,
    interest_type: 'industry',
    interest_value: '钢铁',
    weight: 80,
    updated_at: daysAgo(1)
  },
  {
    interest_id: 19,
    user_id: 8,
    interest_type: 'style',
    interest_value: '周期投资',
    weight: 85,
    updated_at: daysAgo(1)
  },
  {
    interest_id: 20,
    user_id: 9,
    interest_type: 'industry',
    interest_value: '银行',
    weight: 85,
    updated_at: now()
  },
  {
    interest_id: 21,
    user_id: 9,
    interest_type: 'style',
    interest_value: '价值投资',
    weight: 90,
    updated_at: now()
  },
  {
    interest_id: 22,
    user_id: 10,
    interest_type: 'industry',
    interest_value: '证券',
    weight: 70,
    updated_at: now()
  },
  {
    interest_id: 23,
    user_id: 10,
    interest_type: 'style',
    interest_value: '成长投资',
    weight: 75,
    updated_at: now()
  }
];

// 模拟系统通知数据
export const mockNotifications = [
  {
    notification_id: 1,
    user_id: 1,
    notification_type: 'system',
    title: '系统更新通知',
    content: '智能鑫AI系统已更新至最新版本，新增了AI选股功能。',
    is_read: true,
    created_at: daysAgo(5),
    read_at: daysAgo(5)
  },
  {
    notification_id: 2,
    user_id: 1,
    notification_type: 'friend',
    title: '好友请求',
    content: '李四请求添加您为好友。',
    is_read: false,
    created_at: now(),
    read_at: null
  },
  {
    notification_id: 3,
    user_id: 1,
    notification_type: 'stock',
    title: '股票预警',
    content: '平安银行已达到您设置的预警价格15.00元。',
    is_read: true,
    created_at: daysAgo(3),
    read_at: daysAgo(3)
  },
  {
    notification_id: 4,
    user_id: 2,
    notification_type: 'ai_recommendation',
    title: 'AI推荐',
    content: 'AI为您推荐了一只新股票：中兴通讯。',
    is_read: false,
    created_at: daysAgo(2),
    read_at: null
  },
  {
    notification_id: 5,
    user_id: 2,
    notification_type: 'group',
    title: '群组邀请',
    content: '张三邀请您加入股票投资交流群。',
    is_read: true,
    created_at: daysAgo(25),
    read_at: daysAgo(25)
  },
  {
    notification_id: 6,
    user_id: 3,
    notification_type: 'system',
    title: '重要公告',
    content: '平台将于2025年8月10日进行系统维护，期间服务可能中断。',
    is_read: true,
    created_at: daysAgo(7),
    read_at: daysAgo(7)
  },
  {
    notification_id: 7,
    user_id: 4,
    notification_type: 'stock',
    title: '股票资讯',
    content: '三一重工发布了2025年中期财报，净利润同比增长20%。',
    is_read: false,
    created_at: daysAgo(1),
    read_at: null
  },
  {
    notification_id: 8,
    user_id: 5,
    notification_type: 'ai_recommendation',
    title: 'AI推荐',
    content: 'AI为您推荐了一只新股票：中联重科。',
    is_read: false,
    created_at: now(),
    read_at: null
  },
  {
    notification_id: 9,
    user_id: 6,
    notification_type: 'group',
    title: '群组消息',
    content: '科技股讨论组有新消息，快去看看吧！',
    is_read: true,
    created_at: daysAgo(1),
    read_at: daysAgo(1)
  },
  {
    notification_id: 10,
    user_id: 7,
    notification_type: 'system',
    title: '账户安全提醒',
    content: '您的账户已连续30天未登录，请及时登录以确保账户安全。',
    is_read: true,
    created_at: daysAgo(3),
    read_at: daysAgo(3)
  }
];

// 模拟股票评论数据
export const mockStockComments = [
  {
    comment_id: 1,
    stock_id: 1,
    user_id: 1,
    parent_id: null,
    content: '平安银行的风控做得很好，长期持有很放心。',
    likes_count: 15,
    is_deleted: false,
    created_at: daysAgo(5),
    updated_at: daysAgo(5)
  },
  {
    comment_id: 2,
    stock_id: 1,
    user_id: 2,
    parent_id: 1,
    content: '同意，平安银行的管理层也很稳定。',
    likes_count: 8,
    is_deleted: false,
    created_at: daysAgo(4),
    updated_at: daysAgo(4)
  },
  {
    comment_id: 3,
    stock_id: 6,
    user_id: 3,
    parent_id: null,
    content: '中兴通讯的5G技术在国际上很有竞争力。',
    likes_count: 22,
    is_deleted: false,
    created_at: daysAgo(3),
    updated_at: daysAgo(3)
  },
  {
    comment_id: 4,
    stock_id: 6,
    user_id: 4,
    parent_id: 3,
    content: '是的，我看好他们在海外市场的拓展。',
    likes_count: 10,
    is_deleted: false,
    created_at: daysAgo(3),
    updated_at: daysAgo(3)
  },
  {
    comment_id: 5,
    stock_id: 9,
    user_id: 5,
    parent_id: null,
    content: '三一重工的挖掘机销量连续多年全球第一。',
    likes_count: 18,
    is_deleted: false,
    created_at: daysAgo(2),
    updated_at: daysAgo(2)
  },
  {
    comment_id: 6,
    stock_id: 10,
    user_id: 6,
    parent_id: null,
    content: '中信证券作为券商龙头，投行业务一直很强。',
    likes_count: 12,
    is_deleted: false,
    created_at: daysAgo(1),
    updated_at: daysAgo(1)
  },
  {
    comment_id: 7,
    stock_id: 8,
    user_id: 7,
    parent_id: null,
    content: '招商银行的APP做得真好用，用户体验很棒。',
    likes_count: 25,
    is_deleted: false,
    created_at: now(),
    updated_at: now()
  },
  {
    comment_id: 8,
    stock_id: 2,
    user_id: 8,
    parent_id: null,
    content: '万科A在房地产行业的转型很成功。',
    likes_count: 9,
    is_deleted: false,
    created_at: now(),
    updated_at: now()
  },
  {
    comment_id: 9,
    stock_id: 7,
    user_id: 9,
    parent_id: null,
    content: '中联重科的新能源设备很有前景。',
    likes_count: 14,
    is_deleted: false,
    created_at: daysAgo(5),
    updated_at: daysAgo(5)
  },
  {
    comment_id: 10,
    stock_id: 3,
    user_id: 10,
    parent_id: null,
    content: '浦发银行的股息率不错，适合长期投资。',
    likes_count: 11,
    is_deleted: false,
    created_at: daysAgo(4),
    updated_at: daysAgo(4)
  }
];
