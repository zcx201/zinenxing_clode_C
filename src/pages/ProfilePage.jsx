import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const menuItems = [
    { icon: 'fas fa-star', text: '我的收藏', badge: '12' },
    { icon: 'fas fa-history', text: '浏览记录' },
    { icon: 'fas fa-cog', text: '设置' },
    { icon: 'fas fa-question-circle', text: '帮助中心' },
    { icon: 'fas fa-info-circle', text: '关于我们' }
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {currentUser.username || '游客'}
        </h1>
        <p className="text-gray-600">
          {currentUser.email || '请登录或注册'}
        </p>
      </div>

      <div className="bg-white rounded-card shadow-card p-4 mb-6">
        <div className="grid grid-cols-3 text-center">
          <div className="border-r border-gray-100">
            <div className="text-lg font-bold text-gray-900">28</div>
            <div className="text-sm text-gray-600">关注</div>
          </div>
          <div className="border-r border-gray-100">
            <div className="text-lg font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-600">粉丝</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">42</div>
            <div className="text-sm text-gray-600">帖子</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-0 mb-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center">
              <span className={`${item.icon} text-gray-600 w-5 mr-3`}></span>
              <span className="text-gray-900">{item.text}</span>
            </div>
            <div className="flex items-center">
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                  {item.badge}
                </span>
              )}
              <span className="fas fa-chevron-right text-gray-400"></span>
            </div>
          </div>
        ))}
      </div>

      {currentUser.username ? (
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          退出登录
        </button>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            登录/注册
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePage