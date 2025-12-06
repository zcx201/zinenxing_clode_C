import React from 'react'

const EducationPage = () => {
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
              <button className="bg-primary-500 text-white px-3 py-1 rounded text-sm font-semibold">
                开始学习
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EducationPage