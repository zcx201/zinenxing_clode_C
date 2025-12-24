import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'

const MarketPage = () => {
  const [currentTab, setCurrentTab] = useState('market')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')

  // 模拟指数数据
  const indices = [
    { id: 'sh', name: '上证指数', value: '3,025.67', change: '+1.23%', isPositive: true },
    { id: 'sz', name: '深证成指', value: '9,456.42', change: '+0.87%', isPositive: true },
    { id: 'cy', name: '创业板指', value: '1,856.89', change: '-0.34%', isPositive: false },
    { id: 'hs300', name: '沪深300', value: '3,678.45', change: '+0.95%', isPositive: true },
    { id: 'sz50', name: '上证50', value: '2,543.21', change: '+1.12%', isPositive: true },
    { id: 'zxb', name: '中小板指', value: '6,789.12', change: '-0.21%', isPositive: false }
  ]

  // 模拟热门股票数据
  const hotStocks = [
    {
      name: '贵州茅台',
      code: '600519',
      price: '1,865.00',
      change: '+2.15%',
      isPositive: true,
      industry: '白酒',
      marketValue: '2.4万亿'
    },
    {
      name: '宁德时代',
      code: '300750',
      price: '214.50',
      change: '-1.23%',
      isPositive: false,
      industry: '新能源',
      marketValue: '8,500亿'
    },
    {
      name: '招商银行',
      code: '600036',
      price: '35.67',
      change: '+0.85%',
      isPositive: true,
      industry: '银行',
      marketValue: '8,900亿'
    },
    {
      name: '中国平安',
      code: '601318',
      price: '48.92',
      change: '-0.56%',
      isPositive: false,
      industry: '保险',
      marketValue: '8,200亿'
    },
    {
      name: '比亚迪',
      code: '002594',
      price: '285.40',
      change: '+3.12%',
      isPositive: true,
      industry: '汽车',
      marketValue: '7,800亿'
    }
  ]

  // 模拟板块数据
  const sectors = [
    { name: '白酒', change: '+2.5%', isPositive: true, leadingStock: '贵州茅台' },
    { name: '新能源', change: '+1.8%', isPositive: true, leadingStock: '宁德时代' },
    { name: '科技', change: '-0.5%', isPositive: false, leadingStock: '中兴通讯' },
    { name: '医药', change: '+0.9%', isPositive: true, leadingStock: '恒瑞医药' },
    { name: '金融', change: '-0.2%', isPositive: false, leadingStock: '招商银行' }
  ]

  // 模拟排行数据
  const rankings = [
    { rank: 1, name: '立讯精密', change: '+8.2%', isPositive: true, code: '002475' },
    { rank: 2, name: '药明康德', change: '+7.5%', isPositive: true, code: '603259' },
    { rank: 3, name: '三一重工', change: '+6.8%', isPositive: true, code: '600031' },
    { rank: 4, name: '中国中免', change: '+5.9%', isPositive: true, code: '601888' },
    { rank: 5, name: '东方财富', change: '+5.3%', isPositive: true, code: '300059' }
  ]

  // 模拟资金流向数据
  const capitalFlows = [
    { name: '北上资金', amount: '+28.5亿', isInflow: true, market: 'A股' },
    { name: '主力资金', amount: '+15.2亿', isInflow: true, market: '上证' },
    { name: '游资', amount: '-8.7亿', isInflow: false, market: '深证' },
    { name: '散户资金', amount: '-12.3亿', isInflow: false, market: '创业板' },
    { name: '机构资金', amount: '+23.1亿', isInflow: true, market: '沪深300' }
  ]

  // 搜索功能
  useEffect(() => {
    if (searchQuery.trim()) {
      // 模拟搜索逻辑
      const results = hotStocks.filter(stock =>
        stock.name.includes(searchQuery) || stock.code.includes(searchQuery)
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

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
          />
        </div>
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result, index) => (
              <div key={index} className="search-result-item" onClick={() => handleViewDetail(result)}>
                <div className="search-result-info">
                  <div className="search-result-name">{result.name}</div>
                  <div className="search-result-code">{result.code}</div>
                </div>
                <div className="search-result-price">
                  <div className={`search-result-change ${result.isPositive ? 'change-up' : 'change-down'}`}>
                    {result.change}
                  </div>
                </div>
              </div>
            ))}
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