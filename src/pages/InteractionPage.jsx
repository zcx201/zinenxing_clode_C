import React from 'react'

const InteractionPage = () => {
  const interactions = [
    {
      user: '投资大师',
      avatar: 'M',
      question: '明天大盘走势如何？',
      likes: 45,
      comments: 23,
      time: '1小时前',
      category: '大盘分析'
    },
    {
      user: '股市新手',
      avatar: 'N',
      question: '新手应该从哪些股票开始投资？',
      likes: 32,
      comments: 15,
      time: '3小时前',
      category: '投资入门'
    },
    {
      user: '量化达人',
      avatar: 'Q',
      question: '分享一个简单的量化策略收益率分析',
      likes: 67,
      comments: 28,
      time: '5小时前',
      category: '量化投资'
    },
    {
      user: '价值投资者',
      avatar: 'V',
      question: '当前哪些股票具有长期投资价值？',
      likes: 38,
      comments: 19,
      time: '7小时前',
      category: '价值投资'
    }
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">互动点盘</h1>
        <p className="text-gray-600">与股友交流投资心得</p>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-card p-6 mb-6">
        <div className="flex items-center mb-4">
          <span className="fas fa-bullseye text-3xl mr-3"></span>
          <div>
            <h2 className="text-xl font-bold">实时互动</h2>
            <p className="text-blue-100">分享观点，交流经验</p>
          </div>
        </div>
        <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold">
          发起话题
        </button>
      </div>

      <div className="space-y-4">
        {interactions.map((item, index) => (
          <div key={index} className="bg-white rounded-card shadow-card p-4">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                {item.avatar}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">{item.user}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    {item.category}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-900 font-medium">{item.question}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="fas fa-heart mr-1"></span>
                  <span>{item.likes}</span>
                </div>
                <div className="flex items-center">
                  <span className="fas fa-comment mr-1"></span>
                  <span>{item.comments}</span>
                </div>
              </div>
              <button className="text-primary-500 font-semibold text-sm">
                参与讨论
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InteractionPage