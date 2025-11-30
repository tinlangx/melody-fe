import { Link } from 'react-router-dom'

const Home = () => {
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
      </div>
    </section>
  )
}

export default Home
