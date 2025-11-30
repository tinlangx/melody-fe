import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerRequest } from '../services/apiClient'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

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
      await registerRequest(form)
      setStatus('Đăng ký thành công, chuyển đến trang đăng nhập...')
      navigate('/login', {
        replace: true,
        state: { fromRegister: true, registeredEmail: form.email },
      })
    } catch (err) {
      setError(err.message || 'Không thể đăng ký, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Đăng ký</p>
        <h1 className="title">Tạo tài khoản mới</h1>
        <p className="subtitle">Sau khi đăng ký thành công bạn sẽ được chuyển tới trang đăng nhập.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Họ và tên</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            disabled={loading}
            required
          />
        </label>
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
            autoComplete="new-password"
            disabled={loading}
            required
          />
        </label>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
        {error && <p className="status error">{error}</p>}
        {status && !error && <p className="status success">{status}</p>}
        <p className="helper-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </section>
  )
}

export default Register
