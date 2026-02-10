import { getStorageSettings, getFiles } from '@/lib/cosmic'
import type { StorageSettings, FileObject } from '@/types'
import FileGrid from '@/components/FileGrid'
import StorageBar from '@/components/StorageBar'
import CosmicBadge from '@/components/CosmicBadge'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settingsRaw = await getStorageSettings()
  const filesRaw = await getFiles()

  const settings = settingsRaw as StorageSettings | null
  const files = (filesRaw || []) as FileObject[]

  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  const totalUsedBytes = files.reduce((sum, f) => {
    return sum + (f.metadata?.file_size_bytes || 0)
  }, 0)

  const maxStorageBytes = settings?.metadata?.max_storage_bytes || 1e52
  const maxUploadBytes = settings?.metadata?.max_upload_size_bytes || 1e52
  const cloudEnabled = settings?.metadata?.cloud_enabled ?? true
  const cloudMaxBytes = settings?.metadata?.cloud_max_storage_bytes || 1e52
  const defaultSort = settings?.metadata?.default_sort_order?.value || 'A-Z'
  const defaultPlayback = settings?.metadata?.default_playback_mode?.value || 'Repeat'
  const appName = settings?.metadata?.files_r_us || 'Files R Us'

  return (
    <main className="min-h-screen bg-primary">
      {/* Header */}
      <header className="border-b border-border-dark bg-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-xl">📁</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{appName}</h1>
                <p className="text-xs text-text-muted">
                  Cloud File Storage
                  {cloudEnabled && (
                    <span className="ml-2 text-accent">☁️ Cloud Enabled</span>
                  )}
                </p>
              </div>
            </div>
            <StorageBar
              usedBytes={totalUsedBytes}
              maxBytes={maxStorageBytes}
              cloudMaxBytes={cloudMaxBytes}
              cloudEnabled={cloudEnabled}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FileGrid
          initialFiles={files}
          maxUploadBytes={maxUploadBytes}
          defaultSort={defaultSort}
          defaultPlayback={defaultPlayback}
          cloudEnabled={cloudEnabled}
        />
      </div>

      <CosmicBadge bucketSlug={bucketSlug} />
    </main>
  )
}