import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../services/apiClient'

const Login = ({ onSuccess, initialEmail = '', onSwitchToRegister }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState(
    location.state?.fromRegister ? 'Đăng ký thành công, hãy đăng nhập.' : ''
  )

  useEffect(() => {
    const emailFromState = location.state?.registeredEmail
    const email = initialEmail || emailFromState
    if (email) {
      setForm((prev) => ({ ...prev, email }))
    }
  }, [location.state, initialEmail])

  const getRedirectPath = (role) => {
    switch (role) {
      case 'ADMIN':
        return '/admin'
      case 'ARTIST':
        return '/artist/dashboard'
      default:
        return '/'
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')
    setLoading(true)

    try {
      const data = await loginRequest(form)
      localStorage.setItem('melody_auth', JSON.stringify({ user: data.user, token: data.token }))
      if (onSuccess) {
        onSuccess(data)
      } else {
        const redirect = getRedirectPath(data?.user?.role)
        navigate(redirect, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Không thể đăng nhập, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Đăng nhập</p>
        <h1 className="title">Chào mừng trở lại</h1>
        <p className="subtitle">Nhập thông tin để vào trang home của Melody.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            required
          />
        </label>
        <label className="field">
          <span>Mật khẩu</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </label>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        {error && <p className="status error">{error}</p>}
        {status && !error && <p className="status success">{status}</p>}
        <p className="helper-text">
          Chưa có tài khoản?{' '}
          {onSwitchToRegister ? (
            <button
              type="button"
              className="ghost-btn"
              style={{ padding: 0, border: 'none' }}
              onClick={onSwitchToRegister}
              disabled={loading}
            >
              Đăng ký
            </button>
          ) : (
            <Link to="/register">Đăng ký</Link>
          )}
        </p>
      </form>
    </section>
  )
}

export default Login
