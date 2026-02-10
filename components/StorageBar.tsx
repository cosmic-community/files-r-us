'use client'

interface StorageBarProps {
  usedBytes: number;
  maxBytes: number;
  cloudMaxBytes: number;
  cloudEnabled: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0.0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i >= units.length) {
    return `${(bytes / Math.pow(1024, units.length - 1)).toFixed(1)} ${units[units.length - 1]}`
  }
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(1)} ${units[i]}`
}

function formatMaxStorage(bytes: number): string {
  if (bytes >= 1e52) return '99999 YB'
  return formatBytes(bytes)
}

export default function StorageBar({ usedBytes, maxBytes, cloudMaxBytes, cloudEnabled }: StorageBarProps) {
  const percentage = maxBytes > 0 ? Math.min((usedBytes / maxBytes) * 100, 100) : 0

  return (
    <div className="flex flex-col items-end gap-1 min-w-[240px]">
      <div className="text-xs text-text-secondary">
        <span className="text-text-primary font-semibold">{formatBytes(usedBytes)}</span>
        {' '}of{' '}
        <span className="text-accent font-semibold">{formatMaxStorage(maxBytes)}</span>
        {' '}used
      </div>
      <div className="w-full h-2 bg-surface-lighter rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full progress-bar"
          style={{ width: `${Math.max(percentage, 0.5)}%` }}
        />
      </div>
      {cloudEnabled && (
        <div className="text-xs text-text-muted">
          ☁️ Cloud: {formatMaxStorage(cloudMaxBytes)} max
        </div>
      )}
    </div>
  )
}