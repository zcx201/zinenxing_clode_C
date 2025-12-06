import React from 'react'

const AIPicksPage = () => {
  const aiPicks = [
    {
      stockName: '立讯精密',
      code: '002475',
      reason: 'AI分析显示该股具备高成长性，技术面突破关键位置',
      confidence: '85%',
      targetPrice: '38.50',
      currentPrice: '32.15'
    },
    {
      stockName: '药明康德',
      code: '603259',
      reason: '医药板块复苏，基本面稳健，估值合理',
      confidence: '78%',
      targetPrice: '95.20',
      currentPrice: '82.30'
    },
    {
      stockName: '三一重工',
      code: '600031',
      reason: '基建投资增长预期，技术指标显示买入信号',
      confidence: '72%',
      targetPrice: '18.90',
      currentPrice: '16.25'
    }
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI智能选股</h1>
        <p className="text-gray-600">大数据AI发现投资机会</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-card p-6 mb-6">
        <div className="flex items-center mb-4">
          <span className="fas fa-robot text-3xl mr-3"></span>
          <div>
            <h2 className="text-xl font-bold">AI选股引擎运行中</h2>
            <p className="text-blue-100">实时分析市场数据</p>
          </div>
        </div>
        <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold">
          刷新推荐
        </button>
      </div>

      <div className="space-y-4">
        {aiPicks.map((pick, index) => (
          <div key={index} className="bg-white rounded-card shadow-card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-lg text-gray-900">{pick.stockName}</div>
                <div className="text-sm text-gray-500">{pick.code}</div>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                推荐度: {pick.confidence}
              </div>
            </div>

            <div className="text-gray-600 text-sm mb-4">{pick.reason}</div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-500">现价: </span>
                <span className="font-bold text-gray-900">{pick.currentPrice}</span>
              </div>
              <div>
                <span className="text-gray-500">目标价: </span>
                <span className="font-bold text-green-600">{pick.targetPrice}</span>
              </div>
              <button className="bg-primary-500 text-white px-3 py-1 rounded text-sm font-semibold">
                加入自选
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIPicksPage