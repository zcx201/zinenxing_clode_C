import React, { useState, useRef, useEffect } from 'react'
import Modal from '../components/Modal'
import favoritesManager from '../utils/favorites'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const NewsPage = () => {
  const [selectedNews, setSelectedNews] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const toastTimerRef = useRef(null)
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
        toastTimerRef.current = null
      }
    }
  }, [])

  const { currentUser } = useAuth()

  // 确保 favoritesManager 与当前用户保持一致（AuthContext 已做一次注入，这里以防）
  useEffect(() => {
    if (currentUser) {
      try {
        if (typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(currentUser.user_id)
      } catch (e) {
        // ignore
      }
    } else {
      try {
        if (typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(null)
      } catch (e) {
        // ignore
      }
    }
  }, [currentUser])
  // 加载更多状态管理
  const [displayedNews, setDisplayedNews] = useState(4)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const newsItems = [
    {
      id: 1,
      title: 'A股市场迎来政策利好，券商板块集体拉升',
      content: '证监会发布多项利好政策，资本市场改革加速推进。此次政策调整将进一步优化市场环境，提升市场活力，为投资者创造更好的投资机会。券商板块作为市场的重要组成部分，将直接受益于此次政策利好，预计未来一段时间内将保持活跃态势。',
      summary: '证监会发布多项利好政策，资本市场改革加速推进...',
      time: '2小时前',
      source: '财经日报',
      hot: true,
      tags: ['政策', '券商', '市场']
    },
    {
      id: 2,
      title: '新能源板块再度活跃，光伏产业迎政策春风',
      content: '国家能源局发布光伏产业支持政策，产业链全面受益。政策明确指出，将加大对光伏产业的支持力度，推动产业升级和技术创新。这将为新能源板块带来新的发展机遇，特别是光伏产业链相关企业将迎来快速发展期。',
      summary: '国家能源局发布光伏产业支持政策，产业链全面受益...',
      time: '4小时前',
      source: '投资快报',
      hot: true,
      tags: ['新能源', '光伏', '政策']
    },
    {
      id: 3,
      title: '人工智能概念股集体大涨，AI应用场景逐步落地',
      content: '各大AI公司发布最新产品，AI+应用前景广阔。随着人工智能技术的不断成熟，AI应用场景正在逐步落地，涵盖了医疗、金融、教育等多个领域。人工智能概念股因此受到市场青睐，股价表现强劲。',
      summary: '各大AI公司发布最新产品，AI+应用前景广阔...',
      time: '6小时前',
      source: '科技前沿',
      tags: ['人工智能', '科技', '应用']
    },
    {
      id: 4,
      title: '央行降准释放流动性，市场预期稳中向好',
      content: '央行宣布降准0.5个百分点，释放长期资金约1.2万亿。此次降准将有效缓解市场流动性压力，支持实体经济发展。市场预期经济将保持稳中向好的发展态势，投资者信心得到进一步提升。',
      summary: '央行宣布降准0.5个百分点，释放长期资金约1.2万亿...',
      time: '8小时前',
      source: '金融时报',
      tags: ['央行', '降准', '流动性']
    },
    {
      id: 5,
      title: '证监会发布投资者保护新规',
      content: '进一步完善投资者适当性管理，提升市场透明度，保护中小投资者合法权益。新规将从信息披露、风险提示、适当性匹配等多个方面加强投资者保护。',
      summary: '进一步完善投资者适当性管理，提升市场透明度...',
      time: '2小时前',
      source: '证券时报',
      tags: ['政策', '监管', '投资者保护']
    },
    {
      id: 6,
      title: '外资持续加仓A股，本月净流入超500亿',
      content: '北向资金连续10日净买入，重点布局消费和科技板块。分析人士认为，外资流入反映了国际投资者对中国经济和A股市场的长期信心。',
      summary: '北向资金连续10日净买入，重点布局消费和科技板块...',
      time: '1小时前',
      source: '财经网',
      tags: ['外资', '北向资金', '市场']
    },
    {
      id: 7,
      title: '房地产板块触底反弹，多家房企获融资支持',
      content: '政策支持下，房地产板块连续三日上涨。多家房企获得银行融资支持，市场预期行业将逐步企稳回升。',
      summary: '政策支持下，房地产板块连续三日上涨...',
      time: '30分钟前',
      source: '地产观察',
      tags: ['房地产', '政策', '融资']
    },
    {
      id: 8,
      title: '科技股领涨，半导体板块涨幅超5%',
      content: '半导体板块集体大涨，多只个股涨停。受益于全球芯片需求复苏和国内自主可控政策推动，板块表现强劲。',
      summary: '半导体板块集体大涨，多只个股涨停...',
      time: '45分钟前',
      source: '科技日报',
      tags: ['科技', '半导体', '芯片']
    },
    {
      id: 9,
      title: '消费板块回暖，白酒股表现亮眼',
      content: '消费板块迎来反弹，白酒股涨幅居前。市场预期随着经济复苏，消费需求将逐步释放，板块有望持续走强。',
      summary: '消费板块迎来反弹，白酒股涨幅居前...',
      time: '1小时前',
      source: '消费观察',
      tags: ['消费', '白酒', '经济复苏']
    },
    {
      id: 10,
      title: '碳中和政策持续推进，环保板块迎来机遇',
      content: '国家发改委发布多项碳中和相关政策，环保板块受益明显。市场预期环保产业将迎来长期发展机遇。',
      summary: '国家发改委发布多项碳中和相关政策...',
      time: '2小时前',
      source: '环保时报',
      tags: ['环保', '碳中和', '政策']
    }
  ]

  const handleNewsClick = (news) => {
    setSelectedNews(news)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleFavorite = async () => {
    if (!selectedNews) return
    try {
      // 尝试使用 API 添加新闻收藏
      await api.favorites.addFavorite({ type: 'news', title: selectedNews.title, source: selectedNews.source, time: selectedNews.time })
      setToastMessage('收藏成功')
    } catch (e) {
      // 回退到本地实现以保证兼容性
      try {
        if (typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(currentUser ? currentUser.user_id : null)
        const success = favoritesManager.addToFavorites({ ...selectedNews, type: 'news' })
        setToastMessage(success ? '收藏成功' : '已收藏')
      } catch (err) {
        setToastMessage('收藏失败，请稍后再试')
      }
    }
    setShowToast(true)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setShowToast(false), 2000)
  }

  // 加载更多新闻
  const loadMoreNews = () => {
    // 如果正在加载或没有更多内容，不执行
    if (isLoading || !hasMore) return
    
    // 设置加载状态
    setIsLoading(true)
    
    // 模拟网络请求延迟（0.7秒）
    setTimeout(() => {
      // 计算新的显示数量
      const newDisplayedNews = displayedNews + 3
      
      // 更新显示数量
      setDisplayedNews(newDisplayedNews)
      
      // 检查是否还有更多新闻
      if (newDisplayedNews >= newsItems.length) {
        setHasMore(false)
      }
      
      // 结束加载状态
      setIsLoading(false)
    }, 700)
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">速递时事</h1>
        <p className="text-gray-600">AI推送财经新闻</p>
      </div>

      <div className="space-y-4">
        {newsItems.slice(0, displayedNews).map((news, index) => (
          <div 
            key={index} 
            className="bg-white rounded-card shadow-card p-5 pt-6 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleNewsClick(news)}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full mb-3">
                <span className="fas fa-newspaper text-blue-600 text-xl"></span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{news.title}</h3>
              <p className="text-gray-500 text-xs leading-loose h-10 flex items-center justify-center">
                {news.summary.split('').reduce((acc, char, idx) => {
                  if (idx > 0 && idx % 3 === 0) {
                    return acc + '\n' + char
                  }
                  return acc + char
                }, '')}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2 w-full">
                <span>{news.source}</span>
                <span>{news.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center pb-4">
        {hasMore ? (
          <button 
            className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={loadMoreNews}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                正在加载...
              </span>
            ) : (
              '加载更多'
            )}
          </button>
        ) : (
          <div className="text-gray-500 text-sm">
            没有更多内容
          </div>
        )}
      </div>

      {/* 新闻详情弹窗 - 居中显示 */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="新闻详情" size="lg">
        {selectedNews && (
          <div className="text-gray-900">
            {/* 新闻标题 */}
            <h2 className="text-xl font-bold leading-tight mb-3">{selectedNews.title}</h2>
            
            {/* 来源信息 */}
            <div className="text-sm text-gray-500 mb-4">
              <span>{selectedNews.source}</span>
              <span className="mx-2">·</span>
              <span>{selectedNews.time}</span>
            </div>
            
            {/* 分隔线 */}
            <div className="border-b border-gray-200 mb-5"></div>
            
            {/* 新闻内容区域 - 可滚动 */}
            <div className="text-gray-700 leading-relaxed text-base mb-6">
              {selectedNews.content}
            </div>
            
            {/* 标签区域 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedNews.tags.map((tag, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* 操作按钮区域 */}
            <div className="flex gap-3">
              <button 
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                onClick={handleFavorite}
              >
                <span className="fas fa-star mr-2"></span>收藏
              </button>
              <button 
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <span className="fas fa-share-alt mr-2"></span>分享
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )

}

export default NewsPage