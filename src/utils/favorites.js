// 收藏管理工具类 - 支持股票和新闻
class FavoritesManager {
  constructor() {
    // storageKey 会基于当前用户 id 生成，默认 guest
    this.userId = null
    this.storageKey = this._calcKey(null)
  }

  _calcKey(userId) {
    return userId ? `userFavorites_${userId}` : 'userFavorites_guest'
  }

  // 在 AuthContext 中调用以切换当前用户的收藏命名空间
  setUserId(userId) {
    this.userId = userId
    this.storageKey = this._calcKey(userId)
  }

  // 获取所有收藏
  getFavorites() {
    const favorites = localStorage.getItem(this.storageKey)
    return favorites ? JSON.parse(favorites) : []
  }

  // 添加收藏（支持股票和新闻）
  addToFavorites(item) {
    const favorites = this.getFavorites()

    // 检查是否已存在
    const exists = favorites.some(fav => {
      if (item.type === 'stock') {
        return fav.type === 'stock' && fav.code === item.code
      } else if (item.type === 'news') {
        return fav.type === 'news' && fav.title === item.title
      }
      return false
    })

    if (exists) {
      return false // 已存在，添加失败
    }

    const newFavorite = {
      ...item,
      addedTime: new Date().toISOString(),
      id: Date.now().toString()
    }

    favorites.push(newFavorite)
    localStorage.setItem(this.storageKey, JSON.stringify(favorites))
    return true // 添加成功
  }

  // 从收藏中移除
  removeFromFavorites(id) {
    const favorites = this.getFavorites()
    const newFavorites = favorites.filter(fav => fav.id !== id)
    localStorage.setItem(this.storageKey, JSON.stringify(newFavorites))

    return newFavorites.length !== favorites.length // 返回是否成功移除
  }

  // 检查是否在收藏中
  isInFavorites(item) {
    const favorites = this.getFavorites()
    if (item.type === 'stock') {
      return favorites.some(fav => fav.type === 'stock' && fav.code === item.code)
    } else if (item.type === 'news') {
      return favorites.some(fav => fav.type === 'news' && fav.title === item.title)
    }
    return false
  }

  // 清空收藏
  clearFavorites() {
    localStorage.removeItem(this.storageKey)
  }

  // 获取收藏的新闻
  getFavoriteNews() {
    const favorites = this.getFavorites()
    return favorites.filter(fav => fav.type === 'news')
  }

  // 获取收藏的股票
  getFavoriteStocks() {
    const favorites = this.getFavorites()
    return favorites.filter(fav => fav.type === 'stock')
  }
}

export default new FavoritesManager()