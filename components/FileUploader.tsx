'use client'

import { useState, useRef } from 'react'

interface FileUploaderProps {
  onUploadComplete: () => void;
  maxUploadBytes: number;
}

export default function FileUploader({ onUploadComplete, maxUploadBytes }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setError(null)

    if (file.size > maxUploadBytes) {
      setError(`File exceeds max upload size`)
      return
    }

    setUploading(true)
    setProgress(0)

    // Simulate progress increments
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      setProgress(100)

      // Brief delay to show 100%
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        onUploadComplete()
      }, 500)
    } catch (err) {
      clearInterval(progressInterval)
      setUploading(false)
      setProgress(0)
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  return (
    <div className="mb-6">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-accent bg-accent/10'
            : 'border-border-dark hover:border-accent/50 bg-surface'
        } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="text-accent text-3xl animate-pulse">⬆️</div>
            <p className="text-text-secondary text-sm">Uploading...</p>
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-surface-lighter rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Uploaded as: <span className="text-accent font-mono">{Date.now()}</span>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📂</div>
            <p className="text-text-primary font-medium">
              Drop a file here or <span className="text-accent underline">browse</span>
            </p>
            <p className="text-xs text-text-muted">
              Max upload size: 99999 YB • Epoch milliseconds renamer
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}