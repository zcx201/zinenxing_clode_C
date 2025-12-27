import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLogin) {
      try {
        await login({ username: formData.username, password: formData.password, rememberMe: rememberMe })
        navigate('/')
      } catch (err) {
        alert(err.message || '登录失败')
      }
    } else {
      // 注册逻辑通过 mock API
      if (formData.password !== formData.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }

      try {
        await register({ username: formData.username, email: formData.email, password: formData.password })
        navigate('/')
      } catch (err) {
        alert(err.message || '注册失败')
      }
    }
  }

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? '欢迎回来' : '创建账户'}
        </h1>
        <p className="text-gray-600">
          {isLogin ? '登录您的智能鑫AI账户' : '开始您的股票投资之旅'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入邮箱"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入密码"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请再次输入密码"
              required
            />
          </div>
        )}

        {/* 记住我和忘记密码 */}
        {isLogin && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">记住我</label>
            </div>
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              忘记密码？
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          {isLogin ? '登录' : '注册'}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary-500 hover:text-primary-600 font-medium"
        >
          {isLogin ? '没有账户？立即注册' : '已有账户？立即登录'}
        </button>
      </div>

      {/* 忘记密码弹窗 */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-0 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isResetting ? '重置密码' : '忘记密码'}
              </h2>
              
              {!isResetting ? (
                <>
                  <p className="text-gray-600 mb-4">
                    请输入您的邮箱，我们将发送密码重置链接
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入邮箱"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          // 模拟发送重置邮件
                          alert('密码重置链接已发送到您的邮箱')
                          setIsResetting(true)
                        }}
                        className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                        disabled={!forgotPasswordEmail}
                      >
                        发送链接
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    请输入收到的验证码和新密码
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                      <input
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入验证码"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入新密码"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请再次输入新密码"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsResetting(false)
                          setResetToken('')
                          setNewPassword('')
                          setConfirmNewPassword('')
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        返回
                      </button>
                      <button
                        onClick={() => {
                          if (newPassword !== confirmNewPassword) {
                            alert('两次输入的密码不一致')
                            return
                          }
                          // 模拟重置密码
                          alert('密码重置成功，请使用新密码登录')
                          setShowForgotPassword(false)
                          setIsResetting(false)
                          setResetToken('')
                          setNewPassword('')
                          setConfirmNewPassword('')
                          setForgotPasswordEmail('')
                        }}
                        className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                        disabled={!resetToken || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}
                      >
                        重置密码
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage