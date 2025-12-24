import React, { useEffect, useState, useRef } from 'react'

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false)
  const visibleTimerRef = useRef(null)
  const closeCallbackTimerRef = useRef(null)

  useEffect(() => {
    setVisible(true)

    const hideTimer = setTimeout(() => {
      setVisible(false)
      // 延迟触发 onClose，以配合动画
      if (typeof onClose === 'function') {
        closeCallbackTimerRef.current = setTimeout(onClose, 300)
      }
    }, duration)

    // 保存引用以便卸载时清理
    visibleTimerRef.current = hideTimer

    return () => {
      if (visibleTimerRef.current) {
        clearTimeout(visibleTimerRef.current)
        visibleTimerRef.current = null
      }
      if (closeCallbackTimerRef.current) {
        clearTimeout(closeCallbackTimerRef.current)
        closeCallbackTimerRef.current = null
      }
    }
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

// 定时器引用（模块级，仅在组件实例内部使用的 ref 将在组件中创建）