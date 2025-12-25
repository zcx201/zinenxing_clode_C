import React, { useState, useEffect } from 'react'
import favoritesManager from '../utils/favorites'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import { addFavoritesUpdatedListener } from '../utils/favoritesNotifier'
import { useNavigate } from 'react-router-dom'

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')
  // 参与讨论弹窗状态
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [discussionContent, setDiscussionContent] = useState('')
  const [selectedDiscussion, setSelectedDiscussion] = useState(null)

  useEffect(() => {
    // 初始载入：优先从 mock API 获取股票类收藏；新闻类收藏仍从本地 favoritesManager 获取以保持兼容
    let mounted = true
    const load = async () => {
      try {
        const [stockRes, newsRes] = await Promise.all([
          api.favorites.getFavorites({ page: 1, limit: 200 }),
          api.favorites.getFavorites({ page: 1, limit: 200, type: 'news' })
        ])
        if (!mounted) return
        const stockFavs = (stockRes.favorites || []).map(fav => ({
          id: fav.favorite_id,
          type: 'stock',
          code: fav.stock_info?.stock_code || '',
          name: fav.stock_info?.stock_name || fav.stock_name || '',
          raw: fav
        }))
        const newsFavs = (newsRes.favorites || []).map(fav => ({
          id: fav.favorite_id,
          type: 'news',
          title: fav.title,
          source: fav.source,
          time: fav.time,
          raw: fav
        }))
        // also merge any local-only favorites (fallbacks) to ensure items added via local manager are visible
        try {
          const local = favoritesManager.getFavorites() || []
          const localMapped = local.map(fav => {
            if (fav.type === 'stock') {
              return {
                id: fav.id || fav.favorite_id || String(fav.stock_id || fav.code || Date.now()),
                type: 'stock',
                code: fav.code || fav.stock_code || (fav.raw && fav.raw.stock_info && fav.raw.stock_info.stock_code) || '',
                name: fav.name || fav.stock_name || (fav.raw && fav.raw.stock_info && fav.raw.stock_info.stock_name) || fav.title || '',
                raw: fav
              }
            }
            return {
              id: fav.id || fav.favorite_id || String(Date.now()),
              type: 'news',
              title: fav.title || fav.name || '',
              source: fav.source || (fav.raw && fav.raw.source) || '',
              time: fav.time || '',
              raw: fav
            }
          })

          const combined = [...stockFavs, ...newsFavs]
          // dedupe: by (type, code) for stocks, (type, title) for news
          const existsKey = new Set(combined.map(it => it.type === 'stock' ? `stock:${it.code}` : `news:${it.title}`))
          for (const l of localMapped) {
            const key = l.type === 'stock' ? `stock:${l.code}` : `news:${l.title}`
            if (!existsKey.has(key) && ((l.type === 'stock' && l.code) || (l.type === 'news' && l.title))) {
              combined.push(l)
            }
          }
          setFavorites(combined)
        } catch (e) {
          setFavorites([...stockFavs, ...newsFavs])
        }
      } catch (e) {
        // 如果 API 出错，回退到本地收藏
        if (!mounted) return
        setFavorites(favoritesManager.getFavorites())
      }
    }
    load()
    // listen for favorites updates from other pages/tabs
    const removeListener = addFavoritesUpdatedListener(() => {
      // reload favorites when notified
      load()
    })

    return () => {
      mounted = false
      if (typeof removeListener === 'function') removeListener()
    }
  }, [])

  const { currentUser } = useAuth()

  // 在用户切换时刷新收藏列表
  useEffect(() => {
    // 当前用户切换时刷新收藏（优先 API）
    let mounted = true
    ;(async () => {
      try {
        if (currentUser && typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(currentUser.user_id)
        const [stockRes, newsRes] = await Promise.all([
          api.favorites.getFavorites({ page: 1, limit: 200 }),
          api.favorites.getFavorites({ page: 1, limit: 200, type: 'news' })
        ])
        if (!mounted) return
        const stockFavs = (stockRes.favorites || []).map(fav => ({
          id: fav.favorite_id,
          type: 'stock',
          code: fav.stock_info?.stock_code || '',
          name: fav.stock_info?.stock_name || fav.stock_name || '',
          raw: fav
        }))
        const newsFavs = (newsRes.favorites || []).map(fav => ({
          id: fav.favorite_id,
          type: 'news',
          title: fav.title,
          source: fav.source,
          time: fav.time,
          raw: fav
        }))
        setFavorites([...stockFavs, ...newsFavs])
      } catch (e) {
        if (!mounted) return
        setFavorites(favoritesManager.getFavorites())
      }
    })()
    return () => { mounted = false }
  }, [currentUser])

  // 显示Toast消息
  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  // 参与讨论相关函数
  const handleJoinDiscussion = (discussion) => {
    setSelectedDiscussion(discussion)
    setDiscussionContent('')
    setShowDiscussionModal(true)
  }

  const handleSubmitDiscussion = () => {
    if (!discussionContent.trim()) return
    
    // 这里可以添加提交讨论的逻辑
    // 将新回复加入到对应的 discussion 对象的 replies 中，并增加评论计数
    try {
      const discussionToUpdate = selectedDiscussion || selectedTopic;
      if (discussionToUpdate && discussionToUpdate.id) {
        setDiscussions(prev => prev.map(d => {
          if (d.id === discussionToUpdate.id) {
            const replies = d.replies ? [...d.replies] : []
            // 生成唯一id
            const newReplyId = Math.max(...replies.map(r => r.id || 0), 0) + 1;
            replies.unshift({ 
              id: newReplyId, 
              user: '我', 
              content: discussionContent, 
              time: '刚刚' 
            })
            return { ...d, replies, comments: (d.comments || 0) + 1 }
          }
          return d
        }))
        showToastMessage('评论发表成功！', 'success')
      }
    } catch (e) {
      showToastMessage('评论发表失败，请稍后重试！', 'error')
    }
    setShowDiscussionModal(false)
    setShowTopicDetail(false)
    setDiscussionContent('')
  }

  const handleCloseDiscussionModal = () => {
    setShowDiscussionModal(false)
    setSelectedDiscussion(null)
  }

  // 发表主题相关
  const [newDiscussion, setNewDiscussion] = useState('')

  const handlePublishDiscussion = () => {
    if (!newDiscussion.trim()) return
    
    // 创建新的讨论主题
    const newTopic = {
      user: '我',
      content: newDiscussion,
      time: '刚刚',
      likes: 0,
      comments: 0
    }
    
    // 添加到讨论列表开头
    setDiscussions(prev => [newTopic, ...prev])
    // 清空输入框
    setNewDiscussion('')
    // 显示成功提示
    showToastMessage('主题发表成功！', 'success')
  }

  // 移除收藏
  const handleRemoveFavorite = async (id) => {
    // 如果是 API 管理的自选股（type === 'stock' 并且 id 为 favorite_id），调用 API；否则回退到本地 favoritesManager
    const target = favorites.find(f => f.id === id)
    if (!target) return
    try {
      // 支持 API 管理的股票与新闻收藏
      await api.favorites.deleteFavorite(id)
      // 重新拉取股票与新闻收藏
      const [stockRes, newsRes] = await Promise.all([
        api.favorites.getFavorites({ page: 1, limit: 200 }),
        api.favorites.getFavorites({ page: 1, limit: 200, type: 'news' })
      ])
      const stockFavs = (stockRes.favorites || []).map(fav => ({
        id: fav.favorite_id,
        type: 'stock',
        code: fav.stock_info?.stock_code || '',
        name: fav.stock_info?.stock_name || fav.stock_name || '',
        raw: fav
      }))
      const newsFavs = (newsRes.favorites || []).map(fav => ({
        id: fav.favorite_id,
        type: 'news',
        title: fav.title,
        source: fav.source,
        time: fav.time,
        raw: fav
      }))
      setFavorites([...stockFavs, ...newsFavs])
      showToastMessage('已从收藏中移除', 'success')
    } catch (e) {
      showToastMessage('移除失败，请稍后重试', 'error')
    }
  }

  // 模拟股票数据
  const mockStockData = [
    { name: '贵州茅台', code: '600519', price: '1,865.00', change: '+2.15%', isPositive: true },
    { name: '宁德时代', code: '300750', price: '214.50', change: '-1.23%', isPositive: false },
    { name: '招商银行', code: '600036', price: '35.67', change: '+0.85%', isPositive: true },
    { name: '中国平安', code: '601318', price: '48.92', change: '-0.56%', isPositive: false }
  ]

  // 分离股票和新闻收藏
  const favoriteStocks = favorites.filter(item => item.type === 'stock')
  const favoriteNews = favorites.filter(item => item.type === 'news')

  // 社区讨论状态
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      user: '股市老李',
      content: '新能源板块最近回调是不是加仓好机会？',
      time: '2小时前',
      likes: 24,
      comments: 8,
      replies: [
        { id: 1, user: '股民小张', content: '我觉得可以适量加仓，长期来看新能源还是有前景的', time: '1小时前' },
        { id: 2, user: '投资专家', content: '建议再观察一下，等回调企稳再进场', time: '30分钟前' }
      ]
    },
    {
      id: 2,
      user: '投资小王',
      content: '医疗股最近表现不错，大家怎么看？',
      time: '4小时前',
      likes: 15,
      comments: 5,
      replies: [
        { id: 3, user: '医生小李', content: '医疗板块政策利好不断，值得关注', time: '3小时前' }
      ]
    },
    {
      id: 3,
      user: '财经达人',
      content: '分享一个挖掘小盘股的方法...',
      time: '6小时前',
      likes: 36,
      comments: 12,
      replies: [
        { id: 4, user: '散户小王', content: '学习了，感谢分享！', time: '5小时前' },
        { id: 5, user: '分析师老张', content: '这个方法不错，不过需要结合基本面分析', time: '4小时前' }
      ]
    }
  ]);

  // 主题详情弹窗状态
  const [showTopicDetail, setShowTopicDetail] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // 跳转与新闻详情状态
  const navigate = useNavigate()
  const [selectedNewsItem, setSelectedNewsItem] = useState(null)
  const [showNewsModal, setShowNewsModal] = useState(false)

  // 处理主题点击，打开主题详情
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic)
    setShowTopicDetail(true)
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">自选嗨吧</h1>
        <p className="text-gray-600">自选股与收藏新闻</p>
      </div>

      {/* 我的自选股 */}
      <div className="bg-white rounded-card shadow-card p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">我的自选股</h2>
          <div className="text-sm text-gray-500">共 {favoriteStocks.length} 只股票</div>
        </div>

        {favoriteStocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <div>暂无自选股</div>
            <div className="text-sm mt-1">去AI选股添加您关注的股票吧！</div>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteStocks.map((stock, index) => {
              // 查找模拟数据中的股票信息
              const stockInfo = mockStockData.find(s => s.code === stock.code) || stock
              return (
                <div key={index} onClick={() => {
                  // 点击股票卡片：跳转到股票详情
                  if (stock && (stock.code || (stock.raw && stock.raw.stock_info && stock.raw.stock_info.stock_code))) {
                    const code = stock.code || (stock.raw && stock.raw.stock_info && stock.raw.stock_info.stock_code)
                    navigate(`/stock/${encodeURIComponent(code)}`, { state: { item: stock } })
                    return
                  }
                }} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold text-gray-900">{stock.name}</div>
                    <div className="text-sm text-gray-500">{stock.code}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{stockInfo.price || stock.price}</div>
                      <div className={`text-sm font-semibold ${
                        stockInfo.isPositive !== undefined
                          ? stockInfo.isPositive ? 'text-red-500' : 'text-green-500'
                          : stock.changeDirection === 'up' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {stockInfo.change || stock.change}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(stock.id) }}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="移除收藏"
                    >
                      <span className="fas fa-times"></span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 我的收藏新闻 */}
      <div className="bg-white rounded-card shadow-card p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">我的收藏新闻</h2>
          <div className="text-sm text-gray-500">共 {favoriteNews.length} 条新闻</div>
        </div>

        {favoriteNews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📰</div>
            <div>暂无收藏新闻</div>
            <div className="text-sm mt-1">去速递时事添加您关注的新闻吧！</div>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteNews.map((news, index) => (
              <div key={index} onClick={() => { setSelectedNewsItem(news); setShowNewsModal(true) }} className="p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold text-gray-900">{news.title}</div>
                        {((news.source === '课程') || (news.raw && news.raw.source === '课程')) && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">课程收藏</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{news.source}</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(news.id) }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="移除收藏"
                  >
                    <span className="fas fa-times"></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 社区讨论 */}
      <div className="bg-white rounded-card shadow-card p-4">
        <h2 className="text-lg font-bold mb-4">社区讨论</h2>
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id} 
              className="border-b border-gray-100 pb-4 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => handleTopicClick(discussion)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-900">{discussion.user}</div>
                <div className="text-sm text-gray-500">{discussion.time}</div>
              </div>
              <p className="text-gray-700 mb-3">{discussion.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                  <span className="fas fa-heart mr-1"></span>
                  <span className="mr-3">{discussion.likes}</span>
                  <span className="fas fa-comment mr-1"></span>
                  <span className="mr-3">{discussion.comments}</span>
                  <button 
                    className="text-primary-500 font-semibold hover:text-primary-700 transition-colors cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleJoinDiscussion(discussion) }}
                  >
                    参与讨论
                  </button>
                </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="发表你的观点..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-primary-500"
            value={newDiscussion}
            onChange={(e) => setNewDiscussion(e.target.value)}
          />
          <button 
            className="bg-primary-500 text-white px-4 py-2 rounded-r-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handlePublishDiscussion}
            disabled={!newDiscussion.trim()}
          >
            发表
          </button>
        </div>
      </div>

      {/* 主题详情弹窗 */}
      <Modal
        isOpen={showTopicDetail}
        onClose={() => setShowTopicDetail(false)}
        title="主题详情"
        size="lg"
      >
        {selectedTopic && (
          <div className="p-4">
            {/* 主题信息 */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-900">{selectedTopic.user}</div>
                <div className="text-sm text-gray-500">{selectedTopic.time}</div>
              </div>
              <div className="text-gray-700 mb-3">{selectedTopic.content}</div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="fas fa-heart mr-1"></span>
                <span className="mr-3">{selectedTopic.likes}</span>
                <span className="fas fa-comment mr-1"></span>
                <span className="mr-3">{selectedTopic.comments}</span>
              </div>
            </div>

            {/* 讨论列表标题 */}
            <div className="font-semibold text-lg mb-3">全部讨论 ({selectedTopic.replies?.length || 0})</div>

            {/* 讨论列表 */}
            <div className="space-y-4 mb-6">
              {selectedTopic.replies && selectedTopic.replies.length > 0 ? (
                selectedTopic.replies.map((reply) => (
                  <div key={reply.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-gray-900">{reply.user}</div>
                      <div className="text-xs text-gray-500">{reply.time}</div>
                    </div>
                    <div className="text-gray-700">{reply.content}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  暂无讨论，快来发表你的观点吧！
                </div>
              )}
            </div>

            {/* 参与讨论 */}
            <div className="mt-6">
              <div className="font-semibold text-lg mb-3">参与讨论</div>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[100px] mb-4"
                placeholder="写下你的观点..."
                value={discussionContent}
                onChange={(e) => setDiscussionContent(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setShowTopicDetail(false)
                    setDiscussionContent('')
                  }}
                >
                  取消
                </button>
                <button
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  onClick={() => {
                    if (discussionContent.trim()) {
                      handleSubmitDiscussion()
                      setShowTopicDetail(false)
                    }
                  }}
                  disabled={!discussionContent.trim()}
                >
                  发表评论
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 参与讨论弹窗 */}
      <Modal
        isOpen={showDiscussionModal}
        onClose={handleCloseDiscussionModal}
        title="参与讨论"
        size="sm"
      >
        <div className="p-4">
          {/* 讨论主题 */}
          {selectedDiscussion && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-1">{selectedDiscussion.content}</div>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span className="mr-3">{selectedDiscussion.user}</span>
                <span>{selectedDiscussion.time}</span>
              </div>
              {/* 已有回复（如果有） */}
              {selectedDiscussion.replies && selectedDiscussion.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                  {selectedDiscussion.replies.map((r, idx) => (
                    <div key={idx} className="p-2 bg-white rounded border text-sm">
                      <div className="text-xs text-gray-600 mb-1">{r.user} · {r.time}</div>
                      <div className="text-gray-700">{r.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* 评论输入框 */}
          <div className="mb-4">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[100px]"
              placeholder="写下你的观点..."
              value={discussionContent}
              onChange={(e) => setDiscussionContent(e.target.value)}
            />
          </div>
          
          {/* 操作按钮 */}
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={handleCloseDiscussionModal}
            >
              取消
            </button>
            <button
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              onClick={handleSubmitDiscussion}
              disabled={!discussionContent.trim()}
            >
              发表评论
            </button>
          </div>
        </div>
      </Modal>

      {/* 新闻/课程详情弹窗（来自我的收藏） */}
      <Modal
        isOpen={showNewsModal}
        onClose={() => { setShowNewsModal(false); setSelectedNewsItem(null) }}
        title={selectedNewsItem?.title || '详情'}
        size="sm"
      >
        {selectedNewsItem && (
          <div>
            <div className="mb-3 text-sm text-gray-700">
              <div className="font-semibold mb-2">来源：{selectedNewsItem.source}</div>
              <div className="text-xs text-gray-500">{selectedNewsItem.time}</div>
            </div>
            <div className="text-sm text-gray-700">
              {/* 如果 raw.content 存在则显示全文，否则显示简要 */}
              {selectedNewsItem.raw && selectedNewsItem.raw.content ? selectedNewsItem.raw.content : (selectedNewsItem.title || '')}
            </div>
            <div className="mt-4 flex justify-center">
              <button className="px-6 py-2 bg-primary-500 text-white rounded-lg" onClick={() => { setShowNewsModal(false); setSelectedNewsItem(null) }}>关闭</button>
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
    </div>
  )
}

export default FavoritesPage