import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
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
        await login({ username: formData.username, password: formData.password })
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
    </div>
  )
}

export default LoginPage