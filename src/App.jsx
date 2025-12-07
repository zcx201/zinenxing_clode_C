import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PhoneLayout from './components/PhoneLayout'
import MarketHeader from './components/MarketHeader'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MarketPage from './pages/MarketPage'
import AIPicksPage from './pages/AIPicksPage'
import NewsPage from './pages/NewsPage'
import EducationPage from './pages/EducationPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import InteractionPage from './pages/InteractionPage'
import FriendsPage from './pages/FriendsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <div className="phone-container">
            <div className="phone-screen">
              <LoginPage />
            </div>
          </div>
        } />
        <Route path="/market" element={
          <div className="phone-container">
            <div className="phone-screen">
              <MarketHeader />
              <div className="scrollable-content">
                <MarketPage />
              </div>
              <Navigation />
            </div>
          </div>
        } />
        <Route path="*" element={
          <PhoneLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/aipicks" element={<AIPicksPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/interaction" element={<InteractionPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </PhoneLayout>
        } />
      </Routes>
    </Router>
  )
}

export default App