import { createContext, useContext, useEffect, useRef, useState } from 'react'

const PlayerContext = createContext(null)

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)

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
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    audio.src = currentSong.url
    audio.play().catch(() => setIsPlaying(false))
  }, [currentSong])

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
        next: () => {
          if (currentIndex < queue.length - 1) {
            setCurrentIndex((i) => i + 1)
            setIsPlaying(true)
          }
        },
        prev: () => {
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
