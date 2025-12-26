import React, { useState, useEffect } from 'react'
import Modal from '../components/Modal'

const InteractionPage = () => {
  const [selectedIndex, setSelectedIndex] = useState('sh')
  const [selectedOption, setSelectedOption] = useState(null)
  const [betAmount, setBetAmount] = useState('')
  const [activeGuesses, setActiveGuesses] = useState([])
  const [showBetModal, setShowBetModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedGuess, setSelectedGuess] = useState(null)
  const [joinBetAmount, setJoinBetAmount] = useState('')
  const [joinBetType, setJoinBetType] = useState('')
  // 竞猜列表弹窗状态
  const [showGuessListModal, setShowGuessListModal] = useState(false)
  const [guessListTab, setGuessListTab] = useState('ongoing') // 'ongoing', 'history', 'all'

  // 统计卡片弹窗状态
  const [showWinRateModal, setShowWinRateModal] = useState(false)
  const [showProfitModal, setShowProfitModal] = useState(false)
  const [showParticipationModal, setShowParticipationModal] = useState(false)
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false)
  
  // 模态框内容状态
  const [winRateData, setWinRateData] = useState(null)
  const [profitData, setProfitData] = useState(null)
  const [participationData, setParticipationData] = useState(null)

  // 指数选项
  const indices = [
    { id: 'sh', name: '上证指数' },
    { id: 'sz', name: '深证成指' },
    { id: 'cy', name: '创业板指' },
    { id: 'hs300', name: '沪深300' }
  ]

  // 模拟指数数据
  const indexData = {
    sh: { value: '3,025.67', change: '+1.23%', direction: 'up' },
    sz: { value: '9,456.42', change: '+0.87%', direction: 'up' },
    cy: { value: '1,856.89', change: '-0.34%', direction: 'down' },
    hs300: { value: '3,678.45', change: '+0.95%', direction: 'up' }
  }

  // 模拟进行中的竞猜
  const mockActiveGuesses = [
    {
      id: 1,
      index: '上证指数',
      deadline: '今日收盘后',
      upVotes: 1245,
      downVotes: 789,
      myBet: { type: 'up', amount: 50 },
      totalPool: 2034,
      betTime: '今天 10:30',
      status: 'ongoing'
    },
    {
      id: 2,
      index: '创业板指',
      deadline: '1小时后',
      upVotes: 567,
      downVotes: 892,
      myBet: null,
      totalPool: 1459,
      betTime: '今天 09:45',
      status: 'ongoing'
    },
    {
      id: 3,
      index: '沪深300',
      deadline: '明日开市前',
      upVotes: 987,
      downVotes: 654,
      myBet: { type: 'down', amount: 30 },
      totalPool: 1641,
      betTime: '今天 11:20',
      status: 'ongoing'
    },
    {
      id: 4,
      index: '深证成指',
      deadline: '今日收盘后',
      upVotes: 892,
      downVotes: 1103,
      myBet: { type: 'down', amount: 100 },
      totalPool: 1995,
      betTime: '今天 10:00',
      status: 'ongoing'
    }
  ]

  // 模拟历史竞猜
  const mockHistoryGuesses = [
    {
      id: 5,
      index: '创业板指',
      deadline: '昨日收盘后',
      myBet: { type: 'up', amount: 200 },
      result: 'win',
      profit: 150,
      betTime: '昨天 14:30',
      status: 'ended'
    },
    {
      id: 6,
      index: '沪深300',
      deadline: '前日收盘后',
      myBet: { type: 'down', amount: 80 },
      result: 'lose',
      profit: -80,
      betTime: '前天 13:45',
      status: 'ended'
    },
    {
      id: 7,
      index: '上证指数',
      deadline: '前日收盘后',
      myBet: { type: 'up', amount: 150 },
      result: 'win',
      profit: 120,
      betTime: '前天 10:15',
      status: 'ended'
    }
  ]

  useEffect(() => {
    setActiveGuesses(mockActiveGuesses)
  }, [])

  const handlePlaceBet = () => {
    if (!selectedOption || !betAmount) return

    const amount = parseInt(betAmount)
    if (amount <= 0) return

    // 显示确认弹窗
    setShowBetModal(true)
  }

  const confirmBet = () => {
    setShowBetModal(false)

    // 成功提示（这里可以替换为更好的UI提示）
    // 重置选择
    setSelectedOption(null)
    setBetAmount('')
  }

  const handleJoinGuess = (guessId) => {
    const guess = activeGuesses.find(g => g.id === guessId)
    if (guess?.myBet) {
      return
    }

    setSelectedGuess(guess)
    setShowJoinModal(true)
  }

  const handleJoinBet = () => {
    if (!joinBetAmount || !joinBetType) return

    const amount = parseInt(joinBetAmount)
    if (amount <= 0) return

    setShowJoinModal(false)

    // 更新用户的投注信息
    const updatedGuesses = activeGuesses.map(guess => {
      if (guess.id === selectedGuess.id) {
        return {
          ...guess,
          myBet: {
            type: joinBetType,
            amount: amount
          }
        }
      }
      return guess
    })
    setActiveGuesses(updatedGuesses)

    setJoinBetAmount('')
    setJoinBetType('')
  }

  // 处理统计卡片点击
  const handleStatCardClick = async (type) => {
    // 根据卡片类型执行不同操作
    setIsLoading(true)
    
    try {
      // 模拟数据加载延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      switch (type) {
        case 'winRate':
          // 模拟胜率数据
          setWinRateData({
            totalGames: 128,
            winGames: 111,
            winRate: '86.5%',
            recentGames: [
              { date: '2025-12-26', result: 'win', gameId: 'G128' },
              { date: '2025-12-25', result: 'win', gameId: 'G127' },
              { date: '2025-12-24', result: 'lose', gameId: 'G126' },
              { date: '2025-12-23', result: 'win', gameId: 'G125' },
              { date: '2025-12-22', result: 'win', gameId: 'G124' }
            ]
          })
          setShowWinRateModal(true)
          break
        case 'totalProfit':
          // 模拟收益数据
          setProfitData({
            totalProfit: 2584,
            dailyProfit: 120,
            weeklyProfit: 450,
            monthlyProfit: 1200,
            profitHistory: [
              { date: '2025-12-26', profit: 120 },
              { date: '2025-12-25', profit: 80 },
              { date: '2025-12-24', profit: -50 },
              { date: '2025-12-23', profit: 150 },
              { date: '2025-12-22', profit: 100 }
            ]
          })
          setShowProfitModal(true)
          break
        case 'participation':
          // 模拟参与次数数据
          setParticipationData({
            totalParticipation: 128,
            monthlyParticipation: 25,
            weeklyParticipation: 8,
            dailyParticipation: 2,
            recentParticipations: [
              { date: '2025-12-26', gameId: 'G128', index: '上证指数', type: 'up' },
              { date: '2025-12-25', gameId: 'G127', index: '深证成指', type: 'down' },
              { date: '2025-12-24', gameId: 'G126', index: '创业板指', type: 'up' },
              { date: '2025-12-23', gameId: 'G125', index: '沪深300', type: 'down' },
              { date: '2025-12-22', gameId: 'G124', index: '上证指数', type: 'up' }
            ]
          })
          setShowParticipationModal(true)
          break
        default:
          break
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="interaction-page">
      {/* 投注确认弹窗 */}
      <Modal
        isOpen={showBetModal}
        onClose={() => setShowBetModal(false)}
        title="确认投注"
      >
        <div className="text-center">
          <div className="text-lg mb-4">
            确认下注 <span className="font-bold text-primary-500">{betAmount}</span> 积分，预测
            <span className="font-bold">{indices.find(i => i.id === selectedIndex)?.name}</span> 会
            <span className={`font-bold ${selectedOption === 'up' ? 'text-red-500' : 'text-green-500'}`}>
              {selectedOption === 'up' ? '上涨' : '下跌'}
            </span>
          </div>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowBetModal(false)}
            >
              取消
            </button>
            <button
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              onClick={confirmBet}
            >
              确认投注
            </button>
          </div>
        </div>
      </Modal>

      {/* 参与竞猜弹窗 */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="参与竞猜"
      >
        <div>
          <div className="mb-4 text-lg font-semibold">{selectedGuess?.index}</div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">选择预测方向</div>
            <div className="flex gap-4">
              <button
                className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                  joinBetType === 'up'
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 hover:border-red-500'
                }`}
                onClick={() => setJoinBetType('up')}
              >
                <div className="text-lg mb-1">📈</div>
                <div>上涨</div>
              </button>
              <button
                className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                  joinBetType === 'down'
                    ? 'border-green-500 bg-green-50 text-green-500'
                    : 'border-gray-300 hover:border-green-500'
                }`}
                onClick={() => setJoinBetType('down')}
              >
                <div className="text-lg mb-1">📉</div>
                <div>下跌</div>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">投注积分</div>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary-500"
              placeholder="输入投注积分"
              value={joinBetAmount}
              onChange={(e) => setJoinBetAmount(e.target.value)}
              min="1"
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowJoinModal(false)}
            >
              取消
            </button>
            <button
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleJoinBet}
              disabled={!joinBetAmount || !joinBetType}
            >
              确认参与
            </button>
          </div>
        </div>
      </Modal>

      {/* 竞猜列表弹窗 */}
      <Modal
        isOpen={showGuessListModal}
        onClose={() => setShowGuessListModal(false)}
        title="竞猜列表"
        size="lg"
      >
        <div>
          {/* 标签栏 */}
          <div className="flex justify-around h-12 border-b border-gray-200 flex-shrink-0 mb-4">
            <button
              className={`flex-1 text-center flex items-center justify-center font-medium ${guessListTab === 'ongoing' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
              onClick={() => setGuessListTab('ongoing')}
            >
              进行中
            </button>
            <button
              className={`flex-1 text-center flex items-center justify-center font-medium ${guessListTab === 'history' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
              onClick={() => setGuessListTab('history')}
            >
              历史记录
            </button>
            <button
              className={`flex-1 text-center flex items-center justify-center font-medium ${guessListTab === 'all' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
              onClick={() => setGuessListTab('all')}
            >
              全部
            </button>
          </div>
          {/* 根据当前标签显示对应的竞猜列表 */}
          <div className="space-y-3">
              {guessListTab === 'ongoing' && (
                mockActiveGuesses.map(guess => (
                  <div key={guess.id} className="bg-white rounded-xl shadow-sm p-4 mx-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-bold text-gray-900 text-lg">{guess.index}</div>
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                        进行中
                      </span>
                    </div>
                    
                    {guess.myBet && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <span className={`text-lg ${
                            guess.myBet.type === 'up' ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {guess.myBet.type === 'up' ? '📈' : '📉'}
                          </span>
                          <span className="text-sm font-medium">
                            {guess.myBet.type === 'up' ? '看涨' : '看跌'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          投注: {guess.myBet.amount}积分
                        </div>
                        <div className="text-sm text-gray-500">
                          {guess.betTime}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="fas fa-clock mr-1"></span>
                      截止: {guess.deadline}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">涨支持者</div>
                          <div className="font-semibold text-red-500">{guess.upVotes}人</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">跌支持者</div>
                          <div className="font-semibold text-green-500">{guess.downVotes}人</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">总奖池</div>
                        <div className="font-semibold text-primary-500">{guess.totalPool}积分</div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {guessListTab === 'history' && (
                mockHistoryGuesses.map(guess => (
                  <div key={guess.id} className="bg-white rounded-xl shadow-sm p-4 mx-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-bold text-gray-900 text-lg">{guess.index}</div>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        已结束
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <span className={`text-lg ${
                          guess.myBet.type === 'up' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {guess.myBet.type === 'up' ? '📈' : '📉'}
                        </span>
                        <span className="text-sm font-medium">
                          {guess.myBet.type === 'up' ? '看涨' : '看跌'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        投注: {guess.myBet.amount}积分
                      </div>
                      <div className="text-sm text-gray-500">
                        {guess.betTime}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-600 mb-1">结果</div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          guess.result === 'win' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {guess.result === 'win' ? '盈利' : '亏损'}
                        </span>
                        <span className={`text-sm font-medium ${
                          guess.result === 'win' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {guess.result === 'win' ? '+' : ''}{guess.profit}积分
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="text-primary-500 text-sm font-medium">
                        查看详情 →
                      </button>
                    </div>
                  </div>
                ))
              )}

              {guessListTab === 'all' && (
                <>
                  {/* 先显示进行中的竞猜 */}
                  {mockActiveGuesses.map(guess => (
                    <div key={guess.id} className="bg-white rounded-xl shadow-sm p-4 mx-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-gray-900 text-lg">{guess.index}</div>
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                          进行中
                        </span>
                      </div>
                      
                      {guess.myBet && (
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <span className={`text-lg ${
                              guess.myBet.type === 'up' ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {guess.myBet.type === 'up' ? '📈' : '📉'}
                            </span>
                            <span className="text-sm font-medium">
                              {guess.myBet.type === 'up' ? '看涨' : '看跌'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            投注: {guess.myBet.amount}积分
                          </div>
                          <div className="text-sm text-gray-500">
                            {guess.betTime}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="fas fa-clock mr-1"></span>
                        截止: {guess.deadline}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">涨支持者</div>
                            <div className="font-semibold text-red-500">{guess.upVotes}人</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">跌支持者</div>
                            <div className="font-semibold text-green-500">{guess.downVotes}人</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">总奖池</div>
                          <div className="font-semibold text-primary-500">{guess.totalPool}积分</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 再显示历史竞猜 */}
                  {mockHistoryGuesses.map(guess => (
                    <div key={guess.id} className="bg-white rounded-xl shadow-sm p-4 mx-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-gray-900 text-lg">{guess.index}</div>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          已结束
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <span className={`text-lg ${
                            guess.myBet.type === 'up' ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {guess.myBet.type === 'up' ? '📈' : '📉'}
                          </span>
                          <span className="text-sm font-medium">
                            {guess.myBet.type === 'up' ? '看涨' : '看跌'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          投注: {guess.myBet.amount}积分
                        </div>
                        <div className="text-sm text-gray-500">
                          {guess.betTime}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-600 mb-1">结果</div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            guess.result === 'win' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {guess.result === 'win' ? '盈利' : '亏损'}
                          </span>
                          <span className={`text-sm font-medium ${
                            guess.result === 'win' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {guess.result === 'win' ? '+' : ''}{guess.profit}积分
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="text-primary-500 text-sm font-medium">
                          查看详情 →
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
        </div>
      </Modal>
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full max-h-[75vh] overflow-hidden flex flex-col mx-0">
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">加载中</h2>
            </div>
            
            {/* 内容 */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[calc(75vh-60px)] flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500 mb-4"></div>
              <p className="text-gray-600">正在加载数据...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 胜率分析弹窗 */}
      <Modal
        isOpen={showWinRateModal}
        onClose={() => setShowWinRateModal(false)}
        title="胜率详情"
        size="lg"
      >
        {winRateData && (
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary-500 mb-2">{winRateData.winRate}</div>
              <div className="text-gray-600">总胜率</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">总参与次数</div>
                <div className="text-2xl font-bold text-gray-900">{winRateData.totalGames}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">获胜次数</div>
                <div className="text-2xl font-bold text-green-500">{winRateData.winGames}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">最近5场记录</h3>
              <div className="space-y-3">
                {winRateData.recentGames.map((game, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-primary-500">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{game.gameId}</div>
                        <div className="text-sm text-gray-500">{game.date}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      game.result === 'win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {game.result === 'win' ? '获胜' : '失败'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 收益明细弹窗 */}
      <Modal
        isOpen={showProfitModal}
        onClose={() => setShowProfitModal(false)}
        title="收益明细"
        size="lg"
      >
        {profitData && (
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-500 mb-2">{profitData.totalProfit}</div>
              <div className="text-gray-600">累计收益（积分）</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-600 mb-1">今日收益</div>
                <div className="text-xl font-bold text-green-500">+{profitData.dailyProfit}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-600 mb-1">本周收益</div>
                <div className="text-xl font-bold text-green-500">+{profitData.weeklyProfit}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-600 mb-1">本月收益</div>
                <div className="text-xl font-bold text-green-500">+{profitData.monthlyProfit}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">收益趋势</h3>
              <div className="space-y-3">
                {profitData.profitHistory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{item.date}</div>
                    <div className={`font-bold ${
                      item.profit >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.profit >= 0 ? '+' : ''}{item.profit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 参与历史记录弹窗 */}
      <Modal
        isOpen={showParticipationModal}
        onClose={() => setShowParticipationModal(false)}
        title="参与记录"
        size="lg"
      >
        {participationData && (
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary-500 mb-2">{participationData.totalParticipation}</div>
              <div className="text-gray-600">总参与次数</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-600 mb-1">今日参与</div>
                <div className="text-xl font-bold text-primary-500">{participationData.dailyParticipation}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-600 mb-1">本周参与</div>
                <div className="text-xl font-bold text-primary-500">{participationData.weeklyParticipation}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-600 mb-1">本月参与</div>
                <div className="text-xl font-bold text-primary-500">{participationData.monthlyParticipation}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">最近参与记录</h3>
              <div className="space-y-3">
                {participationData.recentParticipations.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{item.gameId}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{item.index}</div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        item.type === 'up' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type === 'up' ? '看涨' : '看跌'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 主竞猜卡片 */}
      <div className="main-guess-card">
        {/* 顶部操作区：下拉选择菜单改为顶部横条居中布局 */}
        <div className="guess-header mb-4">
          <select
            className="index-select w-full bg-primary-500 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none text-center"
            style={{
              backgroundColor: '#1e40af', // 不透明的深蓝色背景
              color: '#ffffff', // 白色文字
              option: {
                backgroundColor: '#ffffff', // 选项背景为白色
                color: '#1e40af', // 选项文字为深蓝色
              }
            }}
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
          >
            {indices.map(index => (
              <option key={index.id} value={index.id} style={{ color: '#1e40af', backgroundColor: '#ffffff' }}>{index.name}</option>
            ))}
          </select>
        </div>

        {/* 指数信息区域：两个卡片左右排列 */}
        <div className="index-info-area flex gap-3 mb-5">
          {/* 第一个卡片：指数信息 */}
          <div className="index-card bg-white bg-opacity-15 rounded-xl p-4 flex-1">
            <div className="index-name text-sm opacity-90 mb-2">{indices.find(i => i.id === selectedIndex)?.name}</div>
            <div className={`index-value text-2xl font-bold mb-1 ${indexData[selectedIndex].direction === 'up' ? 'text-red-200' : 'text-green-200'}`}>
              {indexData[selectedIndex].value}
            </div>
            <div className={`index-change text-lg font-bold px-2 py-1 rounded-lg inline-block ${indexData[selectedIndex].direction === 'up' ? 'up' : 'down'}`}>
              {indexData[selectedIndex].change}
            </div>
          </div>

          {/* 第二个卡片：创建新竞猜按钮 */}
          <div className="create-guess-card bg-white bg-opacity-15 rounded-xl p-4 flex-1 flex items-center justify-center cursor-pointer hover:bg-opacity-20 transition-all duration-300">
            <button 
              className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
              onClick={handlePlaceBet}
            >
              创建新的竞猜
            </button>
          </div>
        </div>

        {/* 竞猜操作区域 */}
        <div className="guess-options-area">
          {/* 看涨/看跌按钮 */}
          <div className="guess-options flex gap-4 mb-4">
            <button
              className={`guess-option up flex-1 p-4 bg-white bg-opacity-15 border-2 border-transparent rounded-xl text-center font-bold text-lg cursor-pointer transition-all duration-300 flex flex-col items-center gap-2 ${selectedOption === 'up' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('up')}
            >
              <div className="option-icon">✅</div>
              <div>看涨</div>
            </button>

            <button
              className={`guess-option down flex-1 p-4 bg-white bg-opacity-15 border-2 border-transparent rounded-xl text-center font-bold text-lg cursor-pointer transition-all duration-300 flex flex-col items-center gap-2 ${selectedOption === 'down' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('down')}
            >
              <div className="option-icon">❌</div>
              <div>看跌</div>
            </button>
          </div>

          {/* 积分和投注按钮 */}
          <div className="bet-controls flex gap-4">
            <input
              type="number"
              className="points-input flex-1 bg-white bg-opacity-15 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white text-center text-xl font-bold outline-none"
              placeholder="100"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="1"
            />
            <button 
              className="bet-btn flex-1 p-4 bg-white bg-opacity-25 text-white font-bold rounded-xl hover:bg-opacity-35 transition-all duration-300"
              onClick={handlePlaceBet}
              disabled={!selectedOption || !betAmount}
            >
              投注
            </button>
          </div>
        </div>

        {/* 参与信息区域 */}
        <div className="participation-info mt-5 flex justify-between items-center text-sm opacity-90">
          <div className="participants">已有 2,348 人参与</div>
          <div className="total-points">总奖池 234,800 积分</div>
        </div>
      </div>

      {/* 进行中的竞猜 */}
      <div className="section-title">
        <span>进行中的竞猜</span>
        <span className="see-more cursor-pointer" onClick={() => setShowGuessListModal(true)}>查看全部</span>
      </div>

      <div className="active-guesses">
        {activeGuesses.map(guess => (
          <div key={guess.id} className="guess-item">
            <div className="guess-info">
              <div className="guess-header-info">
                <div className="guess-index">{guess.index}</div>
                <div className="guess-deadline">
                  <span className="fas fa-clock"></span>
                  {guess.deadline}
                </div>
              </div>

              <div className="guess-stats">
                <div className="stat-item">
                  <div className="stat-label">涨支持者</div>
                  <div className="stat-value up">{guess.upVotes}人</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">跌支持者</div>
                  <div className="stat-value down">{guess.downVotes}人</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">总奖池</div>
                  <div className="stat-value">{guess.totalPool}积分</div>
                </div>
              </div>

              {guess.myBet && (
                <div className="my-bet">
                  您已投注<span className="bet-amount">{guess.myBet.amount}</span>积分预测
                  <span className={`bet-type ${guess.myBet.type}`}>
                    {guess.myBet.type === 'up' ? '上涨' : '下跌'}
                  </span>
                </div>
              )}
            </div>

            {!guess.myBet && (
              <button
                className="join-guess-btn"
                onClick={() => handleJoinGuess(guess.id)}
              >
                立即参与
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 历史胜率统计 */}
      <div className="stats-section">
        <div 
          className="stat-card"
          onClick={() => handleStatCardClick('winRate')}
          role="button"
          tabIndex="0"
          aria-label="查看胜率详情"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('winRate');
            }
          }}
        >
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-number">86.5%</div>
            <div className="stat-label">胜率</div>
          </div>
        </div>
        <div 
          className="stat-card"
          onClick={() => handleStatCardClick('totalProfit')}
          role="button"
          tabIndex="0"
          aria-label="查看累计收益详情"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('totalProfit');
            }
          }}
        >
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">2,584</div>
            <div className="stat-label">累计收益</div>
          </div>
        </div>
        <div 
          className="stat-card"
          onClick={() => handleStatCardClick('participation')}
          role="button"
          tabIndex="0"
          aria-label="查看参与次数详情"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('participation');
            }
          }}
        >
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <div className="stat-number">128</div>
            <div className="stat-label">参与次数</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractionPage