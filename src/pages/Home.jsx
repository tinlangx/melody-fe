import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { apiBaseUrl } from '../services/apiClient'

const getSavedAuth = () => {
  try {
    const raw = localStorage.getItem('melody_auth')
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    return null
  }
}

const Home = () => {
  const savedAuth = useMemo(() => getSavedAuth(), [])

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Welcome</p>
        <h1 className="title">Melody Home</h1>
        <p className="subtitle">
          Đây là trang chính sau khi đăng nhập. Từ đây bạn có thể tiếp tục xây dựng tính năng cho Melody
          web.
        </p>
      </div>
      <div className="panel-grid">
        <div className="panel-card">
          <h3>Hành động nhanh</h3>
          <ul className="actions">
            <li>
              <Link to="/login">Đăng nhập lại</Link>
            </li>
            <li>
              <Link to="/register">Tạo tài khoản mới</Link>
            </li>
          </ul>
        </div>
        <div className="panel-card accent">
          <h3>Ghi chú</h3>
          <p>Điều chỉnh nội dung trang này theo luồng sản phẩm của bạn.</p>
        </div>
        <div className="panel-card">
          <h3>Kết nối backend</h3>
          <p>API đang trỏ tới: {apiBaseUrl}</p>
          {savedAuth?.user ? (
            <p>
              Phiên hiện tại: <strong>{savedAuth.user.email}</strong>
            </p>
          ) : (
            <p>Chưa có phiên đăng nhập. Hãy đăng nhập để thử gọi API.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Home
