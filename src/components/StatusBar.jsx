import React, { useState, useEffect } from 'react'

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState('14:30')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="status-bar">
      <div className="status-left">
        <span>中国移动</span>
        <span>4G</span>
      </div>
      <div className="status-time">{currentTime}</div>
      <div className="status-icons">
        <span className="fas fa-signal"></span>
        <span className="fas fa-wifi"></span>
        <span className="fas fa-battery-three-quarters"></span>
      </div>
    </div>
  )
}

export default StatusBar