import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import favoritesManager from '../utils/favorites'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import { notifyFavoritesUpdated } from '../utils/favoritesNotifier'

const StockDetailPage = () => {
  const { code, id, name } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [item, setItem] = useState(location.state?.item || null)
  const [loading, setLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [adding, setAdding] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')

  // Helper to show toast
  const doToast = (message, type = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (item) {
        // already have data
        // Try check favorite status by stock_id if present
        if (item.stock_id) {
          try {
            const res = await api.favorites.checkFavorite(item.stock_id)
            if (!mounted) return
            setIsFavorite(!!res?.is_favorite)
          } catch (e) {
            // ignore
          }
        }
        return
      }

      // No item passed via state — try to resolve by params
      const keyword = code || name || id
      if (!keyword) return
      setLoading(true)
      try {
        // try search by code or name
        const res = await api.stock.searchStocks({ keyword })
        const found = res.stocks && res.stocks.length ? res.stocks[0] : null
        if (mounted) setItem(found)
        if (found && found.stock_id) {
          try {
            const ck = await api.favorites.checkFavorite(found.stock_id)
            if (mounted) setIsFavorite(!!ck?.is_favorite)
          } catch (e) {}
        }
      } catch (e) {
        // swallow; keep null
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [code, id, name, item])

  const handleAddFavorite = async () => {
    if (adding) return
    setAdding(true)
    try {
      // prefer API path
      if (item && item.stock_id) {
        await api.favorites.addFavorite({ stock_id: item.stock_id })
        setIsFavorite(true)
          try { notifyFavoritesUpdated() } catch (e) {}
        doToast('已加入自选股', 'success')
      } else if (item && (item.stock_code || item.code)) {
        // try to resolve stock_id first
        const res = await api.stock.searchStocks({ keyword: item.stock_code || item.code || item.stock_name || item.name })
        const matched = res.stocks && res.stocks.length ? res.stocks[0] : null
        if (matched && matched.stock_id) {
          await api.favorites.addFavorite({ stock_id: matched.stock_id })
          setIsFavorite(true)
            try { notifyFavoritesUpdated() } catch (e) {}
          doToast('已加入自选股', 'success')
        } else {
          // fallback to local favoritesManager
          try {
            if (typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(currentUser ? currentUser.user_id : null)
          } catch (e) {
            // ignore
          }
          const added = favoritesManager.addToFavorites({ type: 'stock', code: item.stock_code || item.code || '', name: item.stock_name || item.name || '' })
          if (added) {
            setIsFavorite(true)
            try { notifyFavoritesUpdated() } catch (e) {}
            doToast('已加入本地自选（离线）', 'success')
          } else {
            doToast('已在自选中', 'warning')
          }
        }
      } else {
        doToast('无法识别股票信息，添加失败', 'error')
      }
    } catch (err) {
      // API error -> fallback to local
      try {
        if (item) {
          try {
            if (typeof favoritesManager.setUserId === 'function') favoritesManager.setUserId(currentUser ? currentUser.user_id : null)
          } catch (e) {
            // ignore
          }
          const added = favoritesManager.addToFavorites({ type: 'stock', code: item.stock_code || item.code || '', name: item.stock_name || item.name || '' })
          if (added) {
            setIsFavorite(true)
            doToast('已加入本地自选（离线）', 'success')
          } else {
            doToast('已在自选中', 'warning')
          }
        } else {
          doToast('添加失败，请稍后重试', 'error')
        }
      } catch (e) {
        doToast('添加失败，请稍后重试', 'error')
      }
    } finally {
      setAdding(false)
    }
  }

  const title = item?.stock_name || item?.name || code || id || name || '详情'
  const price = item?.price || item?.latest_price || '-'
  const change = item?.change || item?.latest_change || ''
  const industry = item?.industry || item?.stock_industry || ''
  const listing = item?.listing_date || ''

  return (
    <>
      <Modal isOpen={true} onClose={() => navigate(-1)} title={title} size="md">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div />
            <h2 className="text-lg font-bold">{title}</h2>
            <div style={{width:40}} />
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-2xl font-bold">{price}</div>
                <div className={`text-sm ${change && change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>{change}</div>
              </div>
              <div>
                <button
                  className={`px-4 py-2 rounded-lg text-sm ${isFavorite ? 'bg-gray-300 text-gray-800' : 'bg-primary-500 text-white'}`}
                  onClick={handleAddFavorite}
                  disabled={adding || isFavorite}
                >
                  {isFavorite ? '已加入自选' : adding ? '添加中...' : '加入自选嗨吧'}
                </button>
              </div>
            </div>

            <div className="mb-2">行业：{industry || '-'}</div>
            <div className="mb-2">上市日期：{listing || '-'}</div>

            <div className="mt-4 text-sm text-gray-700">
              这里展示更多股票摘要（行情、公司概况、财务摘要、风险提示等）。如需完整行情图表，请接入后端行情服务或第三方数据源。
            </div>
          </div>

          {showToast && (
            <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
          )}
        </div>
      </Modal>
    </>
  )
}

export default StockDetailPage
