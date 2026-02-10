'use client'

import { useRef, useState, useEffect } from 'react'

interface VideoPlayerProps {
  src: string;
  playbackMode: string;
}

export default function VideoPlayer({ src, playbackMode }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState(playbackMode)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.loop = mode === 'Repeat' || mode === 'Loop'
  }, [mode])

  return (
    <div className="bg-surface-light rounded-lg overflow-hidden space-y-3">
      <video
        ref={videoRef}
        src={src}
        controls
        loop={mode === 'Repeat' || mode === 'Loop'}
        className="w-full max-h-[400px] bg-black"
        preload="metadata"
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