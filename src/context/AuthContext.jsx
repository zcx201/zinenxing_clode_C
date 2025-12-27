import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'
import favorites from '../utils/favorites'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('currentUser')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        // 注入 token 到 api 层（模拟）
  if (currentUser.token && typeof api.setToken === 'function') api.setToken(currentUser.token)
  // 告知 api 和 favorites 模块当前用户 id，以便 mock 层与客户端同步
  if (typeof api.setCurrentUserId === 'function') api.setCurrentUserId(currentUser.user_id)
  if (typeof favorites.setUserId === 'function') favorites.setUserId(currentUser.user_id)
      } else {
        localStorage.removeItem('currentUser')
  if (typeof api.setToken === 'function') api.setToken(null)
  if (typeof api.setCurrentUserId === 'function') api.setCurrentUserId(null)
  if (typeof favorites.setUserId === 'function') favorites.setUserId(null)
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [currentUser])

  const login = async ({ username, password, rememberMe = false }) => {
    const res = await api.auth.login({ username, password })
    const safeUser = {
      user_id: res.user_id,
      username: res.username,
      email: res.email,
      token: res.token,
      rememberMe: rememberMe
    }
    setCurrentUser(safeUser)
    if (safeUser.token && typeof api.setToken === 'function') api.setToken(safeUser.token)
    return safeUser
  }

  const register = async ({ username, email, password }) => {
    const res = await api.auth.register({ username, email, password })
    const safeUser = {
      user_id: res.user_id,
      username: res.username,
      email: res.email,
      token: res.token
    }
    setCurrentUser(safeUser)
    if (safeUser.token && typeof api.setToken === 'function') api.setToken(safeUser.token)
    return safeUser
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (e) {
      // ignore
    }
    setCurrentUser(null)
    if (typeof api.setToken === 'function') api.setToken(null)
  }

  const value = {
    currentUser,
    setCurrentUser,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
