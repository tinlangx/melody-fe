import { useEffect, useMemo, useState } from 'react'
import {
  getArtistStats,
  createAlbum,
  listMyAlbums,
  createSong,
  listMySongs,
  deleteSong,
  deleteAlbum,
  getUploadSignature,
  createPlaylist,
  listMyPlaylists,
  deletePlaylist,
  listArtistComments,
  hideComment,
  listNotifications,
  markNotificationRead,
  listEarnings,
  createPromotion,
  listPromotions,
  deletePromotion,
  createSupport,
  listSupport,
  statsListensLikes,
  updateAlbum,
  addSongToAlbum,
  removeSongFromAlbum,
} from '../services/apiClient'

const uploadToCloudinary = async (file, sig) => {
  const { cloudName, apiKey, signature, timestamp, folder, resource_type } = sig
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resource_type || 'auto'}/upload`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', timestamp)
  formData.append('signature', signature)
  if (folder) formData.append('folder', folder)
  return fetch(url, {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      const msg = data?.error?.message || 'Upload thất bại.'
      throw new Error(msg)
    }
    return data
  })
}

const loadAuth = () => {
  try {
    const raw = localStorage.getItem('melody_auth')
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    return null
  }
}

const StatCard = ({ label, value }) => (
  <div className="admin-card">
    <div className="admin-card-head">
      <h3>{label}</h3>
    </div>
    <p className="admin-desc" style={{ fontSize: 24, fontWeight: 800 }}>
      {value}
    </p>
  </div>
)

const ArtistDashboard = () => {
  const [auth, setAuth] = useState(() => loadAuth())
  const token = auth?.token
  const isArtist = auth?.user?.role === 'ARTIST' || auth?.user?.role === 'ADMIN'

  const [stats, setStats] = useState(null)
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [comments, setComments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [earnings, setEarnings] = useState([])
  const [promotions, setPromotions] = useState([])
  const [supports, setSupports] = useState([])
  const [listenLikeStats, setListenLikeStats] = useState(null)
  const [albumForm, setAlbumForm] = useState({ title: '', description: '', coverUrl: '' })
  const [songForm, setSongForm] = useState({
    title: '',
    description: '',
    folder: 'melody-media/audio',
  })
  const [songFile, setSongFile] = useState(null)
  const [playlistForm, setPlaylistForm] = useState({ title: '', description: '', coverUrl: '' })
  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    appliesToSongs: '',
    appliesToAlbums: '',
  })
  const [supportForm, setSupportForm] = useState({ title: '', message: '' })
  const [albumSongSelection, setAlbumSongSelection] = useState({})
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [toast, setToast] = useState(null) // { type: 'error' | 'success', message }

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }
  const [loading, setLoading] = useState(false)

  const infoText = useMemo(() => {
    if (!auth) return 'Bạn chưa đăng nhập. Hãy login bằng Artist hoặc Admin.'
    if (!isArtist) return 'Tài khoản hiện tại không phải Artist/Admin.'
    return ''
  }, [auth, isArtist])

  const fetchAll = async () => {
    if (!token || !isArtist) return
    try {
      const [statsRes, albumRes, songRes, playlistRes, commentRes, notifRes, earningRes, promoRes, supportRes, listenLikeRes] =
        await Promise.all([
          getArtistStats(token),
          listMyAlbums(token),
          listMySongs(token),
          listMyPlaylists(token),
          listArtistComments(token),
          listNotifications(token),
          listEarnings(token),
          listPromotions(token),
          listSupport(token),
          statsListensLikes(token),
        ])
      setStats(statsRes)
      setAlbums(albumRes.albums || [])
      setSongs(songRes.songs || [])
      setPlaylists(playlistRes.playlists || [])
      setComments(commentRes.comments || [])
      setNotifications(notifRes.notifications || [])
      setEarnings(earningRes.earnings || [])
      setPromotions(promoRes.promotions || [])
      setSupports(supportRes.tickets || [])
      setListenLikeStats(listenLikeRes || null)
      // set default song selection for albums if empty and there is at least one song
      setAlbumSongSelection({})
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu.')
      showToast('error', err.message || 'Không thể tải dữ liệu.')
    }
  }

  useEffect(() => {
    fetchAll()
  }, [token, isArtist])

  const handleAlbumSubmit = async (e) => {
    e.preventDefault()
    if (!token || !isArtist) return showToast('error', 'Bạn cần đăng nhập Artist/Admin.')
    if (!albumForm.title || !albumForm.title.trim()) return showToast('error', 'Nhập tiêu đề album.')
    setLoading(true)
    setStatus('')
    setError('')
    try {
      const payload = {
        title: albumForm.title.trim(),
        description: albumForm.description,
        coverUrl: albumForm.coverUrl,
      }
      if (import.meta.env.DEV) console.log('Album payload -> backend', payload)
      await createAlbum(payload, token)
      setStatus('Đã tạo album.')
      showToast('success', 'Đã tạo album.')
      setAlbumForm({ title: '', description: '', coverUrl: '' })
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể tạo album.')
      showToast('error', err.message || 'Không thể tạo album.')
    } finally {
      setLoading(false)
    }
  }

  const handleSongUpload = async (e) => {
    e.preventDefault()
    if (!token || !isArtist) return showToast('error', 'Bạn cần đăng nhập Artist/Admin.')
    if (!songForm.title || !songFile) return showToast('error', 'Nhập tiêu đề và chọn file bài hát.')
    setLoading(true)
    setStatus('')
    setError('')
    try {
      const sig = await getUploadSignature(token, {
        folder: songForm.folder || 'melody-media/audio',
        resource_type: 'auto',
      })
      const uploadRes = await uploadToCloudinary(songFile, sig)
      if (!uploadRes?.secure_url || !uploadRes?.public_id) {
        throw new Error('Upload không trả về secure_url/public_id.')
      }
      const payload = {
        title: songForm.title,
        description: songForm.description,
        url: uploadRes.secure_url,
        secure_url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        public_id: uploadRes.public_id,
        format: uploadRes.format,
        bytes: uploadRes.bytes,
        duration: uploadRes.duration,
        thumbnail: uploadRes.thumbnail_url,
      }
      if (import.meta.env.DEV) {
        console.log('Song payload -> backend', payload)
      }
      await createSong(payload, token)
      setStatus('Đã upload bài hát.')
      showToast('success', 'Đã upload bài hát.')
      setSongForm((prev) => ({
        ...prev,
        title: '',
        description: '',
      }))
      setSongFile(null)
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể upload bài hát.')
      showToast('error', err.message || 'Không thể upload bài hát.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSong = async (id) => {
    if (!token || !isArtist) return
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await deleteSong(id, token)
      setStatus('Đã xoá bài hát.')
      showToast('success', 'Đã xoá bài hát.')
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể xoá bài hát.')
      showToast('error', err.message || 'Không thể xoá bài hát.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAlbum = async (id) => {
    if (!token || !isArtist) return
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await deleteAlbum(id, token)
      setStatus('Đã xoá album.')
      showToast('success', 'Đã xoá album.')
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể xoá album.')
      showToast('error', err.message || 'Không thể xoá album.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSongToAlbum = async (album) => {
    if (!token || !isArtist) return
    const songId = albumSongSelection[album._id] || (songs[0]?._id ? String(songs[0]._id) : '')
    if (!songId) {
      setError('Chọn bài hát để thêm vào album.')
      showToast('error', 'Chọn bài hát để thêm vào album.')
      return
    }
    // đảm bảo state có giá trị đang dùng
    setAlbumSongSelection((prev) => ({ ...prev, [album._id]: songId }))
    const current = Array.isArray(album.songs) ? album.songs.map((s) => (typeof s === 'string' ? s : s?._id || s)) : []
    if (current.includes(songId)) {
      return setError('Bài hát đã có trong album.')
    }
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await addSongToAlbum(album._id, String(songId), token)
      setStatus('Đã thêm bài hát vào album.')
      showToast('success', 'Đã thêm bài hát vào album.')
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể thêm bài hát vào album.')
      showToast('error', err.message || 'Không thể thêm bài hát vào album.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSongFromAlbum = async (album, songId) => {
    if (!token || !isArtist) return
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await removeSongFromAlbum(album._id, String(songId), token)
      setStatus('Đã xoá bài hát khỏi album.')
      showToast('success', 'Đã xoá bài hát khỏi album.')
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể xoá bài hát khỏi album.')
      showToast('error', err.message || 'Không thể xoá bài hát khỏi album.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaylistSubmit = async (e) => {
    e.preventDefault()
    if (!token || !isArtist) return setError('Bạn cần đăng nhập Artist/Admin.')
    if (!playlistForm.title) return setError('Nhập tiêu đề playlist.')
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await createPlaylist(playlistForm, token)
      setStatus('Đã tạo playlist.')
      setPlaylistForm({ title: '', description: '', coverUrl: '' })
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể tạo playlist.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlaylist = async (id) => {
    if (!token || !isArtist) return
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await deletePlaylist(id, token)
      setStatus('Đã xoá playlist.')
      showToast('success', 'Đã xoá playlist.')
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể xoá playlist.')
      showToast('error', err.message || 'Không thể xoá playlist.')
    } finally {
      setLoading(false)
    }
  }

  const handleHideComment = async (id) => {
    if (!token || !isArtist) return
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await hideComment(id, token)
      setStatus('Đã ẩn bình luận.')
      showToast('success', 'Đã ẩn bình luận.')
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể ẩn bình luận.')
      showToast('error', err.message || 'Không thể ẩn bình luận.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkNotification = async (id) => {
    if (!token) return
    try {
      await markNotificationRead(id, token)
      fetchAll()
    } catch (err) {
      // ignore
    }
  }

  const handlePromotionSubmit = async (e) => {
    e.preventDefault()
    if (!token || !isArtist) return showToast('error', 'Bạn cần đăng nhập Artist/Admin.')
    if (!promotionForm.title || !promotionForm.startDate) return showToast('error', 'Nhập tiêu đề và ngày bắt đầu.')
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await createPromotion(
        {
          ...promotionForm,
          appliesToSongs: promotionForm.appliesToSongs
            ? promotionForm.appliesToSongs.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          appliesToAlbums: promotionForm.appliesToAlbums
            ? promotionForm.appliesToAlbums.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        },
        token
      )
      setStatus('Đã tạo khuyến mãi.')
      showToast('success', 'Đã tạo khuyến mãi.')
      setPromotionForm({ title: '', description: '', startDate: '', endDate: '', appliesToSongs: '', appliesToAlbums: '' })
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể tạo khuyến mãi.')
      showToast('error', err.message || 'Không thể tạo khuyến mãi.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePromotion = async (id) => {
    if (!token || !isArtist) return
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await deletePromotion(id, token)
      setStatus('Đã xoá khuyến mãi.')
      showToast('success', 'Đã xoá khuyến mãi.')
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể xoá khuyến mãi.')
      showToast('error', err.message || 'Không thể xoá khuyến mãi.')
    } finally {
      setLoading(false)
    }
  }

  const handleSupportSubmit = async (e) => {
    e.preventDefault()
    if (!token || !isArtist) return showToast('error', 'Bạn cần đăng nhập Artist/Admin.')
    if (!supportForm.title || !supportForm.message) return showToast('error', 'Nhập tiêu đề và nội dung hỗ trợ.')
    setLoading(true)
    setError('')
    setStatus('')
    try {
      await createSupport(supportForm, token)
      setStatus('Đã gửi yêu cầu hỗ trợ.')
      showToast('success', 'Đã gửi yêu cầu hỗ trợ.')
      setSupportForm({ title: '', message: '' })
      fetchAll()
    } catch (err) {
      setError(err.message || 'Không thể gửi hỗ trợ.')
      showToast('error', err.message || 'Không thể gửi hỗ trợ.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Artist</p>
        <h1 className="title">Bảng điều khiển</h1>
        <p className="subtitle">Quản lý bài hát, album, thống kê, thông báo và hỗ trợ.</p>
      </div>
      {infoText && <p className="status error">{infoText}</p>}

      {stats && (
        <div className="admin-grid">
          <StatCard label="Bài hát" value={stats.songs} />
          <StatCard label="Album" value={stats.albums} />
          <StatCard label="Lượt nghe" value={stats.listens} />
          <StatCard label="Lượt thích" value={stats.likes} />
          <StatCard label="Bình luận" value={stats.comments} />
        </div>
      )}

      <div className="panel-card accent">
        <h3>Tải lên bài hát (ART-ULD01)</h3>
        <form className="form" onSubmit={handleSongUpload}>
          <label className="field">
            <span>Tiêu đề</span>
            <input
              type="text"
              value={songForm.title}
              onChange={(e) => setSongForm((p) => ({ ...p, title: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Mô tả</span>
            <input
              type="text"
              value={songForm.description}
              onChange={(e) => setSongForm((p) => ({ ...p, description: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Folder Cloudinary</span>
            <input
              type="text"
              value={songForm.folder}
              onChange={(e) => setSongForm((p) => ({ ...p, folder: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>File (mp3/mp4)</span>
            <input
              type="file"
              accept=".mp3,.wav,.flac,.aac,.mp4,.m4a,.ogg"
              onChange={(e) => setSongFile(e.target.files?.[0] || null)}
              disabled={loading || !isArtist}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading || !isArtist}>
            {loading ? 'Đang upload...' : 'Upload & Lưu bài hát'}
          </button>
        </form>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}

      <div className="panel-card accent">
        <h3>Tạo album mới (ART-ULD02)</h3>
        <form className="form" onSubmit={handleAlbumSubmit}>
          <label className="field">
            <span>Tiêu đề</span>
            <input
              type="text"
              value={albumForm.title}
              onChange={(e) => setAlbumForm((p) => ({ ...p, title: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Mô tả</span>
            <input
              type="text"
              value={albumForm.description}
              onChange={(e) => setAlbumForm((p) => ({ ...p, description: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Cover URL</span>
            <input
              type="url"
              value={albumForm.coverUrl}
              onChange={(e) => setAlbumForm((p) => ({ ...p, coverUrl: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading || !isArtist}>
            {loading ? 'Đang lưu...' : 'Tạo album'}
          </button>
        </form>
      </div>

      <div className="panel-card">
        <h3>Quản lý bài hát (ART-MNG01)</h3>
        <div className="song-grid">
          {songs.map((song) => (
            <article key={song._id} className="song-card">
              <span className="song-tag">{song.format || 'media'}</span>
              <h3 className="song-title">{song.title}</h3>
              {song.description && <p className="song-meta">{song.description}</p>}
              <p className="song-meta">
                <small>{song.url}</small>
              </p>
              <div className="admin-actions">
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={() => handleDeleteSong(song._id)}
                  disabled={loading}
                >
                  Xoá
                </button>
              </div>
            </article>
          ))}
          {!songs.length && <p className="helper-text">Chưa có bài hát nào.</p>}
        </div>
      </div>

      <div className="panel-card">
        <h3>Quản lý album (ART-MNG02)</h3>
        <div className="album-grid">
          {albums.map((album) => (
            <article key={album._id} className="album-card">
              <span className="album-status">{album.status || 'published'}</span>
              <div>
                <h3 style={{ margin: '0 0 6px' }}>{album.title}</h3>
                {album.description && <p className="album-meta">{album.description}</p>}
                {album.coverUrl && (
                  <p className="album-meta">
                    <small>{album.coverUrl}</small>
                  </p>
                )}
              </div>
              <div className="album-meta">
                Bài hát: {Array.isArray(album.songs) ? album.songs.length : 0}
              </div>
              {Array.isArray(album.songs) && album.songs.length > 0 && (
                <div className="album-song-list">
                  {album.songs.map((s) => {
                    if (!s) return null
                    const title = typeof s === 'object' ? s.title || s._id : s
                    return (
                      <div key={title} className="album-song-pill" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span>{title}</span>
                        <button
                          className="ghost-btn"
                          type="button"
                          onClick={() => handleRemoveSongFromAlbum(album, typeof s === 'object' ? s._id : s)}
                          disabled={loading || !isArtist}
                          style={{ padding: '4px 8px', fontSize: 12 }}
                        >
                          Xoá
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
              {songs.length > 0 && (
                <div className="field">
                  <span>Chọn bài hát để thêm</span>
                  <select
                    value={albumSongSelection[album._id] || ''}
                    onChange={(e) =>
                      setAlbumSongSelection((prev) => ({ ...prev, [album._id]: e.target.value }))
                    }
                    disabled={loading || !isArtist}
                  >
                    <option value="">-- Chọn bài hát --</option>
                    {songs.map((song) => (
                      <option key={song._id} value={song._id}>
                        {song.title}
                      </option>
                    ))}
                  </select>
                  <div className="admin-actions" style={{ marginTop: 8 }}>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => handleAddSongToAlbum(album)}
                      disabled={loading || !isArtist}
                    >
                      Thêm vào album
                    </button>
                  </div>
                </div>
              )}
              <div className="admin-actions">
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={() => handleDeleteAlbum(album._id)}
                  disabled={loading}
                >
                  Xoá
                </button>
              </div>
            </article>
          ))}
          {!albums.length && <p className="helper-text">Chưa có album nào.</p>}
        </div>
      </div>

      <div className="panel-card accent">
        <h3>Tạo playlist (ART-COL01)</h3>
        <form className="form" onSubmit={handlePlaylistSubmit}>
          <label className="field">
            <span>Tiêu đề</span>
            <input
              type="text"
              value={playlistForm.title}
              onChange={(e) => setPlaylistForm((p) => ({ ...p, title: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Mô tả</span>
            <input
              type="text"
              value={playlistForm.description}
              onChange={(e) => setPlaylistForm((p) => ({ ...p, description: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Cover URL</span>
            <input
              type="url"
              value={playlistForm.coverUrl}
              onChange={(e) => setPlaylistForm((p) => ({ ...p, coverUrl: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading || !isArtist}>
            {loading ? 'Đang lưu...' : 'Tạo playlist'}
          </button>
        </form>
      </div>

      <div className="panel-card">
        <h3>Playlist của bạn</h3>
        <div className="admin-grid">
          {playlists.map((pl) => (
            <article key={pl._id} className="admin-card">
              <div className="admin-card-head">
                <h3>{pl.title}</h3>
                <span className="admin-code">{pl.visibility || 'public'}</span>
              </div>
              <p className="admin-desc">{pl.description}</p>
              <div className="admin-actions">
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={() => handleDeletePlaylist(pl._id)}
                  disabled={loading}
                >
                  Xoá
                </button>
              </div>
            </article>
          ))}
          {!playlists.length && <p className="helper-text">Chưa có playlist nào.</p>}
        </div>
      </div>

      <div className="panel-card">
        <h3>Bình luận (ART-COM01)</h3>
        <div className="admin-grid">
          {comments.map((c) => (
            <article key={c._id} className="admin-card">
              <div className="admin-card-head">
                <h3>{c.author?.name || 'User'}</h3>
                <span className="admin-code">{c.status}</span>
              </div>
              <p className="admin-desc">{c.content}</p>
              <div className="admin-actions">
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={() => handleHideComment(c._id)}
                  disabled={loading}
                >
                  Ẩn
                </button>
              </div>
            </article>
          ))}
          {!comments.length && <p className="helper-text">Chưa có bình luận.</p>}
        </div>
      </div>

      <div className="panel-card">
        <h3>Thông báo (ART-NTF01)</h3>
        <div className="admin-grid">
          {notifications.map((n) => (
            <article key={n._id} className="admin-card">
              <div className="admin-card-head">
                <h3>{n.title}</h3>
                <span className="admin-code">{n.type}</span>
              </div>
              <p className="admin-desc">{n.message}</p>
              {!n.read && (
                <div className="admin-actions">
                  <button className="ghost-btn" type="button" onClick={() => handleMarkNotification(n._id)}>
                    Đánh dấu đã đọc
                  </button>
                </div>
              )}
            </article>
          ))}
          {!notifications.length && <p className="helper-text">Không có thông báo.</p>}
        </div>
      </div>

      <div className="panel-card">
        <h3>Báo cáo thu nhập (ART-RPT01)</h3>
        <div className="admin-grid">
          {earnings.map((e) => (
            <article key={e._id} className="admin-card">
              <div className="admin-card-head">
                <h3>{e.period}</h3>
                <span className="admin-code">{e.currency || 'USD'}</span>
              </div>
              <p className="admin-desc">
                Streams: {e.streamsRevenue} • Ads: {e.adsRevenue} • Total: {e.total}
              </p>
            </article>
          ))}
          {!earnings.length && <p className="helper-text">Chưa có dữ liệu thu nhập.</p>}
        </div>
      </div>

      <div className="panel-card accent">
        <h3>Khuyến mãi (ART-PRM01)</h3>
        <form className="form" onSubmit={handlePromotionSubmit}>
          <label className="field">
            <span>Tiêu đề</span>
            <input
              type="text"
              value={promotionForm.title}
              onChange={(e) => setPromotionForm((p) => ({ ...p, title: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Mô tả</span>
            <input
              type="text"
              value={promotionForm.description}
              onChange={(e) => setPromotionForm((p) => ({ ...p, description: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Ngày bắt đầu</span>
            <input
              type="date"
              value={promotionForm.startDate}
              onChange={(e) => setPromotionForm((p) => ({ ...p, startDate: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Ngày kết thúc</span>
            <input
              type="date"
              value={promotionForm.endDate}
              onChange={(e) => setPromotionForm((p) => ({ ...p, endDate: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Song IDs (phẩy)</span>
            <input
              type="text"
              value={promotionForm.appliesToSongs}
              onChange={(e) => setPromotionForm((p) => ({ ...p, appliesToSongs: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Album IDs (phẩy)</span>
            <input
              type="text"
              value={promotionForm.appliesToAlbums}
              onChange={(e) => setPromotionForm((p) => ({ ...p, appliesToAlbums: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading || !isArtist}>
            {loading ? 'Đang lưu...' : 'Tạo khuyến mãi'}
          </button>
        </form>
        <div className="admin-grid" style={{ marginTop: 12 }}>
          {promotions.map((pr) => (
            <article key={pr._id} className="admin-card">
              <div className="admin-card-head">
                <h3>{pr.title}</h3>
                <span className="admin-code">{pr.status}</span>
              </div>
              <p className="admin-desc">
                {pr.description}
                <br />
                {pr.startDate?.slice(0, 10)} - {pr.endDate ? pr.endDate.slice(0, 10) : 'N/A'}
              </p>
              <div className="admin-actions">
                <button className="ghost-btn" type="button" onClick={() => handleDeletePromotion(pr._id)} disabled={loading}>
                  Xoá
                </button>
              </div>
            </article>
          ))}
          {!promotions.length && <p className="helper-text">Chưa có khuyến mãi.</p>}
        </div>
      </div>

      <div className="panel-card accent">
        <h3>Yêu cầu hỗ trợ (ART-SPT01)</h3>
        <form className="form" onSubmit={handleSupportSubmit}>
          <label className="field">
            <span>Tiêu đề</span>
            <input
              type="text"
              value={supportForm.title}
              onChange={(e) => setSupportForm((p) => ({ ...p, title: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <label className="field">
            <span>Nội dung</span>
            <input
              type="text"
              value={supportForm.message}
              onChange={(e) => setSupportForm((p) => ({ ...p, message: e.target.value }))}
              disabled={loading || !isArtist}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading || !isArtist}>
            {loading ? 'Đang gửi...' : 'Gửi hỗ trợ'}
          </button>
        </form>
        <div className="admin-grid" style={{ marginTop: 12 }}>
          {supports.map((t) => (
            <article key={t._id} className="admin-card">
              <div className="admin-card-head">
                <h3>{t.title}</h3>
                <span className="admin-code">{t.status}</span>
              </div>
              <p className="admin-desc">{t.message}</p>
            </article>
          ))}
          {!supports.length && <p className="helper-text">Chưa có yêu cầu hỗ trợ.</p>}
        </div>
      </div>

      {listenLikeStats && (
        <div className="panel-card">
          <h3>Thống kê nghe & thích (ART-STT01)</h3>
          <div className="admin-grid">
            <StatCard label="Tổng lượt nghe" value={listenLikeStats.listens} />
            <StatCard label="Tổng lượt thích" value={listenLikeStats.likes} />
          </div>
        </div>
      )}
    </section>
  )
}

export default ArtistDashboard
