import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MarketHeader = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleBackClick = () => {
    navigate('/')
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

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