import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import PageLayout from './components/PageLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageLayout>
  )
}

export default App
