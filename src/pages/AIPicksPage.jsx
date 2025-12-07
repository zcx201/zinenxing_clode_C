import React, { useState, useEffect } from 'react'

const AIPicksPage = () => {
  const [currentTab, setCurrentTab] = useState('strategy')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [aiResponses, setAiResponses] = useState([])

  // 示例问题
  const exampleQuestions = [
    '推荐几只AI概念股',
    '新能源汽车股票怎么样',
    '茅台现在适合买入吗',
    '明天大盘走势预测',
    '医药板块的投资建议'
  ]

  // 智能选股数据
  const strategies = [
    {
      name: '增长价值策略',
      description: '基于估值与成长性打分',
      icon: 'fas fa-chart-line',
      stocks: [
        {
          name: '立讯精密',
          code: '002475',
          price: '56.78',
          change: '+8.2%',
          changeDirection: 'up',
          confidence: '88%',
          reason: '与苹果合作关系稳固，消费电子复苏'
        },
        {
          name: '药明康德',
          code: '603259',
          price: '85.60',
          change: '+7.5%',
          changeDirection: 'up',
          confidence: '85%',
          reason: '医药外包龙头，海外业务增长强劲'
        }
      ]
    },
    {
      name: '科技创新策略',
      description: '聚焦科技创新企业',
      icon: 'fas fa-microchip',
      stocks: [
        {
          name: '宁德时代',
          code: '300750',
          price: '214.50',
          change: '+6.8%',
          changeDirection: 'up',
          confidence: '82%',
          reason: '全球动力电池龙头，新能源汽车需求旺盛'
        },
        {
          name: '中兴通讯',
          code: '000063',
          price: '28.35',
          change: '+5.3%',
          changeDirection: 'up',
          confidence: '79%',
          reason: '5G建设加速，通信设备需求增加'
        }
      ]
    }
  ]

  // 对话示例
  const demoChatHistory = [
    {
      id: 1,
      type: 'user',
      content: '推荐几只AI概念股',
      time: '10:30'
    },
    {
      id: 2,
      type: 'ai',
      content: '根据分析，我推荐以下AI概念股：\n1. 科大讯飞(002230) - AI语音龙头\n2. 海康威视(002415) - AI安防应用\n3. 四维图新(002405) - 高精度地图\n建议关注技术面和基本面变化。',
      time: '10:31'
    }
  ]

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    // 用户消息
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: chatMessage,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setChatHistory(prev => [...prev, userMsg])
    setChatMessage('')

    // AI回复
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: `关于"${chatMessage}"，我分析如下：\n\n根据当前市场和技术面分析，相关股票表现较好。建议关注基本面稳健、成长性明确的优质标的。具体个股需要结合您的风险偏好进一步评估。`,
        time: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      setChatHistory(prev => [...prev, aiMsg])
    }, 1500)
  }

  const handleExampleClick = (question) => {
    setChatMessage(question)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderStrategyTab = () => (
    <div className="ai-recommendation">
      {strategies.map((strategy, index) => (
        <div key={index} className="strategy-section">
          <div className="strategy-header">
            <div className="strategy-icon">
              <span className={strategy.icon}></span>
            </div>
            <div className="strategy-info">
              <div className="strategy-name">{strategy.name}</div>
              <div className="strategy-desc">{strategy.description}</div>
            </div>
          </div>

          <div className="recommend-stocks">
            {strategy.stocks.map((stock, stockIndex) => (
              <div key={stockIndex} className="stock-card">
                <div className="stock-card-header">
                  <div className="stock-name-code">
                    <div className="stock-name">{stock.name}</div>
                    <div className="stock-code">{stock.code}</div>
                  </div>
                  <div className="confidence-score">{stock.confidence}</div>
                </div>
                <div className="stock-price">{stock.price}</div>
                <div className={`price-change ${stock.changeDirection === 'up' ? 'change-up' : 'change-down'}`}>
                  {stock.change}
                </div>
                <div className="ai-reason">{stock.reason}</div>
                <div className="stock-actions">
                  <button className="add-favorite-btn">加自选</button>
                  <button className="view-detail-btn">查看详情</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderHistoryTab = () => (
    <div className="chat-history">
      {chatHistory.length > 0 ? chatHistory.map((message) => (
        <div key={message.id} className={`message-bubble ${message.type}`}>
          <div className="bubble-content">
            {message.content.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <div className="bubble-time">{message.time}</div>
        </div>
      )) : (
        <div className="empty-history">
          <div className="empty-icon">
            <span className="fas fa-comment-alt"></span>
          </div>
          <div className="empty-text">暂无对话记录</div>
          <div className="empty-desc">开始与AI对话来获得投资建议</div>
        </div>
      )}
    </div>
  )

  return (
    <div className="ai-picks-page">
      {/* AI对话输入区域 */}
      <div className="ai-chat-input">
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              placeholder="向AI提问投资问题..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
          </div>
          <button
            className="send-chat-btn"
            onClick={handleSendMessage}
            disabled={!chatMessage.trim()}
          >
            发送
          </button>
        </div>

        <div className="chat-examples">
          {exampleQuestions.map((question, index) => (
            <div
              key={index}
              className="example-tag"
              onClick={() => handleExampleClick(question)}
            >
              {question}
            </div>
          ))}
        </div>
      </div>

      {/* AI标签切换 */}
      <div className="ai-tabs">
        <button
          className={`ai-tab ${currentTab === 'strategy' ? 'active' : ''}`}
          onClick={() => setCurrentTab('strategy')}
        >
          智能选股
        </button>
        <button
          className={`ai-tab ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentTab('history')}
        >
          对话历史
        </button>
      </div>

      {/* 标签内容 */}
      <div className="tab-content">
        {currentTab === 'strategy' ? renderStrategyTab() : renderHistoryTab()}
      </div>
    </div>
  )
}

export default AIPicksPage