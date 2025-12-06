import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './Login'
import Register from './Register'
import {
  listAllAlbums,
  listPublicSongsLimited,
  listListenerPlaylists,
  createListenerPlaylist,
  deleteListenerPlaylist,
  addSongToListenerPlaylist,
  listFavorites,
  addFavorite,
  removeFavorite,
} from '../services/apiClient'
import { usePlayer } from '../context/PlayerContext'
import HomeTopBar from '../components/HomeTopBar'

const heroSlides = [
  {
    title: 'Billie eilish',
    description:
      'Access every song from Billie Eilish. Listen now or follow to stay updated with her latest releases.',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80',
  },
]

const weeklyTop = [
  {
    title: 'Whatever It Takes',
    artist: 'Imagine Dragons',
    cover:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Skyfall',
    artist: 'Adele',
    cover:
      'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Superman',
    artist: 'Eminem',
    cover:
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Softcore',
    artist: 'The Neighbourhood',
    cover:
      'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'The Loneliest',
    artist: 'Måneskin',
    cover:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
  },
]

const newRelease = [
  {
    title: 'Time',
    artist: 'Luciano',
    cover:
      'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: '112',
    artist: 'Jazzyk',
    cover:
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'We don’t care',
    artist: 'Kyross & Dj Gallum',
    cover:
      'https://images.unsplash.com/photo-1482442120256-9c03866de390?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Who I Am',
    artist: 'Alan Walker',
    cover:
      'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Baiko',
    artist: 'XXDCrelix',
    cover:
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=400&q=80',
  },
]

const trending = [
  {
    rank: 1,
    title: 'Softcore',
    artist: 'The Neighbourhood',
    date: 'Nov 4, 2023',
    album: 'Hard to Imagine The Neighbourhood Ever Changing',
    time: '3:26',
  },
  {
    rank: 2,
    title: 'Skyfall Beats',
    artist: 'Nightmares',
    date: 'Oct 26, 2023',
    album: 'Nightmares',
    time: '2:45',
  },
  {
    rank: 3,
    title: 'Greedy',
    artist: 'Tate McRae',
    date: 'Dec 30, 2023',
    album: 'Greedy',
    time: '2:11',
  },
  {
    rank: 4,
    title: 'Lovin On Me',
    artist: 'Jack Harlow',
    date: 'Dec 30, 2023',
    album: 'Lovin On Me',
    time: '2:18',
  },
  {
    rank: 5,
    title: 'Paint The Town Red',
    artist: 'Doja Cat',
    date: 'Dec 29, 2023',
    album: 'Paint The Town Red',
    time: '3:51',
  },
  {
    rank: 6,
    title: 'Dancin On Night',
    artist: 'Dua Lipa',
    date: 'May 27, 2023',
    album: 'Dance The Night',
    time: '2:56',
  },
  {
    rank: 7,
    title: 'Water',
    artist: 'Tyla',
    date: 'Dec 10, 2023',
    album: 'Water',
    time: '2:30',
  },
]

const artists = [
  {
    name: 'Eminem',
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Imagine Dragons',
    photo:
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Adele',
    photo:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Lana Del Rey',
    photo:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Harry Styles',
    photo:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Billie Eilish',
    photo:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
]

const videos = [
  {
    title: 'Gossip',
    artist: 'Måneskin',
    cover:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    views: '231k views',
  },
  {
    title: 'Shape Of You',
    artist: 'Ed Sheeran',
    cover:
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=400&q=80',
    views: '3.4M views',
  },
  {
    title: 'Someone Like You',
    artist: 'Adele',
    cover:
      'https://images.unsplash.com/photo-1515162305286-9de0d655d77a?auto=format&fit=crop&w=400&q=80',
    views: '1.3M views',
  },
]

const albums = [
  {
    title: 'Adele 21',
    artist: 'Adele',
    cover:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Beauty Behind the Madness',
    artist: 'The Weeknd',
    cover:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Scorpion',
    artist: 'Drake',
    cover:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Harry’s House',
    artist: 'Harry Styles',
    cover:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Born To Die',
    artist: 'Lana Del Rey',
    cover:
      'https://images.unsplash.com/photo-1482442120256-9c03866de390?auto=format&fit=crop&w=400&q=80',
  },
]

const playlists = [
  {
    title: 'Sad Songs',
    cover:
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Chill Songs',
    cover:
      'https://images.unsplash.com/photo-1451188502541-13943edb6acb?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Workout Songs',
    cover:
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Love Songs',
    cover:
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Happy Songs',
    cover:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
]

const Sidebar = ({ activeMenu, onSelect, authUser }) => (
  <aside className="home-sidebar">
    <div className="sidebar-logo">Melodies</div>
    <div className="sidebar-section">
      <p className="sidebar-label">Menu</p>
      <nav>
        {['Home', 'Discover', 'Albums', 'Artists'].map((item) => (
          <button
            key={item}
            className={`sidebar-link sidebar-link-btn ${activeMenu === item ? 'active' : ''}`}
            type="button"
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
    <div className="sidebar-section">
      <p className="sidebar-label">Library</p>
      <nav>
        {['Recently Added', 'Most played'].map((item) => (
          <a key={item} className="sidebar-link" href="#">
            {item}
          </a>
        ))}
      </nav>
    </div>
    {authUser?.role === 'LISTENER' && (
      <div className="sidebar-section">
        <p className="sidebar-label">Playlist & favorite</p>
        <nav>
          {['Favorites', 'Playlists'].map((item) => (
            <button
              key={item}
              className={`sidebar-link sidebar-link-btn ${activeMenu === item ? 'active' : ''}`}
              type="button"
              onClick={() => onSelect(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    )}
    <div className="sidebar-section">
      <p className="sidebar-label">General</p>
      <nav>
        {['Setting', 'Logout'].map((item) => (
          <a key={item} className="sidebar-link" href="#">
            {item}
          </a>
        ))}
      </nav>
    </div>
  </aside>
)

const SectionHeader = ({ title, accent, actionLabel, onAction }) => (
  <div className="section-head">
    <h3>
      {title} <span>{accent}</span>
    </h3>
    {actionLabel && (
      <button className="ghost-btn" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
)

const CardGrid = ({ items }) => (
  <div className="card-grid">
    {items.map((item) => (
      <article key={item.title} className="music-card">
        <div className="music-cover" style={{ backgroundImage: `url(${item.cover})` }} />
        <div className="music-meta">
          <p className="music-title">{item.title}</p>
          <p className="music-artist">{item.artist}</p>
        </div>
      </article>
    ))}
  </div>
)

const ListTable = ({ rows }) => (
  <div className="trending-table">
    <div className="table-head">
      <span>#</span>
      <span>Song</span>
      <span>Release Date</span>
      <span>Album</span>
      <span>Time</span>
    </div>
    {rows.map((row) => (
      <div key={row.rank} className="table-row">
        <span>#{row.rank}</span>
        <div>
          <div className="song-title">{row.title}</div>
          <div className="song-artist">{row.artist}</div>
        </div>
        <span>{row.date}</span>
        <span className="album-name">{row.album}</span>
        <span>{row.time}</span>
      </div>
    ))}
    <div className="table-foot">
      <button className="primary-button wide">+ View All</button>
    </div>
  </div>
)

const Home = () => {
  const [modal, setModal] = useState(null) // 'login' | 'register' | null
  const [prefillEmail, setPrefillEmail] = useState('')
  const [authUser, setAuthUser] = useState(null) // { user, token }
  const [activeMenu, setActiveMenu] = useState('Home')
  const [allAlbums, setAllAlbums] = useState([])
  const [albumsLoading, setAlbumsLoading] = useState(false)
  const [albumsError, setAlbumsError] = useState('')
  const [newReleaseSongs, setNewReleaseSongs] = useState([])
  const [popupSongs, setPopupSongs] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [newReleaseError, setNewReleaseError] = useState('')
  const [listenerPlaylists, setListenerPlaylists] = useState([])
  const [playlistForm, setPlaylistForm] = useState({ title: '', description: '' })
  const [favorites, setFavorites] = useState([])
  const [pendingSong, setPendingSong] = useState(null)
  const [selectedSongToAdd, setSelectedSongToAdd] = useState('')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [showFavModal, setShowFavModal] = useState(false)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const navigate = useNavigate()
  const { playSong } = usePlayer()
  const viewer = authUser?.user || authUser
  const role = viewer?.role
  const isListener = role === 'LISTENER'
  const authToken = authUser?.token

  const hero = heroSlides[0]

  useEffect(() => {
    const fetchNewRelease = async () => {
      try {
        const res = await listPublicSongsLimited(6)
        setNewReleaseSongs(res.songs || [])
      } catch (err) {
        setNewReleaseError(err.message || 'Không thể tải bài hát mới.')
      }
    }
    fetchNewRelease()

    try {
      const saved = localStorage.getItem('melody_auth')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.user && parsed?.token) setAuthUser(parsed)
      }
    } catch (err) {
      setAuthUser(null)
    }

    try {
      sessionStorage.removeItem('melody_login_success')
    } catch (err) {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (isListener && authToken) {
      loadListenerData(authToken)
    }
  }, [isListener, authToken])

  const closeModal = () => setModal(null)

  const handleRegisterSuccess = (email) => {
    setPrefillEmail(email || '')
    setModal('login')
  }

  const loadListenerData = async (token) => {
    try {
      const [plRes, favRes] = await Promise.all([listListenerPlaylists(token), listFavorites(token)])
      setListenerPlaylists(plRes.playlists || [])
      setFavorites(favRes.favorites || [])
    } catch (err) {
      // ignore
    }
  }

  const fetchPopupSongs = async () => {
    try {
      const res = await listPublicSongsLimited(20)
      const latest = res.songs ? res.songs.slice(0, 20) : []
      setPopupSongs(latest)
      setShowPopup(true)
    } catch (err) {
      setNewReleaseError(err.message || 'Không thể tải bài hát.')
    }
  }

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

  const handleLoginSuccess = (data) => {
    setAuthUser(data || null) // expect { user, token }
    setModal(null)
    const redirect = getRedirectPath(data?.user?.role)
    navigate(redirect, { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('melody_auth')
    setAuthUser(null)
    setFavorites([])
    setListenerPlaylists([])
    setPendingSong(null)
  }

  const handleMenuSelect = (item) => {
    setActiveMenu(item)
    if (item === 'Albums') {
      fetchAllAlbums()
      // scroll to top of content
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    if (item === 'Favorites') {
      if (isListener) {
        setShowFavModal(true)
      } else if (!authToken) {
        setModal('login')
      }
    }
    if (item === 'Playlists') {
      if (isListener) {
        setPendingSong(null)
        setSelectedSongToAdd('')
        setSelectedPlaylistId('')
        setShowPlaylistModal(true)
      } else if (!authToken) {
        setModal('login')
      }
    }
  }

  const requireListenerAuth = () => {
    if (!authToken) {
      setModal('login')
      return false
    }
    if (!isListener) return false
    return true
  }

  const fetchAllAlbums = async () => {
    if (albumsLoading || allAlbums.length) return
    setAlbumsLoading(true)
    setAlbumsError('')
    try {
      const res = await listAllAlbums()
      setAllAlbums(res.albums || [])
    } catch (err) {
      setAlbumsError(err.message || 'Không thể tải danh sách album.')
    } finally {
      setAlbumsLoading(false)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!requireListenerAuth()) return
    if (!playlistForm.title.trim()) return
    try {
      const res = await createListenerPlaylist(playlistForm, authToken)
      setListenerPlaylists((prev) => [res.playlist, ...prev])
      setPlaylistForm({ title: '', description: '' })
    } catch (err) {
      // ignore
    }
  }

  const handleDeletePlaylist = async (id) => {
    if (!requireListenerAuth()) return
    try {
      await deleteListenerPlaylist(id, authToken)
      setListenerPlaylists((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      // ignore
    }
  }

  const handleAddSongToPlaylist = async (playlistIdArg, songIdArg) => {
    if (!requireListenerAuth()) return
    const targetSong = songIdArg || selectedSongToAdd || pendingSong?._id
    const targetPlaylist = playlistIdArg || selectedPlaylistId
    if (!targetSong || !targetPlaylist) return
    try {
      await addSongToListenerPlaylist(targetPlaylist, targetSong, authToken)
      const plRes = await listListenerPlaylists(authToken)
      setListenerPlaylists(plRes.playlists || [])
      setSelectedSongToAdd('')
      setSelectedPlaylistId('')
      setPendingSong(null)
    } catch (err) {
      // ignore
    }
  }

  const toggleFavoriteSong = async (song) => {
    if (!song?._id) return
    if (!requireListenerAuth()) return
    const exists = favorites.some((f) => f._id === song._id)
    try {
      if (exists) {
        const res = await removeFavorite(song._id, authToken)
        setFavorites(res.favorites || [])
      } else {
        const res = await addFavorite(song._id, authToken)
        setFavorites(res.favorites || [])
      }
    } catch (err) {
      // ignore
    }
  }

  const openPlaylistPicker = (song) => {
    if (!song?._id) return
    if (!requireListenerAuth()) return
    setPendingSong(song)
    setSelectedSongToAdd(song._id)
    if (!listenerPlaylists.length && authToken) {
      loadListenerData(authToken)
    }
    if (listenerPlaylists.length === 1) {
      setSelectedPlaylistId(listenerPlaylists[0]._id)
    } else {
      setSelectedPlaylistId('')
    }
    setShowPlaylistModal(true)
    setActiveMenu('Playlists')
  }

  const isFav = (songId) => favorites.some((f) => f._id === songId)
  const closeFavModal = () => {
    setShowFavModal(false)
    setActiveMenu('Home')
  }
  const closePlaylistModal = () => {
    setShowPlaylistModal(false)
    setActiveMenu('Home')
    setPendingSong(null)
    setSelectedSongToAdd('')
    setSelectedPlaylistId('')
  }
  const playlistSongOptions = [
    ...newReleaseSongs,
    ...(pendingSong && pendingSong._id && !newReleaseSongs.some((s) => s._id === pendingSong._id)
      ? [pendingSong]
      : []),
  ].filter((s) => s && s._id)

  return (
    <div className="home-page">
      <Sidebar
        activeMenu={activeMenu}
        onSelect={handleMenuSelect}
        authUser={viewer}
      />

      <section className="home-main">
        <HomeTopBar
          authUser={viewer}
          onLogout={handleLogout}
          onOpenLogin={() => setModal('login')}
          onOpenRegister={() => setModal('register')}
        />

        {activeMenu === 'Albums' ? (
          <div className="home-content-panel">
            <div className="section">
              <SectionHeader title="Tất cả" accent="Albums" />
              {albumsLoading && <p className="helper-text">Đang tải album...</p>}
              {albumsError && <p className="status error">{albumsError}</p>}
            <div className="album-grid">
              {allAlbums.map((album) => (
                <article
                  key={album._id}
                  className="album-card album-card-cover"
                  onClick={() => {
                    if (Array.isArray(album.songs)) {
                      setPopupSongs(album.songs);
                      setShowPopup(true);
                    }
                  }}
                  style={{ cursor: Array.isArray(album.songs) ? 'pointer' : 'default' }}
                >
                  <div
                    className="album-cover"
                    style={{
                      backgroundImage: `url(${
                        album.coverUrl ||
                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
                      })`,
                    }}
                  />
                  <div className="album-body">
                    <div className="album-head">
                      <h3 style={{ margin: '0 0 6px' }}>{album.title}</h3>
                    </div>
                    <p className="album-meta">
                      {album.uploadedBy?.name || album.uploadedBy?.email || 'Artist'}
                    </p>
                    {album.description && <p className="album-meta">{album.description}</p>}
                    <div className="album-meta">
                      Bài hát: {Array.isArray(album.songs) ? album.songs.length : 0}
                    </div>
                  </div>
                </article>
              ))}
              {!allAlbums.length && !albumsLoading && !albumsError && (
                <p className="helper-text">Chưa có album nào.</p>
              )}
            </div>
            </div>
          </div>
        ) : (
          <div className="home-content-panel">
            {isListener && activeMenu === 'Favorites' && (
              <div className="section">
                <SectionHeader title="Favorites" accent="Songs" />
                <div className="card-grid">
                  {favorites.map((fav) => (
                    <article key={fav._id} className="music-card">
                      <div
                        className="music-cover"
                        style={{
                          backgroundImage: `url(${
                            fav.thumbnail ||
                            fav.coverUrl ||
                            fav.cover ||
                            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
                          })`,
                        }}
                      />
                      <div className="music-meta">
                        <p className="music-title">{fav.title}</p>
                        <p className="music-artist">
                          {fav.uploadedBy?.name || fav.uploadedBy?.email || ''}
                        </p>
                        <button className="ghost-btn small" type="button" onClick={() => toggleFavoriteSong(fav)}>
                          {isFav(fav._id) ? 'Bỏ ♥' : 'Yêu thích'}
                        </button>
                      </div>
                    </article>
                  ))}
                  {!favorites.length && <p className="helper-text">Chưa có bài yêu thích.</p>}
                </div>
              </div>
            )}

            {isListener && activeMenu === 'Playlists' && (
              <div className="section">
                <SectionHeader title="Playlists" accent="Your" />
                <div className="panel-card accent" style={{ padding: '12px' }}>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Tên playlist"
                      value={playlistForm.title}
                      onChange={(e) => setPlaylistForm((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Mô tả (tuỳ chọn)"
                      value={playlistForm.description}
                      onChange={(e) => setPlaylistForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <button className="pill-btn" type="button" onClick={handleCreatePlaylist}>
                    Tạo playlist
                  </button>
                </div>

                <div className="album-grid">
                  {listenerPlaylists.map((pl) => (
                    <article key={pl._id} className="album-card">
                      <h3 style={{ margin: '0 0 6px' }}>{pl.title}</h3>
                      {pl.description && <p className="album-meta">{pl.description}</p>}
                      <p className="album-meta">Bài hát: {Array.isArray(pl.songs) ? pl.songs.length : 0}</p>
                      {Array.isArray(pl.songs) && pl.songs.length > 0 && (
                        <div className="album-song-list">
                          {pl.songs.slice(0, 3).map((s) => (
                            <div key={s._id} className="album-song-pill">
                              {s.title}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="field">
                        <select value={selectedSongToAdd} onChange={(e) => setSelectedSongToAdd(e.target.value)}>
                          <option value="">Chọn bài để thêm</option>
                          {playlistSongOptions.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                        <button
                          className="ghost-btn"
                          type="button"
                          onClick={() => {
                            setSelectedPlaylistId(pl._id)
                            handleAddSongToPlaylist(pl._id)
                          }}
                        >
                          Thêm bài
                        </button>
                      </div>
                      <button className="ghost-btn danger" type="button" onClick={() => handleDeletePlaylist(pl._id)}>
                        Xoá playlist
                      </button>
                    </article>
                  ))}
                  {!listenerPlaylists.length && <p className="helper-text">Chưa có playlist.</p>}
                </div>
              </div>
            )}

            <div className="hero">
              <div className="hero-info">
                <p className="eyebrow">Featured</p>
                <h1>{hero.title}</h1>
                <p className="subtitle">{hero.description}</p>
                <div className="hero-actions">
                  <button className="pill-btn">Listen Now</button>
                  <button className="ghost-btn">Follow</button>
                </div>
              </div>
              <div
                className="hero-cover"
                style={{ backgroundImage: `url(${hero.image})` }}
                role="presentation"
              />
            </div>

        <div className="section">
          <SectionHeader
            title="New Release"
            accent="Songs"
            actionLabel="View All"
            onAction={fetchPopupSongs}
          />
          {newReleaseError && <p className="status error">{newReleaseError}</p>}
          <div className="card-grid">
            {(newReleaseSongs.length ? newReleaseSongs : newRelease).map((item) => {
                const cover =
                  item.thumbnail ||
                  item.coverUrl ||
                  item.cover ||
                  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
                return (
                  <article
                    key={item.title || item._id}
                    className="music-card"
                    onClick={() => {
                    if (item._id && item.url) {
                      playSong(item, newReleaseSongs)
                    }
                  }}
                  style={{ cursor: item._id ? 'pointer' : 'default' }}
                  >
                    <div
                      className="music-cover"
                      style={{ backgroundImage: `url(${cover})`, backgroundPosition: 'center' }}
                    />
                    <div className="music-meta">
                      <p className="music-title marquee">
                        <span>{item.title}</span>
                      </p>
                      <p className="music-artist">
                        {item.artist || item.uploadedBy?.name || item.uploadedBy?.email || ''}
                      </p>
                      {isListener && item._id && (
                        <div className="card-actions">
                          <button
                            className="ghost-btn small"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavoriteSong(item)
                            }}
                          >
                            {isFav(item._id) ? 'Đã ♥' : 'Yêu thích'}
                          </button>
                          <button
                            className="ghost-btn small"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openPlaylistPicker(item)
                            }}
                          >
                            + Playlist
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
          </div>
        </div>

            <div className="section">
              <SectionHeader title="Trending" accent="Songs" />
              <ListTable rows={trending} />
            </div>

            <div className="section">
              <SectionHeader title="Popular" accent="Artists" action />
              <div className="avatar-row">
                {artists.map((artist) => (
                  <div key={artist.name} className="avatar">
                    <div className="avatar-img" style={{ backgroundImage: `url(${artist.photo})` }} />
                    <p>{artist.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <SectionHeader title="Music" accent="Video" action />
              <div className="card-grid">
                {videos.map((item) => (
                  <article key={item.title} className="music-card">
                    <div className="music-cover" style={{ backgroundImage: `url(${item.cover})` }} />
                    <div className="music-meta">
                      <p className="music-title">{item.title}</p>
                      <p className="music-artist">
                        {item.artist} • {item.views}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="section">
              <SectionHeader title="Top" accent="Albums" action />
              <CardGrid items={albums} />
            </div>

            <div className="section">
              <SectionHeader title="Mood" accent="Playlists" action />
              <div className="card-grid">
                {playlists.map((item) => (
                  <article key={item.title} className="music-card">
                    <div className="music-cover" style={{ backgroundImage: `url(${item.cover})` }} />
                    <div className="music-meta">
                      <p className="music-title">{item.title}</p>
                      <p className="music-artist">Curated</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="cta-block">
              <div>
                <p className="eyebrow">Join Our Platform</p>
                <h2>Stream more of what you love</h2>
                <p className="subtitle">
                  Become a member to unlock full tracks, playlists, and exclusive drops from your
                  favorite artists.
                </p>
              </div>
              <div className="cta-actions">
                <button className="pill-btn" type="button" onClick={() => setModal('register')}>
                  Sign Up
                </button>
                <button className="ghost-btn" type="button" onClick={() => setModal('login')}>
                  Login
                </button>
              </div>
            </div>

            <footer className="footer">
              <div>
                <h4>About</h4>
                <p>
                  Melodies là website nghe nhạc với bộ sưu tập đa dạng và playlist theo mood. Luôn cập
                  nhật bản hit mới nhất.
                </p>
              </div>
              <div>
                <h4>Melodi</h4>
                <p>Songs</p>
                <p>Radio</p>
                <p>Podcast</p>
              </div>
              <div>
                <h4>Access</h4>
                <p>Explore</p>
                <p>Artists</p>
                <p>Albums</p>
                <p>Trending</p>
              </div>
              <div>
                <h4>Contact</h4>
                <p>Policy</p>
                <p>Social Media</p>
                <p>Support</p>
              </div>
            </footer>
          </div>
        )}
      </section>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close dialog">
              ×
            </button>
            {modal === 'login' ? (
              <Login
                onSuccess={handleLoginSuccess}
                initialEmail={prefillEmail}
                onSwitchToRegister={() => setModal('register')}
              />
            ) : (
              <Register
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setModal('login')}
              />
            )}
          </div>
        </div>
      )}

      {showFavModal && isListener && (
        <div className="modal-overlay" onClick={closeFavModal}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="section-head">
              <h3>
                Favorites <span>Songs</span>
              </h3>
              <button
                className="pill-btn"
                type="button"
                disabled={!favorites.length}
                onClick={() => {
                  if (favorites.length) {
                    playSong(favorites[0], favorites)
                  }
                }}
              >
                Play All
              </button>
            </div>
            <p className="helper-text">{favorites.length || 0} bài hát yêu thích</p>
            <div className={`song-list ${favorites.length > 6 ? 'scrollable' : ''}`}>
              {favorites.map((fav) => {
                const cover =
                  fav.thumbnail ||
                  fav.coverUrl ||
                  fav.cover ||
                  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60'
                return (
                  <div
                    key={fav._id}
                    className="song-list-item"
                    onClick={() => {
                      if (fav._id && fav.url) {
                        playSong(fav, favorites)
                      }
                    }}
                    style={{ cursor: fav._id ? 'pointer' : 'default' }}
                  >
                    <div
                      className="song-list-cover"
                      style={{ backgroundImage: `url(${cover})`, backgroundPosition: 'center' }}
                    />
                    <div className="song-list-meta">
                      <div className="song-title marquee">
                        <span>{fav.title}</span>
                      </div>
                      <div className="song-artist">
                        {fav.uploadedBy?.name || fav.uploadedBy?.email || 'Unknown'}
                      </div>
                    </div>
                    <div className="song-list-actions">
                      <button
                        className="ghost-btn small"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavoriteSong(fav)
                        }}
                      >
                        {isFav(fav._id) ? 'Bỏ ♥' : 'Yêu thích'}
                      </button>
                    </div>
                  </div>
                )
              })}
              {!favorites.length && <p className="helper-text">Chưa có bài yêu thích.</p>}
            </div>
          </div>
        </div>
      )}

      {showPlaylistModal && isListener && (
        <div className="modal-overlay" onClick={closePlaylistModal}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="section-head">
              <h3>
                Playlists <span>Your</span>
              </h3>
              <button className="ghost-btn" onClick={closePlaylistModal}>
                Đóng
              </button>
            </div>
            <div className="panel-card accent" style={{ padding: '12px' }}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Tên playlist"
                  value={playlistForm.title}
                  onChange={(e) => setPlaylistForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Mô tả (tuỳ chọn)"
                  value={playlistForm.description}
                  onChange={(e) => setPlaylistForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <button className="pill-btn" type="button" onClick={handleCreatePlaylist}>
                Tạo playlist
              </button>
            </div>
            <div className="playlist-grid">
              {listenerPlaylists.map((pl) => (
                <article key={pl._id} className="playlist-card">
                  <div className="playlist-head">
                    <div>
                      <h3>{pl.title}</h3>
                      {pl.description && <p className="playlist-meta">{pl.description}</p>}
                      <p className="playlist-meta">Bài hát: {Array.isArray(pl.songs) ? pl.songs.length : 0}</p>
                    </div>
                    <button
                      className="pill-btn"
                      type="button"
                      disabled={!Array.isArray(pl.songs) || !pl.songs.length}
                      onClick={() => {
                        if (Array.isArray(pl.songs) && pl.songs.length) {
                          playSong(pl.songs[0], pl.songs)
                        }
                      }}
                    >
                      Play
                    </button>
                  </div>
                  {Array.isArray(pl.songs) && pl.songs.length > 0 && (
                    <div className="playlist-song-list">
                      {pl.songs.map((s) => (
                        <div key={s._id} className="playlist-song-pill">
                          <span className="song-title marquee">
                            <span>{s.title}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(!Array.isArray(pl.songs) || !pl.songs.length) && (
                    <p className="playlist-empty">Chưa có bài hát nào.</p>
                  )}
                  <div className="playlist-actions">
                    <div className="field inline">
                      <select value={selectedSongToAdd} onChange={(e) => setSelectedSongToAdd(e.target.value)}>
                        <option value="">Chọn bài để thêm</option>
                        {playlistSongOptions.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                      <button
                        className="ghost-btn"
                        type="button"
                        onClick={() => {
                          setSelectedPlaylistId(pl._id)
                          handleAddSongToPlaylist(pl._id)
                        }}
                      >
                        Thêm bài
                      </button>
                    </div>
                    <button className="ghost-btn danger" type="button" onClick={() => handleDeletePlaylist(pl._id)}>
                      Xoá playlist
                    </button>
                  </div>
                </article>
              ))}
              {!listenerPlaylists.length && <p className="helper-text">Chưa có playlist.</p>}
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="modal-overlay" onClick={() => setShowPopup(false)}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="section-head">
              <h3>
                New <span>Release</span>
              </h3>
              <button
                className="pill-btn"
                type="button"
                disabled={!popupSongs.length}
                onClick={() => {
                  if (popupSongs.length) {
                    playSong(popupSongs[0], popupSongs)
                  }
                }}
              >
                Play All
              </button>
            </div>
            <p className="helper-text">{popupSongs.length} bài hát mới nhất</p>
            <div className={`song-list ${popupSongs.length > 6 ? 'scrollable' : ''}`}>
              {popupSongs.map((item) => {
                const cover =
                  item.thumbnail ||
                  item.coverUrl ||
                  item.cover ||
                  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60'
                return (
                  <div
                    key={item._id}
                    className="song-list-item"
                    onClick={() => {
                      if (item._id && item.url) {
                        playSong(item, popupSongs)
                      }
                    }}
                    style={{ cursor: item._id ? 'pointer' : 'default' }}
                  >
                    <div
                      className="song-list-cover"
                      style={{ backgroundImage: `url(${cover})`, backgroundPosition: 'center' }}
                    />
                    <div className="song-list-meta">
                      <div className="song-title marquee">
                        <span>{item.title}</span>
                      </div>
                    </div>
                    <div className="song-list-actions">
                      <button
                        className="ghost-btn"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item._id && item.url) {
                            playSong(item, popupSongs)
                          }
                        }}
                      >
                        Play
                      </button>
                      {isListener && item._id && (
                        <>
                          <button
                            className="ghost-btn small"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavoriteSong(item)
                            }}
                          >
                            {isFav(item._id) ? 'Đã ♥' : 'Yêu thích'}
                          </button>
                          <button
                            className="ghost-btn small"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openPlaylistPicker(item)
                            }}
                          >
                            + Playlist
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
              {!popupSongs.length && <p className="helper-text">Chưa có bài hát.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
