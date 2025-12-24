import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MarketHeader = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const handleBackClick = () => {
    navigate('/')
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  // 下拉菜单功能暂不需要独立 toggle 函数，保留状态以便未来扩展

  return (
    <div className="market-header">
      <div className="header-left">
        <button className="back-btn" onClick={handleBackClick}>
          <span className="fas fa-chevron-left"></span>
        </button>
        <div className="page-title">股海波涛</div>
      </div>

      <div className="header-actions">
        <button className="login-status" onClick={handleLoginClick}>
          <span className="fas fa-user-circle"></span>
          <span>{currentUser ? currentUser.username : '登录/注册'}</span>
        </button>
      </div>
    </div>
  )
}

export default MarketHeader