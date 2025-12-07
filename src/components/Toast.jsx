import React, { useEffect, useState } from 'react'

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white'
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg min-w-64`}>
        <div className="flex items-center">
          {type === 'success' && <span className="fas fa-check-circle mr-2"></span>}
          {type === 'error' && <span className="fas fa-exclamation-circle mr-2"></span>}
          {type === 'info' && <span className="fas fa-info-circle mr-2"></span>}
          {type === 'warning' && <span className="fas fa-exclamation-triangle mr-2"></span>}
          <span>{message}</span>
        </div>
      </div>
    </div>
  )
}

export default Toast