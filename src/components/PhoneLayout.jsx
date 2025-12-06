import React, { useState, useEffect } from 'react'
import StatusBar from './StatusBar'
import Header from './Header'
import Navigation from './Navigation'

const PhoneLayout = ({ children }) => {
  return (
    <div className="phone-container">
      <div className="phone-screen">
        <StatusBar />
        <Header />
        <div className="scrollable-content">
          {children}
        </div>
        <Navigation />
      </div>
    </div>
  )
}

export default PhoneLayout