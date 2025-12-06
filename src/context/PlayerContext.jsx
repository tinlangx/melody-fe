import { createContext, useContext, useEffect, useRef, useState } from 'react'

const PlayerContext = createContext(null)

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [wasModalClosed, setWasModalClosed] = useState(false)
  const [mode, setMode] = useState('normal') // normal | shuffle | repeat-one
  const [muted, setMuted] = useState(false)

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null

  const playSong = (song, list = []) => {
    if (!song) return
    if (list.length) {
      setQueue(list)
      const idx = list.findIndex((s) => s._id === song._id)
      setCurrentIndex(idx >= 0 ? idx : 0)
    } else {
      setQueue([song])
      setCurrentIndex(0)
    }
    setIsPlaying(true)
    setShowModal(true)
    setWasModalClosed(false)
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleEnded = () => {
    if (mode === 'repeat-one') {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => setIsPlaying(false))
      setIsPlaying(true)
      return
    }

    if (mode === 'shuffle' && queue.length > 1) {
      const nextIdx = getRandomIndex(queue.length, currentIndex)
      setCurrentIndex(nextIdx)
      setIsPlaying(true)
      return
    }

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const getRandomIndex = (length, exclude) => {
    if (length <= 1) return 0
    let idx = exclude
    while (idx === exclude) {
      idx = Math.floor(Math.random() * length)
    }
    return idx
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    audio.src = currentSong.url
    audio.play().catch(() => setIsPlaying(false))
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
  }, [muted])

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentSong,
        isPlaying,
        muted,
        playSong,
        togglePlay,
        showModal,
        hideModal: () => {
          setShowModal(false)
          setWasModalClosed(true)
        },
        reopenModal: () => {
          if (currentSong) {
            setShowModal(true)
            setWasModalClosed(false)
          }
        },
        closePlayer: () => {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ''
          }
          setQueue([])
          setCurrentIndex(-1)
          setIsPlaying(false)
          setShowModal(false)
          setWasModalClosed(false)
        },
        wasModalClosed,
        mode,
        toggleMode: () =>
          setMode((m) => {
            if (m === 'normal') return 'shuffle'
            if (m === 'shuffle') return 'repeat-one'
            return 'normal'
          }),
        toggleMute: () => setMuted((m) => !m),
        playAt: (index) => {
          if (!queue.length) return
          const safeIndex = Math.max(0, Math.min(index, queue.length - 1))
          setCurrentIndex(safeIndex)
          setIsPlaying(true)
          setShowModal(true)
          setWasModalClosed(false)
        },
        next: () => {
          if (mode === 'repeat-one') {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch(() => {})
            }
            setIsPlaying(true)
            return
          }
          if (mode === 'shuffle' && queue.length > 1) {
            const nextIdx = getRandomIndex(queue.length, currentIndex)
            setCurrentIndex(nextIdx)
            setIsPlaying(true)
            return
          }
          if (currentIndex < queue.length - 1) {
            setCurrentIndex((i) => i + 1)
            setIsPlaying(true)
          }
        },
        prev: () => {
          if (mode === 'repeat-one') {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch(() => {})
            }
            setIsPlaying(true)
            return
          }
          if (mode === 'shuffle' && queue.length > 1) {
            const prevIdx = getRandomIndex(queue.length, currentIndex)
            setCurrentIndex(prevIdx)
            setIsPlaying(true)
            return
          }
          if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1)
            setIsPlaying(true)
          }
        },
      }}
    >
      {children}
      <audio ref={audioRef} onEnded={handleEnded} />
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
