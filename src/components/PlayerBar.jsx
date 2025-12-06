import { useMemo } from 'react'
import { usePlayer } from '../context/PlayerContext'

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    muted,
    togglePlay,
    next,
    prev,
    showModal,
    reopenModal,
    wasModalClosed,
    closePlayer,
    mode,
    toggleMode,
    toggleMute,
  } = usePlayer()

  const info = useMemo(() => {
    if (!currentSong) return null
    return {
      title: currentSong.title,
      artist: currentSong.uploadedBy?.name || currentSong.uploadedBy?.email || 'Artist',
      format: currentSong.format || 'media',
    }
  }, [currentSong])

  if (!info || showModal) return null

  return (
    <div className="player-bar">
      <div className="player-info">
        <div className="player-title marquee">
          <span>{info.title}</span>
        </div>
        <div className="player-artist">
          {info.artist} • {info.format}
        </div>
      </div>
      <div className="player-controls">
        <button className="ghost-btn" onClick={toggleMute} type="button" aria-label="Mute/unmute">
          {muted ? '🔇' : '🔊'}
        </button>
        <button className="ghost-btn mode-btn" onClick={toggleMode} type="button" aria-label="Mode">
          {mode === 'normal' ? '⟳' : mode === 'shuffle' ? '⇄' : '⟳1'}
        </button>
        <button className="ghost-btn" onClick={prev} type="button">
          ◀
        </button>
        <button className="pill-btn" onClick={togglePlay} type="button">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="ghost-btn" onClick={next} type="button">
          ▶
        </button>


        {wasModalClosed && (
          <button className="ghost-btn" onClick={reopenModal} type="button" aria-label="Open player">
            ⬆
          </button>
        )}
        <button className="ghost-btn" onClick={closePlayer} type="button" aria-label="Close player">
          ×
        </button>
      </div>
    </div>
  )
}

export default PlayerBar
