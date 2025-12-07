import React, { useState, useEffect } from 'react'

const FriendsPage = () => {
  const [currentTab, setCurrentTab] = useState('messages')
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  // 模拟好友数据
  const friendsList = [
    {
      id: '1001',
      name: '张财经',
      status: 'online',
      avatar: '张',
      lastMessage: '我觉得科技板块下周会有不错的表现，特别是AI概念...',
      lastTime: '10:23',
      unread: 3
    },
    {
      id: '1002',
      name: '李股神',
      status: '2小时前活跃',
      avatar: '李',
      lastMessage: '明天准备加仓宁德时代，你觉得这个位置怎么样？',
      lastTime: '昨天',
      unread: 0
    },
    {
      id: '1003',
      name: '王趋势',
      status: 'online',
      avatar: '王',
      lastMessage: '最近市场波动很大，建议控制仓位',
      lastTime: '3小时前',
      unread: 0
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

  if (selectedChat) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-user">
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
          <div className="back-btn" onClick={backToMessageList}>
            <span className="fas fa-arrow-left"></span>
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
    )
  }

  return (
    <>
      <div className="chat-tabs">
        <button
          className={`chat-tab ${currentTab === 'messages' ? 'active' : ''}`}
          onClick={() => setCurrentTab('messages')}
        >
          消息
        </button>
      </div>

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
  )
}

export default FriendsPage