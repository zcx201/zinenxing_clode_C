import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    // 检查登录状态，如果未登录则跳转到登录页面
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  const currentUser = localStorage.getItem('currentUser')
  const user = currentUser ? JSON.parse(currentUser) : null

  return (
    <div className="fixed-header">
      <div className="brand">
        <div className="app-logo">AI</div>
        <div className="app-title">智能鑫AI</div>
      </div>
      <div className="login-status" onClick={handleLoginClick}>
        <span className="fas fa-user-circle"></span>
        <span>{user ? user.username : '登录/注册'}</span>
      </div>
    </div>
  )
}

export default Header