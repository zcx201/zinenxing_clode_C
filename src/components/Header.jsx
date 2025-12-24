import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const handleLoginClick = () => {
    if (currentUser) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  const user = currentUser ? currentUser : null

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