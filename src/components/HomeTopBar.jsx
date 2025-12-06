import React from 'react'

const HomeTopBar = ({ authUser, onLogout, onOpenLogin, onOpenRegister }) => (
  <div className="home-topbar-card">
    <div className="home-topbar">
      <input className="search" placeholder="Search for musics, artists, albums..." />
      <nav className="top-links">
        {['About', 'Contact', 'Premium'].map((link) => (
          <a key={link} href="#">
            {link}
          </a>
        ))}
      </nav>
      <div className="top-actions">
        {authUser ? (
          <>
            <span className="welcome-text">
              Welcome, {authUser.name || authUser.email || 'user'}
            </span>
            <button className="ghost-btn" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="ghost-btn" type="button" onClick={onOpenLogin}>
              Login
            </button>
            <button className="pill-btn" type="button" onClick={onOpenRegister}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)

export default HomeTopBar
