import React, { useState, useEffect } from 'react'

const InteractionPage = () => {
  const [selectedIndex, setSelectedIndex] = useState('sh')
  const [selectedOption, setSelectedOption] = useState(null)
  const [betAmount, setBetAmount] = useState('')
  const [activeGuesses, setActiveGuesses] = useState([])

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

    // 模拟下注逻辑
    alert(`成功下注${amount}积分，预测${indices.find(i => i.id === selectedIndex)?.name}会${selectedOption === 'up' ? '上涨' : '下跌'}`)

    // 重置选择
    setSelectedOption(null)
    setBetAmount('')
  }

  const handleJoinGuess = (guessId) => {
    const guess = activeGuesses.find(g => g.id === guessId)
    if (guess?.myBet) {
      alert('您已参与此竞猜')
      return
    }

    // 模拟参与竞猜
    alert('参与竞猜成功！')
  }

  return (
    <div className="interaction-page">
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