import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Login from './Login'
import Register from './Register'

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

const Sidebar = () => (
  <aside className="home-sidebar">
    <div className="sidebar-logo">Melodies</div>
    <div className="sidebar-section">
      <p className="sidebar-label">Menu</p>
      <nav>
        {['Home', 'Discover', 'Albums', 'Artists'].map((item) => (
          <a key={item} className={`sidebar-link ${item === 'Home' ? 'active' : ''}`} href="#">
            {item}
          </a>
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
    <div className="sidebar-section">
      <p className="sidebar-label">Playlist & favorite</p>
      <nav>
        {['Your favorites', 'Your playlist', 'Add playlist'].map((item) => (
          <a key={item} className="sidebar-link" href="#">
            {item}
          </a>
        ))}
      </nav>
    </div>
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

const SectionHeader = ({ title, accent, action }) => (
  <div className="section-head">
    <h3>
      {title} <span>{accent}</span>
    </h3>
    {action && <button className="ghost-btn">View All</button>}
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
  const [authUser, setAuthUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const hero = heroSlides[0]

  useEffect(() => {
    try {
      const saved = localStorage.getItem('melody_auth')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.user) setAuthUser(parsed.user)
      }
    } catch (err) {
      setAuthUser(null)
    }

    try {
      const pendingNotice = sessionStorage.getItem('melody_login_success')
      if (pendingNotice) {
        setSuccessMessage('Đăng nhập thành công!')
        sessionStorage.removeItem('melody_login_success')
      }
    } catch (err) {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => setSuccessMessage(''), 2000)
    return () => clearTimeout(timer)
  }, [successMessage])

  const closeModal = () => setModal(null)

  const handleRegisterSuccess = (email) => {
    setPrefillEmail(email || '')
    setModal('login')
  }

  const handleLoginSuccess = (data) => {
    setAuthUser(data?.user || null)
    setSuccessMessage('Đăng nhập thành công!')
    setModal(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('melody_auth')
    setAuthUser(null)
    setSuccessMessage('')
  }

  return (
    <div className="home-page">
      <Sidebar />

      <section className="home-main">
        {successMessage && <div className="banner success">{successMessage}</div>}
        <div className="home-topbar">
          <input className="search" placeholder="Search for musics, artists, albums..." />
          <nav className="top-links">
            {['About', 'Contact', 'Premium'].map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </nav>
          <div className="top-actions">
            {authUser ? (
              <>
                <span className="welcome-text">
                  Welcome, {authUser.name || authUser.email || 'user'}
                </span>
                <button className="ghost-btn" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="ghost-btn" type="button" onClick={() => setModal('login')}>
                  Login
                </button>
                <button className="pill-btn" type="button" onClick={() => setModal('register')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

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
          <SectionHeader title="Weekly Top" accent="Songs" action />
          <CardGrid items={weeklyTop} />
        </div>

        <div className="section">
          <SectionHeader title="New Release" accent="Songs" action />
          <CardGrid items={newRelease} />
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
      </section>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close dialog">
              ×
            </button>
            {modal === 'login' ? (
              <Login onSuccess={handleLoginSuccess} initialEmail={prefillEmail} />
            ) : (
              <Register onSuccess={handleRegisterSuccess} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
