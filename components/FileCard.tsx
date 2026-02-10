'use client'

import type { FileObject } from '@/types'

interface FileCardProps {
  file: FileObject;
  onClick: () => void;
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

function getFileTypeIcon(type: string): string {
  const t = type.toLowerCase()
  if (t === 'image') return '🖼️'
  if (t === 'audio') return '🎵'
  if (t === 'video') return '🎬'
  if (t === 'gif') return '🎞️'
  if (t === 'm3u8 playlist' || t === 'm3u8') return '📺'
  return '📄'
}

function getFileTypeBadgeColor(type: string): string {
  const t = type.toLowerCase()
  if (t === 'image') return 'bg-blue-900/40 text-blue-300'
  if (t === 'audio') return 'bg-purple-900/40 text-purple-300'
  if (t === 'video') return 'bg-green-900/40 text-green-300'
  if (t === 'gif') return 'bg-yellow-900/40 text-yellow-300'
  if (t === 'm3u8 playlist' || t === 'm3u8') return 'bg-teal-900/40 text-teal-300'
  return 'bg-gray-700/40 text-gray-300'
}

export default function FileCard({ file, onClick }: FileCardProps) {
  const fileTypeValue = file.metadata?.file_type?.value || 'Other'
  const fileTypeKey = file.metadata?.file_type?.key || 'other'
  const thumbnailUrl = file.metadata?.thumbnail_image?.imgix_url
  const originalName = file.metadata?.original_name || file.title
  const epochName = file.metadata?.epoch_name || ''
  const fileSize = file.metadata?.file_size_bytes || 0
  const progress = file.metadata?.upload_progress ?? 100
  const isCloud = file.metadata?.is_cloud_enabled ?? true

  const isImage = fileTypeKey === 'image'

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border-dark rounded-xl overflow-hidden hover:border-accent/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-accent/5 group"
    >
      {/* Thumbnail Area */}
      <div className="aspect-video bg-surface-lighter relative flex items-center justify-center overflow-hidden">
        {isImage && thumbnailUrl ? (
          <img
            src={`${thumbnailUrl}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={originalName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl opacity-60">
            {getFileTypeIcon(fileTypeValue)}
          </span>
        )}

        {/* Upload progress overlay */}
        {progress < 100 && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <div className="w-3/4 h-2 bg-surface-lighter rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary mt-2">{Math.round(progress)}%</span>
          </div>
        )}

        {/* Cloud badge */}
        {isCloud && (
          <span className="absolute top-2 right-2 text-xs bg-black/60 px-1.5 py-0.5 rounded">
            ☁️
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-sm font-medium text-text-primary truncate" title={originalName}>
          {originalName}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getFileTypeBadgeColor(fileTypeValue)}`}>
            {fileTypeValue}
          </span>
          <span className="text-xs text-text-muted">{formatBytes(fileSize)}</span>
        </div>
        <p className="text-xs text-text-muted font-mono truncate" title={`Epoch: ${epochName}`}>
          {epochName}
        </p>
      </div>
    </div>
  )
}