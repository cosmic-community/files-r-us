'use client'

import { useState } from 'react'

interface GifPlayerProps {
  src: string;
  playbackMode: string;
}

export default function GifPlayer({ src, playbackMode }: GifPlayerProps) {
  const [mode, setMode] = useState(playbackMode)
  const [paused, setPaused] = useState(false)

  // GIFs inherently loop; for "Once" mode we can freeze the image
  const handleImageClick = () => {
    if (mode === 'Once') {
      setPaused(!paused)
    }
  }

  return (
    <div className="bg-surface-light rounded-lg overflow-hidden space-y-3">
      <div
        className="relative cursor-pointer flex items-center justify-center bg-black"
        onClick={handleImageClick}
      >
        <img
          src={src}
          alt="GIF"
          className="max-w-full max-h-[400px] object-contain"
          style={paused ? { animationPlayState: 'paused' } : {}}
        />
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-4xl">⏸</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-4 pb-3">
        <span className="text-xs text-text-muted">Playback:</span>
        {['Once', 'Repeat', 'Loop'].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              if (m !== 'Once') setPaused(false)
            }}
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