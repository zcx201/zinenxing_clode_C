import React from 'react'

const NewsPage = () => {
  const newsItems = [
    {
      title: 'A股市场迎来政策利好，券商板块集体拉升',
      summary: '证监会发布多项利好政策，资本市场改革加速推进...',
      time: '2小时前',
      source: '财经日报',
      hot: true
    },
    {
      title: '新能源板块再度活跃，光伏产业迎政策春风',
      summary: '国家能源局发布光伏产业支持政策，产业链全面受益...',
      time: '4小时前',
      source: '投资快报',
      hot: true
    },
    {
      title: '人工智能概念股集体大涨，AI应用场景逐步落地',
      summary: '各大AI公司发布最新产品，AI+应用前景广阔...',
      time: '6小时前',
      source: '科技前沿'
    },
    {
      title: '央行降准释放流动性，市场预期稳中向好',
      summary: '央行宣布降准0.5个百分点，释放长期资金约1.2万亿...',
      time: '8小时前',
      source: '金融时报'
    }
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">速递时事</h1>
        <p className="text-gray-600">AI推送财经新闻</p>
      </div>

      <div className="space-y-4">
        {newsItems.map((news, index) => (
          <div key={index} className="bg-white rounded-card shadow-card p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg flex-1">{news.title}</h3>
              {news.hot && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold ml-2">
                  热门
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-3">{news.summary}</p>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{news.source}</span>
              <span>{news.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold">
          加载更多
        </button>
      </div>
    </div>
  )
}

export default NewsPage