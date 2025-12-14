import React, { useState, useEffect, useRef } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const FriendsPage = () => {
  const [currentTab, setCurrentTab] = useState('messages')
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false)
  const [showChatDropdown, setShowChatDropdown] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')
  const dropdownRef = useRef(null)
  const chatDropdownRef = useRef(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowHeaderDropdown(false)
      }
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        setShowChatDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 模拟好友数据
  const friendsList = [
    {
      id: '1001',
      name: '张财经',
      status: 'online',
      avatar: '张',
      lastMessage: '我觉得科技板块下周会有不错的表现，特别是AI概念...',
      lastTime: '10:23',
      unread: 3,
      gender: '男',
      birthDate: '1990-05-15',
      location: '北京',
      contact: 'zhanggcaijing@example.com',
      investmentPhilosophy: '价值投资，长期持有',
      hobbies: '阅读、健身、旅游'
    },
    {
      id: '1002',
      name: '李股神',
      status: '2小时前活跃',
      avatar: '李',
      lastMessage: '明天准备加仓宁德时代，你觉得这个位置怎么样？',
      lastTime: '昨天',
      unread: 0,
      gender: '男',
      birthDate: '1985-08-20',
      location: '上海',
      contact: 'ligushen@example.com',
      investmentPhilosophy: '技术分析，波段操作',
      hobbies: '炒股、钓鱼、下棋'
    },
    {
      id: '1003',
      name: '王趋势',
      status: 'online',
      avatar: '王',
      lastMessage: '最近市场波动很大，建议控制仓位',
      lastTime: '3小时前',
      unread: 0,
      gender: '女',
      birthDate: '1992-12-05',
      location: '深圳',
      contact: 'wangqushi@example.com',
      investmentPhilosophy: '趋势投资，顺势而为',
      hobbies: '瑜伽、美食、摄影'
    }
  ]

  // 模拟群组数据
  const groupsList = [
    {
      id: 'group1',
      name: '价值投资交流群',
      status: '268人 · 最后活跃: 10:30',
      avatar: '群',
      lastMessage: '[股票] 贵州茅台 1688.00 (+2.35%)',
      lastTime: '09:45',
      unread: 12
    },
    {
      id: 'group2',
      name: '科技股投资圈',
      status: '156人 · 最后活跃: 09:15',
      avatar: '群',
      lastMessage: 'AI板块今天表现不错，大家怎么看？',
      lastTime: '08:30',
      unread: 0
    }
  ]

  // 模拟聊天记录
  const chatMessages = {
    '张财经': [
      {
        type: 'received',
        content: '你好！最近关注什么股票？',
        time: '10:20'
      },
      {
        type: 'sent',
        content: '我在看科技板块，特别是AI相关的股票',
        time: '10:21'
      },
      {
        type: 'received',
        content: '我觉得科大讯飞不错，最近资金流入明显',
        time: '10:22'
      },
      {
        type: 'received',
        content: 'stock:KXF',
        time: '10:23'
      }
    ]
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const newMsg = {
      type: 'sent',
      content: newMessage,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setMessages(prev => [...prev, newMsg])
    setNewMessage('')

    // 模拟回复
    setTimeout(() => {
      const replies = [
        '这个观点很有意思！',
        '我也有同感',
        '你觉得明天会怎么走？',
        '可以参考一下技术面'
      ]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]

      setMessages(prev => [...prev, {
        type: 'received',
        content: randomReply,
        time: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const toggleHeaderDropdown = () => {
    setShowHeaderDropdown(!showHeaderDropdown)
  }

  const toggleChatDropdown = () => {
    setShowChatDropdown(!showChatDropdown)
  }

  // 下拉菜单项处理函数
  const handleAddFriend = () => {
    setShowAddModal(true)
    setShowHeaderDropdown(false)
  }

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true)
    setShowHeaderDropdown(false)
  }

  const handleSearchUser = () => {
    setShowSearchModal(true)
    setShowHeaderDropdown(false)
  }

  // 显示Toast消息
  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  // 聊天窗口下拉菜单处理函数
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleViewProfile = () => {
    setShowChatDropdown(false)
    setShowProfileModal(true)
  }

  const handleBlockFriend = () => {
    setShowChatDropdown(false)
    setShowBlockModal(true)
  }

  const handleDeleteFriend = () => {
    setShowChatDropdown(false)
    setShowDeleteModal(true)
  }

  const confirmBlockFriend = () => {
    setShowBlockModal(false)
    showToastMessage(`已拉黑 ${selectedChat?.name}`, 'warning')
  }

  const confirmDeleteFriend = () => {
    setShowDeleteModal(false)
    showToastMessage(`已删除好友 ${selectedChat?.name}`, 'error')
  }

  const openChat = (friend) => {
    setSelectedChat(friend)
    setMessages(chatMessages[friend.name] || [])
  }

  const backToMessageList = () => {
    setSelectedChat(null)
    setMessages([])
  }

  const sendStockCard = () => {
    if (!selectedChat) return

    const stockCardMsg = {
      type: 'sent',
      content: 'stock:KXF',
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setMessages(prev => [...prev, stockCardMsg])
  }

  return (
    <>
      {/* 条件渲染聊天窗口或好友列表 */}
      {selectedChat ? (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-user">
              <div className="back-btn" onClick={backToMessageList}>
                <span className="fas fa-arrow-left"></span>
              </div>
              <div className="chat-user-avatar">
                {selectedChat.avatar}
              </div>
              <div className="chat-user-info">
                <div className="chat-user-name">{selectedChat.name}</div>
                <div className="chat-user-status">
                  {selectedChat.status === 'online' ? '在线' : selectedChat.status}
                </div>
              </div>
            </div>

            <div className="relative" ref={chatDropdownRef}>
              <button
                className="back-btn"
                onClick={toggleChatDropdown}
              >
                <span className="fas fa-ellipsis-v"></span>
              </button>

              {showChatDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-40 shadow-lg">
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 flex items-center text-gray-800 font-medium"
                    onClick={handleViewProfile}
                  >
                    <span className="fas fa-user mr-3 text-primary-500 text-sm"></span>
                    查看资料
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 flex items-center text-gray-800 font-medium"
                    onClick={handleBlockFriend}
                  >
                    <span className="fas fa-ban mr-3 text-yellow-500 text-sm"></span>
                    拉黑好友
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-red-500 flex items-center text-red-600 font-medium"
                    onClick={handleDeleteFriend}
                  >
                    <span className="fas fa-trash mr-3 text-sm"></span>
                    删除好友
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.type}`}>
                {msg.content.startsWith('stock:') ? (
                  <>
                    <div className="bubble-content">
                      <div className="stock-card-message">
                        <div className="stock-card-header">
                          <div className="stock-card-name">科大讯飞 (002230)</div>
                          <div className="stock-card-price">56.78</div>
                        </div>
                        <div className="stock-card-change">+4.5%</div>
                        <div className="stock-card-actions">
                          <button className="stock-card-btn">加自选</button>
                          <button className="stock-card-btn">查看详情</button>
                        </div>
                      </div>
                    </div>
                    <div className="bubble-time">{msg.time}</div>
                  </>
                ) : (
                  <>
                    <div className="bubble-content">{msg.content}</div>
                    <div className="bubble-time">{msg.time}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <div className="input-tools">
              <button className="tool-btn" onClick={sendStockCard}>
                <span className="fas fa-chart-line"></span>
              </button>
              <button className="tool-btn">
                <span className="far fa-smile"></span>
              </button>
            </div>
            <input
              type="text"
              className="message-input"
              placeholder="输入消息..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              发送
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 页面头部 - 改为普通头部 */}
          <div className="mb-4">
            <div className="flex justify-between items-center p-4 bg-white rounded-card shadow-card border border-gray-200">
              <div className="brand">
                <div className="app-logo">股</div>
                <div className="app-title">股友</div>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={toggleHeaderDropdown}
                >
                  <span className="fas fa-ellipsis-v text-gray-600"></span>
                </button>

                {showHeaderDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-40">
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                      onClick={handleAddFriend}
                    >
                      <span className="fas fa-user-plus mr-2 text-primary-500"></span>
                      添加好友
                    </button>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                      onClick={handleCreateGroup}
                    >
                      <span className="fas fa-users mr-2 text-primary-500"></span>
                      建立群聊
                    </button>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-gray-50"
                      onClick={handleSearchUser}
                    >
                      <span className="fas fa-search mr-2 text-primary-500"></span>
                      查找好友
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="message-list">
            {friendsList.concat(groupsList).map((friend) => (
              <div
                key={friend.id}
                className="message-item"
                onClick={() => openChat(friend)}
              >
                <div className="message-avatar">{friend.avatar}</div>
                <div className="message-content">
                  <div className="message-header">
                    <div className="message-name">{friend.name}</div>
                    <div className="message-time">{friend.lastTime}</div>
                  </div>
                  <div className="message-preview">{friend.lastMessage}</div>
                </div>
                {friend.unread > 0 && (
                  <div className="unread-badge">{friend.unread}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* 所有弹窗组件 - 始终渲染在DOM中 */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加好友"
      >
        <div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:border-primary-500"
            placeholder="请输入用户ID或用户名"
          />
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => setShowAddModal(false)}
            >
              取消
            </button>
            <button
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              onClick={() => setShowAddModal(false)}
            >
              发送请求
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        title="建立群聊"
      >
        <div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:border-primary-500"
            placeholder="请输入群聊名称"
          />
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => setShowCreateGroupModal(false)}
            >
              取消
            </button>
            <button
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              onClick={() => setShowCreateGroupModal(false)}
            >
              创建群聊
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        title="查找好友"
      >
        <div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:border-primary-500"
            placeholder="请输入用户ID、用户名或手机号"
          />
          <div className="search-results">
            {/* 这里可以显示搜索结果 */}
          </div>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => setShowSearchModal(false)}
            >
              取消
            </button>
            <button
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              onClick={() => setShowSearchModal(false)}
            >
              搜索
            </button>
          </div>
        </div>
      </Modal>

      {/* 好友资料弹窗 */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title={selectedChat ? `${selectedChat.name} 的资料` : "好友资料"}
        size="lg"
      >
        {selectedChat && (
          <div className="p-4">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-4">
                {selectedChat.avatar}
              </div>
              <h3 className="font-bold text-2xl mb-2">{selectedChat.name}</h3>
              <div className={`text-sm font-medium mb-2 ${selectedChat.status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
                {selectedChat.status === 'online' ? '在线' : selectedChat.status}
              </div>
            </div>

            {/* 好友详细信息 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">性别</div>
                    <div className="text-base font-medium">{selectedChat.gender || '未设置'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">出生年月日</div>
                    <div className="text-base font-medium">{selectedChat.birthDate || '未设置'}</div>
                  </div>
                </div>

                {/* 联系信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">所在地</div>
                    <div className="text-base font-medium">{selectedChat.location || '未设置'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">联系方式</div>
                    <div className="text-base font-medium truncate">{selectedChat.contact || '未设置'}</div>
                  </div>
                </div>

                {/* ID和活跃状态 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">用户ID</div>
                    <div className="text-base font-medium">{selectedChat.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">最后活跃</div>
                    <div className={`text-base font-medium ${selectedChat.status === 'online' ? 'text-green-500' : ''}`}>
                      {selectedChat.status === 'online' ? '在线' : selectedChat.status || '未知'}
                    </div>
                  </div>
                </div>

                {/* 个人兴趣 */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">理财感悟</div>
                  <div className="text-base font-medium leading-relaxed">{selectedChat.investmentPhilosophy || '未设置'}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">个人爱好</div>
                  <div className="text-base font-medium leading-relaxed">{selectedChat.hobbies || '未设置'}</div>
                </div>
              </div>
            </div>

            <button
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              onClick={() => setShowProfileModal(false)}
            >
              关闭
            </button>
          </div>
        )}
      </Modal>

      {/* 拉黑确认弹窗 */}
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title="确认拉黑"
        size="sm"
      >
        <div className="p-4">
          <p className="text-center text-gray-700 mb-4">确认要拉黑 {selectedChat?.name} 吗？</p>
          <div className="flex gap-2">
            <button
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowBlockModal(false)}
            >
              取消
            </button>
            <button
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              onClick={confirmBlockFriend}
            >
              确认拉黑
            </button>
          </div>
        </div>
      </Modal>

      {/* 删除好友弹窗 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="删除好友"
        size="sm"
      >
        <div className="p-4">
          <p className="text-center text-gray-700 mb-4">确认要删除好友 {selectedChat?.name} 吗？此操作不可撤销。</p>
          <div className="flex gap-2">
            <button
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowDeleteModal(false)}
            >
              取消
            </button>
            <button
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              onClick={confirmDeleteFriend}
            >
              确认删除
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast组件 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}

export default FriendsPage