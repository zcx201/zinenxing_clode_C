import React, { useEffect, useRef } from 'react'

const Modal = ({ isOpen, onClose, title, children, size = 'md', type = 'center' }) => {
  const modalRef = useRef(null)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  // 处理触摸事件，实现向下滑动关闭
  const handleTouchStart = (e) => {
    if (type === 'bottom') {
      startYRef.current = e.touches[0].clientY
      isDraggingRef.current = true
    }
  }

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || type !== 'bottom') return
    
    currentYRef.current = e.touches[0].clientY
    const deltaY = currentYRef.current - startYRef.current
    
    if (deltaY > 0) {
      e.preventDefault()
      const modalEl = modalRef.current
      if (modalEl) {
        modalEl.style.transform = `translateY(${deltaY}px)`
        modalEl.style.transition = 'none'
      }
    }
  }

  const handleTouchEnd = () => {
    if (!isDraggingRef.current || type !== 'bottom') return
    
    const modalEl = modalRef.current
    const deltaY = currentYRef.current - startYRef.current
    
    if (deltaY > 100) {
      // 滑动距离超过100px，关闭弹窗
      onClose()
    } else {
      // 恢复原位
      if (modalEl) {
        modalEl.style.transform = 'translateY(0)'
        modalEl.style.transition = 'transform 0.3s ease-out'
      }
    }
    
    isDraggingRef.current = false
    startYRef.current = 0
    currentYRef.current = 0
  }

  if (type === 'bottom') {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-black bg-opacity-50" onClick={onClose}>
        <div 
          ref={modalRef}
          className="relative bg-white rounded-t-3xl shadow-2xl w-full max-w-[390px] max-h-[80vh] overflow-hidden flex flex-col mx-0"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* 头部 - 固定高度60px */}
          <div className="flex items-center justify-between px-6 h-15 border-b border-gray-200 flex-shrink-0">
            {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <span className="fas fa-times text-gray-500"></span>
            </button>
          </div>

          {/* 标签栏 - 固定高度48px */}
          <div className="flex justify-around h-12 border-b border-gray-200 flex-shrink-0">
            {children.props?.guessListTab === 'ongoing' && (
              <button
                className="flex-1 text-center flex items-center justify-center font-medium text-primary-500 border-b-2 border-primary-500"
                onClick={() => children.props?.setGuessListTab('ongoing')}
              >
                进行中
              </button>
            )}
            {children.props?.guessListTab === 'history' && (
              <button
                className="flex-1 text-center flex items-center justify-center font-medium text-primary-500 border-b-2 border-primary-500"
                onClick={() => children.props?.setGuessListTab('history')}
              >
                历史记录
              </button>
            )}
            {children.props?.guessListTab === 'all' && (
              <button
                className="flex-1 text-center flex items-center justify-center font-medium text-primary-500 border-b-2 border-primary-500"
                onClick={() => children.props?.setGuessListTab('all')}
              >
                全部
              </button>
            )}
            {children.props?.guessListTab !== 'ongoing' && (
              <button
                className="flex-1 text-center flex items-center justify-center font-medium text-gray-500"
                onClick={() => children.props?.setGuessListTab('ongoing')}
              >
                进行中
              </button>
            )}
            {children.props?.guessListTab !== 'history' && (
              <button
                className="flex-1 text-center flex items-center justify-center font-medium text-gray-500"
                onClick={() => children.props?.setGuessListTab('history')}
              >
                历史记录
              </button>
            )}
            {children.props?.guessListTab !== 'all' && (
              <button
                className="flex-1 text-center flex items-center justify-center font-medium text-gray-500"
                onClick={() => children.props?.setGuessListTab('all')}
              >
                全部
              </button>
            )}
          </div>

          {/* 内容区域 - 占剩余高度，仅有一个滚动条 */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {children}
          </div>
        </div>
      </div>
    )
  }

  // 默认居中模态框
  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-[358px]', // 适配iPhone 13/14宽度
    xl: 'max-w-lg'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl ${sizeClasses[size]} w-full max-h-[75vh] overflow-hidden flex flex-col mx-0`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <span className="fas fa-times text-gray-500"></span>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[calc(75vh-60px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal