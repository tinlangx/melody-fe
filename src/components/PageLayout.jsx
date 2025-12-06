import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../App.css'

const PageLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const isAdminPage = location.pathname.startsWith('/admin')
  const isArtistPage = location.pathname.startsWith('/artist')
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('melody_auth')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.user) setAuthUser(parsed.user)
      }
    } catch (err) {
      setAuthUser(null)
    }
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('melody_auth')
    setAuthUser(null)
    navigate('/', { replace: true })
  }

  return (
    <div className="app-shell">
      {!isHome && (
        <header className="top-bar">
          <div className="brand">Melody</div>
          <nav className="nav-links">
            {!(isAdminPage || isArtistPage) ? (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/artist/dashboard"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Artist
            </NavLink>
            <NavLink
              to="/player"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Player
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Admin
                </NavLink>
              </>
            ) : isAdminPage ? (
              <>
                <span className="nav-link" style={{ cursor: 'default' }}>
                  {authUser?.name || authUser?.email || 'User'}
                </span>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Admin
                </NavLink>
                <button className="ghost-btn" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="nav-link" style={{ cursor: 'default' }}>
                  {authUser?.name || authUser?.email || 'User'}
                </span>
                <NavLink
                  to="/artist/dashboard"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Artist
                </NavLink>
                <button className="ghost-btn" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>
      )}
      <main className={`content ${isHome ? 'content-home' : ''}`}>{children}</main>
    </div>
  )
}

export default PageLayout
