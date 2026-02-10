'use client'

import { useEffect } from 'react'
import type { FileObject } from '@/types'
import AudioPlayer from '@/components/AudioPlayer'
import VideoPlayer from '@/components/VideoPlayer'
import GifPlayer from '@/components/GifPlayer'
import HlsPlayer from '@/components/HlsPlayer'

interface FilePreviewModalProps {
  file: FileObject;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i >= units.length) {
    return `${(bytes / Math.pow(1024, units.length - 1)).toFixed(1)} ${units[units.length - 1]}`
  }
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

export default function FilePreviewModal({ file, onClose, onDelete }: FilePreviewModalProps) {
  const fileUrl = file.metadata?.file?.url || ''
  const fileType = file.metadata?.file_type?.key || file.metadata?.file_type?.value || 'other'
  const playbackMode = file.metadata?.playback_mode?.value || 'Repeat'

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleDownload = () => {
    if (!fileUrl) return
    const a = document.createElement('a')
    a.href = fileUrl
    a.download = file.metadata?.original_name || file.title
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this file?')) {
      onDelete(file.id)
    }
  }

  const renderPlayer = () => {
    const type = typeof fileType === 'string' ? fileType.toLowerCase() : ''

    if (type === 'audio') {
      return <AudioPlayer src={fileUrl} playbackMode={playbackMode} />
    }
    if (type === 'video') {
      return <VideoPlayer src={fileUrl} playbackMode={playbackMode} />
    }
    if (type === 'gif') {
      return <GifPlayer src={fileUrl} playbackMode={playbackMode} />
    }
    if (type === 'm3u8 playlist' || type === 'm3u8') {
      return <HlsPlayer src={fileUrl} playbackMode={playbackMode} />
    }
    if (type === 'image') {
      const imgixUrl = file.metadata?.file?.imgix_url
      return (
        <div className="flex items-center justify-center bg-black rounded-lg overflow-hidden">
          <img
            src={imgixUrl ? `${imgixUrl}?w=1200&h=800&fit=contain&auto=format,compress` : fileUrl}
            alt={file.metadata?.original_name || 'Image'}
            className="max-w-full max-h-[500px] object-contain"
          />
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-muted">
        <span className="text-6xl mb-4">📄</span>
        <p>Preview not available for this file type</p>
      </div>
    )
  }

  const uploadDate = file.metadata?.uploaded_at
    ? new Date(file.metadata.uploaded_at).toLocaleString()
    : 'Unknown'

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-surface rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border-dark">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-dark">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-text-primary truncate">
              {file.metadata?.original_name || file.title}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Epoch: <span className="text-accent font-mono">{file.metadata?.epoch_name}</span>
              {' • '}{formatBytes(file.metadata?.file_size_bytes || 0)}
              {' • '}{uploadDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-lighter hover:bg-accent/20 text-text-secondary hover:text-accent flex items-center justify-center transition-colors ml-3"
          >
            ✕
          </button>
        </div>

        {/* Player/Preview */}
        <div className="p-4">
          {renderPlayer()}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4 border-t border-border-dark">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
          >
            ⬇️ Download
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-surface-lighter hover:bg-red-900/50 text-accent rounded-lg text-sm font-medium transition-colors border border-accent/30"
          >
            🗑️ Delete
          </button>
          <div className="flex-1" />
          <span className="text-xs text-text-muted">
            ☁️ {file.metadata?.is_cloud_enabled ? 'Cloud' : 'Local'}
          </span>
        </div>
      </div>
    </div>
  )
}