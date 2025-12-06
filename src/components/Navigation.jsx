import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: 'fas fa-home', text: '首页' },
    { path: '/interaction', icon: 'fas fa-bullseye', text: '互动点盘' },
    { path: '/friends', icon: 'fas fa-users', text: '股友' },
    { path: '/profile', icon: 'fas fa-user', text: '我的' },
  ]

  const handleNavClick = (path) => {
    navigate(path)
  }

  return (
    <div className="fixed-bottom-nav">
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => handleNavClick(item.path)}
        >
          <div className="nav-icon">
            <span className={item.icon}></span>
          </div>
          <div className="nav-text">{item.text}</div>
        </div>
      ))}
    </div>
  )
}

export default Navigation