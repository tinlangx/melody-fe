import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { listPublicSongs } from '../services/apiClient'
import { usePlayer } from '../context/PlayerContext'

const Player = () => {
  const location = useLocation()
  const { playSong, currentSong } = usePlayer()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await listPublicSongs()
        const list = res.songs || []
        setSongs(list)
        if (list.length) {
          const params = new URLSearchParams(location.search)
          const targetId = params.get('songId')
          const found = targetId ? list.find((s) => s._id === targetId) : list[0]
          if (found) playSong(found, list)
        }
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách bài hát.')
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Listener</p>
        <h1 className="title">Player</h1>
        <p className="subtitle">Nghe toàn bộ bài hát từ mọi nghệ sĩ.</p>
      </div>
      {loading && <p className="helper-text">Đang tải...</p>}
      {error && <p className="status error">{error}</p>}

      {currentSong && (
        <div className="panel-card accent">
          <h3>{currentSong.title}</h3>
          <p className="album-meta">
            {currentSong.uploadedBy?.name || currentSong.uploadedBy?.email || 'Artist'} • {currentSong.format || 'media'}
          </p>
          <p className="album-meta">{currentSong.description}</p>
        </div>
      )}

      <div className="song-grid">
        {songs.map((song) => (
          <article
            key={song._id}
            className={`song-card ${currentSong?._id === song._id ? 'selected' : ''}`}
            onClick={() => playSong(song, songs)}
            style={{ cursor: 'pointer' }}
          >
            <span className="song-tag">{song.format || 'media'}</span>
            <h3 className="song-title">{song.title}</h3>
            <p className="song-meta">
              {song.uploadedBy?.name || song.uploadedBy?.email || 'Artist'}
            </p>
            {song.description && <p className="song-meta">{song.description}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}

export default Player
