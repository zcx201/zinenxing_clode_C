import React from 'react'

const MarketPage = () => {
  const stocks = [
    { name: '贵州茅台', code: '600519', price: '1,865.00', change: '+2.15%', isPositive: true },
    { name: '宁德时代', code: '300750', price: '214.50', change: '-1.23%', isPositive: false },
    { name: '招商银行', code: '600036', price: '35.67', change: '+0.85%', isPositive: true },
    { name: '中国平安', code: '601318', price: '48.92', change: '-0.56%', isPositive: false },
    { name: '比亚迪', code: '002594', price: '285.40', change: '+3.12%', isPositive: true },
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">股海波涛</h1>
        <p className="text-gray-600">实时行情与市场分析</p>
      </div>

      <div className="bg-white rounded-card shadow-card p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">热门股票</h2>
          <span className="text-primary-500 text-sm">查看全部</span>
        </div>

        <div className="space-y-3">
          {stocks.map((stock, index) => (
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
        <h2 className="text-lg font-bold mb-4">大盘指数</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600">上证指数</div>
            <div className="text-xl font-bold text-blue-600">3,245.67</div>
            <div className="text-red-500 font-semibold">+1.24%</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600">深证成指</div>
            <div className="text-xl font-bold text-green-600">10,532.89</div>
            <div className="text-red-500 font-semibold">+0.86%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketPage