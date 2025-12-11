import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  const [marketData, setMarketData] = useState({
    shanghai: { value: '3,245.67', change: '+1.24%', isPositive: true },
    shenzhen: { value: '10,532.89', change: '+0.86%', isPositive: true }
  })

  const functions = [
    {
      icon: 'fas fa-book',
      name: '谈股论经',
      desc: '股票投资知识与技巧',
      path: '/education'
    },
    {
      icon: 'fas fa-wave-square',
      name: '股海波涛',
      desc: '实时行情与市场分析',
      path: '/market'
    },
    {
      icon: 'fas fa-robot',
      name: 'AI智能选股',
      desc: '大数据AI发现投资机会',
      path: '/aipicks'
    },
    {
      icon: 'fas fa-star',
      name: '自选嗨吧',
      desc: '自选股与投资社区',
      path: '/favorites'
    },
    {
      icon: 'fas fa-bolt',
      name: '速递时事',
      desc: 'AI推送财经新闻',
      path: '/news'
    }
  ]

  useEffect(() => {
    const updateMarketData = () => {
      const isShanghaiPositive = Math.random() > 0.4
      const shanghaiChangePercent = (Math.random() * 2.5).toFixed(2)
      const shanghaiChangeSymbol = isShanghaiPositive ? '+' : '-'

      const isShenzhenPositive = Math.random() > 0.45
      const shenzhenChangePercent = (Math.random() * 2.5).toFixed(2)
      const shenzhenChangeSymbol = isShenzhenPositive ? '+' : '-'

      setMarketData({
        shanghai: {
          value: '3,245.67',
          change: `${shanghaiChangeSymbol}${shanghaiChangePercent}%`,
          isPositive: isShanghaiPositive
        },
        shenzhen: {
          value: '10,532.89',
          change: `${shenzhenChangeSymbol}${shenzhenChangePercent}%`,
          isPositive: isShenzhenPositive
        }
      })
    }

    const interval = setInterval(updateMarketData, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleFunctionClick = (path) => {
    navigate(path)
  }

  return (
    <div>
      {/* 欢迎区域 */}
      <div className="welcome-section">
        <div className="welcome-text">欢迎使用智能鑫AI系统</div>
        <div className="welcome-subtext">AI智能选股 · 实时行情 · 专业分析 · 投资社区</div>
      </div>

      {/* 市场状态 */}
      <div className="market-status">
        <div className="market-indicator">
          <div className="market-value">{marketData.shanghai.value}</div>
          <div className={`market-change ${marketData.shanghai.isPositive ? 'up' : 'down'}`}>
            {marketData.shanghai.change}
          </div>
          <div className="market-label">上证指数</div>
        </div>
        <div className="market-indicator">
          <div className="market-value">{marketData.shenzhen.value}</div>
          <div className={`market-change ${marketData.shenzhen.isPositive ? 'up' : 'down'}`}>
            {marketData.shenzhen.change}
          </div>
          <div className="market-label">深证成指</div>
        </div>
      </div>

      {/* 功能区 */}
      <div className="section-title">
        <span>核心功能</span>
      </div>

      <div className="func-grid">
        {functions.map((func, index) => (
          <div
            key={index}
            className="func-item"
            onClick={() => handleFunctionClick(func.path)}
          >
            <div className="func-icon">
              <span className={func.icon}></span>
            </div>
            <div className="func-name">{func.name}</div>
            <div className="func-desc">{func.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage