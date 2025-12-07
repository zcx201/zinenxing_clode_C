import React, { useEffect } from 'react'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
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

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-md',
    xl: 'max-w-lg'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`relative bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full max-h-[95vh] overflow-hidden flex flex-col mx-2 md:mx-0`}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <span className="fas fa-times text-gray-500"></span>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-3 md:p-6 overflow-y-auto flex-1 max-h-[calc(95vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal