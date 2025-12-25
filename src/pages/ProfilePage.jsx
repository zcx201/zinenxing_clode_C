import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '' })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // 菜单项点击处理函数
  const handleMenuClick = (menuText) => {
    // 如果是我的收藏，直接导航到 /favorites 页面（实现完整收藏管理页面）
    if (menuText === '我的收藏') {
      navigate('/favorites')
      return
    }

    const modalContents = {
      '浏览记录': {
        title: '浏览记录' + (currentUser.username ? ` - ${currentUser.username}` : ''),
        message: currentUser.username ?
          '这里将显示您的浏览历史记录。\n\n功能正在开发中，敬请期待！' :
          '请先登录以查看您的浏览记录'
      },
      '设置': {
        title: '设置',
        message: '这里将包含各种个性化设置选项\n\n功能正在开发中，敬请期待！'
      },
      '帮助中心': {
        title: '帮助中心',
        message: '欢迎使用智能鑫AI股票投资助手！\n\n如果您有任何问题或建议，请联系我们的客服团队。\n\n客服热线：400-123-4567\n客服邮箱：support@zhinengxin.ai'
      },
      '关于我们': {
        title: '关于我们',
        message: '智能鑫AI股票投资助手\n\n版本：v1.0.0\n开发团队：智能鑫科技\n\n致力于为广大投资者提供专业的智能投资分析服务，让投资更简单！'
      }
    }

    setModalContent(modalContents[menuText])
    setShowModal(true)
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
            className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleMenuClick(item.text)}
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

      {/* 智能鑫系统标准弹窗 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        size="sm"
      >
        <div className="p-4">
          {modalContent.message.split('\n').map((line, index) => (
            <div key={index} className="mb-2 text-sm text-gray-700 leading-relaxed">
              {line}
            </div>
          ))}
          <div className="mt-4 text-center">
            <button
              className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors text-sm"
              onClick={() => setShowModal(false)}
            >
              确定
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfilePage