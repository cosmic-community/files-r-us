'use client'

import { useState, useCallback } from 'react'
import type { FileObject } from '@/types'
import FileUploader from '@/components/FileUploader'
import FileCard from '@/components/FileCard'
import FilePreviewModal from '@/components/FilePreviewModal'
import SortFilter from '@/components/SortFilter'

interface FileGridProps {
  initialFiles: FileObject[];
  maxUploadBytes: number;
  defaultSort: string;
  defaultPlayback: string;
  cloudEnabled: boolean;
}

function sortFiles(files: FileObject[], sortOrder: string): FileObject[] {
  const sorted = [...files]

  switch (sortOrder) {
    case 'A-Z':
      return sorted.sort((a, b) => {
        const nameA = a.metadata?.original_name || a.title || ''
        const nameB = b.metadata?.original_name || b.title || ''
        return nameA.localeCompare(nameB)
      })
    case 'Z-A':
      return sorted.sort((a, b) => {
        const nameA = a.metadata?.original_name || a.title || ''
        const nameB = b.metadata?.original_name || b.title || ''
        return nameB.localeCompare(nameA)
      })
    case 'Newest':
      return sorted.sort((a, b) => {
        const timeA = a.metadata?.uploaded_at || 0
        const timeB = b.metadata?.uploaded_at || 0
        return timeB - timeA
      })
    case 'Oldest':
      return sorted.sort((a, b) => {
        const timeA = a.metadata?.uploaded_at || 0
        const timeB = b.metadata?.uploaded_at || 0
        return timeA - timeB
      })
    case 'Size':
      return sorted.sort((a, b) => {
        const sizeA = a.metadata?.file_size_bytes || 0
        const sizeB = b.metadata?.file_size_bytes || 0
        return sizeB - sizeA
      })
    default:
      return sorted
  }
}

export default function FileGrid({
  initialFiles,
  maxUploadBytes,
  defaultSort,
}: FileGridProps) {
  const [files, setFiles] = useState<FileObject[]>(initialFiles)
  const [sortOrder, setSortOrder] = useState(defaultSort)
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const refreshFiles = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/files')
      if (res.ok) {
        const data = await res.json()
        setFiles(data.files || [])
      }
    } catch (err) {
      console.error('Failed to refresh files:', err)
    } finally {
      setRefreshing(false)
    }
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id))
        setSelectedFile(null)
      }
    } catch (err) {
      console.error('Failed to delete file:', err)
    }
  }

  const sortedFiles = sortFiles(files, sortOrder)

  return (
    <div>
      <FileUploader
        onUploadComplete={refreshFiles}
        maxUploadBytes={maxUploadBytes}
      />

      <div className="mb-4">
        <SortFilter
          currentSort={sortOrder}
          onSortChange={setSortOrder}
          fileCount={files.length}
        />
      </div>

      {refreshing && (
        <div className="text-center py-4">
          <span className="text-accent animate-pulse">Refreshing...</span>
        </div>
      )}

      {sortedFiles.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">📂</span>
          <p className="text-text-secondary text-lg">No files yet</p>
          <p className="text-text-muted text-sm mt-1">Upload a file to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onClick={() => setSelectedFile(file)}
            />
          ))}
        </div>
      )}

      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}