import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Giả lập đăng nhập thành công và chuyển đến trang Home
    navigate('/', { replace: true })
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
            required
          />
        </label>
        <button type="submit" className="primary-button">
          Đăng nhập
        </button>
        <p className="helper-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
