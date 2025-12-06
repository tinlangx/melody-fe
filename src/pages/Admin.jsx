import { useMemo, useState } from 'react'
import { promoteToArtist, demoteToListener } from '../services/apiClient'

const loadAuth = () => {
  try {
    const raw = localStorage.getItem('melody_auth')
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    return null
  }
}

const Admin = () => {
  const [auth, setAuth] = useState(() => loadAuth())
  const [targetId, setTargetId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const token = auth?.token

  const isAdmin = auth?.user?.role === 'ADMIN'

  const handlePromote = async () => {
    if (!token) {
      setError('Bạn cần đăng nhập Admin.')
      return
    }
    if (!targetId) {
      setError('Hãy nhập userId cần nâng cấp.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await promoteToArtist(targetId, token)
      setResult(res)
    } catch (err) {
      setError(err.message || 'Không thể thực thi tác vụ.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemote = async () => {
    if (!token) {
      setError('Bạn cần đăng nhập Admin.')
      return
    }
    if (!targetId) {
      setError('Hãy nhập userId cần cập nhật.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await demoteToListener(targetId, token)
      setResult(res)
    } catch (err) {
      setError(err.message || 'Không thể thực thi tác vụ.')
    } finally {
      setLoading(false)
    }
  }

  const infoText = useMemo(() => {
    if (!auth) return 'Bạn chưa đăng nhập. Hãy login bằng tài khoản Admin.'
    if (!isAdmin) return 'Tài khoản hiện tại không phải Admin. Vui lòng dùng Admin.'
    return ''
  }, [auth, isAdmin])

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Admin Control</p>
        <h1 className="title">Nâng Listener thành Artist</h1>
        <p className="subtitle">Nhập userId của Listener và thực thi với tài khoản Admin.</p>
      </div>

      {infoText && <p className="status error">{infoText}</p>}
      {error && <p className="status error">{error}</p>}
      {result && (
        <p className="status success">
          {result.message || 'Đã cập nhật'} — role mới: {result.user?.role}
        </p>
      )}

      <div className="panel-card accent">
        <label className="field">
          <span>User ID</span>
          <input
            type="text"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="Nhập userId Listener"
            disabled={loading || !isAdmin}
          />
        </label>
        <div className="admin-actions">
          <button className="primary-button" type="button" onClick={handlePromote} disabled={loading || !isAdmin}>
            {loading ? 'Đang xử lý...' : 'Nâng lên Artist'}
          </button>
          <button className="ghost-btn" type="button" onClick={handleDemote} disabled={loading || !isAdmin}>
            {loading ? 'Đang xử lý...' : 'Đảo lại Listener'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Admin
