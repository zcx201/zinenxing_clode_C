import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const HomePage = () => {
  const navigate = useNavigate()
  // 初始状态使用2025年12月31日最新数据
  const [marketData, setMarketData] = useState({
    shanghai: {
      id: 'sh',
      value: '3,961.21',
      change: '-0.10%',
      isPositive: false,
      timestamp: Date.now()
    },
    shenzhen: {
      id: 'sz',
      value: '13,568.09',
      change: '+0.23%',
      isPositive: true,
      timestamp: Date.now()
    }
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

  // 获取市场数据
  const fetchMarketData = async () => {
    try {
      // 获取上证指数数据
      const shanghaiData = await api.getIndexData('sh')
      console.log('获取到上证指数数据:', shanghaiData)
      // 获取深证成指数据
      const shenzhenData = await api.getIndexData('sz')
      console.log('获取到深证成指数据:', shenzhenData)

      setMarketData(prev => ({
        shanghai: shanghaiData || {
          id: 'sh',
          value: '3,245.67',
          change: '+0.85%',
          isPositive: true,
          timestamp: Date.now()
        },
        shenzhen: shenzhenData || {
          id: 'sz',
          value: '11,289.34',
          change: '+1.23%',
          isPositive: true,
          timestamp: Date.now()
        }
      }))
      console.log('市场数据更新完成:', { shanghai: shanghaiData, shenzhen: shenzhenData })
    } catch (error) {
      console.error('获取市场数据失败:', error)
    }
  }

  useEffect(() => {
    // 初始加载数据
    fetchMarketData()

    // 每15分钟更新一次数据（900000毫秒）
    const interval = setInterval(fetchMarketData, 900000)
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