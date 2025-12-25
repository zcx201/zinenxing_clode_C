// Simple favorites updated notifier for cross-component and cross-tab sync
export function notifyFavoritesUpdated() {
  try {
    // write timestamp to localStorage so other tabs receive storage event
    localStorage.setItem('favorites_updated', String(Date.now()))
  } catch (e) {
    // ignore
  }
  // dispatch an in-window event for same-tab listeners
  try {
    window.dispatchEvent(new Event('favorites-updated'))
  } catch (e) {}
}

export function addFavoritesUpdatedListener(cb) {
  const handler = () => cb()
  const storageHandler = (e) => {
    if (e.key === 'favorites_updated') cb()
  }
  window.addEventListener('favorites-updated', handler)
  window.addEventListener('storage', storageHandler)
  return () => {
    window.removeEventListener('favorites-updated', handler)
    window.removeEventListener('storage', storageHandler)
  }
}
