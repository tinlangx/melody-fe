import { useEffect, useMemo, useState } from 'react'
import {
  promoteToArtist,
  listUsers,
  deleteUserAdmin,
  listSongsAdmin,
  deleteSongAdmin,
  listAlbumsAdmin,
  deleteAlbumAdmin,
} from '../services/apiClient'

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
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loadingSongs, setLoadingSongs] = useState(false)
  const [loadingAlbums, setLoadingAlbums] = useState(false)
  const [songSearch, setSongSearch] = useState('')
  const [albumSearch, setAlbumSearch] = useState('')
  const [songPage, setSongPage] = useState(1)
  const [albumPage, setAlbumPage] = useState(1)
  const songPageSize = 6
  const albumPageSize = 6
  const token = auth?.token

  const isAdmin = auth?.user?.role === 'ADMIN'

  useEffect(() => {
    if (!isAdmin || !token) return
    const fetchUsers = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await listUsers(token)
        setUsers(res.users || [])
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách người dùng.')
      } finally {
        setLoading(false)
      }
    }
    const fetchSongs = async () => {
      setLoadingSongs(true)
      try {
        const res = await listSongsAdmin(token)
        setSongs(res.songs || [])
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách bài hát.')
      } finally {
        setLoadingSongs(false)
      }
    }
    const fetchAlbums = async () => {
      setLoadingAlbums(true)
      try {
        const res = await listAlbumsAdmin(token)
        setAlbums(res.albums || [])
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách album.')
      } finally {
        setLoadingAlbums(false)
      }
    }
    fetchUsers()
    fetchSongs()
    fetchAlbums()
  }, [isAdmin, token])

  const updateUserInState = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)))
  }

  const removeUserInState = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id))
  }

  const removeSongInState = (id) => setSongs((prev) => prev.filter((s) => s._id !== id))
  const removeAlbumInState = (id) => setAlbums((prev) => prev.filter((a) => a._id !== id))

  const handlePromote = async (userId) => {
    if (!token || !isAdmin) {
      setError('Bạn cần đăng nhập Admin.')
      return
    }
    setError('')
    setResult(null)
    setActionLoading(userId)
    try {
      const res = await promoteToArtist(userId, token)
      setResult({ message: res.message || 'Đã nâng lên Artist.' })
      if (res.user) updateUserInState(res.user)
    } catch (err) {
      setError(err.message || 'Không thể nâng quyền.')
    } finally {
      setActionLoading('')
    }
  }

  const handleDelete = async (userId, role) => {
    if (!token || !isAdmin) {
      setError('Bạn cần đăng nhập Admin.')
      return
    }
    if (role === 'ADMIN') {
      setError('Không thể xóa tài khoản Admin.')
      return
    }
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')
    if (!confirmed) return
    setError('')
    setResult(null)
    setActionLoading(`del-${userId}`)
    try {
      await deleteUserAdmin(userId, token)
      setResult({ message: 'Đã xóa người dùng.' })
      removeUserInState(userId)
    } catch (err) {
      setError(err.message || 'Không thể xóa người dùng.')
    } finally {
      setActionLoading('')
    }
  }

  const handleDeleteSong = async (id) => {
    if (!token || !isAdmin) {
      setError('Bạn cần đăng nhập Admin.')
      return
    }
    const confirmed = window.confirm('Xóa bài hát này?')
    if (!confirmed) return
    setError('')
    setResult(null)
    setActionLoading(`song-${id}`)
    try {
      await deleteSongAdmin(id, token)
      removeSongInState(id)
      setResult({ message: 'Đã xóa bài hát.' })
    } catch (err) {
      setError(err.message || 'Không thể xóa bài hát.')
    } finally {
      setActionLoading('')
    }
  }

  const handleDeleteAlbum = async (id) => {
    if (!token || !isAdmin) {
      setError('Bạn cần đăng nhập Admin.')
      return
    }
    const confirmed = window.confirm('Xóa album này?')
    if (!confirmed) return
    setError('')
    setResult(null)
    setActionLoading(`album-${id}`)
    try {
      await deleteAlbumAdmin(id, token)
      removeAlbumInState(id)
      setResult({ message: 'Đã xóa album.' })
    } catch (err) {
      setError(err.message || 'Không thể xóa album.')
    } finally {
      setActionLoading('')
    }
  }

  const infoText = useMemo(() => {
    if (!auth) return 'Bạn chưa đăng nhập. Hãy login bằng tài khoản Admin.'
    if (!isAdmin) return 'Tài khoản hiện tại không phải Admin. Vui lòng dùng Admin.'
    return ''
  }, [auth, isAdmin])

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return users
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(term) ||
        u.name?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
    )
  }, [users, search])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const filteredSongs = useMemo(() => {
    const term = songSearch.trim().toLowerCase()
    if (!term) return songs
    return songs.filter(
      (s) =>
        s.title?.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term) ||
        s.uploadedBy?.name?.toLowerCase().includes(term) ||
        s.uploadedBy?.email?.toLowerCase().includes(term)
    )
  }, [songs, songSearch])

  const filteredAlbums = useMemo(() => {
    const term = albumSearch.trim().toLowerCase()
    if (!term) return albums
    return albums.filter(
      (a) =>
        a.title?.toLowerCase().includes(term) ||
        a.description?.toLowerCase().includes(term) ||
        a.uploadedBy?.name?.toLowerCase().includes(term) ||
        a.uploadedBy?.email?.toLowerCase().includes(term)
    )
  }, [albums, albumSearch])

  const songTotalPages = Math.max(1, Math.ceil(filteredSongs.length / songPageSize))
  const albumTotalPages = Math.max(1, Math.ceil(filteredAlbums.length / albumPageSize))
  const currentSongPage = Math.min(songPage, songTotalPages)
  const currentAlbumPage = Math.min(albumPage, albumTotalPages)

  const pagedSongs = useMemo(() => {
    const start = (currentSongPage - 1) * songPageSize
    return filteredSongs.slice(start, start + songPageSize)
  }, [filteredSongs, currentSongPage])

  const pagedAlbums = useMemo(() => {
    const start = (currentAlbumPage - 1) * albumPageSize
    return filteredAlbums.slice(start, start + albumPageSize)
  }, [filteredAlbums, currentAlbumPage])

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Admin Control</p>
        <h1 className="title">Quản lý người dùng</h1>
        <p className="subtitle">Xem danh sách, nâng Listener thành Artist hoặc xóa người dùng.</p>
      </div>

      {infoText && <p className="status error">{infoText}</p>}
      {error && <p className="status error">{error}</p>}
      {result && <p className="status success">{result.message}</p>}

      <div className="panel-card accent">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            type="text"
            placeholder="Tìm theo tên, email hoặc role..."
            value={search}
            onChange={handleSearchChange}
            disabled={!isAdmin}
          />
          <span className="helper-text">
            {filteredUsers.length} người dùng • Trang {currentPage}/{totalPages}
          </span>
        </div>

        <div className="admin-table-head">
          <span>Tên</span>
          <span>Email</span>
          <span>Role</span>
          <span>Thao tác</span>
        </div>

        {loading ? (
          <p className="helper-text">Đang tải danh sách người dùng...</p>
        ) : (
          <div className="admin-table-body">
            {pagedUsers.map((user) => {
              const disableActions = user.role === 'ADMIN'
              return (
                <div key={user._id} className="admin-row">
                  <span>{user.name || 'Chưa đặt tên'}</span>
                  <span>{user.email}</span>
                  <span className={`pill pill-${user.role?.toLowerCase() || 'default'}`}>
                    {user.role}
                  </span>
                  <div className="admin-actions">
                    <button
                      className="primary-button"
                      type="button"
                      disabled={disableActions || actionLoading === user._id}
                      onClick={() => handlePromote(user._id)}
                    >
                      {actionLoading === user._id ? 'Đang nâng...' : 'Nâng Artist'}
                    </button>
                    <button
                      className="ghost-btn danger"
                      type="button"
                      disabled={disableActions || actionLoading === `del-${user._id}`}
                      onClick={() => handleDelete(user._id, user.role)}
                    >
                      {actionLoading === `del-${user._id}` ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </div>
              )
            })}
            {!filteredUsers.length && !loading && (
              <p className="helper-text">Không tìm thấy người dùng phù hợp.</p>
            )}
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              className="ghost-btn"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="helper-text">
              Trang {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              className="ghost-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      <div className="panel-card accent">
        <div className="panel-heading" style={{ marginBottom: '12px' }}>
          <p className="eyebrow">AD-MSC03</p>
          <h2 className="title" style={{ fontSize: 20 }}>Quản lý bài hát</h2>
          <p className="subtitle">Xem và quản lý các bài hát được tải lên.</p>
        </div>
        <div className="admin-toolbar">
          <input
            className="admin-search"
            type="text"
            placeholder="Tìm bài hát theo tiêu đề, mô tả, người đăng..."
            value={songSearch}
            onChange={(e) => {
              setSongSearch(e.target.value)
              setSongPage(1)
            }}
            disabled={!isAdmin}
          />
          <span className="helper-text">
            {filteredSongs.length} bài hát • Trang {currentSongPage}/{songTotalPages}
          </span>
        </div>
        {loadingSongs ? (
          <p className="helper-text">Đang tải bài hát...</p>
        ) : (
          <div className="admin-table-body">
            {pagedSongs.map((song) => (
              <div key={song._id} className="admin-row admin-row-compact">
                <div>
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist helper-text">
                    {song.uploadedBy?.name || song.uploadedBy?.email || 'Artist'} •{' '}
                    {song.format || song.status || ''}
                  </div>
                </div>
                <div className="helper-text">{song.publicId || song.url?.slice(0, 30)}</div>
                <div className="pill pill-default">{song.visibility || 'public'}</div>
                <div className="admin-actions">
                  <button
                    className="ghost-btn danger"
                    type="button"
                    disabled={actionLoading === `song-${song._id}` || !isAdmin}
                    onClick={() => handleDeleteSong(song._id)}
                  >
                    {actionLoading === `song-${song._id}` ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </div>
            ))}
            {!filteredSongs.length && !loadingSongs && (
              <p className="helper-text">Không có bài hát phù hợp.</p>
            )}
          </div>
        )}
        {!loadingSongs && filteredSongs.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              className="ghost-btn"
              disabled={currentSongPage === 1}
              onClick={() => setSongPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="helper-text">
              Trang {currentSongPage}/{songTotalPages}
            </span>
            <button
              type="button"
              className="ghost-btn"
              disabled={currentSongPage === songTotalPages}
              onClick={() => setSongPage((p) => Math.min(songTotalPages, p + 1))}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      <div className="panel-card accent">
        <div className="panel-heading" style={{ marginBottom: '12px' }}>
          <p className="eyebrow">AD-MSC04</p>
          <h2 className="title" style={{ fontSize: 20 }}>Quản lý album</h2>
          <p className="subtitle">Xem và quản lý các album được tải lên.</p>
        </div>
        <div className="admin-toolbar">
          <input
            className="admin-search"
            type="text"
            placeholder="Tìm album theo tiêu đề, mô tả, người đăng..."
            value={albumSearch}
            onChange={(e) => {
              setAlbumSearch(e.target.value)
              setAlbumPage(1)
            }}
            disabled={!isAdmin}
          />
          <span className="helper-text">
            {filteredAlbums.length} album • Trang {currentAlbumPage}/{albumTotalPages}
          </span>
        </div>

        {loadingAlbums ? (
          <p className="helper-text">Đang tải album...</p>
        ) : (
          <div className="admin-table-body">
            {pagedAlbums.map((album) => (
              <div key={album._id} className="admin-row admin-row-compact">
                <div>
                  <div className="song-title">{album.title}</div>
                  <div className="song-artist helper-text">
                    {album.uploadedBy?.name || album.uploadedBy?.email || 'Artist'} •{' '}
                    {(album.songs && album.songs.length) || 0} bài hát
                  </div>
                </div>
                <div className="helper-text">{album.description || '—'}</div>
                <div className="pill pill-default">{album.status || 'published'}</div>
                <div className="admin-actions">
                  <button
                    className="ghost-btn danger"
                    type="button"
                    disabled={actionLoading === `album-${album._id}` || !isAdmin}
                    onClick={() => handleDeleteAlbum(album._id)}
                  >
                    {actionLoading === `album-${album._id}` ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </div>
            ))}
            {!filteredAlbums.length && !loadingAlbums && (
              <p className="helper-text">Không có album phù hợp.</p>
            )}
          </div>
        )}

        {!loadingAlbums && filteredAlbums.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              className="ghost-btn"
              disabled={currentAlbumPage === 1}
              onClick={() => setAlbumPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="helper-text">
              Trang {currentAlbumPage}/{albumTotalPages}
            </span>
            <button
              type="button"
              className="ghost-btn"
              disabled={currentAlbumPage === albumTotalPages}
              onClick={() => setAlbumPage((p) => Math.min(albumTotalPages, p + 1))}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Admin
