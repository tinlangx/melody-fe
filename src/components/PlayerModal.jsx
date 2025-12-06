import { useMemo } from 'react'
import { usePlayer } from '../context/PlayerContext'

const PlayerModal = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    next,
    prev,
    showModal,
    hideModal,
    closePlayer,
    mode,
    toggleMode,
    queue,
    currentIndex,
    playAt,
    muted,
    toggleMute,
  } = usePlayer()

  const info = useMemo(() => {
    if (!currentSong) return null
    const cover =
      currentSong.cover ||
      currentSong.coverUrl ||
      currentSong.thumbnail ||
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    return {
      title: currentSong.title,
      artist: currentSong.uploadedBy?.name || currentSong.uploadedBy?.email || 'Artist',
      cover,
    }
  }, [currentSong])

  if (!showModal || !info) return null

  return (
    <div className="player-modal-overlay" onClick={hideModal}>
      <div className="player-modal" onClick={(e) => e.stopPropagation()}>
        <div className="player-modal-actions">
          <button className="ghost-btn" type="button" onClick={hideModal}>
            Ẩn
          </button>
          <button className="ghost-btn" type="button" onClick={closePlayer} aria-label="Close player">
            ×
          </button>
        </div>
        <div className="player-modal-content">
          <div
            className="player-modal-cover"
            style={{ backgroundImage: `url(${info.cover})` }}
          />
          <div className="player-modal-body">
            <div className="player-modal-title marquee">
              <span>{info.title}</span>
            </div>
            {/* <div className="player-modal-artist">{info.artist}</div> */}
            <div className="player-modal-wave" />
            <div className="player-modal-controls">
              <button className="ghost-btn" type="button" onClick={toggleMute}>
                {muted ? '🔇' : '🔊'}
              </button>
              <button className="ghost-btn" type="button" onClick={prev}>
                ◀
              </button>
              <button className="pill-btn" type="button" onClick={togglePlay}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button className="ghost-btn" type="button" onClick={next}>
                ▶
              </button>
              <button className="ghost-btn mode-btn" type="button" onClick={toggleMode}>
                {mode === 'normal' ? '⟳' : mode === 'shuffle' ? '⇄' : '⟳1'}
              </button>
            </div>
          </div>
          <div className="player-queue">
            <div className="player-queue-head">
              <div className="player-now-playing">
                <span className="badge-now">Now</span>
                <span className="player-now-title">{info.title}</span>
              </div>
              <span>Danh sách chờ</span>
            </div>
            <div className="player-queue-list">
              {[
                currentIndex >= 0 ? { s: queue[currentIndex], idx: currentIndex, isCurrent: true } : null,
                ...queue
                  .map((s, idx) => ({ s, idx, isCurrent: false }))
                  .filter(({ idx }) => idx !== currentIndex),
              ]
                .filter(Boolean)
                .map(({ s, idx, isCurrent }) => (
                  <button
                    key={s?._id || idx}
                    className={`player-queue-item ${isCurrent ? 'is-current' : ''}`}
                    type="button"
                    onClick={() => {
                      if (!isCurrent && typeof idx === 'number') {
                        playAt(idx)
                      }
                    }}
                  >
                    <div className="player-queue-meta">
                      {isCurrent && <span className="badge-now small">Now</span>}
                      <div className="player-queue-title">{s?.title || 'Untitled'}</div>
                      {/* <div className="player-queue-artist">
                        {s?.uploadedBy?.name || s?.uploadedBy?.email || 'Artist'}
                      </div> */}
                    </div>
                    {!isCurrent && <span className="player-queue-play">▶</span>}
                  </button>
                ))}
              {queue.length === 0 && <p className="helper-text">Không có bài tiếp theo.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerModal
