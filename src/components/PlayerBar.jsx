import { useMemo } from 'react'
import { usePlayer } from '../context/PlayerContext'

const PlayerBar = () => {
  const { currentSong, isPlaying, togglePlay, next, prev } = usePlayer()

  const info = useMemo(() => {
    if (!currentSong) return null
    return {
      title: currentSong.title,
      artist: currentSong.uploadedBy?.name || currentSong.uploadedBy?.email || 'Artist',
      format: currentSong.format || 'media',
    }
  }, [currentSong])

  if (!info) return null

  return (
    <div className="player-bar">
      <div className="player-info">
        <div className="player-title">{info.title}</div>
        <div className="player-artist">
          {info.artist} • {info.format}
        </div>
      </div>
      <div className="player-controls">
        <button className="ghost-btn" onClick={prev} type="button">
          ◀
        </button>
        <button className="pill-btn" onClick={togglePlay} type="button">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="ghost-btn" onClick={next} type="button">
          ▶
        </button>
      </div>
    </div>
  )
}

export default PlayerBar
