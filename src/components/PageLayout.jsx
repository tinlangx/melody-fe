import { NavLink, useLocation } from 'react-router-dom'
import '../App.css'

const PageLayout = ({ children }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="app-shell">
      {!isHome && (
        <header className="top-bar">
          <div className="brand">Melody</div>
          <nav className="nav-links">
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
          </nav>
        </header>
      )}
      <main className={`content ${isHome ? 'content-home' : ''}`}>{children}</main>
    </div>
  )
}

export default PageLayout
