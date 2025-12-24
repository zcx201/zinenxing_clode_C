// 智能鑫AI系统API服务
// 实现模拟API，用于前端开发和测试

// 模拟数据
import { mockUsers, mockStocks, mockFriendRelationships, mockFriendMessages, mockGroups, mockGroupMembers, mockGroupMessages, mockAIPicks, mockFavorites, mockNewsFavorites, mockMarketData, mockUserInterests, mockNotifications, mockStockComments } from './mockData';

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 生成随机ID
const generateId = () => Math.floor(Math.random() * 1000000);

// 可选的授权 token（模拟）
// 可选的授权 token（模拟）
let authToken = null;
const setAuthToken = (token) => {
  authToken = token
}

// 当前 mock 层的 "当前用户 id"，可由外部注入以与 AuthContext 同步
let apiCurrentUserId = 1
const setCurrentUserId = (id) => {
  apiCurrentUserId = id || null
}
const getCurrentUserId = () => apiCurrentUserId || 1
//
const getAuthToken = () => authToken

// 认证相关API
const authApi = {
  // 用户注册
  register: async (userData) => {
    await delay(500);
    const existingUser = mockUsers.find(user => user.username === userData.username || user.email === userData.email);
    if (existingUser) {
      throw new Error('用户名或邮箱已存在');
    }
    const newUser = {
      user_id: generateId(),
      username: userData.username,
      email: userData.email,
      password_hash: userData.password, // 实际项目中应该使用密码哈希
      phone: userData.phone,
  avatar: '用户',
  created_at: new Date().toISOString(),
      last_login: null
    };
    mockUsers.push(newUser);
    return {
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      token: `mock-token-${newUser.user_id}`
    };
  },

  // 用户登录
  login: async (credentials) => {
    await delay(500);
    const user = mockUsers.find(user => user.username === credentials.username && user.password_hash === credentials.password);
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    return {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      token: `mock-token-${user.user_id}`
    };
  },

  // 用户登出
  logout: async () => {
    await delay(300);
    return { success: true, message: 'Logout successful' };
  }
};

// 用户相关API
const userApi = {
  // 获取当前用户信息
  getCurrentUser: async () => {
    await delay(300);
    return mockUsers[0]; // 返回第一个用户作为当前用户
  },

  // 更新当前用户信息
  updateCurrentUser: async (userData) => {
    await delay(500);
    const currentUser = mockUsers[0];
    Object.assign(currentUser, userData);
    return currentUser;
  },

  // 修改密码
  changePassword: async (passwordData) => {
    await delay(500);
    const currentUser = mockUsers[0];
    if (currentUser.password_hash !== passwordData.old_password) {
      throw new Error('原密码错误');
    }
    currentUser.password_hash = passwordData.new_password;
    return { success: true, message: 'Password updated successfully' };
  },

  // 获取指定用户信息
  getUser: async (userId) => {
    await delay(300);
    const user = mockUsers.find(user => user.user_id === userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  },

  // 搜索用户
  searchUsers: async (params) => {
    await delay(500);
    const { keyword, page = 1, limit = 20 } = params;
    let filteredUsers = mockUsers;
    if (keyword) {
      filteredUsers = mockUsers.filter(user => 
        user.username.includes(keyword) || user.email.includes(keyword)
      );
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    return {
      total: filteredUsers.length,
      page,
      limit,
      users: paginatedUsers
    };
  }
};

// 股票相关API
const stockApi = {
  // 获取股票列表
  getStocks: async (params) => {
    await delay(500);
    const { market_type, industry, page = 1, limit = 20 } = params;
    let filteredStocks = mockStocks;
    if (market_type) {
      filteredStocks = filteredStocks.filter(stock => stock.market_type === market_type);
    }
    if (industry) {
      filteredStocks = filteredStocks.filter(stock => stock.industry === industry);
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStocks = filteredStocks.slice(startIndex, endIndex);
    return {
      total: filteredStocks.length,
      page,
      limit,
      stocks: paginatedStocks
    };
  },

  // 获取股票详情
  getStock: async (stockId) => {
    await delay(300);
    const stock = mockStocks.find(stock => stock.stock_id === stockId);
    if (!stock) {
      throw new Error('股票不存在');
    }
    return stock;
  },

  // 搜索股票
  searchStocks: async (params) => {
    await delay(500);
    const { keyword, page = 1, limit = 20 } = params;
    const filteredStocks = mockStocks.filter(stock => 
      stock.stock_name.includes(keyword) || stock.stock_code.includes(keyword)
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStocks = filteredStocks.slice(startIndex, endIndex);
    return {
      total: filteredStocks.length,
      page,
      limit,
      stocks: paginatedStocks
    };
  },

  // 获取股票行情数据
  getStockMarketData: async (stockId, _params) => {
    await delay(300);
    const stock = mockStocks.find(stock => stock.stock_id === stockId);
    if (!stock) {
      throw new Error('股票不存在');
    }
    const stockMarketData = mockMarketData.filter(data => data.stock_id === stockId);
    return {
      stock_id: stockId,
      stock_code: stock.stock_code,
      market_data: stockMarketData
    };
  },

  // 获取股票评论
  getStockComments: async (stockId, params) => {
    await delay(300);
    const { page = 1, limit = 20, sort = 'latest' } = params;
    let comments = mockStockComments.filter(comment => comment.stock_id === stockId && !comment.is_deleted);
    if (sort === 'latest') {
      comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);
    return {
      total: comments.length,
      page,
      limit,
      comments: paginatedComments
    };
  },

  // 添加股票评论
  addStockComment: async (stockId, commentData) => {
    await delay(500);
    const newComment = {
      comment_id: generateId(),
      stock_id: stockId,
      user_id: 1, // 当前用户ID
      parent_id: commentData.parent_id,
      content: commentData.content,
      likes_count: 0,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockStockComments.push(newComment);
    return newComment;
  },

  // 修改股票评论
  updateStockComment: async (stockId, commentId, commentData) => {
    await delay(500);
    const comment = mockStockComments.find(comment => comment.comment_id === commentId && comment.stock_id === stockId);
    if (!comment) {
      throw new Error('评论不存在');
    }
    comment.content = commentData.content;
    comment.updated_at = new Date().toISOString();
    return comment;
  },

  // 删除股票评论
  deleteStockComment: async (stockId, commentId) => {
    await delay(300);
    const comment = mockStockComments.find(comment => comment.comment_id === commentId && comment.stock_id === stockId);
    if (!comment) {
      throw new Error('评论不存在');
    }
    comment.is_deleted = true;
    return { success: true, message: 'Comment deleted successfully' };
  },

  // 点赞/取消点赞股票评论
  toggleLikeComment: async (stockId, commentId) => {
    await delay(300);
    const comment = mockStockComments.find(comment => comment.comment_id === commentId && comment.stock_id === stockId);
    if (!comment) {
      throw new Error('评论不存在');
    }
    comment.likes_count += 1;
    return { success: true, likes_count: comment.likes_count, is_liked: true };
  }
};

// 好友关系相关API
const friendApi = {
  // 获取好友列表
  getFriends: async (params) => {
    await delay(300);
    const { status = 'accepted', page = 1, limit = 20 } = params;
  const currentUserId = getCurrentUserId();
    const friendRelations = mockFriendRelationships.filter(
      relation => (relation.user_id === currentUserId || relation.friend_id === currentUserId) && relation.status === status
    );
    const friends = friendRelations.map(relation => {
      const friendId = relation.user_id === currentUserId ? relation.friend_id : relation.user_id;
      const friend = mockUsers.find(user => user.user_id === friendId);
      return {
        user_id: friend.user_id,
        username: friend.username,
        avatar: friend.avatar,
        status: relation.status,
        created_at: relation.created_at
      };
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFriends = friends.slice(startIndex, endIndex);
    return {
      total: friends.length,
      page,
      limit,
      friends: paginatedFriends
    };
  },

  // 获取好友请求
  getFriendRequests: async (params) => {
    await delay(300);
    const { status = 'pending', page = 1, limit = 20 } = params;
  const currentUserId = getCurrentUserId();
    const friendRequests = mockFriendRelationships.filter(
      relation => relation.friend_id === currentUserId && relation.status === status
    );
    const requests = friendRequests.map(request => {
      const user = mockUsers.find(user => user.user_id === request.user_id);
      return {
        user_id: user.user_id,
        username: user.username,
        avatar: user.avatar,
        status: request.status,
        created_at: request.created_at
      };
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = requests.slice(startIndex, endIndex);
    return {
      total: requests.length,
      page,
      limit,
      requests: paginatedRequests
    };
  },

  // 发送好友请求
  sendFriendRequest: async (friendId) => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    const existingRequest = mockFriendRelationships.find(
      relation => (relation.user_id === currentUserId && relation.friend_id === friendId) ||
                  (relation.user_id === friendId && relation.friend_id === currentUserId)
    );
    if (existingRequest) {
      throw new Error('好友请求已存在');
    }
    const newRequest = {
      relationship_id: generateId(),
      user_id: currentUserId,
      friend_id: friendId,
      status: 'pending',
      created_at: new Date().toISOString(),
      accepted_at: null
    };
    mockFriendRelationships.push(newRequest);
    return { success: true, message: 'Friend request sent successfully' };
  },

  // 处理好友请求
  handleFriendRequest: async (requestId, action) => {
    await delay(500);
    const request = mockFriendRelationships.find(relation => relation.relationship_id === requestId);
    if (!request) {
      throw new Error('好友请求不存在');
    }
    if (action === 'accept') {
      request.status = 'accepted';
      request.accepted_at = new Date().toISOString();
      return { success: true, message: 'Friend request accepted' };
    } else {
      request.status = 'rejected';
      return { success: true, message: 'Friend request rejected' };
    }
  },

  // 拒绝好友请求
  rejectFriendRequest: async (requestId) => {
    await delay(300);
    const request = mockFriendRelationships.find(relation => relation.relationship_id === requestId);
    if (!request) {
      throw new Error('好友请求不存在');
    }
    request.status = 'rejected';
    return { success: true, message: 'Friend request rejected' };
  },

  // 删除好友
  removeFriend: async (friendId) => {
    await delay(300);
  const currentUserId = getCurrentUserId();
    const friendRelationIndex = mockFriendRelationships.findIndex(
      relation => ((relation.user_id === currentUserId && relation.friend_id === friendId) ||
                  (relation.user_id === friendId && relation.friend_id === currentUserId)) &&
                 relation.status === 'accepted'
    );
    if (friendRelationIndex === -1) {
      throw new Error('好友关系不存在');
    }
    mockFriendRelationships.splice(friendRelationIndex, 1);
    return { success: true, message: 'Friend removed successfully' };
  },

  // 拉黑/取消拉黑好友
  toggleBlockFriend: async (friendId) => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    let friendRelation = mockFriendRelationships.find(
      relation => ((relation.user_id === currentUserId && relation.friend_id === friendId) ||
                  (relation.user_id === friendId && relation.friend_id === currentUserId))
    );
    if (!friendRelation) {
      friendRelation = {
        relationship_id: generateId(),
        user_id: currentUserId,
        friend_id: friendId,
        status: 'blocked',
        created_at: new Date().toISOString(),
        accepted_at: null
      };
      mockFriendRelationships.push(friendRelation);
      return { success: true, is_blocked: true };
    }
    if (friendRelation.status === 'blocked') {
      friendRelation.status = 'accepted';
      return { success: true, is_blocked: false };
    } else {
      friendRelation.status = 'blocked';
      return { success: true, is_blocked: true };
    }
  }
};

// 聊天消息相关API
const messageApi = {
  // 获取与指定好友的聊天记录
  getFriendMessages: async (friendId, params) => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    const { page = 1, limit = 50, direction = 'desc' } = params;
    const messages = mockFriendMessages.filter(
      message => (message.sender_id === currentUserId && message.receiver_id === friendId) ||
                 (message.sender_id === friendId && message.receiver_id === currentUserId)
    );
    if (direction === 'desc') {
      messages.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
    } else {
      messages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = messages.slice(startIndex, endIndex);
    return {
      total: messages.length,
      page,
      limit,
      messages: paginatedMessages
    };
  },

  // 发送好友消息
  sendFriendMessage: async (friendId, messageData) => {
    await delay(300);
  const currentUserId = getCurrentUserId();
    const newMessage = {
      message_id: generateId(),
      sender_id: currentUserId,
      receiver_id: friendId,
      content: messageData.content,
      message_type: messageData.message_type || 'text',
      stock_reference: messageData.stock_reference,
      sent_at: new Date().toISOString(),
      is_read: false
    };
    mockFriendMessages.push(newMessage);
    return newMessage;
  },

  // 标记好友消息为已读
  markFriendMessagesAsRead: async (friendId) => {
    await delay(300);
  const currentUserId = getCurrentUserId();
    mockFriendMessages.forEach(message => {
      if (message.sender_id === friendId && message.receiver_id === currentUserId) {
        message.is_read = true;
      }
    });
    return { success: true, message: 'Messages marked as read' };
  },

  // 获取未读好友消息数量
  getUnreadFriendMessagesCount: async () => {
    await delay(200);
  const currentUserId = getCurrentUserId();
    const unreadCount = mockFriendMessages.filter(
      message => message.receiver_id === currentUserId && !message.is_read
    ).length;
    return { unread_count: unreadCount };
  },

  // 获取群组聊天记录
  getGroupMessages: async (groupId, params) => {
    await delay(500);
    const { page = 1, limit = 50, direction = 'desc' } = params;
    const messages = mockGroupMessages.filter(message => message.group_id === groupId);
    if (direction === 'desc') {
      messages.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
    } else {
      messages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = messages.slice(startIndex, endIndex);
    return {
      total: messages.length,
      page,
      limit,
      messages: paginatedMessages
    };
  },

  // 发送群组消息
  sendGroupMessage: async (groupId, messageData) => {
    await delay(300);
  const currentUserId = getCurrentUserId();
    const newMessage = {
      message_id: generateId(),
      group_id: groupId,
      sender_id: currentUserId,
      content: messageData.content,
      message_type: messageData.message_type || 'text',
      stock_reference: messageData.stock_reference,
      sent_at: new Date().toISOString()
    };
    mockGroupMessages.push(newMessage);
    return newMessage;
  },

  // 标记群组消息为已读
  markGroupMessagesAsRead: async (_groupId) => {
    await delay(300);
    // 群组消息的已读状态通常需要一个单独的表来跟踪，这里简化处理
    return { success: true, message: 'Messages marked as read' };
  }
};

// 群组相关API
const groupApi = {
  // 获取群组列表
  getGroups: async (params) => {
    await delay(300);
    const { page = 1, limit = 20 } = params;
  const currentUserId = getCurrentUserId();
  const userGroups = mockGroupMembers.filter(member => member.user_id === currentUserId).map(member => member.group_id);
    const groups = mockGroups.filter(group => userGroups.includes(group.group_id));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGroups = groups.slice(startIndex, endIndex);
    return {
      total: groups.length,
      page,
      limit,
      groups: paginatedGroups
    };
  },

  // 创建群组
  createGroup: async (groupData) => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    const newGroup = {
      group_id: generateId(),
      group_name: groupData.group_name,
      group_type: groupData.group_type || 'private',
      creator_id: currentUserId,
      avatar: groupData.avatar || '群',
      description: groupData.description,
      status: 'active',
      created_at: new Date().toISOString()
    };
    mockGroups.push(newGroup);
    // 添加创建者为群成员
    mockGroupMembers.push({
      group_member_id: generateId(),
      group_id: newGroup.group_id,
      user_id: currentUserId,
      role: 'owner',
      status: 'active',
      joined_at: new Date().toISOString()
    });
    return newGroup;
  },

  // 获取群组详情
  getGroup: async (groupId) => {
    await delay(300);
    const group = mockGroups.find(group => group.group_id === groupId);
    if (!group) {
      throw new Error('群组不存在');
    }
    return group;
  },

  // 修改群组信息
  updateGroup: async (groupId, groupData) => {
    await delay(500);
    const group = mockGroups.find(group => group.group_id === groupId);
    if (!group) {
      throw new Error('群组不存在');
    }
    Object.assign(group, groupData);
    return group;
  },

  // 解散群组
  deleteGroup: async (groupId) => {
    await delay(500);
    const groupIndex = mockGroups.findIndex(group => group.group_id === groupId);
    if (groupIndex === -1) {
      throw new Error('群组不存在');
    }
    mockGroups.splice(groupIndex, 1);
  // 删除群成员和群消息（就地修改导入数组，避免重赋值导入绑定）
  const remainingMembers = mockGroupMembers.filter(member => member.group_id !== groupId);
  mockGroupMembers.length = 0;
  mockGroupMembers.push(...remainingMembers);

  const remainingMessages = mockGroupMessages.filter(message => message.group_id !== groupId);
  mockGroupMessages.length = 0;
  mockGroupMessages.push(...remainingMessages);
    return { success: true, message: 'Group disbanded successfully' };
  },

  // 获取群成员列表
  getGroupMembers: async (groupId, params) => {
    await delay(300);
    const { page = 1, limit = 20 } = params;
    const members = mockGroupMembers.filter(member => member.group_id === groupId).map(member => {
      const user = mockUsers.find(user => user.user_id === member.user_id);
      return {
        user_id: user.user_id,
        username: user.username,
        role: member.role,
        status: member.status,
        joined_at: member.joined_at
      };
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = members.slice(startIndex, endIndex);
    return {
      total: members.length,
      page,
      limit,
      members: paginatedMembers
    };
  },

  // 添加群成员
  addGroupMember: async (groupId, memberData) => {
    await delay(500);
    const existingMember = mockGroupMembers.find(
      member => member.group_id === groupId && member.user_id === memberData.user_id
    );
    if (existingMember) {
      throw new Error('用户已在群组中');
    }
    const newMember = {
      group_member_id: generateId(),
      group_id: groupId,
      user_id: memberData.user_id,
      role: memberData.role || 'member',
      status: 'active',
      joined_at: new Date().toISOString()
    };
    mockGroupMembers.push(newMember);
    return { success: true, message: 'Member added successfully' };
  },

  // 修改群成员角色
  updateGroupMemberRole: async (groupId, userId, role) => {
    await delay(500);
    const member = mockGroupMembers.find(
      member => member.group_id === groupId && member.user_id === userId
    );
    if (!member) {
      throw new Error('群成员不存在');
    }
    member.role = role;
    return { success: true, message: 'Member role updated successfully' };
  },

  // 移除群成员
  removeGroupMember: async (groupId, userId) => {
    await delay(300);
    const memberIndex = mockGroupMembers.findIndex(
      member => member.group_id === groupId && member.user_id === userId
    );
    if (memberIndex === -1) {
      throw new Error('群成员不存在');
    }
    mockGroupMembers.splice(memberIndex, 1);
    return { success: true, message: 'Member removed successfully' };
  },

  // 加入群组
  joinGroup: async (groupId) => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    const existingMember = mockGroupMembers.find(
      member => member.group_id === groupId && member.user_id === currentUserId
    );
    if (existingMember) {
      throw new Error('已在群组中');
    }
    const newMember = {
      group_member_id: generateId(),
      group_id: groupId,
      user_id: currentUserId,
      role: 'member',
      status: 'active',
      joined_at: new Date().toISOString()
    };
    mockGroupMembers.push(newMember);
    return { success: true, message: 'Joined group successfully' };
  },

  // 退出群组
  leaveGroup: async (groupId) => {
    await delay(300);
  const currentUserId = getCurrentUserId();
    const memberIndex = mockGroupMembers.findIndex(
      member => member.group_id === groupId && member.user_id === currentUserId
    );
    if (memberIndex === -1) {
      throw new Error('不在群组中');
    }
    mockGroupMembers.splice(memberIndex, 1);
    return { success: true, message: 'Left group successfully' };
  },

  // 邀请用户加入群组
  inviteToGroup: async (_groupId, _userId) => {
    await delay(500);
    // 实际项目中，这里应该发送邀请通知
    return { success: true, message: 'Invitation sent successfully' };
  }
};

// AI推荐相关API
const aiApi = {
  // 获取AI推荐股票
  getRecommendations: async (params) => {
    await delay(500);
    const { page = 1, limit = 10 } = params;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecommendations = mockAIPicks.slice(startIndex, endIndex);
    return {
      total: mockAIPicks.length,
      page,
      limit,
      recommendations: paginatedRecommendations
    };
  },

  // 提交AI推荐反馈
  submitFeedback: async (recommendationId, feedback) => {
    await delay(300);
    const recommendation = mockAIPicks.find(pick => pick.recommendation_id === recommendationId);
    if (!recommendation) {
      throw new Error('推荐不存在');
    }
    recommendation.user_feedback = feedback.feedback;
    return { success: true, message: 'Feedback submitted successfully' };
  },

  // 请求AI生成新的推荐
  generateRecommendations: async (params) => {
    await delay(1000); // 模拟AI生成延迟
    const { count = 5 } = params;
    // 从现有推荐中随机选择count个
    const shuffled = [...mockAIPicks].sort(() => 0.5 - Math.random());
    return { success: true, recommendations: shuffled.slice(0, count) };
  }
};

// 自选股相关API
const favoritesApi = {
  // 获取自选股列表
  getFavorites: async (params) => {
    await delay(300);
    const { page = 1, limit = 50, type } = params || {};
  const currentUserId = getCurrentUserId();
    if (type === 'news') {
      // 新闻收藏
      const userNews = mockNewsFavorites.filter(fav => fav.user_id === currentUserId);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginated = userNews.slice(startIndex, endIndex);
      return { total: userNews.length, page, limit, favorites: paginated };
    }
    // 默认：股票自选
    const userFavorites = mockFavorites.filter(fav => fav.user_id === currentUserId);
    const favoritesWithStockInfo = userFavorites.map(fav => {
      const stock = mockStocks.find(stock => stock.stock_id === fav.stock_id);
      return { ...fav, stock_info: stock };
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFavorites = favoritesWithStockInfo.slice(startIndex, endIndex);
    return {
      total: userFavorites.length,
      page,
      limit,
      favorites: paginatedFavorites
    };
  },

  // 添加自选股
  addFavorite: async (favoriteData) => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    // 支持新闻与股票两种类型
    if (favoriteData && favoriteData.type === 'news') {
      const existing = mockNewsFavorites.find(fav => fav.user_id === currentUserId && fav.title === favoriteData.title);
      if (existing) throw new Error('新闻已收藏');
      const newFav = {
        favorite_id: generateId(),
        user_id: currentUserId,
        title: favoriteData.title,
        source: favoriteData.source || null,
        time: favoriteData.time || new Date().toISOString(),
        added_at: new Date().toISOString()
      };
      mockNewsFavorites.push(newFav);
      return newFav;
    }
    // 默认走股票自选逻辑
    const existingFavorite = mockFavorites.find(
      fav => fav.user_id === currentUserId && fav.stock_id === favoriteData.stock_id
    );
    if (existingFavorite) {
      throw new Error('股票已在自选股中');
    }
    const newFavorite = {
      favorite_id: generateId(),
      user_id: currentUserId,
      stock_id: favoriteData.stock_id,
      added_at: new Date().toISOString(),
      notes: favoriteData.notes,
      alert_price: favoriteData.alert_price
    };
    mockFavorites.push(newFavorite);
    return newFavorite;
  },

  // 修改自选股信息
  updateFavorite: async (favoriteId, favoriteData) => {
    await delay(500);
    const favorite = mockFavorites.find(fav => fav.favorite_id === favoriteId);
    if (!favorite) {
      throw new Error('自选股不存在');
    }
    Object.assign(favorite, favoriteData);
    return favorite;
  },

  // 删除自选股
  deleteFavorite: async (favoriteId) => {
    await delay(300);
    // 先尝试在股票自选中删除
    const favoriteIndex = mockFavorites.findIndex(fav => fav.favorite_id === favoriteId);
    if (favoriteIndex !== -1) {
      mockFavorites.splice(favoriteIndex, 1);
      return { success: true, message: 'Favorite removed successfully' };
    }
    // 再尝试新闻收藏
    const newsIndex = mockNewsFavorites.findIndex(fav => fav.favorite_id === favoriteId);
    if (newsIndex !== -1) {
      mockNewsFavorites.splice(newsIndex, 1);
      return { success: true, message: 'Favorite removed successfully' };
    }
    throw new Error('自选/收藏不存在');
  },

  // 检查股票是否在自选股中
  checkFavorite: async (stockId) => {
    await delay(200);
  const currentUserId = getCurrentUserId();
    const isFavorite = mockFavorites.some(fav => fav.user_id === currentUserId && fav.stock_id === stockId);
    return { is_favorite: isFavorite };
  }
};

// 市场行情相关API
const marketApi = {
  // 获取市场行情概览
  getMarketOverview: async (params) => {
    await delay(500);
    const { market_type = 'A股' } = params;
    const marketStocks = mockStocks.filter(stock => stock.market_type === market_type);
    // 计算市场概览
    const marketSummary = {
      total_stocks: marketStocks.length,
      avg_change_percent: 1.25,
      rising_stocks: 650,
      falling_stocks: 350,
      market_type: market_type
    };
    // 获取热门股票
    const hotStocks = [...mockStocks].sort((a, b) => {
      const aData = mockMarketData.find(data => data.stock_id === a.stock_id);
      const bData = mockMarketData.find(data => data.stock_id === b.stock_id);
      return (bData?.volume || 0) - (aData?.volume || 0);
    }).slice(0, 10);
    return {
      market_summary: marketSummary,
      hot_stocks: hotStocks
    };
  },

  // 获取股票实时行情
  getStockRealTimeData: async (stockId) => {
    await delay(300);
    const stockData = mockMarketData.find(data => data.stock_id === stockId);
    if (!stockData) {
      throw new Error('股票行情数据不存在');
    }
    return stockData;
  },

  // 获取股票历史行情
  getStockHistoryData: async (stockId, _params) => {
    await delay(500);
    // 模拟历史数据，实际项目中应该从数据库或API获取
    const historyData = mockMarketData.filter(data => data.stock_id === stockId);
    const stock = mockStocks.find(stock => stock.stock_id === stockId);
    return {
      stock_id: stockId,
      stock_code: stock.stock_code,
      history_data: historyData
    };
  },

  // 获取热门股票
  getHotStocks: async (params) => {
    await delay(300);
    const { limit = 20, sort_by = 'volume' } = params;
    // 根据sort_by排序
    let sortedStocks = [...mockStocks];
    if (sort_by === 'volume') {
      sortedStocks.sort((a, b) => {
        const aData = mockMarketData.find(data => data.stock_id === a.stock_id);
        const bData = mockMarketData.find(data => data.stock_id === b.stock_id);
        return (bData?.volume || 0) - (aData?.volume || 0);
      });
    } else if (sort_by === 'change_percent') {
      sortedStocks.sort((a, b) => {
        const aData = mockMarketData.find(data => data.stock_id === a.stock_id);
        const bData = mockMarketData.find(data => data.stock_id === b.stock_id);
        return (bData?.change_percent || 0) - (aData?.change_percent || 0);
      });
    }
    return {
      hot_stocks: sortedStocks.slice(0, limit)
    };
  },

  // 获取行业板块行情
  getSectorData: async () => {
    await delay(500);
    // 按行业分组
    const sectors = {};
    mockStocks.forEach(stock => {
      if (!sectors[stock.industry]) {
        sectors[stock.industry] = {
          industry: stock.industry,
          avg_change_percent: 0,
          stocks: []
        };
      }
      sectors[stock.industry].stocks.push(stock);
    });
    // 计算每个行业的平均涨跌幅
    Object.values(sectors).forEach(sector => {
      const totalChange = sector.stocks.reduce((sum, stock) => {
        const stockData = mockMarketData.find(data => data.stock_id === stock.stock_id);
        return sum + (stockData?.change_percent || 0);
      }, 0);
      sector.avg_change_percent = parseFloat((totalChange / sector.stocks.length).toFixed(2));
    });
    return {
      sectors: Object.values(sectors)
    };
  }
};

// 用户兴趣相关API
const interestApi = {
  // 获取用户兴趣标签
  getInterests: async () => {
    await delay(300);
  const currentUserId = getCurrentUserId();
    const userInterests = mockUserInterests.filter(interest => interest.user_id === currentUserId);
    return { interests: userInterests };
  },

  // 添加用户兴趣标签
  addInterest: async (interestData) => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    const existingInterest = mockUserInterests.find(
      interest => interest.user_id === currentUserId &&
                  interest.interest_type === interestData.interest_type &&
                  interest.interest_value === interestData.interest_value
    );
    if (existingInterest) {
      throw new Error('兴趣标签已存在');
    }
    const newInterest = {
      interest_id: generateId(),
      user_id: currentUserId,
      interest_type: interestData.interest_type,
      interest_value: interestData.interest_value,
      weight: interestData.weight || 50,
      updated_at: new Date().toISOString()
    };
    mockUserInterests.push(newInterest);
    return newInterest;
  },

  // 修改用户兴趣标签
  updateInterest: async (interestId, interestData) => {
    await delay(500);
    const interest = mockUserInterests.find(interest => interest.interest_id === interestId);
    if (!interest) {
      throw new Error('兴趣标签不存在');
    }
    interest.weight = interestData.weight;
    interest.updated_at = new Date().toISOString();
    return interest;
  },

  // 删除用户兴趣标签
  deleteInterest: async (interestId) => {
    await delay(300);
    const interestIndex = mockUserInterests.findIndex(interest => interest.interest_id === interestId);
    if (interestIndex === -1) {
      throw new Error('兴趣标签不存在');
    }
    mockUserInterests.splice(interestIndex, 1);
    return { success: true, message: 'Interest deleted successfully' };
  }
};

// 系统通知相关API
const notificationApi = {
  // 获取系统通知
  getNotifications: async (params) => {
    await delay(300);
    const { is_read = false, page = 1, limit = 20 } = params;
  const currentUserId = getCurrentUserId();
    let userNotifications = mockNotifications.filter(notification => notification.user_id === currentUserId);
    if (is_read !== undefined) {
      userNotifications = userNotifications.filter(notification => notification.is_read === is_read);
    }
    userNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);
    return {
      total: userNotifications.length,
      page,
      limit,
      notifications: paginatedNotifications
    };
  },

  // 获取通知详情
  getNotification: async (notificationId) => {
    await delay(300);
    const notification = mockNotifications.find(notification => notification.notification_id === notificationId);
    if (!notification) {
      throw new Error('通知不存在');
    }
    return notification;
  },

  // 标记通知为已读
  markNotificationAsRead: async (notificationId) => {
    await delay(300);
    const notification = mockNotifications.find(notification => notification.notification_id === notificationId);
    if (!notification) {
      throw new Error('通知不存在');
    }
    notification.is_read = true;
    notification.read_at = new Date().toISOString();
    return { success: true, message: 'Notification marked as read' };
  },

  // 标记所有通知为已读
  markAllNotificationsAsRead: async () => {
    await delay(500);
  const currentUserId = getCurrentUserId();
    mockNotifications.forEach(notification => {
      if (notification.user_id === currentUserId) {
        notification.is_read = true;
        notification.read_at = new Date().toISOString();
      }
    });
    return { success: true, message: 'All notifications marked as read' };
  },

  // 获取未读通知数量
  getUnreadNotificationCount: async () => {
    await delay(200);
  const currentUserId = getCurrentUserId();
    const unreadCount = mockNotifications.filter(
      notification => notification.user_id === currentUserId && !notification.is_read
    ).length;
    return { unread_count: unreadCount };
  }
};

// 导出所有API
const api = {
  auth: authApi,
  user: userApi,
  stock: stockApi,
  friend: friendApi,
  message: messageApi,
  group: groupApi,
  ai: aiApi,
  favorites: favoritesApi,
  market: marketApi,
  interest: interestApi,
  notification: notificationApi
};

// 暴露用于注入 token 的方法
api.setToken = setAuthToken
// 暴露用于设置/获取当前用户 id（mock 用）
api.setCurrentUserId = setCurrentUserId
api.getCurrentUserId = getCurrentUserId
api.getAuthToken = getAuthToken

export default api;
