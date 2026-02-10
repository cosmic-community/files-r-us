'use client'

import { useRef, useState, useEffect } from 'react'

interface AudioPlayerProps {
  src: string;
  playbackMode: string;
}

export default function AudioPlayer({ src, playbackMode }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [mode, setMode] = useState(playbackMode)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = mode === 'Repeat' || mode === 'Loop'

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (mode === 'Once') {
        setPlaying(false)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [mode])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  const formatTime = (s: number) => {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="bg-surface-light rounded-lg p-4 space-y-3">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-accent hover:bg-accent-dark flex items-center justify-center text-white transition-colors"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div className="flex-1">
          <div className="w-full h-2 bg-surface-lighter rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const audio = audioRef.current
              if (!audio || !duration) return
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              audio.currentTime = (x / rect.width) * duration
            }}
          >
            <div
              className="h-full bg-accent rounded-full progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Playback:</span>
        {['Once', 'Repeat', 'Loop'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-2 py-0.5 text-xs rounded-md transition-colors ${
              mode === m
                ? 'bg-accent text-white'
                : 'bg-surface-lighter text-text-secondary hover:text-text-primary'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}