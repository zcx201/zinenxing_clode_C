// 自选股管理工具类
class FavoritesManager {
  constructor() {
    this.storageKey = 'userFavorites'
  }

  // 获取所有自选股
  getFavorites() {
    const favorites = localStorage.getItem(this.storageKey)
    return favorites ? JSON.parse(favorites) : []
  }

  // 添加自选股
  addToFavorites(stock) {
    const favorites = this.getFavorites()

    // 检查是否已存在
    const exists = favorites.some(fav => fav.code === stock.code)
    if (exists) {
      return false // 已存在，添加失败
    }

    const newFavorite = {
      ...stock,
      addedTime: new Date().toISOString(),
      id: Date.now().toString()
    }

    favorites.push(newFavorite)
    localStorage.setItem(this.storageKey, JSON.stringify(favorites))
    return true // 添加成功
  }

  // 从自选股移除
  removeFromFavorites(stockCode) {
    const favorites = this.getFavorites()
    const newFavorites = favorites.filter(fav => fav.code !== stockCode)
    localStorage.setItem(this.storageKey, JSON.stringify(newFavorites))

    return newFavorites.length !== favorites.length // 返回是否成功移除
  }

  // 检查是否在自选股中
  isInFavorites(stockCode) {
    const favorites = this.getFavorites()
    return favorites.some(fav => fav.code === stockCode)
  }

  // 清空自选股
  clearFavorites() {
    localStorage.removeItem(this.storageKey)
  }
}

export default new FavoritesManager()