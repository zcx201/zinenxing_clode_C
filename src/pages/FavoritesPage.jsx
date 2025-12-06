import React from 'react'

const FavoritesPage = () => {
  const favorites = [
    { name: '贵州茅台', code: '600519', price: '1,865.00', change: '+2.15%', isPositive: true },
    { name: '宁德时代', code: '300750', price: '214.50', change: '-1.23%', isPositive: false },
    { name: '招商银行', code: '600036', price: '35.67', change: '+0.85%', isPositive: true },
    { name: '中国平安', code: '601318', price: '48.92', change: '-0.56%', isPositive: false }
  ]

  const discussions = [
    {
      user: '股市老李',
      content: '新能源板块最近回调是不是加仓好机会？',
      time: '2小时前',
      likes: 24,
      comments: 8
    },
    {
      user: '投资小王',
      content: '医疗股最近表现不错，大家怎么看？',
      time: '4小时前',
      likes: 15,
      comments: 5
    },
    {
      user: '财经达人',
      content: '分享一个挖掘小盘股的方法...',
      time: '6小时前',
      likes: 36,
      comments: 12
    }
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">自选嗨吧</h1>
        <p className="text-gray-600">自选股与投资社区</p>
      </div>

      <div className="bg-white rounded-card shadow-card p-4 mb-6">
        <h2 className="text-lg font-bold mb-4">我的自选股</h2>
        <div className="space-y-3">
          {favorites.map((stock, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">{stock.name}</div>
                <div className="text-sm text-gray-500">{stock.code}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{stock.price}</div>
                <div className={`text-sm font-semibold ${stock.isPositive ? 'text-red-500' : 'text-green-500'}`}>
                  {stock.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-4">
        <h2 className="text-lg font-bold mb-4">社区讨论</h2>
        <div className="space-y-4">
          {discussions.map((discussion, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-900">{discussion.user}</div>
                <div className="text-sm text-gray-500">{discussion.time}</div>
              </div>
              <p className="text-gray-700 mb-3">{discussion.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="fas fa-heart mr-1"></span>
                <span className="mr-3">{discussion.likes}</span>
                <span className="fas fa-comment mr-1"></span>
                <span className="mr-3">{discussion.comments}</span>
                <button className="text-primary-500 font-semibold">参与讨论</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="发表你的观点..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-primary-500"
          />
          <button className="bg-primary-500 text-white px-4 py-2 rounded-r-lg font-semibold">
            发表
          </button>
        </div>
      </div>
    </div>
  )
}

export default FavoritesPage