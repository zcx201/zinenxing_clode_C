import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import api from '../utils/api'

const MarketPage = () => {
  const [currentTab, setCurrentTab] = useState('market')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')

  // 动态数据状态 - 初始值只包含基本结构，不包含实际数值数据
  const [indices, setIndices] = useState([
    { id: 'sh', name: '上证指数', value: '3,961.21', change: '-0.10%', isPositive: false },
    { id: 'sz', name: '深证成指', value: '13,568.09', change: '+0.23%', isPositive: true },
    { id: 'cy', name: '创业板指', value: '3,220.56', change: '-0.06%', isPositive: false },
    { id: 'hs300', name: '沪深300', value: '4,638.90', change: '-0.01%', isPositive: false },
    { id: 'sz50', name: '上证50', value: '3,031.57', change: '-0.10%', isPositive: false },
    { id: 'zxb', name: '中小板指', value: '8,264.98', change: '+0.00%', isPositive: true }
  ])

  const [hotStocks, setHotStocks] = useState([
    {
      name: '贵州茅台',
      code: '600519',
      price: '1391.41',
      change: '-0.76%',
      isPositive: false,
      industry: '白酒',
      marketValue: '17,443亿'
    },
    {
      name: '宁德时代',
      code: '300750',
      price: '367.68',
      change: '-0.44%',
      isPositive: false,
      industry: '新能源',
      marketValue: '16,812亿'
    },
    {
      name: '招商银行',
      code: '600036',
      price: '42.12',
      change: '+0.60%',
      isPositive: true,
      industry: '银行',
      marketValue: '10,549亿'
    },
    {
      name: '中国平安',
      code: '601318',
      price: '69.35',
      change: '-0.76%',
      isPositive: false,
      industry: '保险',
      marketValue: '12,654亿'
    },
    {
      name: '比亚迪',
      code: '002594',
      price: '99.50',
      change: '-0.71%',
      isPositive: false,
      industry: '汽车',
      marketValue: '9,043亿'
    }
  ])

  // 模拟板块数据（暂时保持不变，因为聚宽API可能没有直接的板块数据）
  const sectors = [
    { name: '白酒', change: '+2.5%', isPositive: true, leadingStock: '贵州茅台' },
    { name: '新能源', change: '+1.8%', isPositive: true, leadingStock: '宁德时代' },
    { name: '科技', change: '-0.5%', isPositive: false, leadingStock: '中兴通讯' },
    { name: '医药', change: '+0.9%', isPositive: true, leadingStock: '恒瑞医药' },
    { name: '金融', change: '-0.2%', isPositive: false, leadingStock: '招商银行' }
  ]

  // 模拟排行数据（暂时保持不变，因为聚宽API可能没有直接的排行数据）
  const rankings = [
    { rank: 1, name: '立讯精密', change: '+8.2%', isPositive: true, code: '002475' },
    { rank: 2, name: '药明康德', change: '+7.5%', isPositive: true, code: '603259' },
    { rank: 3, name: '三一重工', change: '+6.8%', isPositive: true, code: '600031' },
    { rank: 4, name: '中国中免', change: '+5.9%', isPositive: true, code: '601888' },
    { rank: 5, name: '东方财富', change: '+5.3%', isPositive: true, code: '300059' }
  ]

  // 模拟资金流向数据（暂时保持不变，因为聚宽API可能没有直接的资金流向数据）
  const capitalFlows = [
    { name: '北上资金', amount: '+28.5亿', isInflow: true, market: 'A股' },
    { name: '主力资金', amount: '+15.2亿', isInflow: true, market: '上证' },
    { name: '游资', amount: '-8.7亿', isInflow: false, market: '深证' },
    { name: '散户资金', amount: '-12.3亿', isInflow: false, market: '创业板' },
    { name: '机构资金', amount: '+23.1亿', isInflow: true, market: '沪深300' }
  ]

  // 获取指数数据
  const fetchIndicesData = async () => {
    try {
      const indexIds = ['sh', 'sz', 'cy', 'hs300', 'sz50', 'zxb']
      const updatedIndices = [...indices]
      
      // 并行获取所有指数数据
      const indexPromises = indexIds.map(async (id) => {
        const indexData = await api.getIndexData(id)
        console.log(`获取到指数 ${id} 数据:`, indexData)
        if (indexData && indexData.value && indexData.value !== '-') {
          const indexIndex = updatedIndices.findIndex(idx => idx.id === id)
          if (indexIndex !== -1) {
            updatedIndices[indexIndex] = indexData
          }
        }
      })
      
      await Promise.all(indexPromises)
      setIndices(updatedIndices)
      console.log('指数数据更新完成:', updatedIndices)
    } catch (error) {
      console.error('获取指数数据失败:', error)
    }
  }

  // 获取热门股票数据
  const fetchHotStocks = async () => {
    try {
      // 先获取热门股票列表
      const hotStockData = await api.getHotStocks()
      console.log('获取到热门股票数据:', hotStockData)
      
      // 如果获取到数据，更新热门股票列表
      if (Object.keys(hotStockData).length > 0) {
        const updatedHotStocks = hotStocks.map(stock => {
          const apiData = hotStockData[stock.code]
          if (apiData) {
            return {
              ...stock,
              price: apiData.price,
              change: apiData.change,
              isPositive: apiData.isPositive
            }
          }
          return stock
        })
        setHotStocks(updatedHotStocks)
        console.log('热门股票数据更新完成:', updatedHotStocks)
      } else {
        // 如果没有获取到数据，尝试逐个获取股票数据
        console.log('尝试逐个获取热门股票数据...')
        const updatedHotStocks = await Promise.all(hotStocks.map(async (stock) => {
          const stockData = await api.getStockPrice(stock.code)
          if (stockData) {
            return {
              ...stock,
              price: stockData.price,
              change: stockData.change,
              isPositive: stockData.isPositive
            }
          }
          return stock
        }))
        setHotStocks(updatedHotStocks)
        console.log('逐个获取热门股票数据完成:', updatedHotStocks)
      }
    } catch (error) {
      console.error('获取热门股票数据失败:', error)
    }
  }

  // 搜索功能
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        setSearchLoading(true)
        setSearchError('')
        
        try {
          // 使用聚宽API搜索股票
          const results = await api.searchStocks(searchQuery)
          if (results.length > 0) {
            // 获取搜索结果的实时价格数据
            const enhancedResults = await Promise.all(
              results.map(async (result) => {
                try {
                  // 获取股票的实时价格数据
                  const stockData = await api.getStockPrice(result.code)
                  if (stockData) {
                    return {
                      ...result,
                      price: stockData.price,
                      change: stockData.change,
                      isPositive: stockData.isPositive,
                      industry: result.industry || '-',
                      marketValue: '-' // 可以从API获取市值数据
                    }
                  }
                } catch (error) {
                  console.error(`获取股票 ${result.code} 数据失败:`, error)
                }

                // 如果没有实时数据，使用基础信息并添加默认值
                return {
                  ...result,
                  price: '-',
                  change: '0.00%',
                  isPositive: true,
                  industry: result.industry || '-',
                  marketValue: '-' 
                }
              })
            )

            setSearchResults(enhancedResults.slice(0, 10)) // 最多显示10条结果
          } else {
            setSearchResults([])
            setSearchError('未找到相关股票')
          }
        } catch (error) {
          console.error('搜索股票失败:', error)
          setSearchResults([])
          setSearchError('搜索失败，请检查网络连接或稍后重试')
        } finally {
          setSearchLoading(false)
        }
      } else {
        setSearchResults([])
        setSearchError('')
        setSearchLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSearchResults, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])
  
  // 处理回车键搜索
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length === 1) {
        // 唯一匹配时直接跳转
        handleViewDetail(searchResults[0])
      } else if (searchResults.length > 1) {
        // 多个匹配时聚焦到搜索结果
        const resultsContainer = document.querySelector('.search-results')
        if (resultsContainer) {
          resultsContainer.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (searchQuery.trim() && !searchLoading) {
        // 无结果时提示
        setSearchError('未找到相关股票')
      }
    }
  }

  // 初始化获取数据
  useEffect(() => {
    fetchIndicesData()
    fetchHotStocks()
    
    // 每15分钟更新一次数据（900000毫秒）
    const interval = setInterval(() => {
      fetchIndicesData()
      fetchHotStocks()
    }, 900000)
    
    return () => clearInterval(interval)
  }, [])

  // 交互处理：路由跳转至详情页（优先通过 location.state 传递数据）
  const handleViewDetail = (stock) => {
    const code = stock.code || stock.stock_code || stock.id || stock.name
    navigate(`/stock/${encodeURIComponent(code)}`, { state: { item: stock } })
  }

  const handleViewIndex = (idx) => {
    navigate(`/index/${encodeURIComponent(idx.id)}`, { state: { item: idx } })
  }

  const handleViewSector = (sector) => {
    navigate(`/sector/${encodeURIComponent(sector.name)}`, { state: { item: sector } })
  }

  // 点击排行项：跳转到股票详情（使用 rank.code）
  const handleViewRank = (rankItem) => {
    if (rankItem && rankItem.code) {
      navigate(`/stock/${encodeURIComponent(rankItem.code)}`, { state: { item: { name: rankItem.name, code: rankItem.code } } })
    } else {
      setToastMessage('无法定位股票详情')
      setToastType('warning')
      setShowToast(true)
    }
  }

  // 点击资金流项：尝试把市场名映射到指数 id 并跳转
  const handleViewCapital = (flow) => {
    if (!flow) return
    const map = {
      '上证': 'sh',
      '上证指数': 'sh',
      '深证': 'sz',
      '深证成指': 'sz',
      '创业板': 'cy',
      '创业板指': 'cy',
      '沪深300': 'hs300',
      'A股': 'sh'
    }

    // 先尝试直接匹配 map key
    let idxId = null
    Object.keys(map).forEach(k => {
      if (flow.market && flow.market.includes(k)) idxId = map[k]
    })

    // 如果找到了对应指数 id，导航到 index 详情
    if (idxId) {
      const idxObj = indices.find(i => i.id === idxId)
      if (idxObj) {
        navigate(`/index/${encodeURIComponent(idxObj.id)}`, { state: { item: idxObj } })
        return
      }
    }

    // 回退：导航到行情页并提示
    setToastMessage('未找到对应指数，已打开行情页')
    setToastType('info')
    setShowToast(true)
    navigate('/market')
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'market':
        return (
          <>
            <div className="section-title">
              <span>热门股票</span>
            </div>
            <div className="stock-list">
              {hotStocks.map((stock, index) => (
                <div key={index} className="stock-item" onClick={() => handleViewDetail(stock)}>
                  <div className="stock-info">
                    <div className="stock-name-code">
                      <div className="stock-name">{stock.name}</div>
                      <div className="stock-code">{stock.code}</div>
                    </div>
                    <div className="stock-tags">
                      <div className="stock-tag">{stock.industry}</div>
                      <div className="stock-tag">{stock.marketValue}</div>
                    </div>
                  </div>
                  <div className="stock-price-info">
                    <div className="stock-price">{stock.price}</div>
                    <div className={`stock-change ${stock.isPositive ? 'change-up' : 'change-down'}`}>
                      {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )

      case 'sector':
        return (
          <>
            <div className="section-title">
              <span>板块涨跌</span>
            </div>
            <div className="sector-list">
              {sectors.map((sector, index) => (
                <div key={index} className="sector-item" onClick={() => handleViewSector(sector)}>
                  <div className="sector-info">
                    <div className="sector-name">{sector.name}</div>
                    <div className="sector-leader">领涨: {sector.leadingStock}</div>
                  </div>
                  <div className={`sector-change ${sector.isPositive ? 'change-up' : 'change-down'}`}>
                    {sector.change}
                  </div>
                </div>
              ))}
            </div>
          </>
        )

      case 'rank':
        return (
          <>
            <div className="section-title">
              <span>涨幅排行</span>
            </div>
            <div className="rank-list">
              {rankings.map((rank, index) => (
                <div key={index} className="rank-item" onClick={() => handleViewRank(rank)}>
                  <div className="rank-info">
                    <div className="rank-number">{rank.rank}</div>
                    <div className="rank-name-code">
                      <div className="rank-name">{rank.name}</div>
                      <div className="rank-code">{rank.code}</div>
                    </div>
                  </div>
                  <div className={`rank-change ${rank.isPositive ? 'change-up' : 'change-down'}`}>
                    {rank.change}
                  </div>
                </div>
              ))}
            </div>
          </>
        )

      case 'capital':
        return (
          <>
            <div className="section-title">
              <span>资金流向</span>
            </div>
            <div className="capital-list">
              {capitalFlows.map((flow, index) => (
                <div key={index} className="capital-item" onClick={() => handleViewCapital(flow)}>
                  <div className="capital-info">
                    <div className="capital-name">{flow.name}</div>
                    <div className="capital-market">{flow.market}</div>
                  </div>
                  <div className={`capital-amount ${flow.isInflow ? 'capital-in' : 'capital-out'}`}>
                    {flow.amount}
                  </div>
                </div>
              ))}
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* 搜索框 */}
      <div className="search-container">
        <div className="search-box">
          <span className="fas fa-search search-icon"></span>
          <input
            type="text"
            className="search-input"
            placeholder="搜索股票名称或代码"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            onFocus={() => console.log('搜索框获得焦点')}
            onBlur={() => console.log('搜索框失去焦点')}
          />
          {searchLoading && (
            <span className="fas fa-spinner fa-spin search-loading"></span>
          )}
        </div>
        
        {/* 搜索结果区域 */}
        {searchQuery.trim() && (
          <div className="search-results-container">
            {searchLoading ? (
              <div className="search-loading-text">搜索中...</div>
            ) : searchError ? (
              <div className="search-error-text">{searchError}</div>
            ) : searchResults.length > 0 ? (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <div key={index} className="search-result-item" onClick={() => handleViewDetail(result)}>
                    <div className="search-result-info">
                      <div className="search-result-name-code">
                        <div className="search-result-name">{result.name}</div>
                        <div className="search-result-code">{result.code}</div>
                      </div>
                      <div className="search-result-tags">
                        <div className="search-result-tag">{result.industry || '-'}</div>
                      </div>
                    </div>
                    <div className="search-result-price-info">
                      <div className="search-result-price">{result.price}</div>
                      <div className={`search-result-change ${result.isPositive ? 'change-up' : 'change-down'}`}>
                        {result.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-no-results">未找到相关股票</div>
            )}
          </div>
        )}
      </div>

      {/* 市场标签 */}
      <div className="market-tabs">
        <button
          className={`market-tab ${currentTab === 'market' ? 'active' : ''}`}
          onClick={() => setCurrentTab('market')}
        >
          行情
        </button>
        <button
          className={`market-tab ${currentTab === 'sector' ? 'active' : ''}`}
          onClick={() => setCurrentTab('sector')}
        >
          板块
        </button>
        <button
          className={`market-tab ${currentTab === 'rank' ? 'active' : ''}`}
          onClick={() => setCurrentTab('rank')}
        >
          排行
        </button>
        <button
          className={`market-tab ${currentTab === 'capital' ? 'active' : ''}`}
          onClick={() => setCurrentTab('capital')}
        >
          资金
        </button>
      </div>

      {/* 指数卡片横向滚动 */}
      <div className="index-scroll-container">
          <div className="index-cards">
          {indices.map((idx) => (
            <div key={idx.id} className="index-card" onClick={() => handleViewIndex(idx)}>
              <div className="index-name">{idx.name}</div>
              <div className="index-point">{idx.value}</div>
              <div className={`index-change ${idx.isPositive ? 'change-up' : 'change-down'}`}>
                {idx.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 当前标签内容 */}
      {renderContent()}

      {/* 详情页已改为路由跳转（/stock/:code, /index/:id, /sector/:name） */}
      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </div>
  )
}

export default MarketPage