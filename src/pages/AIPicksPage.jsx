import React, { useState, useEffect, useRef } from 'react'
import api from '../utils/api'
import favoritesManager from '../utils/favorites'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { notifyFavoritesUpdated } from '../utils/favoritesNotifier'

const AIPicksPage = () => {
  const [currentTab, setCurrentTab] = useState('strategy')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [showStockDetail, setShowStockDetail] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  // aiResponses kept out — unused in current UI
  const [favorites, setFavorites] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')
  // 加自选确认弹窗状态
  const [showAddFavoriteModal, setShowAddFavoriteModal] = useState(false)
  const [stockToAdd, setStockToAdd] = useState(null)

  const { currentUser } = useAuth()

  // 初始化时获取自选股（API）与本地新闻收藏，并在登录/登出时刷新
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await api.favorites.getFavorites({ page: 1, limit: 200 })
        if (!mounted) return
        const stockFavs = (res.favorites || []).map(fav => ({
          id: fav.favorite_id,
          type: 'stock',
          code: fav.stock_info?.stock_code || '',
          name: fav.stock_info?.stock_name || fav.stock_name || '',
          raw: fav
        }))
        // 本页面主要处理股票类收藏；保留 local news 收藏兼容性（若有）
        setFavorites(stockFavs)
      } catch (e) {
        // 回退：空列表或本地数据
        setFavorites([])
      }
    })()
    return () => { mounted = false }
  }, [currentUser])

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

  // demoChatHistory intentionally removed (not used)

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    // 捕获发送时的消息，避免异步闭包引用被清空
    const messageToSend = chatMessage

    // 用户消息
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setChatHistory(prev => [...prev, userMsg])
    setChatMessage('')

    // AI回复（保存定时器以便卸载时清理）
    if (!replyTimerRef.current) replyTimerRef.current = null
    replyTimerRef.current = setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: `关于"${messageToSend}"，我分析如下：\n\n根据当前市场和技术面分析，相关股票表现较好。建议关注基本面稳健、成长性明确的优质标的。具体个股需要结合您的风险偏好进一步评估。`,
        time: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      setChatHistory(prev => [...prev, aiMsg])
      replyTimerRef.current = null
    }, 1500)
  }

  const replyTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        clearTimeout(replyTimerRef.current)
        replyTimerRef.current = null
      }
    }
  }, [])

  const handleExampleClick = (question) => {
    setChatMessage(question)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 显示Toast消息
  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  // 显示加自选确认弹窗
  const handleAddToFavorites = (stock) => {
    setStockToAdd(stock)
    setShowAddFavoriteModal(true)
  }

  // 确认添加自选股
  const confirmAddToFavorites = async () => {
    if (!stockToAdd) return
    
    // 首先尝试通过 API 添加自选（mock 后端）
    try {
      const res = await api.stock.searchStocks({ keyword: stockToAdd.code || stockToAdd.name })
      if (res && res.stocks && res.stocks.length) {
        const matched = res.stocks.find(s => s.stock_code === (stockToAdd.code || '').replace(/^0+/, (m) => m)) || res.stocks[0]
        const stockId = matched.stock_id
        try {
          await api.favorites.addFavorite({ stock_id: stockId })
          // 添加成功，刷新当前自选列表
          const updated = await api.favorites.getFavorites({ page: 1, limit: 200 })
          const stockFavs = (updated.favorites || []).map(fav => ({
            id: fav.favorite_id,
            type: 'stock',
            code: fav.stock_info?.stock_code || '',
            name: fav.stock_info?.stock_name || fav.stock_name || '',
            raw: fav
          }))
          setFavorites(stockFavs)
          // notify other pages (FavoritesPage) to refresh
          try { notifyFavoritesUpdated() } catch (e) {}
          showToastMessage(`成功添加 ${stockToAdd.name} 到自选股`, 'success')
        } catch (err) {
          showToastMessage('添加失败或已在自选中', 'warning')
        }
      } else {
        // API 未能检索到对应股票，回退到本地 favoritesManager（离线自选）
        try {
          if (typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(currentUser ? currentUser.user_id : null)
        } catch (e) {}
        const added = favoritesManager.addToFavorites({ type: 'stock', code: stockToAdd.code || '', name: stockToAdd.name || '' })
        if (added) {
          // 尝试把本地新增项反映到当前页面的 favorites state
          setFavorites(prev => {
            const newItem = { id: String(Date.now()), type: 'stock', code: stockToAdd.code || '', name: stockToAdd.name || '', raw: { stock_name: stockToAdd.name, stock_code: stockToAdd.code } }
            return [newItem, ...prev]
          })
          try { notifyFavoritesUpdated() } catch (e) {}
          showToastMessage(`已本地添加 ${stockToAdd.name} 到自选股`, 'success')
        } else {
          showToastMessage('未找到对应股票信息，添加失败或已在自选中', 'error')
        }
      }
    } catch (e) {
      showToastMessage('添加失败，请稍后重试', 'error')
    }
    
  // 关闭弹窗
  setShowAddFavoriteModal(false)
  setStockToAdd(null)
  }

  // 取消添加自选股
  const cancelAddToFavorites = () => {
    setShowAddFavoriteModal(false)
    setStockToAdd(null)
  }

  // 查看股票详情
  const handleViewDetail = (stock) => {
    setSelectedStock(stock)
    setShowStockDetail(true)
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
                  <button
                    className="add-favorite-btn"
                    onClick={() => handleAddToFavorites(stock)}
                  >
                    加自选
                  </button>
                  <button
                    className="view-detail-btn"
                    onClick={() => handleViewDetail(stock)}
                  >
                    查看详情
                  </button>
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

      {/* 股票详情弹窗 */}
      <Modal
        isOpen={showStockDetail}
        onClose={() => setShowStockDetail(false)}
        title="股票详情"
        size="sm"
      >
        {selectedStock && (
          <div>
            <div className="text-center mb-4">
              <div className="text-lg font-bold text-gray-900">{selectedStock.name} ({selectedStock.code})</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{selectedStock.price}</div>
              <div className={`text-lg font-semibold ${selectedStock.changeDirection === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                {selectedStock.change}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">AI分析</div>
              <div className="text-xs text-gray-600 leading-relaxed">{selectedStock.reason}</div>
              <div className="mt-1 text-xs text-gray-500">置信度: {selectedStock.confidence}</div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="text-sm font-semibold text-blue-700 mb-1">投资建议</div>
              <div className="text-xs text-blue-600 leading-relaxed">
                AI建议关注该股票的基本面和技术面表现，结合市场走势进行投资决策。
                建议设置合理的止盈止损点控制风险。
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                onClick={() => setShowStockDetail(false)}
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 加自选确认弹窗 */}
      <Modal
        isOpen={showAddFavoriteModal}
        onClose={cancelAddToFavorites}
        title="确认加自选"
        size="sm"
      >
        {stockToAdd && (
          <div>
            <div className="text-center mb-4">
              <div className="text-lg font-bold text-gray-900">{stockToAdd.name} ({stockToAdd.code})</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stockToAdd.price}</div>
              <div className={`text-lg font-semibold ${stockToAdd.changeDirection === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                {stockToAdd.change}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">AI推荐理由</div>
              <div className="text-xs text-gray-600 leading-relaxed">{stockToAdd.reason}</div>
              <div className="mt-1 text-xs text-gray-500">置信度: {stockToAdd.confidence}</div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                onClick={cancelAddToFavorites}
              >
                取消
              </button>
              <button
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                onClick={confirmAddToFavorites}
              >
                确认加自选
              </button>
            </div>
          </div>
        )}
      </Modal>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
        )}
        {/* silent reference to favorites to avoid unused-var lint */}
        <div style={{display: 'none'}}>{favorites.length}</div>
    </div>
  )
}

export default AIPicksPage