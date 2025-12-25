import React, { useState } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import api from '../utils/api'
import favoritesManager from '../utils/favorites'
import { notifyFavoritesUpdated } from '../utils/favoritesNotifier'

const EducationPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')
  const [showToast, setShowToast] = useState(false)
  const courses = [
    {
      title: '股票投资入门',
      level: '初级',
      duration: '45分钟',
      students: '12,345',
      description: '从零开始学习股票投资基础知识',
      icon: 'fas fa-graduation-cap'
    },
    {
      title: '技术分析精讲',
      level: '中级',
      duration: '2小时',
      students: '8,765',
      description: '掌握K线图、均线、MACD等技术指标',
      icon: 'fas fa-chart-line'
    },
    {
      title: '价值投资策略',
      level: '高级',
      duration: '3小时',
      students: '5,432',
      description: '学习巴菲特等投资大师的价值投资理念',
      icon: 'fas fa-chart-pie'
    },
    {
      title: '风险管理与止损',
      level: '中级',
      duration: '1.5小时',
      students: '9,876',
      description: '如何有效控制投资风险，做好资金管理',
      icon: 'fas fa-shield-alt'
    }
  ]

  // 课程详情内容
  const courseContents = {
    '股票投资入门': [
      '了解股票基本概念和交易规则',
      '学习如何开立证券账户',
      '掌握基础的K线图阅读',
      '了解常见的投资风险',
      '制定合理的投资计划'
    ],
    '技术分析精讲': [
      '深度解析技术分析三大假设',
      'K线组合形态详解',
      '均线系统的实战应用',
      'MACD、KDJ等指标的应用',
      '成交量与价格关系分析'
    ],
    '价值投资策略': [
      '价值投资的核心理念',
      '如何分析企业基本面',
      '财务数据分析方法',
      '安全边界概念及应用',
      '长期投资策略制定'
    ],
    '风险管理与止损': [
      '风险与收益的平衡',
      '止损策略的制定与执行',
      '仓位管理技巧',
      '投资组合分散化原则',
      '应对市场波动的心理准备'
    ]
  }

  // 开始学习函数
  const handleStartLearning = (course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
  }

  // 收藏课程（加入我的收藏）
  const handleAddCourseToFavorites = async (course) => {
    try {
      // 尝试通过 API 添加为新闻类收藏（课程不在 stocks 表，作为 news 存储）
      await api.favorites.addFavorite({ type: 'news', title: course.title, source: '课程', time: new Date().toISOString() })
      // 若成功，更新本地 favoritesManager（兼容本地查看）
      if (typeof favoritesManager.setUserId === 'function') {
        // 尝试从 api 获取当前 mock user id
        try {
          const cu = await api.user.getCurrentUser()
          if (cu && cu.user_id && typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(cu.user_id)
        } catch (e) {
          // ignore
        }
      }
  favoritesManager.addToFavorites({ type: 'news', title: course.title, source: '课程', time: new Date().toISOString() })
  // notify favorites page
  try { notifyFavoritesUpdated() } catch (e) {}
  // 显示提示
  showToastMessage(`已收藏课程：${course.title}`, 'success')
    } catch (err) {
      // 回退到本地收藏管理器
      try {
        const ok = favoritesManager.addToFavorites({ type: 'news', title: course.title, source: '课程', time: new Date().toISOString() })
        if (ok) {
          try { notifyFavoritesUpdated() } catch (e) {}
          showToastMessage(`已本地收藏课程：${course.title}`, 'success')
        } else {
          showToastMessage('该课程已在收藏中', 'info')
        }
      } catch (e) {
        showToastMessage('收藏失败，请稍后重试', 'error')
      }
    }
  }

  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">谈股论经</h1>
        <p className="text-gray-600">股票投资知识与技巧</p>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-card p-6 mb-6">
        <div className="flex items-center">
          <span className="fas fa-chalkboard-teacher text-3xl mr-3"></span>
          <div>
            <h2 className="text-xl font-bold">投资学院</h2>
            <p className="text-orange-100">系统学习投资知识，提升投资能力</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-card shadow-card p-4">
            <div className="flex items-start mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-blue-500 text-xl mr-4">
                <span className={course.icon}></span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{course.description}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center">
                <span className="fas fa-clock mr-1"></span>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <span className="fas fa-users mr-1"></span>
                <span>{course.students}人学习</span>
              </div>
              <button
                className="bg-primary-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-primary-600 transition-colors"
                onClick={() => handleStartLearning(course)}
              >
                开始学习
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 课程详情弹窗 */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title={selectedCourse?.title || '课程详情'}
        size="sm"
      >
        {selectedCourse && (
          <div>
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">{selectedCourse.title}</h3>
              <div className="flex justify-center gap-2 mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {selectedCourse.level}课程
                </span>
                <span className="text-blue-700 text-xs">{selectedCourse.duration}</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">{selectedCourse.description}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-gray-900 text-sm mb-2">课程大纲</h4>
              <div className="space-y-1">
                {courseContents[selectedCourse.title]?.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-xs">✓</span>
                    <span className="text-gray-700 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-2">
              <button
                className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors text-sm w-full"
                onClick={() => setShowCourseModal(false)}
              >
                开始学习
              </button>

              <button
                className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg w-full hover:bg-gray-50 transition-colors text-sm"
                onClick={() => selectedCourse && handleAddCourseToFavorites(selectedCourse)}
              >
                收藏课程
              </button>
            </div>
          </div>
        )}
        </Modal>

      {/* Toast 显示 */}
      {showToast && (
        <Toast message={toastMessage} type={toastType} duration={2500} onClose={() => setShowToast(false)} />
      )}
    </div>
  )
}

export default EducationPage