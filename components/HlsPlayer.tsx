'use client'

import { useRef, useState, useEffect } from 'react'
import Hls from 'hls.js'

interface HlsPlayerProps {
  src: string;
  playbackMode: string;
}

export default function HlsPlayer({ src, playbackMode }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [mode, setMode] = useState(playbackMode)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.loop = mode === 'Repeat' || mode === 'Loop'

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError('Failed to load M3U8 playlist')
        }
      })

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    } else {
      setError('HLS not supported in this browser')
    }
  }, [src, mode])

  if (error) {
    return (
      <div className="bg-surface-light rounded-lg p-6 text-center">
        <p className="text-accent">⚠️ {error}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-light rounded-lg overflow-hidden space-y-3">
      <video
        ref={videoRef}
        controls
        loop={mode === 'Repeat' || mode === 'Loop'}
        className="w-full max-h-[400px] bg-black"
      />
      <div className="flex items-center gap-2 px-4 pb-3">
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