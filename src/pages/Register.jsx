import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Giả lập đăng ký thành công và chuyển đến trang Login
    navigate('/login', { replace: true })
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
          Đăng ký
        </button>
        <p className="helper-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </section>
  )
}

export default Register
