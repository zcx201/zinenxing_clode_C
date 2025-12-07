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
      totalPool: 2034
    },
    {
      id: 2,
      index: '创业板指',
      deadline: '1小时后',
      upVotes: 567,
      downVotes: 892,
      myBet: null,
      totalPool: 1459
    },
    {
      id: 3,
      index: '沪深300',
      deadline: '明日开市前',
      upVotes: 987,
      downVotes: 654,
      myBet: { type: 'down', amount: 30 },
      totalPool: 1641
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
    const amount = parseInt(betAmount)
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
      {/* 主竞猜卡片 */}
      <div className="main-guess-card">
        <div className="guess-header">
          <div className="guess-target">
            <span className="fas fa-chart-line"></span>
            <span>今日竞猜</span>
          </div>

          {/* 指数选择下拉菜单 */}
          <select
            className="index-select"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
          >
            {indices.map(index => (
              <option key={index.id} value={index.id}>{index.name}</option>
            ))}
          </select>
        </div>

        {/* 指数显示区域 */}
        <div className="index-display">
          <div className="index-item">
            <div className="index-name">当前点位</div>
            <div className="index-value">{indexData[selectedIndex].value}</div>
            <div className="index-change">
              {indexData[selectedIndex].change}
            </div>
          </div>

          <div className="guess-deadline">
            <span className="fas fa-clock"></span> 竞猜截止: 今日收盘后
          </div>
        </div>

        {/* 竞猜选项 */}
        <div className="guess-options">
          <div
            className={`guess-option up ${selectedOption === 'up' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('up')}
          >
            <div className="option-icon">📈</div>
            <div>上涨</div>
          </div>

          <div
            className={`guess-option down ${selectedOption === 'down' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('down')}
          >
            <div className="option-icon">📉</div>
            <div>下跌</div>
          </div>
        </div>

        {/* 投注控制 */}
        <div className="bet-controls">
          <input
            type="number"
            className="bet-amount"
            placeholder="投注积分"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min="1"
          />
          <button
            className="bet-btn"
            onClick={handlePlaceBet}
            disabled={!selectedOption || !betAmount}
          >
            立即投注
          </button>
        </div>
      </div>

      {/* 进行中的竞猜 */}
      <div className="section-title">
        <span>进行中的竞猜</span>
        <span className="see-more">查看全部</span>
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
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-number">86.5%</div>
            <div className="stat-label">胜率</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">2,584</div>
            <div className="stat-label">累计收益</div>
          </div>
        </div>
        <div className="stat-card">
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