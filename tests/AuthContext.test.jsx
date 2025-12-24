import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)
import React, { useEffect } from 'react'
import { render, waitFor } from '@testing-library/react'
import { describe, it } from 'vitest'
import { AuthProvider, useAuth } from '../src/context/AuthContext'
import api from '../src/utils/api'
import favoritesManager from '../src/utils/favorites'

// Helper consumer to obtain auth methods
function Consumer({ onReady }) {
  const auth = useAuth()
  useEffect(() => {
    if (onReady) onReady(auth)
  }, [auth, onReady])
  return null
}

describe('AuthContext', () => {
  it('login sets currentUser, updates api current user id and favorites storageKey', async () => {
    let authRef = null
    const onReady = (a) => { authRef = a }
    render(
      <AuthProvider>
        <Consumer onReady={onReady} />
      </AuthProvider>
    )

    // Wait for provider to mount and provide auth
    await waitFor(() => { expect(authRef).not.toBeNull() })

    // perform login using existing mock user
    const user = await authRef.login({ username: 'zhangsan', password: 'password123' })

    // after login, api.getCurrentUserId should reflect user_id (AuthProvider effect sets it)
    await waitFor(() => {
      expect(api.getCurrentUserId()).toBe(user.user_id)
    })

    // favoritesManager.storageKey should include the new user id
    expect(favoritesManager.storageKey).toBe(`userFavorites_${user.user_id}`)

    // localStorage should have currentUser stored
    const raw = localStorage.getItem('currentUser')
    expect(raw).not.toBeNull()
    const saved = JSON.parse(raw)
    expect(saved.user_id).toBe(user.user_id)
  })
})
