import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)
import { describe, it, beforeEach } from 'vitest'
import favoritesManager from '../src/utils/favorites'

describe('FavoritesManager per-user storage', () => {
  beforeEach(() => {
    // clear both possible keys
    favoritesManager.setUserId(1)
    favoritesManager.clearFavorites()
    favoritesManager.setUserId(2)
    favoritesManager.clearFavorites()
    favoritesManager.setUserId(null)
  })

  it('isolates favorites by userId', () => {
    favoritesManager.setUserId(1)
    expect(favoritesManager.getFavorites().length).toBe(0)
    favoritesManager.addToFavorites({ type: 'news', title: 'news1' })
    expect(favoritesManager.getFavorites().length).toBe(1)

    favoritesManager.setUserId(2)
    expect(favoritesManager.getFavorites().length).toBe(0)

    favoritesManager.setUserId(1)
    expect(favoritesManager.getFavorites().length).toBe(1)

    // cleanup
    favoritesManager.clearFavorites()
    favoritesManager.setUserId(2)
    favoritesManager.clearFavorites()
  })
})
