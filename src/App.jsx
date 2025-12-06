import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import PageLayout from './components/PageLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import ArtistDashboard from './pages/ArtistDashboard'
import Player from './pages/Player'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PlayerProvider } from './context/PlayerContext'
import PlayerBar from './components/PlayerBar'
import PlayerModal from './components/PlayerModal'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    const originalRestoration = window.history.scrollRestoration
    if (originalRestoration) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return () => {
      if (originalRestoration) {
        window.history.scrollRestoration = originalRestoration
      }
    }
  }, [pathname])
  return null
}

function App() {
  return (
    <PlayerProvider>
      <PageLayout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route path="/player" element={<Player />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PlayerModal />
        <PlayerBar />
      </PageLayout>
    </PlayerProvider>
  )
}

export default App
